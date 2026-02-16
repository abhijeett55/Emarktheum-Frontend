import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-area',
  imports: [],
  templateUrl: './product-area.html',
  styleUrl: './product-area.scss',
})
export class ProductArea implements OnInit {
  

  ngOnInit(): void {
    this.getProducts()
  }
}
