import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinorViolationQuestionsComponent } from './minor-violation-questions.component';

describe('MinorViolationQuestionsComponent', () => {
  let component: MinorViolationQuestionsComponent;
  let fixture: ComponentFixture<MinorViolationQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinorViolationQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinorViolationQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
