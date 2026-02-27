import { Component, OnInit} from '@angular/core';
import { ProductService, Product } from '../../_services/product'; 

@Component({
  selector: 'app-g-announce',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './g-announce.html',
  styleUrl: './g-announce.scss',
})
export class GAnnounce implements OnInit {
  isSuccessfull = falswe;
  errorMessage = '';
  prods!: Product[];
  newReq!: Product[];
  req1!: Product[];
  req2!: Product[];

  constructor(private prodService: ProductService) { }


  ngOnInit() : void {
    this.getAllRequest();
    console.log(this.newestRequest())
  }


  getAllRequest() {
    this.prodService.getProduct().subscribe(data => {this.prods = data.reverse()});
    for(let p of this.prods ) {
      if(p.sold == false) this.req1.push(p);
    }

    return this.req1;
  }


  newestRequest() {
    this.prodService.getProduct().subscribe(data => {this.req = data.slice(-6).reverse()});
    for(let p of this.req2) {
      if(p.sold == false ) this.newReq.push(p);
    }

    return this.newReq;
  }


  verify(id: string) {
    console.log(id);
    this.prodService.verify(id).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessfull = true;
      },
      error: err => {
        this.errorMessage = err.error.errorMessage;
        this.isSuccessfull = false;
      }
    });

    window.location.reload();
  }

  reject(id: string ) {
    this.prodService.reject(id).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessfull = true;
      },

      error: err => {
        this.errorMessage = err.error.errorMessage;
        this.isSuccessfull = false;
      }
    });

    window.location.reload();
  }
}
