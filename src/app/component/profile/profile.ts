import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from '../../_services/web3.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Product, ProductService } from '../../_services/product';
import { Transaction as transaction } from '../../models/Transaction';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})

export class Profile implements OnInit {
  currentUser: any = null;
  currentAddress: string | null = null;

  myProducts!: Product[];
  mySoldProducts!: Product[];
  mySaleProducts!: Product[];
  myTranscation!: transaction[];
  allTransactions!: transaction[];


  constructor(
    private token: TokenStorageService,
    private productservice: ProductService,
    private web3: Web3Service
    ) { }


  getMyProduct() {
    this.productservice.getMyProducts()
    .subscribe( data => { 
      this.myProducts = data;
    })
    console.log(this.myProducts);
  }

  getMySoldPoduct() {
    for(var p of this.myProducts) {
      if(p.sold) {
        this.mySoldProducts.push(p);
      }
    }
    return this.mySoldProducts;
  }

  forSaleProduct() {
    console.log("sale");
    for(var p of this.myProducts) {
      if(!p.sold) {
        console.log(this.mySaleProducts);
      }
    }
    return this.mySaleProducts;
  }

  async getMyTranscation() {
    this.myTranscation = await this.web3.getMyTransactions();
    this.currentAddress = this.web3.getAddress();
    console.log(this.myTranscation);
    console.log('------------------------------------');
    console.log(this.currentAddress);
  }

  async getAll() {
    this.allTransactions = await this.web3.getAllTransactions();
  }

  async ngOnInit(): Promise<void> {
    this.web3.connectWallet();

    this.currentUser = this.token.getUser();
    console.log(this.currentUser.id);

    this.currentAddress = this.web3.getAddress();
    console.log('--------------------------------------');
    console.log(this.currentAddress);

    this.getMyProduct();
    this.forSaleProduct();
    console.log(this.mySaleProducts);
    this.getMySoldPoduct();
    this.getAll();

    
  }
}
