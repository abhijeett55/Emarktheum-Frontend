import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner-area',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './banner-area.html',
  styleUrl: './banner-area.scss',
})
export class BannerArea implements OnInit {
  constructor() {}

  ngOnInit(): void {

  }
}
