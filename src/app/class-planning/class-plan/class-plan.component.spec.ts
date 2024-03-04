import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPlanComponent } from './class-plan.component';

describe('ClassPlanComponent', () => {
  let component: ClassPlanComponent;
  let fixture: ComponentFixture<ClassPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
