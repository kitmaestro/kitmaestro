import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSectionFormComponent } from './class-section-form.component';

describe('ClassSectionFormComponent', () => {
  let component: ClassSectionFormComponent;
  let fixture: ComponentFixture<ClassSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSectionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
