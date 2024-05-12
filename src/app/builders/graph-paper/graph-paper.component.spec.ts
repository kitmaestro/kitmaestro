import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPaperComponent } from './graph-paper.component';

describe('GraphPaperComponent', () => {
  let component: GraphPaperComponent;
  let fixture: ComponentFixture<GraphPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphPaperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
