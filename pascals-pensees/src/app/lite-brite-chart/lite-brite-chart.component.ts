import { Component, ElementRef, Input, OnInit, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import * as d3 from 'd3';
import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import {transition} from 'd3-transition';

import { FragmentInterface } from '../fragment';

// resizable chart angulor tutorial https://medium.com/@jeanphilippelemieux/creating-a-responsive-graph-with-angular-and-d3-b45bb8065588

@Component({
  selector: 'app-lite-brite-chart',
  templateUrl: './lite-brite-chart.component.html',
  styleUrls: ['./lite-brite-chart.component.less']
})
export class LiteBriteChartComponent implements OnInit {
  
  // @ViewChild("chart", { static: true }) protected chartContainer!: ElementRef;

  @ViewChild('chart')
  private chartContainer: ElementRef;
  @Input() data: FragmentInterface | null = null;

  private penseeClusterData: any = [];
  private square: number = 10;
  // private squareBuffer: number = this.square/4;
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
  private cluster_color_map: any =  {
    1 : "#543005",
    2 : "#8c510a",
    3 : "#bf812d",
    4 : "#dfc27d",
    5 : "#f6e8c3",
    6 : "#f5f5f5",
    7 : "#c7eae5",
    8 : "#80cdc1",
    9 : "#35978f",
    10 : "#01665e",
    11 : "#003c30",
  }
  constructor() {}

  ngOnInit(){
      this.tooltip = d3.select('#container') // or d3.select('#bar')
        .append('div').attr('class', 'tooltip').style('display', 'none').style('opacity', 0);
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
    // this.adjustWidth = this.width/(44);
    this.adjustWidth = this.contentWidth/44;
    this.adjustHeight = this.contentHeight/21;

    this.g = this.svg.append("g")
              .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }
  private drawLites() {
    const tooltip = d3.select('.tooltip')
      .style('display', 'none').style('opacity', 0);

    this.g.selectAll("lites")
      .data(this.data)
      .enter()
      .append("rect")
        // .attr('x', (d: any, i: any) => d.col*(this.square+this.squareBuffer))
        // .attr('y', (d: any, i: any) => d.row*(this.square+this.squareBuffer))
        .attr('x', (d: any, i: any) => d.col*(this.adjustWidth+this.squareBuffer))
        .attr('y', (d: any, i: any) => d.row*(this.adjustHeight+this.squareBuffer))
        // .attr("width", this.square)
        .attr('width',  this.adjustWidth)
        .attr('height', this.adjustHeight)
        .attr("fill", (d: any) => this.cluster_color_map[d.cluster])
        // .attr("opacity", function (d: any, i: any) {
        //   return d[""];
        //   })
        .on("mouseover", function (this: any, d: any) {
          d3Select.select(this)
            .style("stroke", "red")
            // .style("stroke-weight", "10px")
          tooltip
            .style('top', (d.layerY + 15) + 'px').style('left', (d.layerX) + 'px')
            .style('background', function (this: any) {return 1 ? "white" : "#FFFCE0";})
            .style('display', 'block').style('opacity', 0.99)
            .html(`cluster: ${d.target.__data__['cluster']}<br>index: ${d.target.__data__['fragment_index']}<br>row: ${d.target.__data__['row']}<br>col: ${d.target.__data__['col']}`);
        })
        .on("mouseout", function (this: any, d: any) {
          d3Select.select(this)
            .style("stroke-opacity", 0)
          tooltip
            .style('display', 'none').style('opacity', 0);
        })
  }

}
