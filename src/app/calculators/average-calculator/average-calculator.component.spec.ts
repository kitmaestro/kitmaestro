import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageCalculatorComponent } from './average-calculator.component';

describe('AverageCalculatorComponent', () => {
  let component: AverageCalculatorComponent;
  let fixture: ComponentFixture<AverageCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageCalculatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AverageCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
