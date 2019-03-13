import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { WalmericDialogModalComponent } from '../walmeric-dialog-modal/walmeric-dialog-modal.component';
// import { LeadService } from '../../../landingPage/quote-detail/lead.service';
// import { sourceLogoPath } from '../../../services/constants';


@Component({
  selector: 'verti-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() homePage: Boolean;
  // public sourceSite = sourceLogoPath;
  logoPath: string;
  noLogoSource: Boolean = false;
  ifCompVisible: Boolean = false;
  ifQuoteVisible: Boolean = false;

  constructor(public dialog: MatDialog
    // , private _leadService: LeadService
  ) {
    // const leadData = this._leadService.getLeadData();
    // if (leadData && leadData.source && this.sourceSite.hasOwnProperty(leadData.source)) {
    //   this.logoPath = this.sourceSite[leadData.source];
    // } else {
    //   this.noLogoSource = true;
    // }
    // if (leadData && leadData.source === 'Everquote') {
    //   this.ifQuoteVisible = true;
    // } else {
    //   this.ifCompVisible = true;
    // }
  }
  ngOnInit() {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(WalmericDialogModalComponent, {
      // width: '376px',
      // panelClass: 'custom-modalbox-header'
      panelClass: 'custom-header-modal'
    });
  }
}
