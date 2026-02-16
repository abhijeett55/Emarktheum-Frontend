import { Component, OnInit } from '@angular/core';
import { BannerArea } from '../banner-area/banner-area';
import { NewItemsComponent } from '../new_items/new-items';
@Component({
  selector: 'app-dashboard',
  imports: [BannerArea, NewItemsComponent ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  constructor() { }
  ngOnInit(): void {
    
  }
}
