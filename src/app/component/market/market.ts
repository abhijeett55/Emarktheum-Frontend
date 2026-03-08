import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

import { CryptoService } from '../../_services/crypto';
import { NFTService } from '../../_services/nft';

import { Crypto } from '../../models/crypto';
import { NFT } from '../../models/nft';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [ CommonModule ],
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
export class Market {

  cryptos:any[]=[];
  nfts: NFT[] = [];

   marketType: 'crypto' | 'nft' = 'crypto';
   dropdownOpen = false;

  page = 1;
  cryptoPage = 1;
  nftPage = 1;
  loading = false;
  hasMore = true;


  constructor(private cryptoService:CryptoService, 
    private router: Router,
    private nftService: NFTService,){ }

  ngOnInit() {
    this.loadCoins();
    this.loadNFTs();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectMarketType(type: 'crypto' | 'nft') {
    this.marketType = type;
    this.dropdownOpen = false;
  }


    loadCoins() {
    this.loading = true;
    this.cryptos = [];
    
    // Load multiple pages
    for (let i = 1; i <= 5; i++) {
      this.cryptoService.getCoins(i).subscribe({
        next: (data: any) => {
          this.cryptos = [...this.cryptos, ...data];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading coins:', error);
          this.loading = false;
        }
      });
    }
  }

    loadNFTs() {
    this.loading = true;
    this.nftPage = 1;
    
    this.nftService.getNFTs(this.nftPage, 20).subscribe({
      next: (data: NFT[]) => {
        this.nfts = data;
        this.loading = false;
        this.hasMore = data.length === 20; // If we got 20 items, there might be more
      },
      error: (error) => {
        console.error('Error loading NFTs:', error);
        this.loading = false;
        this.nfts = [];
      }
    });
  }

    loadMore() {
    if (this.marketType === 'crypto') {
      this.cryptoPage++;
      this.loading = true;
      this.cryptoService.getCoins(this.cryptoPage).subscribe({
        next: (data: any) => {
          if (data.length === 0) {
            this.hasMore = false;
          } else {
            this.cryptos = [...this.cryptos, ...data];
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading more coins:', error);
          this.loading = false;
        }
      });
    } else {
      this.nftPage++;
      this.loading = true;
      this.nftService.getNFTs(this.nftPage, 20).subscribe({
        next: (data: NFT[]) => {
          if (data.length === 0) {
            this.hasMore = false;
          } else {
            this.nfts = [...this.nfts, ...data];
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading more NFTs:', error);
          this.loading = false;
        }
      });
    }
  }
  
  trackByCoinId(index: number, coin: any): string {
    return coin?.id || index.toString();
  }
  // In market.ts, verify these methods exist:

  navigateToCoin(coinId: string): void {
  console.log('Navigating to coin:', coinId);
  if (coinId) {
    this.router.navigate(['/coin', coinId]);
  }
}

navigateToNFTPage(nftId: string): void {
  console.log('Navigating to NFT:', nftId);
  if (nftId) {
    this.router.navigate(['/nft', nftId]);
  }
}

  



/**
 * Navigate to buy coin page (stopPropagation handles the event)
 */
navigateToBuy(coinId: string): void {
  if (coinId) {
    console.log('Navigating to buy coin:', coinId);
    this.router.navigate(['/buy', coinId]);
  }
}

/**
 * Navigate to sell coin page (stopPropagation handles the event)
 */
navigateToSell(coinId: string): void {
  if (coinId) {
    console.log('Navigating to sell coin:', coinId);
    this.router.navigate(['/sell', coinId]);
  }
}

/**
 * Navigate to buy NFT page (stopPropagation handles the event)
 */
navigateToBuyNFT(nftId: string): void {
  if (nftId) {
    console.log('Navigating to buy NFT:', nftId);
    this.router.navigate(['/nft/buy', nftId]);
  }
}

/**
 * Navigate to sell NFT page (stopPropagation handles the event)
 */
navigateToSellNFT(nftId: string): void {
  if (nftId) {
    console.log('Navigating to sell NFT:', nftId);
    this.router.navigate(['/nft/sell', nftId]);
  }
}

  trackByNFTId(index: number, nft: NFT): string {
    return nft?.id || index.toString();
  }

    retry() {
    if (this.marketType === 'crypto') {
      this.loadCoins();
    } else {
      this.loadNFTs();
    }
  }


}
