import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerGeneratorComponent } from './planner-generator.component';

describe('PlannerGeneratorComponent', () => {
  let component: PlannerGeneratorComponent;
  let fixture: ComponentFixture<PlannerGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlannerGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
