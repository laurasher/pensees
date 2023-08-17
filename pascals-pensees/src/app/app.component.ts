import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FragmentInterface } from './fragment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  title = "Pascal's Pensées";
  subtitle = "Prototype to explore NLP clustering and topic modeling of Blaise Pascal's unfinished work of 924 'pensées', or thoughts.";
  instructions = "Each colored box represents one of Pascal's numbered thoughts, arranged chronologically as he wrote them. Each has been assigned to \
  1 of 10 clusters by k-means clustering of their TF-IDF vector representations. Because the boxes are arranged chronologically, one gets a sense of \
  thematic relations across the work as a whole. Pascal died before this outline was edited, but with topic modelling we are able to better understand \
  the flow of ideas across the work. When a pensée is double clicked, all the boxes are recolored according to similarity to the clicked pensée, darkest to lightest. This \
  gives a sense of how important this theme was across the work. For example, double clicking pensée 815 shows clearly that Pascal focused on the theme \
  of miracles throughout the work, but most especially at the end."

  data: Observable<FragmentInterface>;

  constructor(private http: HttpClient) {
    this.data = this.http.get<FragmentInterface>('assets/pensee_clusters.json');
    console.log("In AppComponent constructor");
    console.log(this.data);
  }

  ngOnInit(){
  }
}
