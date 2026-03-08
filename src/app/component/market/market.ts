import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

import { CryptoService } from '../../_services/crypto';
import { NFTService } from '../../_services/nft';
import { NFT } from '../../models/nft';
import { Crypto } from '../../models/crypto';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market.html',
  styleUrl: './market.scss',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Market implements OnInit {
  cryptos: any[] = [];
  nfts: NFT[] = [];

  marketType: 'crypto' | 'nft' = 'crypto';

  cryptoPage = 1;
  nftPage = 1;
  loading = false;
  hasMore = true;

  constructor(
    private cryptoService: CryptoService,
    private router: Router,
    private nftService: NFTService
  ) {}

  ngOnInit() {
    this.loadCoins();
    this.loadNFTs();
  }

  loadCoins() {
  this.loading = true;

  this.cryptoService.getCoins(1).subscribe({
    next: (data) => {
      console.log("Coins:", data);
      this.cryptos = data;
      this.loading = false;
      this.hasMore = data.length > 0;
    },
    error: (error) => {
      console.error("Error loading coins:", error);
      this.loading = false;
    }
  });
}


  
  loadNFTs() {
    this.loading = true;
    this.nftPage = 1;
    
    this.nftService.getNFTs(this.nftPage, 20).subscribe({
      next: (data: NFT[]) => {
        this.nfts = data;
        this.loading = false;
        this.hasMore = data.length > 0;
        console.log('NFTs Loaded successfully:', this.nfts);
      },
      error: (error) => {
        console.error('Error loading NFTs:', error);
        this.loading = false;
        this.nfts = [];
      }
    });
  }

  
  loadMore() {
    this.loading = true;
    if (this.marketType === 'crypto') {
      this.cryptoPage++;
      this.cryptoService.getCoins(this.cryptoPage).subscribe({
        next: (data: any[]) => {
          if (data.length === 0) {
            this.hasMore = false;
          } else {
            this.cryptos = [...this.cryptos, ...data];
          }
          this.loading = false;
        },
        error: () => this.loading = false
      });
    } else {
      this.nftPage++;
      this.nftService.getNFTs(this.nftPage, 20).subscribe({
        next: (data: NFT[]) => {
          if (data.length === 0) {
            this.hasMore = false;
          } else {
            this.nfts = [...this.nfts, ...data];
          }
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  
  navigateToCoin(coinId: string): void {
    if (coinId) this.router.navigate(['/coin', coinId]);
  }

  navigateToNFTPage(nftId: string): void {
    if (nftId) this.router.navigate(['/nft', nftId]);
  }

  
  trackByCoinId(index: number, coin: any): string {
    return coin?.id || index.toString();
  }

  trackByNFTId(index: number, nft: NFT): string {
    return nft?.id || index.toString();
  }

  retry() {
    this.marketType === 'crypto' ? this.loadCoins() : this.loadNFTs();
  }
}