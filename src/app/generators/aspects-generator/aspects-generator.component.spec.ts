import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspectsGeneratorComponent } from './aspects-generator.component';

describe('AspectsGeneratorComponent', () => {
  let component: AspectsGeneratorComponent;
  let fixture: ComponentFixture<AspectsGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspectsGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AspectsGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
