import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsHolderComponent } from './apps-holder.component';

describe('AppsHolderComponent', () => {
  let component: AppsHolderComponent;
  let fixture: ComponentFixture<AppsHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppsHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
