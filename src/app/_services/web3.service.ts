// import { Injectable } from '@angular/core';
// import Web3  from 'web3';
// import { ABI as abi} from '../contracts/ABI';

// declare const window: any;

// const address = '0x1911c19a61FbFd4dc65D58E1541150Cff305B1D7'

// @Injectable({
//   providedIn: 'root',
// })

// export class Web3Service {
//   public account: string | null = null;
//   private web3!: Web3;
//   private contract: any;

//   constructor() {}

//   async Token() {
//     if(!this.contract) return;

//     const token = await this.Contract.methods.Token().call({
//       from: this.account,
//     });

//     console.log('Token: ', token);
//     return token;
//   }

//   async loginmsk() {
//     if(!window.ethereum) {
//       alert('MetaMask not detected');
//       return;
//     }
//       try {
//         this.web3 = new Web3(window.ethereum);

//         await window.ethereum.request({
//           method: 'eth_requestAccounts',
//         });

//         await this.loadAccount();
//         await this.loadContract();
        
//         if(this.account) {
//           sessionStorage.setItem('maskAccount', this.account);
//         }

//         console.log('Connected account: ', this.account);
//       } catch (error) {
//         console.log('MetaMask connection failed', error);
//       }
//     }


//   async loadAccount() {
//     const accounts = await this.web3.eth.getAccounts();
//     this.account = accounts[0];
//   }


//   async loadContract() {
//     this.contract = new this.web3.eth.contract(abi, address, {gasPrice: '2000000', from: this.account })
//   }

//   async addProduct(title: string, seller:string, etherValue: string) {
//     if(!this.contract) return;

//     await this.contract.methods
//     .addProduct(title, seller, etherValue)
//     .send({
//       from: this.account,
//       gas: '6721975',
//     });
//   }

//   async buy(seller: string, etherValue: string) {
//     if(!this.web3 || !this.account) return;

//     const value = this.web3.utils.toWei(etherValue, 'ether');

//     return await this.web3.eth.sendTransaction({
//       from: this.account,
//       to: seller,
//       value: value,
//     });
//   }



//   async getAllTranscations() {
//     if(!this.contract) return;

//     const value = await this.contract.methods
//     .getAllProducrts()
//     .call({from this.account });

//     sessionStorage.setItem('transcation', JSON.stringify(value));
//     return value;
//   }

//   async getMyTranscations() {
//     if(!this.contract) return;

//     return await this.contract.methods
//     .getMyTranscations()
//     .call({from : this.account});
//   }

//   async getCurrentAccountBalance() {
//     if(!this.web3 || !this.account) return;

//     return this.web3.eth.getBalance(this.account);
//   }
  
//   getAddress() {
//     return this.account;
//   }
// }
