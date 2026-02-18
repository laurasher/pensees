import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiteBriteChartComponent } from './lite-brite-chart.component';

describe('LiteBriteChartComponent', () => {
  let component: LiteBriteChartComponent;
  let fixture: ComponentFixture<LiteBriteChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiteBriteChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiteBriteChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should set double-click state to false initially', () => {
    expect(component['isDoubleClickActive']).toBe(false);
    expect(component['doubleClickedPensee']).toBeNull();
  });
  
  it('should clear double-click state when refreshLiteBrites is called', () => {
    // Set up some state
    component['isDoubleClickActive'] = true;
    component['doubleClickedPensee'] = { cluster: 0, sim_arr: [] };
    component['searchTerm'] = 'test';
    component['currentDisplayedPensee'] = { cluster: 0 };
    
    // Mock the scatter_svg_g to avoid null reference errors
    component['scatter_svg_g'] = {
      selectAll: jasmine.createSpy('selectAll').and.returnValue({
        attr: jasmine.createSpy('attr').and.returnValue({
          attr: jasmine.createSpy('attr')
        })
      })
    };
    
    // Mock the required D3 elements to avoid errors
    spyOn(component as any, 'buildSvg');
    spyOn(component as any, 'drawLites');
    
    // Call refresh
    component.refreshLiteBrites();
    
    // Verify state is cleared
    expect(component['isDoubleClickActive']).toBe(false);
    expect(component['doubleClickedPensee']).toBeNull();
    expect(component['searchTerm']).toBe('');
    expect(component['currentDisplayedPensee']).toBeNull();
  });
  
  it('should clear search term when clearSearch is called', () => {
    component['searchTerm'] = 'test';
    component['matchedIndices'] = new Set([1, 2, 3]);
    
    spyOn(component as any, 'resetSearchHighlighting');
    
    component.clearSearch();
    
    expect(component['searchTerm']).toBe('');
    expect(component['matchedIndices'].size).toBe(0);
    expect(component['resetSearchHighlighting']).toHaveBeenCalled();
  });
});
