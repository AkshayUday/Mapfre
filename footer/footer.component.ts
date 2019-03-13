import { Component, OnInit } from '@angular/core';
import { FooterDialogModalComponent } from '../footer-dialog-modal/footer-dialog-modal.component';
import { MatDialog } from '@angular/material';

export interface DialogTitle {
  title: string;
}

@Component({
  selector: 'verti-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  showMobile = false;
  isMobileDevice;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.isMobileDevice = this.isMobile();
    if (this.isMobileDevice) {
      this.showMobile = true;
    }
  }
  isMobile = () => {

    return navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/Opera Mini/i) ||
      navigator.userAgent.match(/IEMobile/i);

  }


  feedbackTrigger = (e) => {
    e.preventDefault();
    if (window['_kiq']) {
      window['_kiq'].push(['set', { 'event': 'shareFeedback' }]);
      window['_kiq'].push(['eventHandler', 'close', function () {
        window['_kiq'].push(['set', { 'event': null }]);
      }]);
    }
  }

  openDialog(event): void {
    const dialogRef = this.dialog.open(FooterDialogModalComponent, {
      height: '440px',
      data: { title: event.target.innerText },
      panelClass: 'custom-modalbox-footer'
    });

  }

}
