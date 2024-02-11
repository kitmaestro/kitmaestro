import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumToolsComponent } from './premium-tools.component';

describe('PremiumToolsComponent', () => {
  let component: PremiumToolsComponent;
  let fixture: ComponentFixture<PremiumToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumToolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PremiumToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
