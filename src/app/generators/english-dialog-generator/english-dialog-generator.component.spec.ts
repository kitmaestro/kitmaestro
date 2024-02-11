import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishDialogGeneratorComponent } from './english-dialog-generator.component';

describe('EnglishDialogGeneratorComponent', () => {
  let component: EnglishDialogGeneratorComponent;
  let fixture: ComponentFixture<EnglishDialogGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnglishDialogGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnglishDialogGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
