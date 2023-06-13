import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements OnInit {
  title = 'Pensées Explorer';
  subtitle = 'Prototype to explore nlp clustering and topic modeling.';

  constructor() {}

  ngOnInit() {
  }
}
