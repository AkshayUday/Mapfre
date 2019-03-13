import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PNINameComponent } from './pni-name.component';

describe('PNINameComponent', () => {
  let component: PNINameComponent;
  let fixture: ComponentFixture<PNINameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PNINameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PNINameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
