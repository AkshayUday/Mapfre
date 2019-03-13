import { Component, ElementRef, OnInit, ViewChild, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, EMPTY, of, Subscription } from 'rxjs';
import { } from 'googlemaps';
import { GooglePredictionService } from '../../core/services/google-prediction.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { NavigationService } from '../../core/services/navigation.service';

import { MatDialog } from '@angular/material';
import { TrilliumModalComponent } from '../../shared/trillium-modal/trillium-modal.component';
import { ProductsListService } from 'src/app/core/services/products-list.service';
import { CitiesListService } from 'src/app/core/services/cities-list.service';
import { TrilliumAddressService } from 'src/app/core/services/trillium-address.service';
import * as fromStore from '../../store/reducers/lead.reducers';
import { PrimaryAddress, Lead } from '../../store/models/lead.model';
import { distinctUntilChanged, take } from 'rxjs/operators';
import * as LoaderActions from '../../store/actions/loader.actions';
import { TimeoutModalComponent } from '../../shared/timeout-modal/timeout-modal.component';
export interface DialogTitle {
  tempVal: string;
}

@Component({
  selector: 'verti-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, AfterViewInit, OnDestroy {
  imgSource: string;
  title: string;
  addressForm: FormGroup;
  selectedAddress;
  public googleSuggestions = [];
  public cantFindAddress = false;
  placeHolder = 'Street address, city, state';
  statesData = [];
  citiesData;
  initMaps: Boolean = false;
  zeroResults: Boolean = false;
  showCityState: Boolean = false;
  stopPrediction: Boolean = false;
  predictionSelected: Boolean = false;
  invalidAddress1: Boolean = false;
  addressForm$: Subscription;
  addressObj;
  addressUpdated;
  private addressSubscription: Subscription;
  trilliumResponse: any;
  @ViewChild('zip') zip: ElementRef;
  @ViewChild('city') city;
  isAddressVerified: Boolean = false;
  leadSub: Subscription;
  isADPFQuote: boolean;
  loaderSubscription: Subscription;
  cityAndState: String;
  clickFromStore = false;
  loaderStopped: boolean;
  poBoxArray: Array<String> = [
    'PO Box', 'PO.Box', 'P.O.Box', 'P. O. Box', 'P O Box', 'POBox', 'P.O Box'
  ];
  marketData$: Subscription;
  addressSuggestionSelected: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _ngZone: NgZone,
    private googlePredictionService: GooglePredictionService,
    private productListService: ProductsListService,
    private citiesListService: CitiesListService,
    private trilliumAddressService: TrilliumAddressService,
    private store: Store<any>,
    private navService: NavigationService,
    public dialog: MatDialog
  ) {
    this.imgSource = './assets/img/Icon_address.svg';
    this.title = 'Where do you live?';
    this.isADPFQuote = false;
  }

  ngOnInit() {
    this.addressForm = this.fb.group({
      addressLine1: ['',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(250),
          Validators.required
        ])],
      addressLine2: ['',
        Validators.compose([
          // Validators.maxLength(1),
        ])],
      timeAtCurrentResidenceCode: [true,
        Validators.compose([
          // Validators.maxLength(1),
        ])],
      postalCode: ['',
        Validators.compose([
          Validators.minLength(5),
          Validators.maxLength(5)
        ])],
      state: ['', Validators.compose([
        // Validators.required
      ])],
      city: ['', Validators.compose([
        // Validators.required
      ])]
    });
    // this.addressForm$ = this.store.select('QuickQuote').subscribe(qqData => {
    this.addressForm$ = this.store.select(fromStore.primaryAddress)
      .pipe(distinctUntilChanged()).subscribe((primaryAddress: PrimaryAddress) => {
        // this.cantFindAddress = primaryAddress.cantFindAddress;
        if (primaryAddress) {
          this.cantFindAddress = primaryAddress.cantFindAddress;
          this.predictionSelected = true;
          if (this.cantFindAddress) {
            this.showCityState = true;
            this.stopPrediction = true;
          }
          this._ngZone.run(() => {
            this.addressForm.patchValue(primaryAddress);
            if (!this.cantFindAddress && primaryAddress.addressLine1.length) {
              const addressLine1 = primaryAddress['addressLine1'] + ', ' + primaryAddress['city'] + ', ' +
                primaryAddress['state'] + ', ' + primaryAddress['postalCode'];
              this.addressForm.get('addressLine1').setValue(addressLine1);
              this.addressSuggestionSelected = true;
            }
            const timeAtCurrentResidenceCode = primaryAddress['timeAtCurrentResidenceCode'] === 'lessThan2Months' ? false : true;
            this.addressForm.get('timeAtCurrentResidenceCode').setValue(timeAtCurrentResidenceCode);
          });
        }
      });
    this.store.select(fromStore.isADPFQuoteSelector).subscribe(isADPFQuote => {
      this.isADPFQuote = isADPFQuote;
    });
    this.addressForm.get('addressLine1').valueChanges.subscribe(newValue => {
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

    this.marketData$ = this.store.select(state => state.lead.marketingData).pipe(take(1)).subscribe((params) => {
      // setTimeout(() => {
      if (params.zipCode) {
        this.googlePredictionService.getLatLong(params.zipCode, false);
      } else {
        this.googlePredictionService.getLatLong('', true);
      }
      // }, 2000);
    });
  }
  ngAfterViewInit() {
    this.navService.upDateMarketingData();
    setTimeout(() => {
      if (this.zip) {
        // this.zip.nativeElement.click();
        // this.zip.nativeElement.blur();
        this.clickFromStore = true;
        this.updateZipCode(this.addressForm.get('postalCode').value);
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
      this.googlePredictionService.findZipCode(value).subscribe(zip => {
        this.selectedAddress = this.selectedAddress['description'].split(',');
        let checkZip = this.selectedAddress[this.selectedAddress.length - 2].replace(/[^0-9]/g, '');
        if (!checkZip) {
          checkZip = zip;
        }
        this.selectedAddress.pop();
        const stateName = this.selectedAddress[this.selectedAddress.length - 1].replace(/[0-9\s]/g, '');
        this.addressForm.get('state').patchValue(stateName);
        // patching value to hidden field
        const cityName = this.selectedAddress[this.selectedAddress.length - 2].replace(/[0-9\s]/g, '');
        this.addressForm.get('city').patchValue(cityName);
        this.addressForm.get('postalCode').patchValue(checkZip);

        this.selectedAddress[this.selectedAddress.length - 1] = ' ' + stateName + ', ' + checkZip;
        this.selectedAddress = this.selectedAddress.join(',');
        this.addressForm.get('addressLine1').patchValue(this.selectedAddress);
      },
        error => console.log(error)
      );
    } else {
      this.cantFindAddress = true;
      this.placeHolder = 'Street Name';
      const addressValue = this.addressForm.get('addressLine1').value;
      setTimeout(() => {
        this.addressForm.get('addressLine1').patchValue(addressValue);
        this.addressForm.get('postalCode').patchValue('');
        this.addressForm.get('city').patchValue('');
        this.addressForm.get('state').patchValue('');
      });
      this.stopPrediction = true;
      this.googleSuggestions = [];
      this.setValidators();
    }
  }

  setValidators() {
    this.addressForm.get('postalCode').setValidators(Validators.required);
    this.addressForm.get('city').setValidators(Validators.required);
    this.addressForm.get('state').setValidators(Validators.required);
    this.predictionSelected = true;
  }

  clearSuggestions() {
    this.googleSuggestions = [];
  }

  checkAddress1Validity() {
    this.invalidAddress1 = false;
    const addressLine1 = this.addressForm.get('addressLine1').value.toLowerCase();
    this.poBoxArray.forEach(value => {
      if (addressLine1.includes(value.toLowerCase())) {
        this.invalidAddress1 = true;
      }
    });
  }

  allowOnlyNumbers(field) {
    let value = this.addressForm.get(field).value;
    value = value.replace(/[^0-9]/g, '');
    this.addressForm.get(field).patchValue(value);
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
              this.addressForm.get('state').patchValue(cities[0].stateCode);
              this.addressForm.get('city').patchValue(cities[0].cityName);
            });
          } else {
            this.cityAndState = '';
            this.citiesData = cities;
            this.statesData = [];
            this.statesData.push(cities[0]);
            setTimeout(() => {
              this.addressForm.get('state').patchValue(cities[0].stateCode);
              if (this.city && !this.clickFromStore) {
                this.city.open();
              }
            });
            this.showCityState = true;
          }
        } else {
          this.showCityState = false;
          this.cityAndState = '';
          this.addressForm.get('city').patchValue('');
          this.addressForm.get('state').patchValue('');
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
      city: this.addressForm.get('city').value,
      state: this.addressForm.get('state').value,
      zip: this.addressForm.get('postalCode').value
    };
    if (this.cantFindAddress) {
      this.addressObj['addressLine1'] = this.addressForm.get('addressLine1').value;
    } else {
      let address1 = this.addressForm.get('addressLine1').value;
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
    this.addressObj['addressLine2'] = this.addressForm.get('addressLine2').value || null;
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
          // const dialogRef = this.openTrilliumModalDialog(data);
        } else if (trilResponse.matchLevel === '0' && trilResponse.rdiFlag !== null &&
          trilResponse.rdiFlag !== '' && trilResponse.rdiFlag !== 'Y') {
          // address invalid condition
          const data = {
            uspsSuggestion: trilResponse,
            userEntered: this.addressObj,
            invalidAddress: true
          };
          this.openTrilliumModalDialog(data);
          // const dialogRef = this.openTrilliumModalDialog(data);
        } else if (trilResponse.matchLevel === '0' && (this.searchText(responseAddress, fullAddress) &&
          trilliumZipCode.trim() !== zipCode)) {
          // address invalid condition
          const data = {
            uspsSuggestion: trilResponse,
            userEntered: this.addressObj,
            invalidAddress: true
          };
          this.openTrilliumModalDialog(data);
          // const dialogRef = this.openTrilliumModalDialog(data);
        } else if (trilResponse.matchLevel === '0' &&
          (responseAddress.toLowerCase() === fullAddress.toLowerCase() &&
            trilliumZipCode === zipCode)) {
          // address fully valid condition
          this.isAddressVerified = true;
          this.toNextPage();
        } else if (trilResponse.matchLevel === '0' && (this.searchText(responseAddress, fullAddress)
          || trilliumZipCode.trim() !== zipCode)) {
          // address partially valid condition
          const data = {
            uspsSuggestion: trilResponse,
            userEntered: this.addressObj,
            partialAddress: true
          };
          this.openTrilliumModalDialog(data);

        } else if (trilResponse.matchLevel === '0' &&
          (this.searchText(responseAddress, fullAddress) ||
            trilliumZipCode.trim() === zipCode)) {
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
    // this.trilliumService();
    const postalCode = this.addressForm.get('postalCode').value;
    this.store.dispatch(new LoaderActions.StartLoaderAction());
    this.productListService.productListService(postalCode).subscribe(product => {
      this.store.dispatch(new LoaderActions.StopLoaderAction());
      console.log('Products:', product['ApiOutput']);
      // if (product['ApiOutput']['statusMessage'] !== 'Product Found') {
      //   this.savePNIData();
      //   this.router.navigate(['notinyourarea']);
      // } else {
      //   this.trilliumService();
      // }
      if (product['ApiOutput']['statusMessage'] === 'Product Not Found') {
        this.savePNIData();
        this.router.navigate(['notinyourarea']);
      } else {
        if (product['ApiOutput']['statusMessage'] === 'Product Found') {
          this.trilliumService();
        } else {
          this.navService.numOfTimesErrorOccurredOnScreen++;
          // eye blink
          if (this.navService.numOfTimesErrorOccurredOnScreen < 4) {
            this.dialog.open(TimeoutModalComponent, {
              height: '510px',
              data: '',
              panelClass: 'custom-timeout-modal'
            });
          } else {
            this.navService.gotoRouteByName('systemfailure');
          }
        }
      }
    }, error => {
      this.navService.numOfTimesErrorOccurredOnScreen++;
      console.log(error);
      this.savePNIData();
      this.store.dispatch(new LoaderActions.StopLoaderAction());
      // this.router.navigate(['notinyourarea']);
      // eye blink
      if (this.navService.numOfTimesErrorOccurredOnScreen < 4) {
        this.dialog.open(TimeoutModalComponent, {
          height: '510px',
          data: error,
          panelClass: 'custom-timeout-modal'
        });
      } else {
        this.navService.gotoRouteByName('systemfailure');
      }
    });
  }

  saveUpdatedDetails(trilliumValue: Object): void {
    let zipCode = trilliumValue['postalCode'];
    if (zipCode && zipCode.indexOf('-') !== -1) {
      const zipCodeValue = zipCode.split('-');
      zipCode = zipCodeValue[0];
    }

    const patchFormValue = {
      addressLine1: trilliumValue['address'] + ', ' + trilliumValue['cityName'] + ', '
        + trilliumValue['regionName'] + ', ' + zipCode,
      addressLine2: trilliumValue['subBuildingValue'],
      postalCode: zipCode,
      state: trilliumValue['regionName'],
      city: trilliumValue['cityName'].toUpperCase()
    };
    if (this.cantFindAddress) {
      patchFormValue.addressLine1 = trilliumValue['address'];
    }

    this.addressForm.patchValue(patchFormValue);
  }
  savePNIData() {
    const primaryAddress = { ...this.addressForm.value, 'cantFindAddress': this.cantFindAddress };
    if (!this.cantFindAddress) {
      let address1 = this.addressForm.get('addressLine1').value;
      const addressArry = address1.split(',');
      address1 = '';
      // let addArrLength = addressArry.length;
      const addArrLength = addressArry.length;
      // if (addArrLength > 4) {
      //   addressArry.splice(4);
      //   addArrLength = addressArry.length;
      // }
      for (let i = 0; i < addArrLength - 3; ++i) {
        address1 += addressArry[i];
        if (i !== addArrLength - 4) {
          address1 += ',';
        }
      }
      primaryAddress['addressLine1'] = address1;
    }
    primaryAddress.city = primaryAddress.city.trim();
    primaryAddress.state = primaryAddress.state.trim();
    primaryAddress.county = this.trilliumResponse ? this.trilliumResponse['county'] : null;
    primaryAddress.country = 'US';
    primaryAddress.isAddressVerified = this.isAddressVerified;
    const timeAtCurrentResidenceStatus = primaryAddress.timeAtCurrentResidenceCode;
    primaryAddress.timeAtCurrentResidenceCode = primaryAddress.timeAtCurrentResidenceCode ? 'greaterThan2Months' : 'lessThan2Months';
    primaryAddress.timeAtCurrentResidenceValue = timeAtCurrentResidenceStatus ? 'Greater than 2 months' : 'Less than 2 months';
    this.store.dispatch(new LeadActions.SavePNIData({ 'primaryAddress': primaryAddress }));
  }

  toNextPage() {
    this.savePNIData();
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
    if (this.addressForm$) {
      this.addressForm$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.marketData$) {
      this.marketData$.unsubscribe();
    }
  }
}
