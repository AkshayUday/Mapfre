import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickquoteComponent } from './quickquote.component';

describe('QuickquoteComponent', () => {
  let component: QuickquoteComponent;
  let fixture: ComponentFixture<QuickquoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickquoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
