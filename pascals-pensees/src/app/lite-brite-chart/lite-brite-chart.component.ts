import { Component, ElementRef, Input, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as d3 from 'd3';
import * as d3Select from 'd3-selection';

import { FragmentInterface } from '../fragment';

// resizable chart angular tutorial https://medium.com/@jeanphilippelemieux/creating-a-responsive-graph-with-angular-and-d3-b45bb8065588

@Component({
  selector: 'app-lite-brite-chart',
  templateUrl: './lite-brite-chart.component.html',
  styleUrls: ['./lite-brite-chart.component.less']
})
export class LiteBriteChartComponent implements OnInit, OnDestroy {

  @ViewChild('chart')
  private chartContainer: ElementRef;
  @ViewChild('clusterScatterplot')
  private scatterplotContainer: ElementRef;
  @Input() data: FragmentInterface | null = null;

  public filterBy: string = '';
  filterControl = new FormControl();
  public searchTerm: string = '';
  public matchedIndices: Set<number> = new Set<number>();
  private previousMatchedIndices: Set<number> = new Set<number>();
  private searchDebounceTimer: any = null;
  private searchCache: Array<{corpusLower: string, indexStr: string, numberStr: string}> = [];
  private resizeTimeout: any = null;
  private currentDisplayedPensee: any = null; // Track currently displayed pensée for dynamic highlighting

  public message = "Click colored boxes to see pensées text below. Double click to see n-most similar pensées to the one you clicked. \nClick within text area to reset."
  // public message = ""
  public isTextViewerExpanded: boolean = false;
  private square: number = 10;
  private squareBuffer: number = 0;

  private NUM_CLUSTERS = 10;
  private margin = {top: 0, right: 0, bottom: 0, left: 0};
  private width: number = 0;
  private scatter_svg_width: number = 0;
  private scatter_svg_height: number = 0;
  private height: number = 0;
  private contentWidth: number = 0;
  private adjustWidth: number = 0;
  private adjustHeight: number = 0;
  private contentHeight: number = 0;
  private g: any;
  private scatter_svg_g: any;
  private svg: any;
  private scatter_svg: any;
  private tooltip: any;
  private textviewer: any;
  private cluster_color_map: any =  {
    0 : "#D3BCBC",
    1 : "#DA6627",
    2 : "#08332C",
    3 : "#4D7F71",
    4 : "#3A4D22",
    5 : "#B39530",
    6 : "#EADB9F",
    7 : "#604F5B",
    8 : "#937F7F",
    9 : "#3F5450",
  }

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Debounce resize events to avoid excessive redraws
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.handleResize();
    }, 250);
  }

  private handleResize() {
    if (!this.data) { return; }
    // Remove existing SVG elements only within this component
    d3.select(this.chartContainer.nativeElement).selectAll('svg').remove();
    if (this.scatterplotContainer) {
      d3.select(this.scatterplotContainer.nativeElement).selectAll('svg').remove();
    }
    // Rebuild and redraw
    this.buildSvg();
    this.drawLites();
  }

  ngOnInit(){
    this.tooltip = d3.select('#container') // or d3.select('#bar')
      .append('div').attr('class', 'tooltip').style('display', 'none').style('opacity', 0);
    this.textviewer = d3.select('#text-viewer')
      .append('div').attr('class', 'text-viewer');
  };

  ngOnDestroy() {
    // Clean up resize timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  }

  ngOnChanges(): void {
    if (!this.data) { return; }
    console.log(this.data);
    
    // Build search cache to avoid repeated toLowerCase() operations
    if (Array.isArray(this.data)) {
      this.searchCache = this.data.map(item => ({
        corpusLower: item.corpus?.toLowerCase() || '',
        indexStr: item.fragment_index?.toString() || '',
        numberStr: item.fragment_number?.toString() || ''
      }));
    }
    
    this.buildSvg();
    this.drawLites();
  }

  private buildSvg() {
    const element = this.chartContainer.nativeElement;
    this.svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

    this.scatter_svg = d3.select("#cluster-scatterplot").append('svg').attr("height", "100%").attr("width", "100%");
    this.scatter_svg_width = +this.scatter_svg.style("width").replace("px", "") - 20;
    this.scatter_svg_height = +this.scatter_svg.style("height").replace("px", "") - 20;

    this.margin = {
      top: +this.svg.style("margin-top").replace("px", ""),
      right: +this.svg.style("margin-right").replace("px", ""),
      bottom: +this.svg.style("margin-bottom").replace("px", ""),
      left: +this.svg.style("margin-left").replace("px", "")
    };

    this.width = +this.svg.style("width").replace("px", "");
    this.height = +this.svg.style("height").replace("px", "");

    this.contentWidth = this.width - this.margin.left - this.margin.right;
    this.contentHeight = this.height - this.margin.top - this.margin.bottom;
    this.adjustWidth = this.contentWidth/44;
    this.adjustHeight = this.contentHeight/21;

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.scatter_svg_g = this.scatter_svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  }
  private drawLites() {
    const cluster_color_map = this.cluster_color_map;
    const tooltip = d3.select('.tooltip')
      .style('display', 'none').style('opacity', 0);
    const textviewer = d3.select('.text-viewer');
    const scatter = this.scatter_svg_g;

    this.g.selectAll("lites")
      .data(this.data)
      .enter()
      .append("rect")
        .attr("class", "lites")
        .attr('x', (d: any, i: any) => d.col*(this.adjustWidth+this.squareBuffer))
        .attr('y', (d: any, i: any) => d.row*(this.adjustHeight+this.squareBuffer))
        .attr('width',  this.adjustWidth)
        .attr('height', this.adjustHeight)
        .attr("fill", "white")
        .attr("stroke", "white")
        .transition(d3.transition(), 40000)
        .attr("fill", (d: any) => cluster_color_map[d.cluster])
        .attr("stroke", (d: any) => cluster_color_map[d.cluster])

    let x = d3.scaleLinear()
      .domain([-0.45, 0.45])
      .range([ 0, this.scatter_svg_width ]);
    let y = d3.scaleLinear()
      .domain([-0.3, 0.44])
      .range([ this.scatter_svg_height, 0]);

    for (let ci=0; ci<this.NUM_CLUSTERS; ci++){
      scatter.selectAll("dot")
        .data(this.data)
          .enter()
          .filter( (d: any) =>  d.cluster == ci )
          .append("g")
          .attr('class', (d: any) => "scatter-cluster scatter-cluster-"+ci+" scatter-dot-"+d.fragment_index)
          .append("circle")
            .attr("cx", (d: any) => x(d.x0))
            .attr("cy", (d: any) => y(d.x1))
            .transition(d3.transition(), 40000)
            .attr("r", 1.6)
            .attr("fill", (d: any) => cluster_color_map[d.cluster])
            .attr("stroke", (d: any) => cluster_color_map[d.cluster])
    }

    let color_amplifier = 5;
    this.g.selectAll("lites-overlay")
      .data(this.data)
        .enter()
        .append("rect")
          .attr("class", "lites-overlay")
          .attr('x', (d: any, i: any) => d.col*(this.adjustWidth+this.squareBuffer))
          .attr('y', (d: any, i: any) => d.row*(this.adjustHeight+this.squareBuffer))
          .attr('width',  this.adjustWidth)
          .attr('height', this.adjustHeight)
          .attr("fill", "white")
          .attr("fill-opacity", 0)
          .on("mouseover", function (this: any, _event: any, d:any) {
            d3Select.select(this)
            tooltip
              .style('top', (_event.layerY + 15) + 'px').style('left', (_event.layerX) + 'px')
              .style('background', "#f6efe3")
              .style('display', 'block').style('opacity', 0.99)
              .html(`cluster: ${_event.target.__data__['cluster']}<br>number: ${_event.target.__data__['fragment_number']}<br>index: ${_event.target.__data__['fragment_index']}<br>row: ${_event.target.__data__['row']}<br>col: ${_event.target.__data__['col']}`);
            
            // Dim all scatter dots to 50% opacity
            scatter.selectAll(".scatter-cluster circle")
              .transition().duration(100)
              .attr("fill-opacity", 0.5)
              .attr("stroke-opacity", 0.5);
            
            // Highlight the corresponding dot in the scatter plot
            const fragmentIndex = _event.target.__data__['fragment_index'];
            scatter.select(".scatter-dot-"+fragmentIndex)
              .select("circle")
              .transition().duration(100)
              .attr("r", 8)
              .attr("fill-opacity", 1)
              .attr("stroke-opacity", 1);
          })
          .on("mouseout", function (this: any, _event: any) {
            d3Select.select(this)
              // .style("stroke", function (d: any) {return cluster_color_map[d.cluster];})
            tooltip
              .style('display', 'none').style('opacity', 0);
            
            // Restore all scatter dots to full opacity
            scatter.selectAll(".scatter-cluster circle")
              .transition().duration(100)
              .attr("r", 1.6)
              .attr("fill-opacity", 1)
              .attr("stroke-opacity", 1);
            
            // Remove highlight from the corresponding dot in the scatter plot
            const fragmentIndex = _event.target.__data__['fragment_index'];
            scatter.select(".scatter-dot-"+fragmentIndex)
              .select("circle")
              .transition().duration(100)
              .attr("r", 1.6);
          })
          .on("click", (_event: any, _d: any) => {
            // Store the currently displayed pensée
            this.currentDisplayedPensee = _d;
            
            // Get the color for this pensée's cluster
            const penseeColor = cluster_color_map[_d.cluster];
            
            // Highlight search terms in the text with the pensée's color
            const highlightedText = this.highlightSearchTerms(_d.corpus, penseeColor);
            
            textviewer
              .html(highlightedText);
            //reset
            scatter.selectAll(".scatter-cluster")
              .attr("fill-opacity", 0)
              .attr("stroke-opacity", 0)

            scatter.selectAll(".scatter-cluster-"+_d.cluster)
              .transition(d3.transition())
              .attr("fill-opacity", 1)
              .attr("stroke-opacity", 1)
          })
          .on("dblclick", function (this: any, _event: any, _d: any) {
            d3.selectAll(".lites")
              .data(_d.sim_arr)
              .transition(d3.transition())
              .attr("fill", cluster_color_map[_d.cluster])
              .attr("fill-opacity", (d: any) =>    d*color_amplifier)
              .style("stroke-opacity", (d: any) => d*color_amplifier)
              .style("stroke-color", cluster_color_map[_d.cluster])
          })

  }
  
  private highlightSearchTerms(text: string, color: string): string {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return text;
    }
    
    // Validate color format (hex colors only from cluster_color_map)
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      // If color is invalid, return text without highlighting
      return text;
    }
    
    const searchLower = this.searchTerm.toLowerCase().trim();
    const searchTerms = searchLower.split(/\s+/); // Split by whitespace to handle multiple words
    
    let highlightedText = text;
    
    // Highlight each search term
    searchTerms.forEach(term => {
      if (term.length === 0) return;
      
      // Escape special regex characters
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Create regex to match term case-insensitively
      const regex = new RegExp(`(${escapedTerm})`, 'gi');
      
      // Replace matches with highlighted version
      highlightedText = highlightedText.replace(regex, (match) => {
        // Escape HTML entities in the match to prevent XSS
        const escapedMatch = match
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        return `<span style="background-color: ${color}; color: white; padding: 2px 4px; border-radius: 3px;">${escapedMatch}</span>`;
      });
    });
    
    return highlightedText;
  }
  
  public searchPensees() {
    // Clear any existing debounce timer
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    
    // Debounce search execution by 300ms (increased for better performance)
    this.searchDebounceTimer = setTimeout(() => {
      this.executeSearch();
    }, 300);
  }
  
  private executeSearch() {
    // Store previous state for comparison
    this.previousMatchedIndices = new Set(this.matchedIndices);
    this.matchedIndices.clear();
    
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // If search is empty, just reset styles without rebuilding SVG
      this.resetSearchHighlighting();
      return;
    }
    
    const searchLower = this.searchTerm.toLowerCase().trim();
    
    // Use cached lowercase strings for much faster search
    this.searchCache.forEach((cached, index) => {
      if (cached.corpusLower.includes(searchLower) ||
          cached.indexStr.includes(searchLower) ||
          cached.numberStr.includes(searchLower)) {
        this.matchedIndices.add(index);
      }
    });
    
    // Apply highlighting to existing rectangles
    this.applySearchHighlighting();
    
    // If there's a pensée currently displayed, update its highlighting
    this.updateTextViewerHighlighting();
  }
  
  private resetSearchHighlighting() {
    // Reset all rectangles to normal appearance without transitions for instant feedback
    const allRects = d3.selectAll('.lites');
    allRects
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 1)
      .attr('stroke', (d: any) => this.cluster_color_map[d.cluster])
      .attr('stroke-width', 1);
    
    this.previousMatchedIndices.clear();
    
    // If there's a pensée currently displayed, update its highlighting (remove highlights)
    this.updateTextViewerHighlighting();
  }
  
  private applySearchHighlighting() {
    const hasMatches = this.matchedIndices.size > 0;
    const cluster_color_map = this.cluster_color_map;
    
    // Get all rectangles once
    const allRects = d3.selectAll('.lites');
    
    if (!hasMatches) {
      // No matches - dim all rectangles instantly
      allRects
        .attr('fill-opacity', 0.3)
        .attr('stroke-opacity', 0.3)
        .attr('stroke', (d: any) => cluster_color_map[d.cluster])
        .attr('stroke-width', 1);
    } else {
      // Only update rectangles that changed state
      allRects.each((d: any, i: number, nodes: any) => {
        const isMatch = this.matchedIndices.has(i);
        const wasMatch = this.previousMatchedIndices.has(i);
        
        // Skip if state hasn't changed
        if (isMatch === wasMatch && this.previousMatchedIndices.size > 0) {
          return;
        }
        
        // Update only changed rectangles
        d3.select(nodes[i])
          .attr('fill-opacity', isMatch ? 1 : 0.3)
          .attr('stroke-opacity', isMatch ? 1 : 0.3)
          .attr('stroke', cluster_color_map[d.cluster])
          .attr('stroke-width', 1);
      });
    }
    
    // Update previous state
    this.previousMatchedIndices = new Set(this.matchedIndices);
  }
  
  private updateTextViewerHighlighting() {
    // Only update if there's a pensée currently displayed
    if (!this.currentDisplayedPensee) {
      return;
    }
    
    // Get the text viewer element
    const textviewer = d3.select('.text-viewer');
    
    // Get the color for the currently displayed pensée's cluster
    const penseeColor = this.cluster_color_map[this.currentDisplayedPensee.cluster];
    
    // Re-apply highlighting with current search term
    const highlightedText = this.highlightSearchTerms(this.currentDisplayedPensee.corpus, penseeColor);
    
    // Update the text viewer
    textviewer.html(highlightedText);
  }
  
  public clearSearch() {
    this.searchTerm = '';
    this.matchedIndices.clear();
    
    // Clear any pending debounce timer
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    
    // Just reset styles without rebuilding SVG
    this.resetSearchHighlighting();
  }

  public refreshLiteBrites(){
    // Clear search state
    this.searchTerm = '';
    this.matchedIndices.clear();
    this.currentDisplayedPensee = null; // Clear currently displayed pensée
    
    // d3.select('svg').remove();
    this.scatter_svg_g.selectAll(".scatter-cluster")
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)
    d3.selectAll('svg').remove();
    this.buildSvg();
    this.drawLites();
    d3.select('.text-viewer').html(``);
  }

  public toggleTextViewer() {
    this.isTextViewerExpanded = !this.isTextViewerExpanded;
  }
  // public refreshLiteBritesChart(){
  //   d3.select('svg').remove();
  //   this.buildSvg();
  //   this.drawLites();
  //   // d3.select('.text-viewer').html(``);
  // }
}
