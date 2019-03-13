import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLicenseStatusComponent } from './driver-license-status.component';

describe('DriverLicenseStatusComponent', () => {
  let component: DriverLicenseStatusComponent;
  let fixture: ComponentFixture<DriverLicenseStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverLicenseStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverLicenseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
