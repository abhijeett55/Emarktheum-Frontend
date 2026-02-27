import { Component , OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-category',
  imports: [],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category implements OnInit {
  @Input() id!:string;
  @Input() label!:string;

  constructor() {

  }

  ngOnInit() : void {
    
  }
}
