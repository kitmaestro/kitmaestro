import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathTestGeneratorComponent } from './math-test-generator.component';

describe('MathTestGeneratorComponent', () => {
  let component: MathTestGeneratorComponent;
  let fixture: ComponentFixture<MathTestGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathTestGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MathTestGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
