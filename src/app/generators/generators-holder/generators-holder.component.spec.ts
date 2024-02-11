import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorsHolderComponent } from './generators-holder.component';

describe('GeneratorsHolderComponent', () => {
  let component: GeneratorsHolderComponent;
  let fixture: ComponentFixture<GeneratorsHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorsHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneratorsHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
