import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Crypto } from '../../_services/crypto';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './market.html',
  styleUrl: './market.scss',
})
export class Market {

  cryptos:any[]=[];
  page=1;

constructor(private cryptoService:Crypto){}

ngOnInit(){

this.loadCoins();

}

loadCoins(){

for(let i=1;i<=5;i++){

this.cryptoService.getCoins(i)
.subscribe((data:any)=>{

this.cryptos=[...this.cryptos,...data];

});

}

}


}
