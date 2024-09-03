import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleGeneratorComponent } from './schedule-generator.component';

describe('ScheduleGeneratorComponent', () => {
  let component: ScheduleGeneratorComponent;
  let fixture: ComponentFixture<ScheduleGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
