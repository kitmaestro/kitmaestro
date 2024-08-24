import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingActivityGeneratorComponent } from './reading-activity-generator.component';

describe('ReadingActivityGeneratorComponent', () => {
  let component: ReadingActivityGeneratorComponent;
  let fixture: ComponentFixture<ReadingActivityGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingActivityGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadingActivityGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
