import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsPremiumComponent } from './is-premium.component';

describe('IsPremiumComponent', () => {
  let component: IsPremiumComponent;
  let fixture: ComponentFixture<IsPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsPremiumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IsPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
