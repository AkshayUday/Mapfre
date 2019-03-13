import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  selector: 'verti-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  imgSource: string;
  title: string;
  contactForm: FormGroup;
  phoneNumber: any;
  mobileFormInvalid: Boolean = true;
  mobileErrorMsg: Boolean = false;
  // emailPattern = '^[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$';
  // emailPattern = '^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$';
  emailPattern = /^[A-Za-z][A-Za-z0-9._-]+@[A-za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  IsChecked: Boolean = false;
  contactForm$: Subscription;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  loaderStopped: boolean;

  constructor(private fb: FormBuilder, private router: Router, private store: Store<any>, private navService: NavigationService) {
    this.imgSource = './assets/img/Icon_contact.svg';
    this.title = 'Where can we send your quote?';
    // this.title = 'Contact information.';
  }

  ngOnInit() {
    this.contactForm = this.fb.group({
      // email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      primaryEmailAddress: ['',
        Validators.compose([
          // Validators.minLength(1),
          Validators.maxLength(50),
          Validators.required,
          Validators.pattern(this.emailPattern)
        ])],
      phoneNumber: ['', Validators.compose([
        // Validators.minLength(12),
        Validators.maxLength(12),
      ])]
      // termsConditions: ['', Validators.requiredTrue],
    });

    this.contactForm$ = this.store.select(fromStore.leadSelector)
      .pipe(distinctUntilChanged()).subscribe((leadData) => {
        if (leadData) {
          this.contactForm.patchValue(leadData);
          this.formatPhoneNumber('phoneNumber');
        }
      });
    this.navService.upDateMarketingData();
  }


  validateEmail(value, controlName) {
    if (value !== '') {
      const str = value.replace(/[^a-zA-Z0-9_\-\.\@]/g, '');
      this.contactForm.get(controlName).patchValue(str);
    }
  }


  onBlur(event) {
    const phoneNum = this.contactForm.get('phoneNumber').value;
    if (phoneNum) {
      // console.log(event.target.value);
      if (phoneNum.length < 12 || phoneNum.substr(0, 1) === '0' || phoneNum.substr(0, 1) === '1') {
        // this.contactForm.get('phonenumber')
        this.contactForm.get('phoneNumber').setErrors({ 'incorrect': true });
        this.mobileErrorMsg = true;
        this.mobileFormInvalid = true;
      }
    }
  }



  onKey(event: any) {
    const OnlyNumbers = event.target.value.replace(/[^0-9]/g, '');
    this.formatPhoneNumber('phoneNumber');
    if (this.contactForm.get('phoneNumber').value.length > 10) {
      return false;
    }
    this.contactForm.patchValue({
      phonenumber: OnlyNumbers
    });
  }

  formatPhoneNumber(field) {
    let value = this.contactForm.get(field).value;
    const numbers = value.replace(/\D/g, ''),
      char = { 3: ' ', 6: ' ' };
    value = '';
    for (let i = 0; i < numbers.length; i++) {
      value += (char[i] || '') + numbers[i];
    }
    this.contactForm.get(field).patchValue(value);
    if (this.contactForm.get(field).value === '' || this.contactForm.get(field).value
      === undefined || value.length < 12) {
      this.mobileFormInvalid = true;
    } else {
      this.mobileFormInvalid = false;
    }
  }

  saveDetails(): void {
    const conatctValObj = this.contactForm.value;
    conatctValObj.phoneNumber = this.contactForm.get('phoneNumber').value.replace(/\s/g, '');
    this.store.dispatch(new LeadActions.SavePNIData(conatctValObj));
    // this.router.navigate(['/koqone']);
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
    // this.navService.navigate();
    // setTimeout(() => {
    //   // if (this.leadSub) {
    //   //   this.leadSub.unsubscribe();
    //   // }
    //   this.navService.upDateMarketingData();
    // });
  }

  ngOnDestroy() {
    if (this.contactForm$) {
      this.contactForm$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

}
