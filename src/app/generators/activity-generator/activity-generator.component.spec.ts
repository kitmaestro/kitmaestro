import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityGeneratorComponent } from './activity-generator.component';

describe('ActivityGeneratorComponent', () => {
  let component: ActivityGeneratorComponent;
  let fixture: ComponentFixture<ActivityGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
