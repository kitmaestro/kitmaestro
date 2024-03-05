import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceGalleryComponent } from './resource-gallery.component';

describe('ResourceGalleryComponent', () => {
  let component: ResourceGalleryComponent;
  let fixture: ComponentFixture<ResourceGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourceGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
