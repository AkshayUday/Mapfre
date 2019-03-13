import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalmericDialogModalComponent } from './walmeric-dialog-modal.component';

describe('WalmericDialogModalComponent', () => {
  let component: WalmericDialogModalComponent;
  let fixture: ComponentFixture<WalmericDialogModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalmericDialogModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalmericDialogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
