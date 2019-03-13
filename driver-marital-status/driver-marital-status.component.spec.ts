import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMaritalStatusComponent } from './driver-marital-status.component';

describe('DriverMaritalStatusComponent', () => {
  let component: DriverMaritalStatusComponent;
  let fixture: ComponentFixture<DriverMaritalStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverMaritalStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverMaritalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
