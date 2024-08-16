import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintViewComponent } from './print-view.component';

describe('PrintViewComponent', () => {
  let component: PrintViewComponent;
  let fixture: ComponentFixture<PrintViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
