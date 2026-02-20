import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductComponent } from '../product/product';
import { Product, ProductService } from '../../_services/product';
@Component({
  selector: 'app-new-items',
  standalone: true,
  imports: [CommonModule, RouterModule,
    ProductComponent ],
  templateUrl: './new-items.html',
  styleUrl: './new-items.scss',
})
export class NewItems implements OnInit {

  newProducts: Product[] = [];

  constructor(private productService: ProductService) {
  }

  getProducts(){
    this.productService.getProducts().subscribe(data => {
      this.newProducts = data.slice(-3).reverse();
      console.log(this.newProducts);
    });
  }

  ngOnInit(): void {
    this.getProducts()
  }
}
