import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetBuildersComponent } from './worksheet-builders.component';

describe('WorksheetBuildersComponent', () => {
  let component: WorksheetBuildersComponent;
  let fixture: ComponentFixture<WorksheetBuildersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorksheetBuildersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorksheetBuildersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
