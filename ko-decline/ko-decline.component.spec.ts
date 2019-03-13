import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoDeclineComponent } from './ko-decline.component';

describe('KoDeclineComponent', () => {
  let component: KoDeclineComponent;
  let fixture: ComponentFixture<KoDeclineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoDeclineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoDeclineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
