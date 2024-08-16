import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPlanDetailComponent } from './unit-plan-detail.component';

describe('UnitPlanDetailComponent', () => {
  let component: UnitPlanDetailComponent;
  let fixture: ComponentFixture<UnitPlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitPlanDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
