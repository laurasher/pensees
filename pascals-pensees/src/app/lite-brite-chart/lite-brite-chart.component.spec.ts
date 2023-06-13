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
});
