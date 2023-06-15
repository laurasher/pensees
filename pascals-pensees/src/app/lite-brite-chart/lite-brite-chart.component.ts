import { Component, ElementRef, Input, OnInit, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
// import * as _ from 'lodash';

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

  private square: number = 10;
  private squareBuffer: number = 0;
  private url: string = '/assets/pensee_clusters.json';

  private margin = {top: 0, right: 0, bottom: 0, left: 0};
  private width: number = 0;
  private height: number = 0;
  private contentWidth: number = 0;
  private adjustWidth: number = 0;
  private adjustHeight: number = 0;
  private contentHeight: number = 0;
  private g: any;
  private svg: any;
  private tooltip: any;
  private textviewer: any;
  private cluster_color_map: any =  {
    0 : "#a6cee3",
    1 : "#1f78b4",
    2 : "#b2df8a",
    3 : "#33a02c",
    4 : "#fb9a99",
    5 : "#e31a1c",
    6 : "#fdbf6f",
    7 : "#ff7f00",
    8 : "#cab2d6",
    9 : "#6a3d9a",
  }
  NEEDS_RESET: boolean = false;

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
    this.buildSvg();
    this.drawLites();
  }

  private buildSvg() {
    const element = this.chartContainer.nativeElement;
    this.svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

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

    this.g = this.svg.append("g")
              .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }
  private drawLites() {
    const cluster_color_map = this.cluster_color_map;

    const tooltip = d3.select('.tooltip')
      .style('display', 'none').style('opacity', 0);

    const textviewer = d3.select('.text-viewer');

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
          .on("dblclick", function (this: any, _event: any, _d: any) {
            d3.selectAll(".lites-overlay")
            .attr("fill-opacity", 0)
          })
          .on("mouseover", function (this: any, _event: any, d:any) {
            d3Select.select(this)
              // .style("stroke", "red")
            tooltip
              .style('top', (_event.layerY + 15) + 'px').style('left', (_event.layerX) + 'px')
              .style('background', function (this: any) {return 1 ? "white" : "#FFFCE0";})
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
          })
          .on("dblclick", function (this: any, _event: any, _d: any) {
            d3.selectAll(".lites")
              .data(_d.sim_arr)
              .transition(d3.transition())
              .attr("fill", cluster_color_map[_d.cluster])
              .attr("fill-opacity", (d: any) => d)
              .style("stroke-opacity", (d: any) => d)
              .style("stroke-color", cluster_color_map[_d.cluster])
          })

  }
  public refreshLiteBrites(){
    d3.select('svg').remove();
    this.buildSvg();
    this.drawLites();
    d3.select('.text-viewer').html(``);
  }
  public refreshLiteBritesChart(){
    d3.select('svg').remove();
    this.buildSvg();
    this.drawLites();
    // d3.select('.text-viewer').html(``);
  }
}
