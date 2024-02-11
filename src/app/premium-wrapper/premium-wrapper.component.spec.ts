import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumWrapperComponent } from './premium-wrapper.component';

describe('PremiumWrapperComponent', () => {
  let component: PremiumWrapperComponent;
  let fixture: ComponentFixture<PremiumWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PremiumWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
