import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationDashboardComponent } from './formation-dashboard.component';

describe('FormationDashboardComponent', () => {
  let component: FormationDashboardComponent;
  let fixture: ComponentFixture<FormationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
