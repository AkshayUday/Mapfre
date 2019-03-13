import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoQuestionTwoComponent } from './ko-question-two.component';

describe('KoQuestionTwoComponent', () => {
  let component: KoQuestionTwoComponent;
  let fixture: ComponentFixture<KoQuestionTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoQuestionTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoQuestionTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
