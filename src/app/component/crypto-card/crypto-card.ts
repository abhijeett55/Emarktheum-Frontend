import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbsolutePipe } from '../../pipes/absolute-pipe';

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [ CommonModule, AbsolutePipe],
  templateUrl: './crypto-card.html',
  styleUrl: './crypto-card.scss',
})
export class CryptoCard {

  @Input() name: string = '';
  @Input() price: number = 0;
  @Input() change: number = 0;
  @Input() symbol: string = '';
  @Input() id?: string;
  
  @Output() cardClick = new EventEmitter<any>();
  @Output() favoriteToggle = new EventEmitter<any>();

    isFavorite: boolean = false;

  formatPrice(price: number): string {
    if (!price || price === 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }

  getChangeClass(): string {
    return this.change >= 0 ? 'positive' : 'negative';
  }

  getChangeIcon(): string {
    return this.change >= 0 ? '↑' : '↓';
  }

  onCardClick(): void {
    this.cardClick.emit({
      name: this.name,
      symbol: this.symbol,
      price: this.price,
      change: this.change,
      id: this.id
    });
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.favoriteToggle.emit({
      name: this.name,
      symbol: this.symbol,
      isFavorite: this.isFavorite,
      id: this.id
    });
  }

}
