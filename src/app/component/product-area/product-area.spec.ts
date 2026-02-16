import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductArea } from './product-area';

describe('ProductArea', () => {
  let component: ProductArea;
  let fixture: ComponentFixture<ProductArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
