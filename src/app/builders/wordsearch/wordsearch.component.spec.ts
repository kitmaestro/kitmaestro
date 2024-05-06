import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsearchComponent } from './wordsearch.component';

describe('WordsearchComponent', () => {
  let component: WordsearchComponent;
  let fixture: ComponentFixture<WordsearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
