import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesDashboardComponent } from './resources-dashboard.component';

describe('ResourcesDashboardComponent', () => {
  let component: ResourcesDashboardComponent;
  let fixture: ComponentFixture<ResourcesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourcesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
