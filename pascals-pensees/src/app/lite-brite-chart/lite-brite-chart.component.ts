import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as d3 from 'd3';
import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import {transition} from 'd3-transition';

@Component({
  selector: 'app-lite-brite-chart',
  templateUrl: './lite-brite-chart.component.html',
  styleUrls: ['./lite-brite-chart.component.less']
})
export class LiteBriteChartComponent implements OnInit {
  @ViewChild("chart", { static: true }) protected chartContainer!: ElementRef;
  penseeClusterData: any;
  url: string = '/assets/pensee_clusters.json';

  private timeseriesData =  [];

  private chartFill = "#022A3A"; //#998a42"; //"#00291f" //"#E5EAE9"
  private strokeWidth = "0px";
  private barWidth = "9px";
  private barOpacity = "0.5";

  private margin = {top: 0, right: 0, bottom: 0, left: 0};
  private width: number = 0;
  private height: number = 0;
  private contentWidth: number = 0;
  private contentHeight: number = 0;
  private x: any;
  private y: any;
  private g: any;
  private svg: any;
  private tooltip: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get(this.url).subscribe(res => {
      this.penseeClusterData = res;
      console.log(this.penseeClusterData);
    });

    this.buildSvg();
    this.addXandYAxis();
    this.drawBars();
    this.tooltip = d3.select('#chart') // or d3.select('#bar')
      .append('div').attr('class', 'tooltip').style('display', 'none').style('opacity', 0);

  }

  private buildSvg() {
    const element = this.chartContainer.nativeElement;
    this.svg = d3Select.select(element);

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

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }
  private addXandYAxis() {
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, this.contentWidth]);
    this.y = d3Scale.scaleLinear().range([this.contentHeight, 0]);
    this.x.domain(d3Array.extent(this.timeseriesData, (d: any) => d.date ));
    this.y.domain(d3Array.extent(this.timeseriesData, (d: any) => d.value ));

    // Configure the X Axis
    this.g.append('g')
      .attr('transform', 'translate(0,' + (this.contentHeight-this.margin.bottom) + ')')
      .call(d3Axis.axisBottom(this.x).tickFormat(d3.timeFormat("%b %Y") as (dv: unknown | { valueOf(): number; }, i: number) => string))

    // Configure the Y Axis
    this.g.append('g')
      .attr('class', 'axis axis--y')
      // .call(d3Axis.axisLeft(this.y));
  }
  private drawBars() {
    const tooltip = d3.select('.tooltip')
      .style('display', 'none').style('opacity', 0);

    const formatTime = d3.timeFormat("%B %d, %Y");

    // Create and fill the bars
    this.g.selectAll("bars")
      .data(this.timeseriesData)
      .enter()
      .append("rect")
        .attr('x', (d: any) => this.x(d.date) )
        .attr('y', (d: any) => this.y(d.value) )
        .attr("width", this.barWidth)
        .attr('height', (d: any) => this.contentHeight - this.margin.bottom - this.y(d.value))
        // .attr("fill", function (this: any, d: any) {return d.compatible ? this.chartFill : "#998A42";})
        .attr("fill", function (d: any) {return d.compatible ? "#022A3A" : "#998A42";})
        .attr("stroke", "#707070")
        .attr("stroke-width", this.strokeWidth)
        // .attr("opacity", this.barOpacity)
        .attr("opacity", function (d: any) {return d.compatible ? 0.5 : 1.0;})
        .on("mouseover", function (this: any, d: any) {
          d3Select.select(this).attr("fill", function (this: any, d: any) {return d.compatible ? "#436577" : "#BFAD52";})
          tooltip
            .style('top', (d.layerY + 15) + 'px').style('left', (d.layerX) + 'px')
            .style('background', function (this: any) {return d.target.__data__.compatible ? "white" : "#FFFCE0";})
            .style('display', 'block').style('opacity', 0.99)
            .html(`${formatTime(d.target.__data__['date'])}<br>${d.target.__data__['name']}<br>${d.target.__data__['desc']}`);
        })
        .on("mouseout", function (this: any, d: any) {
          d3Select.select(this)
            .attr("fill", function (d: any) {return d.compatible ? "#022A3A" : "#998A42";})
            .attr("opacity", function (d: any) {return d.compatible ? 0.5 : 1.0;})
          tooltip
            .style('display', 'none').style('opacity', 0);
        })
  }

}
