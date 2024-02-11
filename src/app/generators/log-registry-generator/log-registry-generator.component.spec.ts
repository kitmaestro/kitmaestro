import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogRegistryGeneratorComponent } from './log-registry-generator.component';

describe('LogRegistryGeneratorComponent', () => {
  let component: LogRegistryGeneratorComponent;
  let fixture: ComponentFixture<LogRegistryGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogRegistryGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogRegistryGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
