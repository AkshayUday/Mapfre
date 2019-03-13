import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'verti-ko-decline',
  templateUrl: './ko-decline.component.html',
  styleUrls: ['./ko-decline.component.scss']
})
export class KoDeclineComponent implements OnInit {
  imgSource: string;
  title: string;
  subtitle: string;
  para1: string;
  para2: string;

  constructor() {
    this.imgSource = './assets/img/Icon_SadRacoon.svg';
    this.title = 'Sorry.';
    this.subtitle = 'YOU HAVE BEEN DECLINED';
    this.para1 = 'Based on current violation activity we can\'t offer you a policy at this time.' + ' ' +
      'You\'ll receive a notice in the mail shortly providing more details about why you were declined coverage.';
    this.para2 = ' if there is more to this story & maybe we can still make things work.';
  }

  ngOnInit() {
  }

}
