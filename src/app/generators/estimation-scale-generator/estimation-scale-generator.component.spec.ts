import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationScaleGeneratorComponent } from './estimation-scale-generator.component';

describe('EstimationScaleGeneratorComponent', () => {
  let component: EstimationScaleGeneratorComponent;
  let fixture: ComponentFixture<EstimationScaleGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimationScaleGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstimationScaleGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
