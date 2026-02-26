import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FragmentInterface } from './fragment';
import { LiteBriteChartComponent } from './lite-brite-chart/lite-brite-chart.component';

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
  public filteredPenseesList: FragmentInterface[] = [];
  public searchTerm: string = '';
  private dataSubscription: Subscription;

  // Drawer positioning & drag state
  readonly drawerWidth: number = 600;
  private readonly toggleButtonWidth: number = 36;
  public drawerLeft: number = 0;
  public isDragging: boolean = false;

  @ViewChild('liteBriteChart') private liteBriteChartRef!: LiteBriteChartComponent;

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
      this.updateFilteredPensees();
    });
    console.log("In AppComponent constructor");
    console.log(this.data);
  }

  ngOnInit(){
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  // Returns the `left` pixel position for the drawer (off-screen when closed)
  get drawerPositionLeft(): number {
    if (typeof window === 'undefined') return this.drawerWidth * 4;
    return this.isDrawerOpen ? this.drawerLeft : window.innerWidth;
  }

  // Toggle button always sits flush against the drawer's left edge
  get toggleButtonLeft(): number {
    if (typeof window === 'undefined') return this.drawerWidth * 4;
    return this.isDrawerOpen
      ? this.drawerLeft - this.toggleButtonWidth
      : window.innerWidth - this.toggleButtonWidth;
  }

  // Maximum valid left position for the drawer (keeps it fully on screen)
  private get maxDrawerLeft(): number {
    return window.innerWidth - this.drawerWidth;
  }

  public toggleDrawer(): void {
    if (!this.isDrawerOpen) {
      this.drawerLeft = this.maxDrawerLeft;
      this.isDrawerOpen = true;
    } else {
      this.isDrawerOpen = false;
    }
  }

  // ── Search ──────────────────────────────────────────────────────────────────

  public onSearchChange(): void {
    if (this.liteBriteChartRef) {
      this.liteBriteChartRef.searchTerm = this.searchTerm;
      this.liteBriteChartRef.searchPensees();
    }
    this.updateFilteredPensees();
  }

  public clearSearch(): void {
    this.searchTerm = '';
    if (this.liteBriteChartRef) {
      this.liteBriteChartRef.clearSearch();
    }
    this.updateFilteredPensees();
  }

  private updateFilteredPensees(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPenseesList = term
      ? this.penseesList.filter(p => p.corpus?.toLowerCase().includes(term))
      : this.penseesList;
  }

  // ── Drag to reposition ───────────────────────────────────────────────────

  private readonly DRAG_THRESHOLD = 5;
  private pendingDrag: { startX: number; startLeft: number } | null = null;

  public onDragStart(event: MouseEvent): void {
    this.pendingDrag = { startX: event.clientX, startLeft: this.drawerLeft };
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.pendingDrag) return;
    if (!this.isDragging) {
      if (Math.abs(event.clientX - this.pendingDrag.startX) > this.DRAG_THRESHOLD) {
        this.isDragging = true;
      }
    }
    if (!this.isDragging) return;
    const newLeft = this.pendingDrag.startLeft + (event.clientX - this.pendingDrag.startX);
    this.drawerLeft = Math.max(0, Math.min(newLeft, this.maxDrawerLeft));
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
    this.pendingDrag = null;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isDrawerOpen) {
      const max = this.maxDrawerLeft;
      if (this.drawerLeft > max) {
        this.drawerLeft = Math.max(0, max);
      }
    }
  }

  // ── Card styling ──────────────────────────────────────────────────────────

  public getPenseeCardStyle(cluster: number): { [key: string]: string } {
    const color = this.clusterColorMap[cluster] || '#cccccc';
    return {
      'background': `linear-gradient(to right, ${color} 4%, white 4%, white 96%, ${color} 96%)`,
    };
  }
}
