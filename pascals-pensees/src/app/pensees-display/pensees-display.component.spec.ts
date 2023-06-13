import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenseesDisplayComponent } from './pensees-display.component';

describe('PenseesDisplayComponent', () => {
  let component: PenseesDisplayComponent;
  let fixture: ComponentFixture<PenseesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenseesDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PenseesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
