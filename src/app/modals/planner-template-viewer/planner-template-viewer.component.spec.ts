import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerTemplateViewerComponent } from './planner-template-viewer.component';

describe('PlannerTemplateViewerComponent', () => {
  let component: PlannerTemplateViewerComponent;
  let fixture: ComponentFixture<PlannerTemplateViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerTemplateViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlannerTemplateViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
