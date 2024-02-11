import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantsDashboardComponent } from './assistants-dashboard.component';

describe('AssistantsDashboardComponent', () => {
  let component: AssistantsDashboardComponent;
  let fixture: ComponentFixture<AssistantsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssistantsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
