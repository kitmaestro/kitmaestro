import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPlanComponent } from './unit-plan.component';

describe('UnitPlanComponent', () => {
  let component: UnitPlanComponent;
  let fixture: ComponentFixture<UnitPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
