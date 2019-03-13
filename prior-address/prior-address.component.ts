import { Component, ElementRef, OnInit, ViewChild, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, EMPTY, of, Subscription } from 'rxjs';
import { GooglePredictionService } from '../../core/services/google-prediction.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { NavigationService } from '../../core/services/navigation.service';

import { MatDialog } from '@angular/material';
import { TrilliumModalComponent } from '../../shared/trillium-modal/trillium-modal.component';
import { CitiesListService } from 'src/app/core/services/cities-list.service';
import { TrilliumAddressService } from 'src/app/core/services/trillium-address.service';
import * as fromStore from '../../store/reducers/lead.reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';
@Component({
  selector: 'verti-prior-address',
  templateUrl: './prior-address.component.html',
  styleUrls: ['./prior-address.component.scss']
})

export class PriorAddressComponent implements OnInit, AfterViewInit, OnDestroy {
  imgSource: string;
  title: string;
  previousAddressForm: FormGroup;
  selectedAddress;
  public googleSuggestions = [];
  public cantFindAddress = false;
  // placeHolder = '#, Street, City, State';
  placeHolder = 'Street address, city, state';
  statesData = [];
  citiesData;
  initMaps: Boolean = false;
  zeroResults: Boolean = false;
  showCityState: Boolean = false;
  stopPrediction: Boolean = false;
  predictionSelected: Boolean = false;
  invalidAddress1: Boolean = false;
  previousAddressForm$: Subscription;
  addressObj;
  addressUpdated;
  private addressSubscription: Subscription;
  trilliumResponse: any;
  @ViewChild('zip') zip: ElementRef;
  @ViewChild('city') city;
  isAddressVerified: Boolean = false;
  leadSub: Subscription;
  isADPFQuote: boolean;
  loaderSubscription: any;
  cityAndState: String;
  clickFromStore = false;
  loaderStopped: boolean;
  addressSuggestionSelected: Boolean = false;
  poBoxArray: Array<String> = [
    'PO Box', 'PO.Box', 'P.O.Box', 'P. O. Box', 'P O Box', 'POBox', 'P.O Box'
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _ngZone: NgZone,
    private googlePredictionService: GooglePredictionService,
    private citiesListService: CitiesListService,
    private trilliumAddressService: TrilliumAddressService,
    private store: Store<any>,
    private navService: NavigationService,
    public dialog: MatDialog
  ) {
    this.imgSource = './assets/img/Icon_previosaddress.svg';
    this.title = 'Where did you live previously?';
    this.isADPFQuote = false;
  }

