import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDrivingHistoryComponent } from './driver-driving-history.component';

describe('DriverDrivingHistoryComponent', () => {
  let component: DriverDrivingHistoryComponent;
  let fixture: ComponentFixture<DriverDrivingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverDrivingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDrivingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
