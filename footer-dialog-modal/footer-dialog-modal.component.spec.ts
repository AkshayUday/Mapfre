import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterDialogModalComponent } from './footer-dialog-modal.component';

describe('FooterDialogModalComponent', () => {
  let component: FooterDialogModalComponent;
  let fixture: ComponentFixture<FooterDialogModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterDialogModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterDialogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
