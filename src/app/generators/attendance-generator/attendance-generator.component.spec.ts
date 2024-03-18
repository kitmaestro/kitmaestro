import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceGeneratorComponent } from './attendance-generator.component';

describe('AttendanceGeneratorComponent', () => {
  let component: AttendanceGeneratorComponent;
  let fixture: ComponentFixture<AttendanceGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendanceGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
