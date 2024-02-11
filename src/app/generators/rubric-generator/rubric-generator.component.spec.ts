import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricGeneratorComponent } from './rubric-generator.component';

describe('RubricGeneratorComponent', () => {
  let component: RubricGeneratorComponent;
  let fixture: ComponentFixture<RubricGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RubricGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RubricGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
