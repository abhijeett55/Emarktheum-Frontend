import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from 'src/app/_services/product.service';
@Component({
  selector: 'app-new-items',
  imports: [],
  templateUrl: './new-items.html',
  styleUrl: './new-items.scss',
})
export class NewItems implements OnInit {
  newProducts!: Product[];

  constructor(private productService: ProductService) {

  }

  getProducts(){
    this.productService.getProducts().subscribe(data => {this.newProducts = data.slice(-3).reverse()})
    console.log(this.newProducts)
  }

  ngOnInit(): void {
    this.getProducts()
  }
}
