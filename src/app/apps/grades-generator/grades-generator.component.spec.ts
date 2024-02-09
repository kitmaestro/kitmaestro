import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesGeneratorComponent } from './grades-generator.component';

describe('GradesGeneratorComponent', () => {
  let component: GradesGeneratorComponent;
  let fixture: ComponentFixture<GradesGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradesGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradesGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
