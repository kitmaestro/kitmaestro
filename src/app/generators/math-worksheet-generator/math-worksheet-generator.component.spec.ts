import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathWorksheetGeneratorComponent } from './math-worksheet-generator.component';

describe('MathWorksheetGeneratorComponent', () => {
  let component: MathWorksheetGeneratorComponent;
  let fixture: ComponentFixture<MathWorksheetGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathWorksheetGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MathWorksheetGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
