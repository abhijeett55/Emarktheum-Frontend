import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoCard } from '../crypto-card/crypto-card';
import { CryptoService } from '../../_services/crypto';
import { Crypto } from '../../models/crypto';
import { AbsolutePipe } from '../../pipes/absolute-pipe';
import { Subscription, interval } from 'rxjs';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  marketCap: number;
  volume: number;
  image?: string;
}

type TimePeriod = '24h' | '7d' | '30d';

@Component({
  selector: 'app-mini-dashboard',
  standalone: true,
  imports: [CommonModule, CryptoCard, AbsolutePipe],
  templateUrl: './mini-dashboard.html',
  styleUrl: './mini-dashboard.scss',
})
export class MiniDashboard implements OnInit, OnDestroy {
  // Data arrays - initialize empty
  tradableCoins: CryptoData[] = [];
  topGainers: CryptoData[] = [];
  weeklyGainers: CryptoData[] = [];
  newListings: CryptoData[] = [];
  
  // UI state
  activeTab: 'tradable' | 'gainers' | 'weekly' | 'new' = 'tradable';
  selectedCrypto: CryptoData | null = null;
  favorites: Set<string> = new Set();
  
  // Loading states
  isLoading = {
    tradable: false,
    gainers: false,
    weekly: false,
    new: false
  };
  
  // Error handling
  error: string | null = null;
  apiAvailable: boolean = true;
  
  // Auto-refresh
  private refreshSubscription?: Subscription;
  lastUpdated: Date = new Date();
  
  // Time period selector
  timePeriods = [
    { label: '24h', value: '24h' as TimePeriod },
    { label: '7d', value: '7d' as TimePeriod },
    { label: '30d', value: '30d' as TimePeriod }
  ];
  selectedPeriod: TimePeriod = '24h';

  constructor(private cryptoService: CryptoService) {
    console.log('MiniDashboard constructor called');
  }

