import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { Subscription, Observable } from 'rxjs';
import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule } from '@angular/material';
import { NavigationService } from '../../core/services/navigation.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

import * as LeadActions from '../../store/actions/lead.actions';
import * as fromStore from '../../store/reducers/lead.reducers';
import { VehicleAddService } from '../../core/services/vehicle-add-service';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';

export interface VehicleAdd {
  code: string;
  description: string;
}

@Component({
  selector: 'verti-vehicleadd',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})

export class VehicleComponent implements OnInit, OnDestroy {
  imgSource: string;
  title: string;
  dobPattern: string;
  dobInvalid: Boolean;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  vehicleId: String;
  isADPF: boolean;
  numberOfVehicles: number;
  maxVehicleLimit: Boolean = true;
  saveButtonFlag: Boolean = true;
  leadID: string;
  leadIdSubscription: Subscription;
  masterLabels = ['SELECT YEAR', 'SELECT MAKE', 'SELECT MODEL', 'SELECT TRIM'];
  listData = [];
  yearsMasterData = [];
  inputLabel = '';
  selectedDataIndex = 0;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  vehiclesTotal: any = [];
  carsAdded = 0;
  vehicleData: any;
  isAlreadyIncluded: Boolean = false;
  leadSub: Subscription;
  hideAddVehicle: Boolean = false;
  buttonTxt: string;
  yearLists$: any;
  yearLists: any;
  vehicleCount$: Subscription;
  includedVehicles$: Subscription;
  constructor(private fb: FormBuilder, private router: Router, private store: Store<AppState>,
    private navService: NavigationService, private activatedRoute: ActivatedRoute, private vehicleAddService: VehicleAddService) {
    this.imgSource = './assets/img/Icon_AddVehicle2.svg';
    this.title = 'Add a Vehicle';
    this.inputLabel = this.masterLabels[this.selectedDataIndex];
    this.vehiclesTotal[this.carsAdded] = [];
    this.numberOfVehicles = 0;
  }

  ngOnInit() {
    this.getVehicleYear();
    this.activatedRoute.paramMap.subscribe(params => {
      this.store.select(fromStore.selectedVehicle(params.get('id'))).pipe(take(1)).subscribe(vehicles => {
        const selectedVehicle = vehicles[0];
        if (selectedVehicle) {
          this.vehicleId = selectedVehicle['vehicleID'];
          this.isADPF = selectedVehicle.isADPF;
          this.vehicleData = selectedVehicle;
          this.title = 'Add a vehicle';
          this.buttonTxt = 'NEXT';
          if (selectedVehicle.isIncluded && !this.isAlreadyIncluded) {
            this.vehiclesTotal[this.carsAdded] = [];
            this.editVehicle();
            this.title = 'Edit vehicle';
            this.buttonTxt = 'SAVE';
            this.hideAddVehicle = true;
          }
        }
      });
    });
    this.vehicleCount$ = this.store.select(fromStore.vehicleCount)
      .pipe(distinctUntilChanged()).subscribe((vehicleCount) => {
        if (vehicleCount) {
          this.numberOfVehicles = vehicleCount;
        }
      });
    this.includedVehicles$ = this.store.select(fromStore.includedVehicles)
      .subscribe((count) => {
        if (count.length >= 4) {
          this.maxVehicleLimit = true;
        }
      });
    this.leadIdSubscription = this.store.select(fromStore.leadID).pipe(take(1)).subscribe(leadID => this.leadID = leadID);
    this.navService.upDateMarketingData();
  }

  remove(vehicleAdd: VehicleAdd): void {
    const index = this.vehiclesTotal[this.carsAdded].indexOf(vehicleAdd);

    if (index >= 0) {
      this.listData = [];
      if (index < this.selectedDataIndex) {
        this.vehiclesTotal[this.carsAdded].splice(index, this.vehiclesTotal[this.carsAdded].length - index);
        this.selectedDataIndex = index;
      } else {
        this.vehiclesTotal[this.carsAdded].splice(index, 1);
      }
      this.inputLabel = this.masterLabels[this.selectedDataIndex];
      this.getListData();
    }
  }

  getVehicleYear() {
    this.yearLists$ = this.vehicleAddService.getVehicleYear().subscribe((data) => {
      this.yearLists = data;
      this.listData = [];
      this.yearLists.map((item => {
        this.listData.push({
          code: item,
          description: item
        });
        this.yearsMasterData = this.listData;
      }));
    });
  }

  editVehicle() {
    this.selectedDataIndex = 4;
    const tempYear = this.vehicleData['year'];
    this.vehiclesTotal[this.carsAdded].push({
      code: tempYear,
      description: tempYear
    });
    this.getVehicleMake();
  }

  getVehicleMake() {
    this.vehicleAddService.getVehicleMake(this.vehiclesTotal[this.carsAdded][0].code).subscribe((data) => {
      data['makes'].forEach(element => {
        if (element.description === this.vehicleData['make']) {
          this.vehiclesTotal[this.carsAdded].push(element);
        }
      });
      this.getVehicleModel();
    });
  }

