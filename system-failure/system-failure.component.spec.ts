import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemFailureComponent } from './system-failure.component';

describe('SystemFailureComponent', () => {
  let component: SystemFailureComponent;
  let fixture: ComponentFixture<SystemFailureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemFailureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
