import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPlanListComponent } from './class-plan-list.component';

describe('ClassPlanListComponent', () => {
  let component: ClassPlanListComponent;
  let fixture: ComponentFixture<ClassPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPlanListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
