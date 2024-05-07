import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordsComponent } from './crosswords.component';

describe('CrosswordsComponent', () => {
  let component: CrosswordsComponent;
  let fixture: ComponentFixture<CrosswordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrosswordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrosswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
