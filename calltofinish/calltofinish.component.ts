
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../core/services/navigation.service';

import * as LeadActions from '../../store/actions/lead.actions';
import * as fromStore from '../../store/reducers/lead.reducers';
import { VehicleAddService } from '../../core/services/vehicle-add-service';
import { distinctUntilChanged, take } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Lead } from 'src/app/store/models/lead.model';

@Component({
  selector: 'verti-calltofinish',
  templateUrl: './calltofinish.component.html',
  styleUrls: ['./calltofinish.component.scss']
})
export class CalltofinishComponent implements OnInit, OnDestroy, AfterViewInit {
  imgSource: string;
  title: string;
  contactForm: FormGroup;
  phoneNumber: any;
  mobileFormInvalid: Boolean = true;
  mobileErrorMsg: Boolean = false;

  IsChecked: Boolean = false;
  contactForm$: Subscription;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  loaderStopped: Boolean;
  isWorkingHours: Boolean = false;
  leadData$: Subscription;
  leadData: Lead;
  premuimPrice: any;
  decimalPrice: any;

  constructor(private fb: FormBuilder, private router: Router, private store: Store<any>,
    private navService: NavigationService, private httpClient: HttpClient) {
    this.imgSource = './assets/img/Icon_contact.svg';
    this.title = 'Where can we send your quote?';
    // this.title = 'Contact information.';
  }

  ngOnInit() {
    this.leadData$ = this.store.select(fromStore.leadSelector)
      .pipe(distinctUntilChanged()).subscribe((leadData: Lead) => {
        this.leadData = leadData;
      });
    if (this.leadData.quickQuote.monthlyPremiumPrice) {
      let priceArr: any = this.leadData.quickQuote.monthlyPremiumPrice.toString();
      priceArr = priceArr.split('.');
      this.premuimPrice = priceArr[0];
      this.decimalPrice = priceArr[1];
    }
    this.getUtilTime().subscribe(workHours => {
      const estDate = this.getESTTime();
      const estDay = estDate.getDay(); // 0 is sunday, in API 0 is monday
      const workingHours = workHours['workingHours'];
      if (estDay === 0) {
        const apiValue = workHours['workingDays'][6];
        if (apiValue['isIncluded'] && this.compareTime(workingHours['startTime'], true) &&
          this.compareTime(workingHours['endTime'], false)) {
          this.isWorkingHours = true;
        }
      } else {
        const apiValue = workHours['workingDays'][estDay - 1];
        if (apiValue['isIncluded'] && this.compareTime(workingHours['startTime'], true) &&
          this.compareTime(workingHours['endTime'], false)) {
          this.isWorkingHours = true;
        }
      }
      // console.log("is working hours -- " + this.isWorkingHours);
    });
    // this.navService.upDateMarketingData();
  }
  ngAfterViewInit() {
    window['statusDFI'].addDelioClientToForms = false;
    const idForm = document.querySelector('section > form');
    window['DFI'].addDelioClientToForms(idForm);

    // window['DFI'].addDelioClientToForms();
    if (window['DCL']) {
      window['DCL']['set'].forms();
    }
  }
  getUtilTime() {
    const url = environment.nodeserver + 'util/time';
    return this.httpClient.get(url);
  }

  getESTTime() {
    // get local time
    const d = new Date();
    // convert to msec since Jan 1 1970
    const localTime = d.getTime();
    // obtain local UTC offset and convert to msec
    const localOffset = d.getTimezoneOffset() * 60000;
    // obtain UTC time in msec
    const utc = localTime + localOffset;
    // which is UTC + 5 hours is EST
    const offset = -5;
    const est = utc + (3600000 * offset);
    return new Date(est);

  }

  compareTime(timeToCheck: String, checkGreate: boolean) {
    const startHour = parseInt(timeToCheck.split(':')[0], 10);
    const startMinute = parseInt(timeToCheck.split(':')[1], 10);
    const startSecond = 0;



    // Create date object and set the time to that
    const startTimeObject = this.getESTTime();
    // startTimeObject.setHours(startHour, startMinute, startSecond);

    // Create date object and set the time to that
    const endTimeObject = new Date(startTimeObject);
    endTimeObject.setHours(startHour, startMinute, startSecond);

    // Now we are ready to compare both the dates
    if (checkGreate) {
      if (startTimeObject > endTimeObject) {
        return true;
      }
    } else {
      if (startTimeObject < endTimeObject) {
        return true;
      }
    }
    return false;
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
    conatctValObj.phoneNumber = this.contactForm.get('phoneNumber').value;


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

