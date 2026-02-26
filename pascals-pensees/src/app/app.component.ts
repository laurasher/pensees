import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FragmentInterface } from './fragment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements OnDestroy {
  title = "Pascal's Pensées";
  instructions = "Explore clustering of Blaise Pascal's 924 pensées.";
  // instructions = "Explore NLP clustering and topic modeling of Pascal's 924 pensées. Each colored box represents one of Pascal's penseés, arranged chronologically. \
  // Each penseé has been assigned to 1 of 10 clusters by k-means clustering of their TF-IDF vector representations. Double click a box to recolor all boxes\
  // according to their topic-modeled similarity to the clicked pensée, from dark meaning most similar to light, meaning not related thematically."
  // instructions = "Explore NLP clustering and topic modeling of Pascal's 924 pensées. Each colored box represents one of Pascal's penseés, arranged chronologically as they were written. Each has been assigned to \
  // 1 of 10 clusters by k-means clustering of their TF-IDF vector representations. Because the boxes are arranged chronologically, one gets a sense of \
  // thematic relations across the work as a whole. Pascal died before this outline was edited, but with topic modelling we are able to better understand \
  // the flow of ideas across the work. Double click a box to recolor according to similarity of all the boxes to the clicked pensée, darkest to lightest. This \
  // gives a sense of how important this theme was across the work. For example, double clicking pensée 815 shows clearly that Pascal focused on the theme \
  // of miracles throughout the work, but most especially at the end."

  data: Observable<FragmentInterface>;
  public isDrawerOpen: boolean = false;
  public penseesList: FragmentInterface[] = [];
  private dataSubscription: Subscription;

  private readonly clusterColorMap: {[key: number]: string} = {
    0: '#D3BCBC',
    1: '#DA6627',
    2: '#08332C',
    3: '#4D7F71',
    4: '#3A4D22',
    5: '#B39530',
    6: '#EADB9F',
    7: '#604F5B',
    8: '#937F7F',
    9: '#3F5450',
  };

  constructor(private http: HttpClient) {
    this.data = this.http.get<FragmentInterface>('assets/pensee_clusters.json');
    this.dataSubscription = this.data.subscribe((pensees: any) => {
      this.penseesList = pensees as FragmentInterface[];
    });
    console.log("In AppComponent constructor");
    console.log(this.data);
  }

  ngOnInit(){
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  public toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  public getPenseeCardStyle(cluster: number): { [key: string]: string } {
    const hex = this.clusterColorMap[cluster] || '#cccccc';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { 'background-color': `rgba(${r}, ${g}, ${b}, 0.6)` };
  }
}
