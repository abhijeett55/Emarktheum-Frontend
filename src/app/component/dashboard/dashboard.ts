import { Component, OnInit } from '@angular/core';
import { BannerArea } from '../banner-area/banner-area';
import { NewItems } from '../new-items/new-items';
import { ProductArea } from '../product-area/product-area';
import { MiniDashboard} from '../mini-dashboard/mini-dashboard';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MiniDashboard, BannerArea, NewItems, ProductArea ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  constructor() { }
  ngOnInit(): void {
    
  }
}
