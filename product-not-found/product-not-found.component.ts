import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../core/services/navigation.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../../shared/error-modal/error-modal.component';
import * as fromStore from '../../store/reducers/lead.reducers';
import { distinctUntilChanged, take, skip } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';
import { TimeoutModalComponent } from '../../shared/timeout-modal/timeout-modal.component';

@Component({
  selector: 'verti-product-not-found',
  templateUrl: './product-not-found.component.html',
  styleUrls: ['./product-not-found.component.scss']
})
export class ProductNotFoundComponent implements OnInit, OnDestroy {
  imgSource: string;
  title: string;
  noProductsFoundForm: FormGroup;
  emailPattern = /^[A-Za-z][A-Za-z0-9._-]+@[A-za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  noProductsFoundForm$: Subscription;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  errorSubscription: Subscription;
  errorOccured: boolean;
  count: number;

  constructor(private fb: FormBuilder, private router: Router, public dialog: MatDialog,
    private store: Store<any>,
    private navService: NavigationService) {
    this.imgSource = './assets/img/Icon_nocovermap.svg';
    this.title = `We don't cover your area.`;
    // this.title = 'Contact information.';
    this.count = 0;
    this.errorOccured = false;
  }

  ngOnInit() {
    this.noProductsFoundForm = this.fb.group({
      // email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      primaryEmailAddress: ['',
        Validators.compose([
          // Validators.minLength(1),
          Validators.maxLength(50),
          Validators.required,
          Validators.pattern(this.emailPattern)
        ])]
    });

    // this.noProductsFoundForm$ = this.store.select('QuickQuote').subscribe((qqData) => {
    //   if (qqData.accountHolder.noproductsfound) {
    //     this.noProductsFoundForm.patchValue(qqData.accountHolder.noproductsfound);
    //   }
    // });
  }


  validateEmail(controlName) {
    const value = this.noProductsFoundForm.get(controlName).value;
    if (value !== '') {
      const str = value.replace(/[^a-zA-Z0-9_\-\.\@]/g, '');
      this.noProductsFoundForm.get(controlName).patchValue(str);
    }
  }



  getUpdates(): void {
    this.store.dispatch(new LeadActions.SavePNIData(this.noProductsFoundForm.value));
    this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
      this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    });
    this.dialog.open(ErrorModalComponent, {
      // height: '490px',
      data: {
        imgSource: './assets/img/Icon_nocovermap.svg',
        title: `Thanks! We’ll keep you updated.`,
        body: `Look for an update once Verti has launched in your neighborhood.`
      },
      panelClass: 'custom-error-modal'
    });

    // this.loaderSubscription = this.store.select(state => state.loader.isLoading).subscribe(loading => {
    //   if (!loading) {
    //     this.errorSubscription = this.store.select(state => state.error).subscribe(error => {
    //       if (error.code !== '') {
    //         if (+error.code === 602 || +error.code === 603) {
    //           this.navService.gotoRouteByName('kodecline');
    //         } else if (+error.code === 500) {
    //           this.dialog.open(TimeoutModalComponent, {
    //             height: '510px',
    //             data: error,
    //             panelClass: 'custom-timeout-modal'
    //           });
    //         } else {
    //           this.navService.gotoRouteByName('systemfailure');
    //         }
    //       } else {
    //         this.dialog.open(ErrorModalComponent, {
    //           // height: '490px',
    //           data: {
    //             imgSource: './assets/img/Icon_nocovermap.svg',
    //             title: `Thanks! We’ll keep you updated.`,
    //             body: `Look for an update once Verti has launched in your neighborhood.`
    //           },
    //           panelClass: 'custom-error-modal'
    //         });
    //       }
    //     });
    //   }
    // });
    // setTimeout(() => {
    //   if (this.count === 0) {
    //     this.dialog.open(ErrorModalComponent, {
    //       // height: '490px',
    //       data: {
    //         imgSource: './assets/img/Icon_nocovermap.svg',
    //         title: `Thanks! We’ll keep you updated.`,
    //         body: `Look for an update once Verti has launched in your neighborhood.`
    //       },
    //       panelClass: 'custom-error-modal'
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.noProductsFoundForm$) {
      this.noProductsFoundForm$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
  }

}
