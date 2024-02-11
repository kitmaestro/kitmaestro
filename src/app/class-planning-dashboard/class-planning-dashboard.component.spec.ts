import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPlanningDashboardComponent } from './class-planning-dashboard.component';

describe('ClassPlanningDashboardComponent', () => {
  let component: ClassPlanningDashboardComponent;
  let fixture: ComponentFixture<ClassPlanningDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPlanningDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassPlanningDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
