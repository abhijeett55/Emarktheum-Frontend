import { Injectable } from '@angular/core';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import { ABI as abi} from '../contracts/ABI';

declare const window: any;

const CONTRACT_ADDRESS = '0x1911c19a61FbFd4dc65D58E1541150Cff305B1D7';

@Injectable({
  providedIn: 'root',
})

export class Web3Service {
  private provider!: BrowserProvider;
  private signer: any;
  private contract: any;

  public account: string | null = null;

  constructor() {

  }

  // 🔹 Connect MetaMask
  async connectWallet() {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('MetaMask not installed');
      return;
    }

    this.provider = new BrowserProvider(window.ethereum);

    await this.provider.send('eth_requestAccounts', []);

    this.signer = await this.provider.getSigner();
    this.account = await this.signer.getAddress();

    this.contract = new Contract(CONTRACT_ADDRESS, abi, this.signer);

    if (this.account) {
      sessionStorage.setItem('maskAccount', this.account);
    }
    console.log('Connected:', this.account);
  }


   // 🔹 Get current address
  getAddress() {
    return this.account;
  }

  // 🔹 Read Token() from contract
  async Token() {
    if (!this.contract) return;

    try {
      const token = await this.contract.Token();
      console.log('Token:', token);
      return token;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  // 🔹 Add Product (contract call)
  async addProduct(title: string, seller: string, etherValue: string) {
    if (!this.contract) return;

    try {
      const tx = await this.contract.addProduct(title, seller, etherValue);
      await tx.wait();
      console.log('Product added');
      
      await this.buy(seller, etherValue);

    } catch (error: any) {
      console.log(error.message);
    }
  }

  // 🔹 Send Ether
  async buy(seller: string, etherValue: string) {
    if (!this.signer) return;

    try {
      const tx = await this.signer.sendTransaction({
        to: seller,
        value: parseEther(etherValue)
      });

      await tx.wait();
      console.log('Ether transferred');

      return tx;

    } catch (error) {
      console.error(error);
    }
  }

  // 🔹 Get all products
  async getAllTransactions() {
    if (!this.contract) return;

    try {
      const value = await this.contract.getAllProducts();

      sessionStorage.setItem('transactions', JSON.stringify(value));
      console.log(value);

      return value;

    } catch (error) {
      console.error(error);
    }
  }

  // 🔹 Get my transactions
  async getMyTransactions() {
    if (!this.contract) return;

    try {
      const value = await this.contract.getMyTransactions();
      return value;

    } catch (error) {
      console.error(error);
    }
  }

  // 🔹 Get account balance
  async getCurrentAccountBalance() {
    if (!this.provider || !this.account) return;

    const balance = await this.provider.getBalance(this.account);
    return formatEther(balance);
  }

}
