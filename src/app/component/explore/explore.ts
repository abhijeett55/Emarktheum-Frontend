import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductComponent } from '../product/product';
import { ProductService, Product } from '../../_services/product';


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule,RouterModule, ProductComponent ],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})

export class Explore implements OnInit {
  product!: Product[];
  prods!: Product[];
  Sprods!: Product[];


  constructor(private productservice: ProductService) { }

  getProduct() {
  this.productservice.getProducts().subscribe((data: Product[]) => {
    this.product = data;
    console.log(data);
  });
}


  verifiedProduct() {
    this.productservice.isVerified().subscribe((data : Product[]) => {
      this.prods=data;
      console.log(data);
    });
  }


  soldProduct() {
    this.productservice.isSold().subscribe((data : Product[]) => {
      this.Sprods = data;
      console.log(data);
    });
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
