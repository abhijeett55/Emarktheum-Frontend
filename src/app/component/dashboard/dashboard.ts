import { Component, OnInit } from '@angular/core';
import { BannerArea } from '../banner-area/banner-area';
import { MiniDashboard} from '../mini-dashboard/mini-dashboard';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MiniDashboard, BannerArea],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  constructor() { }
  ngOnInit(): void {
    
  }
}
