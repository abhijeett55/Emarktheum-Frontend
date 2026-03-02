import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction as transaction } from '../../models/Transaction';
import { Web3Service } from '../../_services/web3.service';


@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss',
})
export class TransactionComponent implements OnInit {
  
  allTransactions: transaction[] = [];
  trans: transaction[] = [];

  constructor(private web3: Web3Service) { }

  async ngOnInit(): Promise<void> {
    await this.web3.connectWallet();
    await this.loadTransactions();
  }

   async loadTransactions() {
    try {
      this.allTransactions = await this.web3.getAllTransactions();

      const stored = sessionStorage.getItem("transaction");
      this.trans = stored ? JSON.parse(stored) : [];

      console.log("All:", this.allTransactions);
      console.log("Session:", this.trans);

    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  }

}
