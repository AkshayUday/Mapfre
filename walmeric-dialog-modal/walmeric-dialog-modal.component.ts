import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'verti-walmeric-dialog-modal',
  templateUrl: './walmeric-dialog-modal.component.html',
  styleUrls: ['./walmeric-dialog-modal.component.scss']
})
export class WalmericDialogModalComponent implements OnInit, AfterViewInit {
  mobileForm: any;
  mobileFormInvalid: Boolean = false;
  phoneNumber: any;
  enableCall: Boolean = false;
  constructor(public dialogRef: MatDialogRef<WalmericDialogModalComponent>, private _fb: FormBuilder, private elementRef: ElementRef) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {

    // this.mobileForm = this._fb.group({
    //   mobileNumber: ['', Validators.required]
    // });
  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelector('.callme-btn')
      .addEventListener('click', this.onIconClick.bind(this));
    window['statusDFI'].addDelioClientToForms = false;
    const idForm = document.querySelector('#walmeric-dialog-modal-form');
    if (idForm) {
      window['DFI'].addDelioClientToForms(idForm);
    }

    // window['DFI'].addDelioClientToForms();
    if (window['DCL']) {
      window['DCL']['set'].forms();
    }

  }
  onIconClick(element): void {
    if (element === 'icon') {
      this.dialogRef.close();
    } else {
      if (this.enableCall === true) {
        this.dialogRef.close();
      }
    }

  }

  // onKey(event: any) {
  //   const OnlyNumbers = event.target.value.replace(/[^0-9]/g, '');
  //   this.mobileForm.patchValue({
  //     mobileNumber: OnlyNumbers
  //   });
  //   if (OnlyNumbers === '' || OnlyNumbers === undefined) {
  //     this.mobileFormInvalid = true;
  //   } else {
  //     this.mobileFormInvalid = false;
  //   }
  //   if (OnlyNumbers.toString().length === 10) {
  //     this.enableCall = true;
  //   } else {
  //     this.enableCall = false;
  //   }
  // }

  // formatPhoneNumber(data) {
  //   this.phoneNumber = data.value;
  //   this.mobileForm.get('mobileNumber').setValidators(Validators.maxLength(10));
  //   this.mobileForm.get('mobileNumber').setValidators(Validators.minLength(10));
  //   if (this.phoneNumber.toString().length !== 10) {
  //     this.mobileFormInvalid = true;
  //   } else {
  //     this.mobileFormInvalid = false;
  //     this.enableCall = true;
  //   }
  // }

}
