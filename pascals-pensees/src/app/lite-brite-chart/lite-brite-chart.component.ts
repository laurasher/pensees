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
  private searchCache: Array<{corpusLower: string, numberStr: string}> = [];
  private resizeTimeout: any = null;
  private currentDisplayedPensee: any = null; // Track currently displayed pensée for dynamic highlighting
  private isDoubleClickActive: boolean = false; // Track if double-click similarity mode is active
  private doubleClickedPensee: any = null; // Store the pensée that was double-clicked

  public message = "Click colored boxes to see pensées text below. Double click to see n-most similar pensées to the one you clicked."
  // public message = ""
  public isTextViewerExpanded: boolean = false;
  private square: number = 10;
  private squareBuffer: number = 1.5;

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
  
  public clusters: number[] = Array.from({length: 10}, (_, i) => i);
  public clusterFilters: Set<number> = new Set<number>(this.clusters);

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
    this.adjustHeight = this.contentHeight/21.5;

    // Define inner shadow filter for selected pensée tiles
    const defs = this.svg.append('defs');
    const filter = defs.append('filter').attr('id', 'inner-shadow');
    filter.append('feOffset').attr('dx', 0).attr('dy', 2);
    filter.append('feGaussianBlur').attr('stdDeviation', 2).attr('result', 'offset-blur');
    filter.append('feComposite').attr('operator', 'out').attr('in', 'SourceGraphic').attr('in2', 'offset-blur').attr('result', 'inverse');
    filter.append('feFlood').attr('flood-color', '#000').attr('flood-opacity', 0.4).attr('result', 'color');
    filter.append('feComposite').attr('operator', 'in').attr('in', 'color').attr('in2', 'inverse').attr('result', 'shadow');
    filter.append('feComposite').attr('in', 'shadow').attr('in2', 'SourceGraphic');

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
        .attr('x', (d: any, i: any) => d.col * this.adjustWidth)
        .attr('y', (d: any, i: any) => d.row * this.adjustHeight)
        .attr('width',  this.adjustWidth - this.squareBuffer)
        .attr('height', this.adjustHeight - this.squareBuffer)
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
      const circles = scatter.selectAll("dot")
        .data(this.data)
          .enter()
          .filter( (d: any) =>  d.cluster == ci )
          .append("g")
          .attr('class', (d: any) => "scatter-cluster scatter-cluster-"+ci+" scatter-dot-"+d.fragment_index)
          .append("circle")
            .attr("cx", (d: any) => x(d.x0))
            .attr("cy", (d: any) => y(d.x1))
            .attr("r", 1.6)
            .style("cursor", "pointer")
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
              // scatter.selectAll(".scatter-cluster")
              //   .attr("fill-opacity", 0)
              //   .attr("stroke-opacity", 0)

              // scatter.selectAll(".scatter-cluster-"+_d.cluster)
              //   .transition(d3.transition())
              //   .attr("fill-opacity", 1)
              //   .attr("stroke-opacity", 1)
              
              // Apply inner shadow to the selected lite tile, remove from others
              this.applyInnerShadowToSelectedTile(_d.fragment_index);
              
              // Reset all dots to default radius
              scatter.selectAll(".scatter-cluster circle")
                .transition().duration(100)
                .attr("r", 1.6);
              
              // Highlight the selected pensée's dot with radius 8
              scatter.select(".scatter-dot-"+_d.fragment_index)
                .select("circle")
                .transition().duration(100)
                .attr("r", 8);
            });
      
      // Apply transition to fill and stroke after setting up the event handlers
      circles.transition(d3.transition(), 40000)
        .attr("fill", (d: any) => cluster_color_map[d.cluster])
        .attr("stroke", (d: any) => cluster_color_map[d.cluster]);
    }

    let color_amplifier = 5;
    this.g.selectAll("lites-overlay")
      .data(this.data)
        .enter()
        .append("rect")
          .attr("class", "lites-overlay")
          .attr('x', (d: any, i: any) => d.col * this.adjustWidth)
          .attr('y', (d: any, i: any) => d.row * this.adjustHeight)
          .attr('width',  this.adjustWidth - this.squareBuffer)
          .attr('height', this.adjustHeight - this.squareBuffer)
          .attr("fill", "white")
          .attr("fill-opacity", 0)
          .on("mouseover", function (this: any, _event: any, d:any) {
            d3Select.select(this)
            const tooltipData = _event.target.__data__;
            const words = (tooltipData['corpus'] || '').split(/\s+/);
            const preview = words.length > 10 ? words.slice(0, 10).join(' ') + '...' : words.join(' ');
            tooltip
              .style('top', (_event.layerY + 15) + 'px').style('left', (_event.layerX) + 'px')
              .style('background', "#f6efe3")
              .style('display', 'block').style('opacity', 0.99)
              .html(`cluster: ${tooltipData['cluster']}<br>number: ${tooltipData['fragment_number']}<br>${preview}`);
            
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
              // .attr("r", 8)
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
              // .attr("r", 1.6)
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
            // scatter.selectAll(".scatter-cluster")
            //   .attr("fill-opacity", 0)
            //   .attr("stroke-opacity", 0)

            // scatter.selectAll(".scatter-cluster-"+_d.cluster)
            //   .transition(d3.transition())
            //   .attr("fill-opacity", 1)
            //   .attr("stroke-opacity", 1)
            
            // Apply inner shadow to the selected lite tile, remove from others
            this.applyInnerShadowToSelectedTile(_d.fragment_index);
            
            // Reset all dots to default radius
            scatter.selectAll(".scatter-cluster circle")
              .transition().duration(100)
              .attr("r", 1.6);
            
            // Highlight the selected pensée's dot with radius 8
            scatter.select(".scatter-dot-"+_d.fragment_index)
              .select("circle")
              .transition().duration(100)
              .attr("r", 8);
          })
          .on("dblclick", function (this: any, _event: any, _d: any) {
            // Set double-click state
            this.isDoubleClickActive = true;
            this.doubleClickedPensee = _d;
            
            d3.selectAll(".lites")
              .data(_d.sim_arr)
              .transition(d3.transition())
              .attr("fill", cluster_color_map[_d.cluster])
              .attr("fill-opacity", (d: any) =>    d*color_amplifier)
              .style("stroke-opacity", (d: any) => d*color_amplifier)
              .style("stroke-color", cluster_color_map[_d.cluster])
          }.bind(this))

  }
  
  private applyInnerShadowToSelectedTile(fragmentIndex: number) {
    d3.selectAll('.lites').attr('filter', null);
    d3.selectAll('.lites').filter((d: any) => d.fragment_index === fragmentIndex)
      .attr('filter', 'url(#inner-shadow)');
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
    const cluster_color_map = this.cluster_color_map;
    const allRects = d3.selectAll('.lites');
    
    // If double-click mode is active, restore the similarity-based opacity
    if (this.isDoubleClickActive && this.doubleClickedPensee) {
      const color_amplifier = 5;
      allRects
        .data(this.doubleClickedPensee.sim_arr)
        .attr('fill', cluster_color_map[this.doubleClickedPensee.cluster])
        .attr('fill-opacity', (d: any) => d * color_amplifier)
        .attr('stroke-opacity', (d: any) => d * color_amplifier)
        .attr('stroke', cluster_color_map[this.doubleClickedPensee.cluster])
        .attr('stroke-width', 1);
    } else {
      // No double-click active, reset to normal appearance
      allRects
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1)
        .attr('stroke', (d: any) => cluster_color_map[d.cluster])
        .attr('stroke-width', 1);
    }
    
    // Show all scatterplot dots
    const allScatterDots = d3.selectAll('.scatter-cluster circle');
    allScatterDots
      .attr('opacity', 1);
    
    this.previousMatchedIndices.clear();
    
    // If there's a pensée currently displayed, update its highlighting (remove highlights)
    this.updateTextViewerHighlighting();
  }
  
  private applySearchHighlighting() {
    const hasMatches = this.matchedIndices.size > 0;
    const cluster_color_map = this.cluster_color_map;
    const color_amplifier = 5;
    
    // Get all rectangles once
    const allRects = d3.selectAll('.lites');
    
    if (!hasMatches) {
      // No matches - dim all rectangles and hide all scatterplot dots
      if (this.isDoubleClickActive && this.doubleClickedPensee) {
        // In double-click mode, completely hide all rectangles when no matches
        allRects
          .data(this.doubleClickedPensee.sim_arr)
          .attr('fill', cluster_color_map[this.doubleClickedPensee.cluster])
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)
          .attr('stroke', cluster_color_map[this.doubleClickedPensee.cluster])
          .attr('stroke-width', 1);
      } else {
        // Normal mode, just dim everything
        allRects
          .attr('fill-opacity', 0.1)
          .attr('stroke-opacity', 0.1)
          .attr('stroke', (d: any) => cluster_color_map[d.cluster])
          .attr('stroke-width', 1);
      }
      
      // Hide all scatterplot dots
      d3.selectAll('.scatter-cluster circle')
        .attr('opacity', 0.1);
    } else {
      // Has matches - show matching rectangles with appropriate opacity
      if (this.isDoubleClickActive && this.doubleClickedPensee) {
        // In double-click mode, preserve similarity-based opacity for matches, dim non-matches
        allRects
          .data(this.doubleClickedPensee.sim_arr)
          .each((d: any, i: number, nodes: any) => {
            const isMatch = this.matchedIndices.has(i);
            const wasMatch = this.previousMatchedIndices.has(i);
            
            // Skip if state hasn't changed
            if (isMatch === wasMatch && this.previousMatchedIndices.size > 0) {
              return;
            }
            
            // Update only changed rectangles
            const rect = d3.select(nodes[i]);
            if (isMatch) {
              // For matches, use the similarity-based opacity from double-click
              rect
                .attr('fill', cluster_color_map[this.doubleClickedPensee.cluster])
                .attr('fill-opacity', d * color_amplifier)
                .attr('stroke-opacity', d * color_amplifier)
                .attr('stroke', cluster_color_map[this.doubleClickedPensee.cluster])
                .attr('stroke-width', 1);
            } else {
              // For non-matches in double-click mode, completely hide them
              rect
                .attr('fill', cluster_color_map[this.doubleClickedPensee.cluster])
                .attr('fill-opacity', 0)
                .attr('stroke-opacity', 0)
                .attr('stroke', cluster_color_map[this.doubleClickedPensee.cluster])
                .attr('stroke-width', 1);
            }
          });
      } else {
        // Normal mode - just show/dim based on matches
        allRects.each((d: any, i: number, nodes: any) => {
          const isMatch = this.matchedIndices.has(i);
          const wasMatch = this.previousMatchedIndices.has(i);
          
          // Skip if state hasn't changed
          if (isMatch === wasMatch && this.previousMatchedIndices.size > 0) {
            return;
          }
          
          // Update only changed rectangles
          d3.select(nodes[i])
            .attr('fill-opacity', isMatch ? 1 : 0.1)
            .attr('stroke-opacity', isMatch ? 1 : 0.1)
            .attr('stroke', cluster_color_map[d.cluster])
            .attr('stroke-width', 1);
        });
      }
      
      // First, hide all scatterplot dots
      d3.selectAll('.scatter-cluster circle')
        .attr('opacity', 0.1);
      
      // Then, show only the matching dots using a combined selector
      if (this.matchedIndices.size > 0) {
        const selectors = Array.from(this.matchedIndices)
          .map(index => {
            const fragmentData = (this.data as any)[index];
            return fragmentData ? `.scatter-dot-${fragmentData.fragment_index}` : null;
          })
          .filter(selector => selector !== null)
          .join(', ');
        
        if (selectors) {
          d3.selectAll(selectors)
            .selectAll('circle')
            .attr('opacity', 1);
        }
      }
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
    this.isDoubleClickActive = false; // Clear double-click state
    this.doubleClickedPensee = null; // Clear double-clicked pensée
    
    // Reset cluster filters to show all clusters
    this.clusterFilters = new Set<number>(this.clusters);
    
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
  
  public toggleClusterFilter(cluster: number) {
    if (this.clusterFilters.has(cluster)) {
      this.clusterFilters.delete(cluster);
    } else {
      this.clusterFilters.add(cluster);
    }
    this.applyClusterFilters();
  }
  
  public isClusterActive(cluster: number): boolean {
    return this.clusterFilters.has(cluster);
  }

  public selectAllClusters() {
    this.clusterFilters = new Set<number>(this.clusters);
    this.applyClusterFilters();
  }

  public resetClusterFilters() {
    this.clusterFilters.clear();
    this.applyClusterFilters();
  }

  public getClusterColor(cluster: number): string {
    return this.cluster_color_map[cluster];
  }
  
  private applyClusterFilters() {
    // Update lite-brite chart rectangles
    d3.selectAll('.lites').each((d: any, i: number, nodes: any) => {
      const isVisible = this.clusterFilters.has(d.cluster);
      d3.select(nodes[i])
        .transition()
        .duration(200)
        .attr('opacity', isVisible ? 1 : 0.1);
    });
    
    // Update scatterplot dots
    for (let ci = 0; ci < this.NUM_CLUSTERS; ci++) {
      const isVisible = this.clusterFilters.has(ci);
      const clusterSelector = '.scatter-cluster-' + ci;
      d3.selectAll(clusterSelector)
        .selectAll('circle')
        .transition()
        .duration(200)
        .attr('opacity', isVisible ? 1 : 0.1);
    }
  }
  // public refreshLiteBritesChart(){
  //   d3.select('svg').remove();
  //   this.buildSvg();
  //   this.drawLites();
  //   // d3.select('.text-viewer').html(``);
  // }
}
