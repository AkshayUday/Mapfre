import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogTitle } from '../footer/footer.component';
export interface DialogContent {
  content: String;
}
@Component({
  selector: 'verti-footer-dialog-modal',
  templateUrl: './footer-dialog-modal.component.html',
  styleUrls: ['./footer-dialog-modal.component.scss']
})
export class FooterDialogModalComponent implements OnInit {
  public title: String;
  public termsofuse = false;
  public security = false;
  constructor(public dialogRef: MatDialogRef<FooterDialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogTitle) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    // document.getElementById('animation_container').style.display = 'block';
    this.title = this.data['title'];
    if (this.title === 'Terms of use') {
      this.termsofuse = true;
    } else {
      this.security = true;
    }
    setTimeout(() => {
      // document.getElementById('animation_container').style.display = 'none';
    }, 1000);
  }
  onIconClick(): void {
    this.dialogRef.close();
  }
  iframeLoaded() {
    document.getElementById('animation_container').style.display = 'none';
  }

}
