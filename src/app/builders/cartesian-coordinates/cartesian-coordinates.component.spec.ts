import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartesianCoordinatesComponent } from './cartesian-coordinates.component';

describe('CartesianCoordinatesComponent', () => {
  let component: CartesianCoordinatesComponent;
  let fixture: ComponentFixture<CartesianCoordinatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartesianCoordinatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartesianCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
