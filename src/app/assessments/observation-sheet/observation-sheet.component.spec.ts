import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationSheetComponent } from './observation-sheet.component';

describe('ObservationSheetComponent', () => {
  let component: ObservationSheetComponent;
  let fixture: ComponentFixture<ObservationSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObservationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
