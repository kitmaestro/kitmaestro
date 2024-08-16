import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPlanDetailComponent } from './class-plan-detail.component';

describe('ClassPlanDetailComponent', () => {
  let component: ClassPlanDetailComponent;
  let fixture: ComponentFixture<ClassPlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPlanDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
