import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { ProductService , Product } from '../../_services/product';
import { Web3Service } from '../../_services/web3.service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  isSuccessful = false;
  errorMessage = '';
  prod!: Product;
  constructor(private web3: Web3Service,
  private router: Router, private prodService : ProductService, private route: ActivatedRoute)  {

  }

  ngOnInit() : void {
    this.getProduct(this.route.snapshot.params["id"]);
    console.log(this.route.snapshot.params["id"]);
  }

  getProduct(id: string) {
    this.prodService.getProduct(this.route.snapshot.params["id"]).subscribe(
      data => { this.prod = data;
      console.log(this.prod);
    });
  }

  conf!: any;
  async onSubmit() {
    this.web3.connectWallet();
    console.log(this.prod.sellerAddress);
    this.conf = await this.web3.addProduct(this.prod.title,
      this.prod.sellerAddress, String(this.prod.price))
    this.prodService.sold(this.prod.id).subscribe(data => {
      console.log(data);
      window.location.reload()
    });

    console.log(this.prod.sold);
    window.location.reload();
  }


}
