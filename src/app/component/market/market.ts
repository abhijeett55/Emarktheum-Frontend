import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Crypto } from '../../_services/crypto';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
  page=1;

  constructor(private cryptoService:Crypto, 
    private router: Router){ }

  ngOnInit(){

  this.loadCoins();

  }

  loadCoins(){

    for(let i=1;i<=5;i++) {
      this.cryptoService.getCoins(i).subscribe((data:any) => {
      this.cryptos=[...this.cryptos,...data];
      });
    }
  }

  navigateToBuy(coinId: string) {
    this.router.navigate(['/buy', coinId]);
  }

  navigateToSell(coinId: string) {
    this.router.navigate(['/sell', coinId]);
  }


}
