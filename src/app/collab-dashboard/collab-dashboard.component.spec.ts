import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabDashboardComponent } from './collab-dashboard.component';

describe('CollabDashboardComponent', () => {
  let component: CollabDashboardComponent;
  let fixture: ComponentFixture<CollabDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollabDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollabDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
