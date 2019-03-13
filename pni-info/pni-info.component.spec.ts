import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PniInfoComponent } from './pni-info.component';

describe('PniInfoComponent', () => {
  let component: PniInfoComponent;
  let fixture: ComponentFixture<PniInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PniInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PniInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
