import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../core/services/navigation.service';
import { TypeListService } from '../../core/services/type-list.service';
import * as fromStore from '../../store/reducers/lead.reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';
@Component({
  selector: 'verti-pni-info',
  templateUrl: './pni-info.component.html',
  styleUrls: ['./pni-info.component.scss']
})
export class PniInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  maritalStatusForm: FormGroup;
  id: any;
  imgSource: string;
  title: string;
  maritalStatusForm$: Subscription;
  maritalStatusOptions: any;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  loaderStopped: boolean;

  constructor(private fb: FormBuilder, private store: Store<any>, private navService: NavigationService) {
    this.imgSource = './assets/img/Icon_MaritalStatus.svg';
    this.title = 'What\'s your marital status?';
  }

  ngOnInit() {
    this.maritalStatusForm = this.fb.group({
      maritalStatusCode: ['', Validators.compose([
        Validators.required
      ])]
    });
    this.maritalStatusForm$ = this.store.select(fromStore.leadSelector)
      .pipe(distinctUntilChanged()).subscribe((leadData) => {
        if (leadData) {
          setTimeout(() => {
            this.maritalStatusForm.patchValue(leadData);
          });
        }
      });
  }

  ngAfterViewInit() {
    this.navService.upDateMarketingData();
  }

  onChange(event): void {
    const maritalStatusObj = event.selected;

    maritalStatusObj.maritalStatusValue = this.getMaritalStatusValue(event);
    this.store.dispatch(new LeadActions.SavePNIData(maritalStatusObj));
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
    //   this.navService.upDateMarketingData();
    // });
  }
  getMaritalStatusValue(data) {
    if (data && data.allOptions) {
      return data.allOptions.filter(item => item.code.trim() === data.selected.maritalStatusCode.trim())[0].name;
    }
  }
  ngOnDestroy() {
    if (this.maritalStatusForm$) {
      this.maritalStatusForm$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
  }
}
