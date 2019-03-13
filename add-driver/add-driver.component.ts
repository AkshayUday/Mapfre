import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../core/services/navigation.service';
import * as LeadActions from '../../store/actions/lead.actions';
import * as fromStore from '../../store/reducers/lead.reducers';
import { distinctUntilChanged, take, skip } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';
import { HttpClient } from '@angular/common/http';
import { ErrorDialogModalComponent } from '../../shared/error-dialog-modal/error-dialog-modal.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'verti-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit, OnDestroy {
  public addDriverForm: FormGroup;
  imgSource: string;
  title: string;
  dobPattern: string;
  addDriverForm$: Subscription;
  dobInvalid: Boolean;
  selectedDriverObj: Object;
  driverId: String;
  errorSubscription: Subscription;
  errorOccured: any;
  loaderStopped: boolean;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  count: any;
  genderOptions: any;
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient,
    private store: Store<any>, private navService: NavigationService,
    private activatedRoute: ActivatedRoute, private dialog: MatDialog) {
    this.imgSource = './assets/img/Icon_Driver.svg';
    this.title = 'Add a driver to your policy.';
    this.dobPattern = '^(0[1-9]|[12][0-9]|3[01])[\- \/.](?:(0[1-9]|1[012])[\- \/.](19|20)[0-9]{2})$';
    this.genderOptions = [{ code: 'M', value: 'Male' }, { code: 'F', value: 'Female' }];
  }
  ngOnInit() {
    this.addDriverForm = this.fb.group({
      firstName: ['',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(30),
          Validators.required
        ])],
      // middleName: ['', Validators.compose([
      //   Validators.maxLength(1)
      // ])],
      lastName: ['', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.required
      ])],
      DOB: ['', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required,
        // Validators.pattern(this.dobPattern)
      ])],
      genderCode: ['', Validators.compose([
        Validators.required
      ])],
      age: [{ value: '', disabled: true },
      Validators.compose([
        Validators.required
      ])]
    });

    this.activatedRoute.paramMap.subscribe(params => {
      this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
        // const driverArr = drivers.filter(item => +item.driverID === +params.get('id'));
        const selectedDriver = drivers[0];
        if (selectedDriver) {
          this.driverId = selectedDriver['driverID'];
          this.selectedDriverObj = selectedDriver;
          const dateOfBirth = selectedDriver.dateOfBirth;
          this.addDriverForm.patchValue(selectedDriver);
          if (selectedDriver.genderCode) {
            this.addDriverForm.controls.genderCode.patchValue(selectedDriver.genderCode);
          }
          if (selectedDriver.isADPF && selectedDriver.age) {
            // this.addDriverForm.controls.DOB.clearValidators();
            this.addDriverForm.removeControl('DOB');
            // this.addDriverForm.controls.age.setValidators([Validators.required]);
            this.addDriverForm.updateValueAndValidity();
          } else {
            if (dateOfBirth) {
              // const dobString = dateOfBirth['month'] + '/' + dateOfBirth['day'] + '/' + dateOfBirth['year'];
              const dobMonth = dateOfBirth.month < 10 ? '0' + dateOfBirth.month : dateOfBirth.month;
              const dobDay = dateOfBirth.day < 10 ? '0' + dateOfBirth.day : dateOfBirth.day;
              const dobString = dobMonth + '/' + dobDay + '/' + dateOfBirth.year;
              this.addDriverForm.controls.DOB.patchValue(dobString);
            }
            this.addDriverForm.removeControl('age');
            this.addDriverForm.updateValueAndValidity();
          }
        }
      });
    });
    this.navService.upDateMarketingData();
  }

  saveDetails(newValue) {
    const driverObj = newValue;
    driverObj['driverID'] = this.driverId;
    if (!this.selectedDriverObj['isADPF']) {
      const dob = driverObj.DOB.split('/');
      const dateOfBirth = {
        year: +dob[2],
        month: +dob[0],
        day: +dob[1]
      };
      delete driverObj.DOB;
      driverObj['dateOfBirth'] = dateOfBirth;
      driverObj['age'] = this.calcAge(driverObj);
    } else if (this.selectedDriverObj['isADPF'] && !this.selectedDriverObj['age']) {
      const dob = driverObj.DOB.split('/');
      const dateOfBirth = {
        year: +dob[2],
        month: +dob[0],
        day: +dob[1]
      };
      delete driverObj.DOB;
      driverObj['dateOfBirth'] = dateOfBirth;
      driverObj['age'] = this.calcAge(driverObj);
      driverObj['dateOfBirth'] = dob[2] + '-' + dob[0] + '-' + dob[1] + 'T05:00:00Z';
    }
    driverObj.genderValue = this.getGenderValueByCode(newValue.genderCode);
    this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
    // this.router.navigate(['drivermaritalstatus/' + this.driverId]);
    // if (driverObj.isIncluded) {
    //   this.loaderStopped = false;
    //   this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
    //     this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    //   });
    //   this.loaderSubscription = this.store.select(state => state.loader.isLoading).subscribe(loading => {
    //     if (!loading && !this.loaderStopped) {
    //       if (this.leadSub) {
    //         this.leadSub.unsubscribe();
    //       }
    //       this.loaderStopped = true;
    //       // this.router.navigate(['driversummary']);
    //       // this.navService.navigate();
    //       // this.navigateToNextPage();
    //       this.navService.navigateSubRouteToSubRoute();
    //     }
    //   });
    // } else {
    //   // this.navigateToNextPage();
    //   this.navService.navigateSubRouteToSubRoute();
    // }
    this.navService.navigateSubRouteToSubRoute();
  }

  calcAge(obj) {
    if (obj.age) {
      return obj.age;
    } else if (obj.dateOfBirth) {
      const dateOfBirth: any = obj.dateOfBirth.year + '-' + obj.dateOfBirth.month + '-' + obj.dateOfBirth.day;
      const dob: any = new Date(dateOfBirth);
      const ageDiff = Math.abs(Date.now() - dob);
      return Math.floor((ageDiff / (1000 * 3600 * 24)) / 365);
    }
  }

  getGenderValueByCode(genderCode) {
    return this.genderOptions.filter(item => item.code === genderCode)[0].value;
  }
  navigateToNextPage() {
    // this.errorSubscription = this.store.select(state => state.error).pipe(take(1)).subscribe(error => {
    //   if (!this.errorOccured) {
    //     this.errorOccured = true;
    //     // this.loaderSubscription.unsubscribe();
    //     if (error.code === '') {
    //       // this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
    //       this.router.navigate(['drivermaritalstatus/' + this.driverId], { queryParamsHandling: 'merge' });

    //     } else {
    //       // this.errorOccured = true;
    //       // alert(error.message);
    //       // this.errorSubscription.unsubscribe();
    //       this.dialog.open(ErrorDialogModalComponent, error);
    //     }
    //   }
    // });
    this.count = 0;
    this.errorSubscription = this.store.select(state => state.error).pipe(skip(1)).subscribe(error => {
      if (!this.errorOccured) {
        this.count++;
        this.errorOccured = true;
        // this.loaderSubscription.unsubscribe();
        if (error.code === '') {
          // this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
        } else {
          // this.errorOccured = true;
          // alert(error.message);
          // this.errorSubscription.unsubscribe();
          this.dialog.open(ErrorDialogModalComponent, { data: error });
        }
      }
    });
    setTimeout(() => {
      if (this.count === 0) {
        // this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
        this.router.navigate(['drivermaritalstatus/' + this.driverId], { queryParamsHandling: 'merge' });

      }
    });
  }
  ngOnDestroy() {
    if (this.addDriverForm$) {
      this.addDriverForm$.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}