  getVehicleModel() {
    this.vehicleAddService.getVehicleModel(this.vehiclesTotal[this.carsAdded][0].code,
      this.vehiclesTotal[this.carsAdded][1].code).subscribe((data) => {
        data['models'].forEach(element => {
          if (element.description === this.vehicleData['model']) {
            this.vehiclesTotal[this.carsAdded].push(element);
          }
        });
        this.getVehicleTrim();
      });
  }
  getVehicleTrim() {
    this.vehicleAddService.getVehicleTrim(this.vehiclesTotal[this.carsAdded][0].code,
      this.vehiclesTotal[this.carsAdded][1].code,
      this.vehiclesTotal[this.carsAdded][2].code).subscribe((data) => {
        data['vinPrefixes'].forEach(element => {
          if (element.trimDisplay === this.vehicleData['trim']) {
            if (this.vehiclesTotal[this.carsAdded].length < 4) {
              this.vehiclesTotal[this.carsAdded].push({ code: element.trimDisplay, description: element.trimDisplay });
            }
          }
        });
      });

  }

  save(cars): void {
    this.vehiclesTotal[this.carsAdded].push(cars);
    this.listData = [];
    if (this.selectedDataIndex < 4) {
      this.selectedDataIndex++;
      if (this.selectedDataIndex === 4) {
        this.maxVehicleLimit = false;
        this.updateVehicleSummary();
      }
      this.inputLabel = this.masterLabels[this.selectedDataIndex];
      this.getListData();
    }
  }

  updateVehicleSummary() {
    this.saveButtonFlag = false;
    this.isAlreadyIncluded = true;
    const vehicleObj = {
      vehicleID: this.vehicleId,
      isIncluded: true,
      isADPF: false,
      isAlreadyIncluded: true
    };
    vehicleObj['year'] = this.vehiclesTotal[this.carsAdded][0].description;
    vehicleObj['make'] = this.vehiclesTotal[this.carsAdded][1].description;
    vehicleObj['model'] = this.vehiclesTotal[this.carsAdded][2].description;
    vehicleObj['trim'] = this.vehiclesTotal[this.carsAdded][3].description;
    vehicleObj['bodyStyleCode'] = this.vehiclesTotal[this.carsAdded][3].bodyStyleCode || '';
    vehicleObj['stubbedVIN'] = this.vehiclesTotal[this.carsAdded][3].stubbedVIN || '';
    this.store.dispatch(new LeadActions.UpdateVehicle(vehicleObj));
    // this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
    //   this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    // });
    // this.store.dispatch(new LeadActions.AddVehicle(vehicleObj));
    this.checkVehicleCount();
  }

  addAnotherVehicle() {
    this.vehiclesTotal = [];
    this.checkVehicleCount();
    this.saveButtonFlag = true;
    this.carsAdded += 1;
    this.vehiclesTotal[this.carsAdded] = [];
    this.selectedDataIndex = 0;
    this.listData = this.yearsMasterData;
    this.inputLabel = this.masterLabels[this.selectedDataIndex];

    const vehicle = {
      vehicleID: this.leadID + '-' + (this.numberOfVehicles + 1).toString(),
      isIncluded: false,
      isADPF: false,
    };
    this.store.dispatch(new LeadActions.AddVehicle(vehicle));
    this.maxVehicleLimit = true;
    this.router.navigate(['vehicleadd/' + vehicle.vehicleID]);
  }

  getListData() {
    switch (this.masterLabels[this.selectedDataIndex]) {
      case 'SELECT YEAR':
        this.listData = this.yearsMasterData;
        break;
      case 'SELECT MAKE':
        this.vehicleAddService.getVehicleMake(this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 1].code).subscribe((data) => {
          data['makes'].forEach(element => {
            this.listData.push(element);
          });
        });
        break;
      case 'SELECT MODEL':
        this.vehicleAddService.getVehicleModel(this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 2].code,
          this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 1].code).subscribe((data) => {
            data['models'].forEach(element => {
              this.listData.push({ code: element.code, description: element.description });
            });
          });
        break;
      case 'SELECT TRIM':
        this.vehicleAddService.getVehicleTrim(this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 3].code,
          this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 2].code,
          this.vehiclesTotal[this.carsAdded][this.selectedDataIndex - 1].code).subscribe((data) => {
            data['vinPrefixes'].forEach(element => {
              this.listData.push({
                code: element.trimDisplay, description: element.trimDisplay,
                bodyStyleCode: element.bodyStyleCode, stubbedVIN: element.stubbedVIN
              });
            });
          });
        break;
      default:
        this.listData = this.listData;
        break;
    }
  }

  checkVehicleCount() {
    this.store.select(fromStore.includedVehicles)
      .subscribe((count) => {
        if (count.length >= 4) {
          this.maxVehicleLimit = true;
        }
      });
  }

  saveDetails() {
    this.router.navigate(['vehiclesummary']);
    // this.navService.navigate();
  }

  ngOnDestroy() {
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.yearLists$) {
      this.yearLists$.unsubscribe();
    }
    if (this.vehicleCount$) {
      this.vehicleCount$.unsubscribe();
    }
    if (this.includedVehicles$) {
      this.includedVehicles$.unsubscribe();
    }
    if (this.leadIdSubscription) {
      this.leadIdSubscription.unsubscribe();
    }
  }

}
