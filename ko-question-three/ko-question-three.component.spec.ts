import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoQuestionThreeComponent } from './ko-question-three.component';

describe('KoQuestionThreeComponent', () => {
  let component: KoQuestionThreeComponent;
  let fixture: ComponentFixture<KoQuestionThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoQuestionThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoQuestionThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
