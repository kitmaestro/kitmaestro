import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorsDashboardComponent } from './generators-dashboard.component';

describe('GeneratorsDashboardComponent', () => {
  let component: GeneratorsDashboardComponent;
  let fixture: ComponentFixture<GeneratorsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneratorsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
