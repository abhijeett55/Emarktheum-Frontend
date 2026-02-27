import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/Transaction';
import { Web3Service } from '../../_services/web3.service';


@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss',
})
export class TransactionComponent implements OnInit {
  
  allTransactions: Transaction[] = [];

  constructor(private web3: Web3Service) { }

  async ngOnInit(): Promise<void> {
    await this.web3.connectWallet();
    await this.loadTransactions();
  }

  async loadTransactions() {
    const data = await this.web3.getAllTransactions();

    if(data) {
        this.allTransactions = data;
        console.log("Transaction: ", data);
    }
  }

  async getAll() {
    await this.loadTransactions();
  }
}
