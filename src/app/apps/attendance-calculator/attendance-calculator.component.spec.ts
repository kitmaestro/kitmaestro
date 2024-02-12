import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceCalculatorComponent } from './attendance-calculator.component';

describe('AttendanceCalculatorComponent', () => {
  let component: AttendanceCalculatorComponent;
  let fixture: ComponentFixture<AttendanceCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceCalculatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendanceCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
