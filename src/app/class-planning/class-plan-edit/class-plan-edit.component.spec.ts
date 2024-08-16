import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPlanEditComponent } from './class-plan-edit.component';

describe('ClassPlanEditComponent', () => {
  let component: ClassPlanEditComponent;
  let fixture: ComponentFixture<ClassPlanEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPlanEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassPlanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
