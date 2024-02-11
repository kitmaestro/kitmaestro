import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationDashboardComponent } from './communication-dashboard.component';

describe('CommunicationDashboardComponent', () => {
  let component: CommunicationDashboardComponent;
  let fixture: ComponentFixture<CommunicationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunicationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
