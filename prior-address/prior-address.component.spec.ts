import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorAddressComponent } from './prior-address.component';

describe('PriorAddressComponent', () => {
  let component: PriorAddressComponent;
  let fixture: ComponentFixture<PriorAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
