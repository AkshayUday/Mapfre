import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../core/services/navigation.service';
import * as fromStore from '../../store/reducers/lead.reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';
@Component({
  selector: 'verti-pni-name',
  templateUrl: './pni-name.component.html',
  styleUrls: ['./pni-name.component.scss']
})
export class PNINameComponent implements OnInit, OnDestroy, AfterViewInit {
  public profileForm: FormGroup;
  imgSource: string;
  title: string;
  dobPattern: string;
  profileForm$: Subscription;
  dobInvalid: Boolean;
  leadSub: Subscription;
  isADPFQuote: boolean;
  loaderSubscription: Subscription;
  loaderStopped: boolean;
  genderOptions: any;
  constructor(private fb: FormBuilder, private router: Router, private store: Store<any>,
    private navService: NavigationService) {
    this.imgSource = './assets/img/Icon_HandWave.svg';
    this.title = 'Hi, we’re Verti.\nWho are you?';
    this.dobPattern = '^(0[1-9]|[12][0-9]|3[01])[\- \/.](?:(0[1-9]|1[012])[\- \/.](19|20)[0-9]{2})$';
    this.genderOptions = [{ code: 'M', value: 'Male' }, { code: 'F', value: 'Female' }];
  }
  ngOnInit() {
    this.profileForm = this.fb.group({
      firstName: ['',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(30),
          Validators.required
        ])],
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
      ])]
    });
    this.profileForm$ = this.store.select(fromStore.leadSelector)
      .pipe(distinctUntilChanged()).subscribe((leadData: Lead) => {
        if (leadData && leadData.dateOfBirth) {
          const dateOfBirth = leadData.dateOfBirth;
          const dobMonth = dateOfBirth.month < 10 ? '0' + dateOfBirth.month : dateOfBirth.month;
          const dobDay = dateOfBirth.day < 10 ? '0' + dateOfBirth.day : dateOfBirth.day;
          const dobString = dobMonth + '/' + dobDay + '/' + dateOfBirth.year;
          this.profileForm.controls.DOB.patchValue(dobString);
          this.profileForm.patchValue(leadData);
          if (leadData.genderCode) {
            this.profileForm.controls.genderCode.patchValue(leadData.genderCode);
          }
        }
        if (leadData && leadData.quote) {
          this.isADPFQuote = leadData.quote.isADPFQuote;
        }
      });
  }
  ngAfterViewInit() {
    this.navService.upDateMarketingData();
  }
  saveDetails(newValue) {
    this.loaderStopped = false;
    const pniNameObj = newValue;
    const dob = pniNameObj.DOB.split('/');
    const dateOfBirth = {
      year: +dob[2],
      month: +dob[0],
      day: +dob[1]
    };
    delete pniNameObj.DOB;
    pniNameObj['dateOfBirth'] = dateOfBirth;
    pniNameObj.genderValue = this.getGenderValueByCode(newValue.genderCode);
    this.store.dispatch(new LeadActions.SavePNIData(pniNameObj));
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

    // setTimeout(() => {
    //   if (this.leadSub) {
    //     this.leadSub.unsubscribe();
    //     this.loaderStopped = false;
    //   }
    // });
    // this.navService.navigate();
    // setTimeout(() => {
    //   // if (this.leadSub) {
    //   //   this.leadSub.unsubscribe();
    //   // }
    //   this.navService.upDateMarketingData();

    // });
    // this.navService.navigate();
    // this.router.navigate(['/maritalstatus']);
  }
  getGenderValueByCode(genderCode) {
    return this.genderOptions.filter(item => item.code === genderCode)[0].value;
  }
  ngOnDestroy() {
    if (this.profileForm$) {
      this.profileForm$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

}

