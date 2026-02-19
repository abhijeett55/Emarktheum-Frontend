import { Component, OnInit } from '@angular/core';
import {CommonModule } from '@angular/common';
import { Product, ProductService } from '../../_services/product.service';

@Component({
  selector: 'app-product-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-area.html',
  styleUrl: './product-area.scss',
})
export class ProductArea implements OnInit {

  constructor(private productService: ProductService) {}
  
  trendingProducts!: Product[];

  getProducts() {
    this.productService.getProducts().subscribe(data => {
      this.trendingProducts = data
      .sort(() => 0.5 - Math.random())
      .slice(0, 6)
    });

    console.log(this.trendingProducts)

  }

  ngOnInit(): void {
    this.getProducts()
  }
}
