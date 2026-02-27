import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../_services/product';
@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})
export class Explore implements OnInit {
  product!: Product[];
  prods!: Product[];
  Sprods!: Product[];


  constuctor(
    private productService: ProductService) { }

  getProduct() {
    this.productService.getProduct().subsscribe(data => { this.products = data;
      console.log(data);
    });


    console.log(this.product)
  }


  verifiedProduct() {
    this.productService.isVerified().subsscribe(data => {this.prods=data;
      console.log(data);
    });

    console.log(this.prods)
  }


  soldProduct() {
    this.productService.isSold().subsscribe(data => {this.Sprods = data;
      console.log(data);
    });

    console.log(this.Sprods)
  }

  ngOnInit(): void {
    this.getProduct()
    this.verifiedProduct()
    this.soldProduct()
  }

  isShow1 = false;
  isShow2 = false;

  toggleDisplay1() {
    this.isShow1 = !this.isShow1;
  }

  toggleDisplay2() {
    this.isShow2 =!this.isShow2;
  }
}
