import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPlanListComponent } from './unit-plan-list.component';

describe('UnitPlanListComponent', () => {
  let component: UnitPlanListComponent;
  let fixture: ComponentFixture<UnitPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitPlanListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
