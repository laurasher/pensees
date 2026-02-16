import { Component, ElementRef, Input, OnInit, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
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
export class LiteBriteChartComponent implements OnInit {

  @ViewChild('chart')
  private chartContainer: ElementRef;
  @Input() data: FragmentInterface | null = null;

  public filterBy: string = '';
  filterControl = new FormControl();
  public searchTerm: string = '';
  public matchedIndices: Set<number> = new Set<number>();
  private previousMatchedIndices: Set<number> = new Set<number>();
  private searchDebounceTimer: any = null;
  private searchCache: Array<{corpusLower: string, indexStr: string, numberStr: string}> = [];

  public message = "Click colored boxes to see pensées text below. Double click to see n-most similar pensées to the one you clicked. \nClick within text area to reset."
  // public message = ""
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

  ngOnInit(){
    this.tooltip = d3.select('#container') // or d3.select('#bar')
      .append('div').attr('class', 'tooltip').style('display', 'none').style('opacity', 0);
    this.textviewer = d3.select('#text-viewer')
      .append('div').attr('class', 'text-viewer');
  };

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
          .attr('class', "scatter-cluster scatter-cluster-"+ci)
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
          })
          .on("mouseout", function (this: any) {
            d3Select.select(this)
              // .style("stroke", function (d: any) {return cluster_color_map[d.cluster];})
            tooltip
              .style('display', 'none').style('opacity', 0);
          })
          .on("click", function (this: any, _event: any, _d: any) {
            textviewer
              .html(`${_d.corpus}`);
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
    
    // d3.select('svg').remove();
    this.scatter_svg_g.selectAll(".scatter-cluster")
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)
    d3.selectAll('svg').remove();
    this.buildSvg();
    this.drawLites();
    d3.select('.text-viewer').html(``);
  }
  // public refreshLiteBritesChart(){
  //   d3.select('svg').remove();
  //   this.buildSvg();
  //   this.drawLites();
  //   // d3.select('.text-viewer').html(``);
  // }
}
