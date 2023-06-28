import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FragmentInterface } from './fragment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  title = "Pascal's Pensées Explorer";
  subtitle = "Prototype to explore nlp clustering and topic modeling on the philosopher's 924 fragments.";
  data: Observable<FragmentInterface>;

  constructor(private http: HttpClient) {
    this.data = this.http.get<FragmentInterface>('../assets/pensee_clusters.json');
  }
}
