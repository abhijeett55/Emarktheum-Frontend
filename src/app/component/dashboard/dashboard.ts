import { Component, OnInit } from '@angular/core';
import { BannerArea } from '../banner-area/banner-area';
import { NewItems } from '../new-items/new-items';
import { ProductArea } from '../product-area/product-area';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BannerArea, NewItems, ProductArea ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  constructor() { }
  ngOnInit(): void {
    
  }
}
