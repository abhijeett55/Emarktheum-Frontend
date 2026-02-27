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
  currentUser: any;
  currentAddress!: string;

  myProducts!: Product[];
  mySoldProducts!: Product[];
  mySaleProducts!: Product[];
  myTranscation!: transaction[];
  allTransactions!: transaction[];


  constructor(
    private token: TokenStorageService,
    private productService: ProductService,
    private web3: Web3Service
    ) { }


  ngOnInit(): void {

  }
}
