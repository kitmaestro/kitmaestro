import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlanningDashboardComponent } from './event-planning-dashboard.component';

describe('EventPlanningDashboardComponent', () => {
  let component: EventPlanningDashboardComponent;
  let fixture: ComponentFixture<EventPlanningDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventPlanningDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventPlanningDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
