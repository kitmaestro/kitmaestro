import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceCalcAssistantComponent } from './attendance-calc-assistant.component';

describe('AttendanceCalcAssistantComponent', () => {
  let component: AttendanceCalcAssistantComponent;
  let fixture: ComponentFixture<AttendanceCalcAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceCalcAssistantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendanceCalcAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
