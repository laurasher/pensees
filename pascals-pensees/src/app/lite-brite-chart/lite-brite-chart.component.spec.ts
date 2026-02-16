import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { LiteBriteChartComponent } from './lite-brite-chart.component';

describe('LiteBriteChartComponent', () => {
  let component: LiteBriteChartComponent;
  let fixture: ComponentFixture<LiteBriteChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiteBriteChartComponent ],
      imports: [ FormsModule, MatIconModule ]
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
