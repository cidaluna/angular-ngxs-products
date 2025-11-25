import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsChildComponent } from './products-child.component';

describe('ProductsChildComponent', () => {
  let component: ProductsChildComponent;
  let fixture: ComponentFixture<ProductsChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
