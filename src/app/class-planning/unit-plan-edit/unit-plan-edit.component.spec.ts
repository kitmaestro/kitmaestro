import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPlanEditComponent } from './unit-plan-edit.component';

describe('UnitPlanEditComponent', () => {
  let component: UnitPlanEditComponent;
  let fixture: ComponentFixture<UnitPlanEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitPlanEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitPlanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
