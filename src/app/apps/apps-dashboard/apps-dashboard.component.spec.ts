import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsDashboardComponent } from './apps-dashboard.component';

describe('AppsDashboardComponent', () => {
  let component: AppsDashboardComponent;
  let fixture: ComponentFixture<AppsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
