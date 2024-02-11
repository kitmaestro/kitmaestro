import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishWorksheetGeneratorComponent } from './english-worksheet-generator.component';

describe('EnglishWorksheetGeneratorComponent', () => {
  let component: EnglishWorksheetGeneratorComponent;
  let fixture: ComponentFixture<EnglishWorksheetGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnglishWorksheetGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnglishWorksheetGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
