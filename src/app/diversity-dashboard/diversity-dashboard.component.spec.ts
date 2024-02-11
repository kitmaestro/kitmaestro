import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiversityDashboardComponent } from './diversity-dashboard.component';

describe('DiversityDashboardComponent', () => {
  let component: DiversityDashboardComponent;
  let fixture: ComponentFixture<DiversityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiversityDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiversityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
