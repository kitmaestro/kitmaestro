import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanishWorksheetGeneratorComponent } from './spanish-worksheet-generator.component';

describe('SpanishWorksheetGeneratorComponent', () => {
  let component: SpanishWorksheetGeneratorComponent;
  let fixture: ComponentFixture<SpanishWorksheetGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpanishWorksheetGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpanishWorksheetGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
