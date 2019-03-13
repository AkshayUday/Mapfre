import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMajorViolationsComponent } from './driver-major-violations.component';

describe('DriverMajorViolationsComponent', () => {
  let component: DriverMajorViolationsComponent;
  let fixture: ComponentFixture<DriverMajorViolationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverMajorViolationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverMajorViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