  ngOnInit() {
    this.previousAddressForm = this.fb.group({
      addressLine1: [
        '',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(250),
          Validators.required
        ])
      ],
      addressLine2: [
        '',
        Validators.compose([
          // Validators.maxLength(1),
        ])
      ],
      postalCode: ['',
        Validators.compose([
          Validators.minLength(5),
          Validators.maxLength(5),
        ])
      ],
      state: ['',
        Validators.compose([
          // Validators.required
        ])
      ],
      city: ['',
        Validators.compose([
          // Validators.required
        ])
      ],
    });
    this.previousAddressForm$ = this.store.select(fromStore.priorAddress)
      .pipe(distinctUntilChanged()).subscribe((priorAddress) => {
        // this.cantFindAddress = primaryAddress.cantFindAddress;
        if (priorAddress) {
          this.cantFindAddress = priorAddress.cantFindAddress;
          this.predictionSelected = true;
          if (this.cantFindAddress) {
            this.showCityState = true;
            this.stopPrediction = true;
          }
          this._ngZone.run(() => {
            this.previousAddressForm.patchValue(priorAddress);
            if (!this.cantFindAddress && priorAddress.addressLine1.length) {
              const addressLine1 = priorAddress['addressLine1'] + ', ' + priorAddress['city'] + ', ' +
                priorAddress['state'] + ', ' + priorAddress['postalCode'];
              this.previousAddressForm.get('addressLine1').setValue(addressLine1);
              this.addressSuggestionSelected = true;
            }
          });
        }
      });
    this.store.select(fromStore.isADPFQuoteSelector).subscribe(isADPFQuote => {
      this.isADPFQuote = isADPFQuote;
    });
    this.previousAddressForm.get('addressLine1').valueChanges.subscribe(newValue => {
      if (newValue && this.stopPrediction) {
        this.checkAddress1Validity();
      } else if (newValue && !this.stopPrediction) {
        this.googlePredictionService.autoCompleteAddress(newValue).subscribe(response => {
          this._ngZone.run(() => {
            if (response['status'] === 'ZERO_RESULTS') {
              this.zeroResults = true;
              const zero_results = [
                {
                  description: `ADD ADDRESS MANUALLY`,
                  status: 404
                }
              ];
              this.googleSuggestions = zero_results;
            } else {
              this.zeroResults = false;
              this.googleSuggestions = response['prediction'];
            }
          });
        });
      } else {
        this.clearSuggestions();
      }

    });
    this.googlePredictionService.getLatLong('', false);
  }
  ngAfterViewInit() {
    this.navService.upDateMarketingData();
    setTimeout(() => {

      if (this.zip) {
        // this.zip.nativeElement.click();
        // this.zip.nativeElement.blur();
        this.clickFromStore = true;
        this.updateZipCode(this.previousAddressForm.get('postalCode').value);
      }
    });
  }

  primaryAddressInput() {
    if (!this.cantFindAddress) {
      this.predictionSelected = false;
    }
  }

  prefillAddressDetails(value) {
    if (value['status'] !== 404) {
      this.addressSuggestionSelected = true;
      this.predictionSelected = true;
      this.selectedAddress = value;
      this.googlePredictionService.findZipCode(value).subscribe(
        zip => {
          this.selectedAddress = this.selectedAddress['description'].split(',');
          let checkZip = this.selectedAddress[this.selectedAddress.length - 2].replace(/[^0-9]/g, '');
          if (!checkZip) {
            checkZip = zip;
          }
          this.selectedAddress.pop();
          const stateName = this.selectedAddress[this.selectedAddress.length - 1].replace(/[0-9\s]/g, '');
          this.previousAddressForm.get('state').patchValue(stateName);
          // patching value to hidden field
          const cityName = this.selectedAddress[this.selectedAddress.length - 2].replace(/[0-9\s]/g, '');
          this.previousAddressForm.get('city').patchValue(cityName);
          this.previousAddressForm.get('postalCode').patchValue(checkZip);

          this.selectedAddress[this.selectedAddress.length - 1] = ' ' + stateName + ', ' + checkZip;
          this.selectedAddress = this.selectedAddress.join(',');
          this.previousAddressForm.get('addressLine1').patchValue(this.selectedAddress);
        },
        error => console.log(error)
      );
    } else {
      this.cantFindAddress = true;
      this.placeHolder = 'Street Name';
      const addressValue = this.previousAddressForm.get('addressLine1').value;
      setTimeout(() => {
        this.previousAddressForm.get('addressLine1').patchValue(addressValue);
        this.previousAddressForm.get('postalCode').patchValue('');
        this.previousAddressForm.get('city').patchValue('');
        this.previousAddressForm.get('state').patchValue('');
      });
      this.stopPrediction = true;
      this.googleSuggestions = [];
      this.setValidators();
    }
  }

  setValidators() {
    this.previousAddressForm.get('postalCode').setValidators(Validators.required);
    this.previousAddressForm.get('city').setValidators(Validators.required);
    this.previousAddressForm.get('state').setValidators(Validators.required);
    this.predictionSelected = true;
  }

  clearSuggestions() {
    this.googleSuggestions = [];
  }

  checkAddress1Validity() {
    this.invalidAddress1 = false;
    const addressLine1 = this.previousAddressForm.get('addressLine1').value.toLowerCase();
    this.poBoxArray.forEach(value => {
      if (addressLine1.includes(value.toLowerCase())) {
        this.invalidAddress1 = true;
      }
    });
  }

  allowOnlyNumbers(field) {
    let value = this.previousAddressForm.get(field).value;
    value = value.replace(/[^0-9]/g, '');
    this.previousAddressForm.get(field).patchValue(value);
    this.clickFromStore = false;
    if (value.length === 5) {
      this.updateZipCode(value);
    }
  }

  updateZipCode(zip) {
    if (zip.length === 5) {
      this.citiesListService.getCitiesList(zip).subscribe(results => {
        if (results && results['apiOutput'] && results['apiOutput']['result']) {
          const cities = results['apiOutput']['result'];
          if (cities.length === 1) {
            this.cityAndState = cities[0].cityName + ', ' + cities[0].stateName;
            this.showCityState = false;
            setTimeout(() => {
              this.previousAddressForm.get('state').patchValue(cities[0].stateCode);
              this.previousAddressForm.get('city').patchValue(cities[0].cityName);
            });
          } else {
            this.cityAndState = '';
            this.citiesData = cities;
            this.statesData = [];
            this.statesData.push(cities[0]);
            setTimeout(() => {
              this.previousAddressForm.get('state').patchValue(cities[0].stateCode);
              if (this.city && !this.clickFromStore) {
                this.city.open();
              }
            });
            this.showCityState = true;
          }
        } else {
          this.showCityState = false;
          this.cityAndState = '';
          this.previousAddressForm.get('city').patchValue('');
          this.previousAddressForm.get('state').patchValue('');
        }
      }, error => console.log(error));
    } else {
      this.showCityState = false;
    }
  }

  trilliumService() {
    this.addressObj = {
      addressLine1: '',
      addressLine2: '',
      city: this.previousAddressForm.get('city').value,
      state: this.previousAddressForm.get('state').value,
      zip: this.previousAddressForm.get('postalCode').value
    };
    if (this.cantFindAddress) {
      this.addressObj['addressLine1'] = this.previousAddressForm.get('addressLine1').value;
    } else {
      let address1 = this.previousAddressForm.get('addressLine1').value;
      const addressArry = address1.split(',');
      address1 = '';
      const addArrLength = addressArry.length;
      for (let i = 0; i < addArrLength - 3; ++i) {
        address1 += addressArry[i];
        if (i !== addArrLength - 4) {
          address1 += ', ';
        }
      }
      this.addressObj['addressLine1'] = address1;
    }
    this.addressObj['addressLine2'] = this.previousAddressForm.get('addressLine2').value || null;
    this.trilliumAddressService.putTrilliumAddress(this.addressObj).subscribe(results => {
      const trilResponse = results['apiOutput']['address'];
      this.trilliumResponse = trilResponse;
      let trilliumZipCode = trilResponse.postalCode;
      if (trilliumZipCode.indexOf('-') !== -1) {
        const zipCodeValue = trilliumZipCode.split('-');
        trilliumZipCode = zipCodeValue[0];
      }
      if (results && results['apiOutput'] && results['apiOutput']['address']) {
        const fullAddress = this.addressObj['addressLine1'];
        const zipCode = this.addressObj['zip'];
        const responseAddress = trilResponse.address;
        if (trilResponse.matchLevel !== '0' || (trilResponse.matchLevel === '0' &&
          trilResponse.dpvConfirm !== null && trilResponse.dpvConfirm !== 'Y' &&
          trilResponse.dpvConfirm !== 'S' && trilResponse.dpvConfirm !== 'D')) {
          // address invalid condition
          const data = {
            uspsSuggestion: trilResponse,
            userEntered: this.addressObj,
            invalidAddress: true
          };
          this.openTrilliumModalDialog(data);

        } else if (trilResponse.matchLevel === '0' &&
          trilResponse.rdiFlag !== null && trilResponse.rdiFlag !== '' &&
          trilResponse.rdiFlag !== 'Y') {
          // address invalid condition
          const data = {
            uspsSuggestion: trilResponse,
            userEntered: this.addressObj,
            invalidAddress: true
          };
          this.openTrilliumModalDialog(data);
        } else if (trilResponse.matchLevel === '0' &&
          (this.searchText(responseAddress, fullAddress) && trilliumZipCode.trim() !== zipCode)) {
          // address invalid condition
          const data = {
            uspsSuggestion: responseAddress,
            userEntered: fullAddress,
            invalidAddress: true
          };
          this.openTrilliumModalDialog(data);
        } else if (trilResponse.matchLevel === '0' &&
          (responseAddress.toLowerCase() === fullAddress.toLowerCase() && trilliumZipCode === zipCode)) {
          // address fully valid condition
          this.isAddressVerified = true;
          this.toNextPage();

        } else if (trilResponse.matchLevel === '0' &&
          (this.searchText(responseAddress, fullAddress) || trilliumZipCode.trim() !== zipCode)) {
          // address partially valid condition
          const data = {
            uspsSuggestion: trilResponse,
            userEntered: this.addressObj,
            partialAddress: true
          };
          this.openTrilliumModalDialog(data);

        } else if (trilResponse.matchLevel === '0' &&
          (this.searchText(responseAddress, fullAddress) || trilliumZipCode.trim() === zipCode)) {
          // address partially valid condition
          const data = {
            uspsSuggestion: trilResponse,
            userEntered: this.addressObj,
            partialAddress: true
          };
          this.openTrilliumModalDialog(data);
        }
      } else {
        console.log(results);
        this.isAddressVerified = false;
        this.toNextPage();
      }
    }, error => {
      console.log(error);
      this.isAddressVerified = false;
      this.toNextPage();
    });
  }

  saveDetails(): void {
    // this.toNextPage();
    this.trilliumService();

  }

  saveUpdatedDetails(trilliumValue: Object): void {

    let zipCode = trilliumValue['postalCode'];
    if (zipCode && zipCode.indexOf('-') !== -1) {
      const zipCodeValue = zipCode.split('-');
      zipCode = zipCodeValue[0];
    }

    const patchFormValue = {
      addressLine1: trilliumValue['address'] + ', ' + trilliumValue['cityName'] + ', ' +
        trilliumValue['regionName'] + ', ' + zipCode,
      addressLine2: trilliumValue['subBuildingValue'],
      postalCode: zipCode,
      state: trilliumValue['regionName'],
      city: trilliumValue['cityName'].toUpperCase()
    };
    if (this.cantFindAddress) {
      patchFormValue.addressLine1 = trilliumValue['address'];
    }

    this.previousAddressForm.patchValue(patchFormValue);
  }


  toNextPage() {

    const priorAddress = { ...this.previousAddressForm.value, 'cantFindAddress': this.cantFindAddress };
    if (!this.cantFindAddress) {
      let address1 = this.previousAddressForm.get('addressLine1').value;
      const addressArry = address1.split(',');
      address1 = '';
      let addArrLength = addressArry.length;
      if (addArrLength > 4) {
        addressArry.splice(4);
        addArrLength = addressArry.length;
      }
      for (let i = 0; i < addArrLength - 3; ++i) {
        address1 += addressArry[i];
        if (i !== addArrLength - 4) {
          address1 += ', ';
        }
      }
      priorAddress['addressLine1'] = address1;
    }
    priorAddress.city = priorAddress.city.trim();
    priorAddress.state = priorAddress.state.trim();
    priorAddress.county = this.trilliumResponse ? this.trilliumResponse['county'] : null;
    priorAddress.country = 'US';
    priorAddress.isAddressVerified = this.isAddressVerified;
    priorAddress.addressType = 'priorExt';
    this.store.dispatch(new LeadActions.SavePNIData({ 'priorAddress': priorAddress }));
    this.loaderStopped = false;
    this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
      this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    });

    this.loaderSubscription = this.store.select(state => state.loader.isLoading).subscribe(loading => {
      if (!loading && !this.loaderStopped) {
        if (this.leadSub) {
          this.leadSub.unsubscribe();
        }
        this.loaderStopped = true;
        // this.router.navigate(['driversummary']);
        this.navService.navigate();
      }
    });
    this.navService.navigate();
    setTimeout(() => {
      if (this.leadSub) {
        this.leadSub.unsubscribe();
      }
      // this.navService.upDateMarketingData();
    });
  }

  searchText(compareStr, data) {
    const resAddr = compareStr.toLowerCase();
    const fullAddr = data.toLowerCase();
    if (resAddr.search(fullAddr) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  openTrilliumModalDialog(data) {
    const dialogRef = this.dialog.open(TrilliumModalComponent, {
      height: '510px',
      data: data,
      panelClass: 'custom-trillium-modal'
    });

    this.addressSubscription = dialogRef.componentInstance.trilliumAddressUpdate.subscribe(newValue => {
      this.addressUpdated = newValue;
      if (newValue) {
        this.isAddressVerified = true;
        this.saveUpdatedDetails(this.trilliumResponse);
      }
      this.toNextPage();
    }
    );
    dialogRef.afterClosed().subscribe(() => {
      this.addressSubscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    if (this.previousAddressForm$) {
      this.previousAddressForm$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}