  ngOnInit(): void {
    console.log('MiniDashboard initialized');
    this.loadFavorites();
    
    // Load mock data immediately to show something
    this.loadMockData();
    
    // Then try to load real data
    this.loadAllData();
    
    // Auto-refresh every 5 minutes
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  /**
   * Start auto-refresh interval
   */
  private startAutoRefresh(): void {
    this.refreshSubscription = interval(300000).subscribe(() => {
      console.log('Auto-refreshing data...');
      this.refreshData();
    });
  }

  /**
   * Stop auto-refresh interval
   */
  private stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  /**
   * Transform API coin to CryptoData format
   */
  private transformCoin(coin: any): CryptoData {
    return {
      id: coin.id || `coin-${Math.random()}`,
      name: coin.name || 'Unknown',
      symbol: (coin.symbol || '???').toUpperCase(),
      price: coin.current_price || coin.price || 0,
      priceChange: coin.price_change_percentage_24h || coin.priceChange || 0,
      marketCap: coin.market_cap || coin.marketCap || 0,
      volume: coin.total_volume || coin.volume || 0,
      image: coin.image || `https://via.placeholder.com/32/2a1e3c/a18cd1?text=${(coin.symbol || '??').toUpperCase()}`
    };
  }

  /**
   * Transform array of API coins to CryptoData array
   */
  private transformCoins(data: any[]): CryptoData[] {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data.map(coin => this.transformCoin(coin));
  }

  /**
   * Load mock data immediately to ensure UI shows something
   */
  private loadMockData(): void {
    console.log('Loading mock data as fallback');
    this.tradableCoins = this.getMockMarketCap();
    this.topGainers = this.getMockGainers();
    this.weeklyGainers = this.getMockWeeklyGainers();
    this.newListings = this.getMockNewListings();
  }

  /**
   * Load all data from API
   */
  loadAllData(): void {
    this.loadTradableData();
    this.loadGainersData();
    this.loadWeeklyGainers();
    this.loadNewListings();
  }

  /**
   * Load tradable coins (top by market cap)
   */
  loadTradableData(): void {
    this.isLoading.tradable = true;
    console.log('Loading tradable data...');
    
    this.cryptoService.getTopByMarketCap(6).subscribe({
      next: (data: any) => {
        console.log('Tradable data received:', data);
        if (data && data.length > 0) {
          this.tradableCoins = this.transformCoins(data);
          this.apiAvailable = true;
          this.error = null;
        } else {
          // Keep mock data if API returns empty
          console.warn('No data received, keeping mock data');
          this.apiAvailable = false;
          this.error = 'Using offline data';
        }
        this.isLoading.tradable = false;
        this.lastUpdated = new Date();
      },
      error: (err: any) => {
        console.error('Error loading tradable data:', err);
        this.apiAvailable = false;
        this.error = 'Using offline data - API unavailable';
        this.isLoading.tradable = false;
        // Mock data already loaded, so we're good
      }
    });
  }

  /**
   * Load gainers data based on selected period
   */
  loadGainersData(): void {
    this.isLoading.gainers = true;
    console.log('Loading gainers for period:', this.selectedPeriod);
    
    let observable;
    switch(this.selectedPeriod) {
      case '24h':
        observable = this.cryptoService.getTopGainers(6);
        break;
      case '7d':
        observable = this.cryptoService.getWeeklyGainers(6);
        break;
      case '30d':
        // Use 24h as fallback for 30d
        console.log('30d not available, using 24h data');
        observable = this.cryptoService.getTopGainers(6);
        break;
      default:
        observable = this.cryptoService.getTopGainers(6);
    }
    
    observable.subscribe({
      next: (data: any) => {
        console.log('Gainers data received:', data);
        if (data && data.length > 0) {
          this.topGainers = this.transformCoins(data);
        }
        this.isLoading.gainers = false;
      },
      error: (err: any) => {
        console.error('Error loading gainers:', err);
        this.isLoading.gainers = false;
        // Keep existing mock data
      }
    });
  }

  /**
   * Load weekly gainers
   */
  loadWeeklyGainers(): void {
    this.isLoading.weekly = true;
    console.log('Loading weekly gainers...');
    
    this.cryptoService.getWeeklyGainers(6).subscribe({
      next: (data: any) => {
        console.log('Weekly gainers received:', data);
        if (data && data.length > 0) {
          this.weeklyGainers = this.transformCoins(data);
        }
        this.isLoading.weekly = false;
      },
      error: (err: any) => {
        console.error('Error loading weekly gainers:', err);
        this.isLoading.weekly = false;
      }
    });
  }

  /**
   * Load new listings
   */
  loadNewListings(): void {
    this.isLoading.new = true;
    console.log('Loading new listings...');
    
    this.cryptoService.getNewListings(6).subscribe({
      next: (data: any) => {
        console.log('New listings received:', data);
        if (data && data.length > 0) {
          this.newListings = this.transformCoins(data);
        }
        this.isLoading.new = false;
      },
      error: (err: any) => {
        console.error('Error loading new listings:', err);
        this.isLoading.new = false;
      }
    });
  }

  /**
   * Load favorites from localStorage
   */
  loadFavorites(): void {
    try {
      const saved = localStorage.getItem('cryptoFavorites');
      if (saved) {
        this.favorites = new Set(JSON.parse(saved));
        console.log('Favorites loaded:', this.favorites);
      }
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: 'tradable' | 'gainers' | 'weekly' | 'new'): void {
    console.log('Setting active tab:', tab);
    this.activeTab = tab;
  }

  /**
   * Handle period selection from template
   */
  onPeriodSelect(period: string): void {
    console.log('Period selected:', period);
    if (period === '24h' || period === '7d' || period === '30d') {
      this.selectedPeriod = period;
      // Reload gainers data when period changes
      if (this.activeTab === 'gainers') {
        this.loadGainersData();
      }
    } else {
      console.warn('Invalid period:', period);
    }
  }

  /**
   * Format price to INR
   */
  formatPrice(price: number): string {
    if (!price || price === 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }

  /**
   * Get CSS class for price change
   */
  getPriceChangeClass(change: number): string {
    return change >= 0 ? 'positive' : 'negative';
  }

  /**
   * Get icon for price change
   */
  getPriceChangeIcon(change: number): string {
    return change >= 0 ? '↑' : '↓';
  }

  /**
   * Handle crypto card click
   */
  onCryptoClick(crypto: CryptoData): void {
    console.log('Crypto clicked:', crypto);
    this.selectedCrypto = crypto;
  }

  /**
   * Handle favorite toggle
   */
  onFavoriteToggle(event: { symbol: string; isFavorite: boolean }): void {
    console.log('Favorite toggled:', event);
    
    if (event.isFavorite) {
      this.favorites.add(event.symbol);
    } else {
      this.favorites.delete(event.symbol);
    }
    
    // Save to localStorage
    localStorage.setItem('cryptoFavorites', JSON.stringify([...this.favorites]));
  }

  /**
   * Get current items based on active tab
   */
  getCurrentItems(): CryptoData[] {
    let items: CryptoData[] = [];
    
    switch(this.activeTab) {
      case 'tradable':
        items = this.tradableCoins;
        break;
      case 'gainers':
        items = this.topGainers;
        break;
      case 'weekly':
        items = this.weeklyGainers;
        break;
      case 'new':
        items = this.newListings;
        break;
    }
    
    return items && items.length > 0 ? items : [];
  }

  /**
   * Refresh all data
   */
  refreshData(): void {
    console.log('Manually refreshing data...');
    this.error = null;
    this.loadAllData();
  }

  /**
   * Close details modal
   */
  closeDetails(): void {
    this.selectedCrypto = null;
  }

  /**
   * Get last updated time string
   */
  getLastUpdatedTime(): string {
    return this.lastUpdated.toLocaleTimeString();
  }

  /**
   * Get active tab title
   */
  getActiveTabTitle(): string {
    switch(this.activeTab) {
      case 'tradable': return 'Top by Market Cap';
      case 'gainers': return `${this.selectedPeriod} Top Gainers`;
      case 'weekly': return 'Weekly Top Gainers';
      case 'new': return 'New Listings';
      default: return '';
    }
  }

  /**
   * Get API status message
   */
  getApiStatusMessage(): string {
    return this.apiAvailable ? 'Live Data' : 'Offline Mode';
  }

  /**
   * Debug method to test API
   */
  testAPI(): void {
    console.log('Testing API connection...');
    this.cryptoService.getTopByMarketCap(1).subscribe({
      next: (data: any) => {
        console.log('✅ API Test Success:', data);
        alert(`API Working! Received: ${JSON.stringify(data)}`);
      },
      error: (err: any) => {
        console.error('❌ API Test Failed:', err);
        alert(`API Error: ${err.message}`);
      }
    });
  }

  /**
   * Debug method to log current state
   */
  logCurrentState(): void {
    console.log('Current State:', {
      activeTab: this.activeTab,
      selectedPeriod: this.selectedPeriod,
      tradableCoins: this.tradableCoins.length,
      topGainers: this.topGainers.length,
      weeklyGainers: this.weeklyGainers.length,
      newListings: this.newListings.length,
      apiAvailable: this.apiAvailable,
      error: this.error,
      favorites: [...this.favorites]
    });
  }

  /**
   * Force use mock data
   */
  forceMockData(): void {
    console.log('Forcing mock data...');
    this.tradableCoins = this.getMockMarketCap();
    this.topGainers = this.getMockGainers();
    this.weeklyGainers = this.getMockWeeklyGainers();
    this.newListings = this.getMockNewListings();
    this.apiAvailable = false;
    this.error = 'Using mock data';
    this.lastUpdated = new Date();
  }

  // ============ MOCK DATA METHODS ============

  private getMockGainers(): CryptoData[] {
    return [
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 12450.75, priceChange: 12.34, marketCap: 45000000000, volume: 2500000000 },
      { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 3456.89, priceChange: 8.92, marketCap: 12000000000, volume: 800000000 },
      { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', price: 567.23, priceChange: 7.45, marketCap: 5000000000, volume: 300000000 },
      { id: 'fetch', name: 'Fetch.ai', symbol: 'FET', price: 234.56, priceChange: 15.67, marketCap: 2000000000, volume: 150000000 },
      { id: 'render', name: 'Render Token', symbol: 'RNDR', price: 789.12, priceChange: 22.34, marketCap: 3000000000, volume: 200000000 },
      { id: 'injective', name: 'Injective', symbol: 'INJ', price: 2345.67, priceChange: 18.45, marketCap: 2000000000, volume: 100000000 }
    ];
  }

  private getMockWeeklyGainers(): CryptoData[] {
    return [
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 12450.75, priceChange: 45.2, marketCap: 45000000000, volume: 2500000000 },
      { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 3456.89, priceChange: 38.7, marketCap: 12000000000, volume: 800000000 },
      { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', price: 567.23, priceChange: 28.3, marketCap: 5000000000, volume: 300000000 },
      { id: 'fetch', name: 'Fetch.ai', symbol: 'FET', price: 234.56, priceChange: 52.3, marketCap: 2000000000, volume: 150000000 },
      { id: 'render', name: 'Render Token', symbol: 'RNDR', price: 789.12, priceChange: 61.8, marketCap: 3000000000, volume: 200000000 },
      { id: 'injective', name: 'Injective', symbol: 'INJ', price: 2345.67, priceChange: 41.8, marketCap: 2000000000, volume: 100000000 }
    ];
  }

  private getMockMarketCap(): CryptoData[] {
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 6276766.19, priceChange: 3.95, marketCap: 123000000000, volume: 15000000000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 182489.30, priceChange: 4.43, marketCap: 56000000000, volume: 8000000000 },
      { id: 'tether', name: 'Tether', symbol: 'USDT', price: 91.91, priceChange: 0.01, marketCap: 85000000000, volume: 30000000000 },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 57847.28, priceChange: 2.81, marketCap: 32000000000, volume: 1200000000 },
      { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 125.46, priceChange: 2.93, marketCap: 18000000000, volume: 800000000 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 12450.75, priceChange: 5.67, marketCap: 15000000000, volume: 900000000 }
    ];
  }

  private getMockNewListings(): CryptoData[] {
    return [
      { id: 'hyperliquid', name: 'Hyperliquid', symbol: 'HPL', price: 2836.67, priceChange: 1.06, marketCap: 100000000, volume: 5000000 },
      { id: 'sentient', name: 'Sentient', symbol: 'SEN', price: 2.15, priceChange: 9.31, marketCap: 50000000, volume: 2000000 },
      { id: 'jupiter', name: 'Jupiter', symbol: 'JUP', price: 16.30, priceChange: -5.85, marketCap: 200000000, volume: 10000000 },
      { id: 'walrus', name: 'Walrus', symbol: 'WAL', price: 6.82, priceChange: -5.65, marketCap: 75000000, volume: 3000000 },
      { id: 'lighter', name: 'Lighter', symbol: 'LIT', price: 103.49, priceChange: -6.23, marketCap: 150000000, volume: 8000000 },
      { id: 'raydium', name: 'Raydium', symbol: 'RAY', price: 54.20, priceChange: -4.42, marketCap: 120000000, volume: 6000000 }
    ];
  }
}