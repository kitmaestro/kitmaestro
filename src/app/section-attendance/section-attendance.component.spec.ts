import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAttendanceComponent } from './section-attendance.component';

describe('SectionAttendanceComponent', () => {
  let component: SectionAttendanceComponent;
  let fixture: ComponentFixture<SectionAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionAttendanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SectionAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
