import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantsHolderComponent } from './assistants-holder.component';

describe('AssistantsHolderComponent', () => {
  let component: AssistantsHolderComponent;
  let fixture: ComponentFixture<AssistantsHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantsHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssistantsHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
