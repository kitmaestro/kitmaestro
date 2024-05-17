import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationGuideComponent } from './observation-guide.component';

describe('ObservationGuideComponent', () => {
  let component: ObservationGuideComponent;
  let fixture: ComponentFixture<ObservationGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationGuideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObservationGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
