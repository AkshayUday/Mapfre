import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lead } from '../../store/models/lead.model';
import { distinctUntilChanged, take } from 'rxjs/operators';
import * as fromStore from '../../store/reducers/lead.reducers';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'verti-system-failure',
  templateUrl: './system-failure.component.html',
  styleUrls: ['./system-failure.component.scss']
})
export class SystemFailureComponent implements OnInit, OnDestroy {
  imgSource: string;
  title: string;
  private _firstName: string;

  set firstName(firstName: string) {
    this._firstName = firstName || '';
    this.title = 'Sorry, ' + this._firstName + ' we need to talk this through.';
  }

  get firstName(): string {
    return this._firstName;
  }

  leadSub: Subscription;
  constructor(private store: Store<any>) {
    this.imgSource = './assets/img/Fill_1.svg';
    this.firstName = '';
  }
  ngOnInit() {
    this.leadSub = this.store.select(fromStore.leadSelector)
      .pipe(take(1)).subscribe((leadData: Lead) => {
        this.firstName = leadData.firstName;
      });
  }
  ngOnDestroy() {
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
  }
}
