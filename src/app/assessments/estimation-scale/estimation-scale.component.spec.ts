import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationScaleComponent } from './estimation-scale.component';

describe('EstimationScaleComponent', () => {
  let component: EstimationScaleComponent;
  let fixture: ComponentFixture<EstimationScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimationScaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstimationScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
