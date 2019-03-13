import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoQuestionOneComponent } from './ko-question-one.component';

describe('KoQuestionOneComponent', () => {
  let component: KoQuestionOneComponent;
  let fixture: ComponentFixture<KoQuestionOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoQuestionOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoQuestionOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
