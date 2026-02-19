import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})


export class ProductComponent implements OnInit {
  @Input() id!: string;
  @Input() label!: string;
  @Input() title!: string;
  @Input() location!: string;
  @Input() category!: any;
  @Input() price!: any;
  @Input() description !: Text;
  @Input() sold !: boolean;
  @Input() userId!: string;
  @Input() sellerAddress!: string;
  @Input() images!: string;

  constructor() { }
  ngOnInit(): void  {
    
  }
}
