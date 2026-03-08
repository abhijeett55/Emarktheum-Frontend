import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Web3Service } from '../../_services/web3.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Product, ProductService } from '../../_services/product';
import { Transaction } from '../../models/Transaction';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  currentUser: any = null;
  currentAddress: string | null = null;

  // Initialize arrays
  myProducts: Product[] = [];
  mySoldProducts: Product[] = [];
  mySaleProducts: Product[] = [];
  myTransaction: Transaction[] = [];
  allTransactions: Transaction[] = [];

  // Loading states
  isLoading = {
    products: false,
    transactions: false,
    allTransactions: false
  };

  // Error handling
  error: string | null = null;

  constructor(
    private token: TokenStorageService,
    private productService: ProductService,
    private web3: Web3Service
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Connect wallet
      await this.web3.connectWallet();
      
      // Get user data
      this.currentUser = this.token.getUser();
      console.log('Current User ID:', this.currentUser?.id);

      // Get wallet address
      this.currentAddress = this.web3.getAddress();
      console.log('Current Address:', this.currentAddress);

      // Load all data
      await this.loadAllData();
      
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.error = 'Failed to initialize profile';
    }
  }

  /**
   * Load all profile data
   */
  async loadAllData(): Promise<void> {
    // Load products
    this.getMyProducts();
    
    // Load transactions
    await this.getMyTransactions();
    
    // Load all transactions
    await this.getAllTransactions();
  }

  /**
 * Get formatted date from transaction
 */
getTransactionDate(transaction: Transaction): string {
  if (!transaction) return 'Date not available';
  
  // If date property exists
  if (transaction.date) {
    return new Date(transaction.date).toLocaleString();
  }
  
  // If timestamp exists (in seconds)
  if (transaction.timestamp) {
    return new Date(transaction.timestamp * 1000).toLocaleString();
  }
  
  return 'Date not available';
}

  /**
   * Get user's products
   */
  getMyProducts(): void {
    this.isLoading.products = true;
    
    this.productService.getMyProducts().subscribe({
      next: (data: Product[]) => {
        this.myProducts = data || [];
        console.log('My Products:', this.myProducts);
        
        // Process products after loading
        this.processProducts();
        this.isLoading.products = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
        this.isLoading.products = false;
        this.myProducts = [];
      }
    });
  }

  /**
   * Process products to get sold and for-sale items
   */
  processProducts(): void {
    // Reset arrays
    this.mySoldProducts = [];
    this.mySaleProducts = [];
    
    // Process each product
    for (const product of this.myProducts) {
      if (product.sold) {
        this.mySoldProducts.push(product);
      } else {
        this.mySaleProducts.push(product);
      }
    }
    
    console.log('Sold Products:', this.mySoldProducts);
    console.log('For Sale Products:', this.mySaleProducts);
  }

  /**
   * Get user's transactions from blockchain and transform them
   */
  async getMyTransactions(): Promise<void> {
    this.isLoading.transactions = true;
    
    try {
      const rawTransactions = await this.web3.getMyTransactions() || [];
      
      // Transform blockchain transactions to match our interface
      this.myTransaction = this.transformTransactions(rawTransactions);
      this.currentAddress = this.web3.getAddress();
      
      console.log('My Transactions:', this.myTransaction);
      console.log('Current Address:', this.currentAddress);
      
    } catch (error) {
      console.error('Error loading transactions:', error);
      this.error = 'Failed to load transactions';
      this.myTransaction = [];
    } finally {
      this.isLoading.transactions = false;
    }
  }

  /**
   * Get all transactions from blockchain
   */
  async getAllTransactions(): Promise<void> {
    this.isLoading.allTransactions = true;
    
    try {
      const rawTransactions = await this.web3.getAllTransactions() || [];
      this.allTransactions = this.transformTransactions(rawTransactions);
      console.log('All Transactions:', this.allTransactions);
    } catch (error) {
      console.error('Error loading all transactions:', error);
      this.allTransactions = [];
    } finally {
      this.isLoading.allTransactions = false;
    }
  }

  /**
   * Transform raw blockchain transactions to our Transaction interface
   */
  private transformTransactions(rawTxs: any[]): Transaction[] {
    if (!rawTxs || !Array.isArray(rawTxs)) {
      return [];
    }

    return rawTxs.map((tx, index) => {
      // Create a proper Transaction object
      const transaction: Transaction = {
        id: tx.id || `tx-${index}`,
        transactionHash: tx.transactionHash || tx.hash || `0x${Math.random().toString(36).substring(2)}`,
        title: tx.title || tx.name || 'Transaction',
        price: tx.price || tx.value || 0,
        seller: tx.seller || tx.from || '0x0000...0000',
        buyer: tx.buyer || tx.to || '0x0000...0000',
        timestamp: tx.timestamp || tx.time || Math.floor(Date.now() / 1000) - (Math.random() * 30 * 24 * 60 * 60),
        status: tx.status || 'completed',
        blockNumber: tx.blockNumber,
        gasUsed: tx.gasUsed
      };

      // Convert timestamp to Date if needed
      if (transaction.timestamp) {
        // If timestamp is in seconds (typical for blockchain), convert to milliseconds
        const timestampMs = transaction.timestamp * 1000;
        transaction.date = new Date(timestampMs);
      } else {
        transaction.date = new Date();
      }

      return transaction;
    });
  }

  /**
   * Check if user is seller of a transaction
   */
  isSeller(transaction: Transaction): boolean {
    if (!transaction || !this.currentAddress) return false;
    
    return (
      !!transaction.seller &&
      transaction.seller.toLowerCase() === this.currentAddress.toLowerCase()
    );
  }

  /**
   * Check if user is buyer of a transaction
   */
  isBuyer(transaction: Transaction): boolean {
    if (!transaction || !this.currentAddress) return false;
    
    return (
      !!transaction.buyer &&
      transaction.buyer.toLowerCase() === this.currentAddress.toLowerCase()
    );
  }

  /**
   * Format address for display
   */
  formatAddress(address: string | null | undefined): string {
    if (!address) return 'Not connected';
    if (address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  /**
   * Get transaction badge class
   */
  getTransactionBadge(transaction: Transaction): string {
    if (this.isSeller(transaction)) return 'seller';
    if (this.isBuyer(transaction)) return 'buyer';
    return '';
  }

  /**
   * Get transaction role text
   */
  getTransactionRole(transaction: Transaction): string {
    if (this.isSeller(transaction)) return 'You sold';
    if (this.isBuyer(transaction)) return 'You bought';
    return 'Transaction';
  }

  /**
   * Track by function for products
   */
  trackByProductId(index: number, product: Product): any {
    return product?.id || index;
  }

  /**
   * Track by function for transactions
   */
  trackByTransactionId(index: number, transaction: Transaction): any {
    return transaction?.transactionHash || transaction?.id || index;
  }

  /**
   * Retry after error
   */
  retry(): void {
    this.error = null;
    this.refreshData();
  }

  /**
   * Refresh all data
   */
  async refreshData(): Promise<void> {
    this.error = null;
    await this.loadAllData();
  }

  /**
   * Check if there are any products
   */
  get hasProducts(): boolean {
    return this.myProducts && this.myProducts.length > 0;
  }

  /**
   * Check if there are any transactions
   */
  get hasTransactions(): boolean {
    return this.myTransaction && this.myTransaction.length > 0;
  }
}