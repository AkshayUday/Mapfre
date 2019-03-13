
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { Subscription } from 'rxjs';
import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule } from '@angular/material';
import { NavigationService } from '../../core/services/navigation.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

import * as LeadActions from '../../store/actions/lead.actions';
import * as fromStore from '../../store/reducers/lead.reducers';
import { VehicleAddService } from '../../core/services/vehicle-add-service';
import { distinctUntilChanged, take } from 'rxjs/operators';

@Component({
  selector: 'verti-contactpa',
  templateUrl: './contact-pa.component.html',
  styleUrls: ['./contact-pa.component.scss']
})
export class ContactpaComponent implements OnInit {
  imgSource: string;
  title: string;
  contactitle:string;

  constructor(private fb: FormBuilder, private router: Router, private store: Store<AppState>,
    private navService: NavigationService, private activatedRoute: ActivatedRoute, private vehicleAddService: VehicleAddService) {
    this.imgSource = './assets/img/Icon_SadRacoon.svg';
    this.contactitle = "Sorry,"; 
    
  }
 
  ngOnInit() {
  }

}

 