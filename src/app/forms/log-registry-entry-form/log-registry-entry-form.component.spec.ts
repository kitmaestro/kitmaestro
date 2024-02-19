import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogRegistryEntryFormComponent } from './log-registry-entry-form.component';

describe('LogRegistryEntryFormComponent', () => {
  let component: LogRegistryEntryFormComponent;
  let fixture: ComponentFixture<LogRegistryEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogRegistryEntryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogRegistryEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
