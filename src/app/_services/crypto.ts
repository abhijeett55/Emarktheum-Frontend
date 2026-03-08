import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Crypto as CryptoData } from '../models/crypto';
import { Observable, map, catchError, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private apiUrl = 'https://api.coincap.io/v2';
  private cacheTime = 5 * 60 * 1000;
  private usdToInr = 83.5;

  constructor(private http: HttpClient) {}

  getCoins(page: number): Observable<any[]> {

  const limit = 100;
  const offset = (page - 1) * limit;

  return this.http.get<any>(`https://api.coincap.io/v2/assets`, {
    params: { limit, offset }
  }).pipe(
    map(res => res.data)
  );
}



  getTopGainers(limit: number = 10): Observable<CryptoData[]> {
    const cacheKey = 'topGainers';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<any>(`${this.apiUrl}/assets`, {
      params: {
        limit: 100 
      }
    }).pipe(
      map(response => {
        const assets = response.data;
        // Sort by change percent (highest positive change first)
        const gainers = assets
          .filter((asset: any) => parseFloat(asset.changePercent24Hr) > 0)
          .sort((a: any, b: any) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr))
          .slice(0, limit)
          .map((asset: any) => this.transformAsset(asset));
        
        this.cacheData(cacheKey, gainers);
        return gainers;
      }),
      catchError(error => {
        console.error('Error fetching gainers:', error);
        return of(this.getMockGainers());
      })
    );
  }

  getWeeklyGainers(limit: number = 10): Observable<CryptoData[]> {
    const cacheKey = 'weeklyGainers';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<any>(`${this.apiUrl}/assets`, {
      params: {
        limit: 100
      }
    }).pipe(
      map(response => {
        const assets = response.data;
        // Simulate weekly gains (multiply 24h change by a factor)
        const weeklyGainers = assets
          .filter((asset: any) => parseFloat(asset.changePercent24Hr) > 0)
          .sort((a: any, b: any) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr))
          .slice(0, limit)
          .map((asset: any) => {
            const transformed = this.transformAsset(asset);
            // Rough estimate for weekly (24h * 7 as an approximation)
            transformed.priceChange = parseFloat((parseFloat(asset.changePercent24Hr) * 3).toFixed(2));
            return transformed;
          });
        
        this.cacheData(cacheKey, weeklyGainers);
        return weeklyGainers;
      }),
      catchError(error => {
        console.error('Error fetching weekly gainers:', error);
        return of(this.getMockWeeklyGainers());
      })
    );
  }

  getTopByMarketCap(limit: number = 10): Observable<CryptoData[]> {
    const cacheKey = 'topByMarketCap';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return of(cached);
    }

    return this.http.get<any>(`${this.apiUrl}/assets`, {
      params: {
        limit: limit
      }
    }).pipe(
      map(response => {
        const assets = response.data.map((asset: any) => this.transformAsset(asset));
        this.cacheData(cacheKey, assets);
        return assets;
      }),
      catchError(error => {
        console.error('Error fetching market cap:', error);
        return of(this.getMockMarketCap());
      })
    );
  }
  getNewListings(limit: number = 10): Observable<CryptoData[]> {
    const cacheKey = 'newListings';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return of(cached);
    }
    return this.http.get<any>(`${this.apiUrl}/assets`, {
      params: {
        limit: 100
      }
    }).pipe(
      map(response => {
        const assets = response.data;
        // Sort by rank descending (lower rank = newer listing)
        const newListings = assets
          .sort((a: any, b: any) => b.rank - a.rank)
          .slice(0, limit)
          .map((asset: any) => this.transformAsset(asset));
        
        this.cacheData(cacheKey, newListings);
        return newListings;
      }),
      catchError(error => {
        console.error('Error fetching new listings:', error);
        return of(this.getMockNewListings());
      })
    );
  }
  private transformAsset(asset: any): CryptoData {
    const priceUsd = parseFloat(asset.priceUsd || '0');
    const changePercent = parseFloat(asset.changePercent24Hr || '0');
    const marketCapUsd = parseFloat(asset.marketCapUsd || '0');
    const volumeUsd = parseFloat(asset.volumeUsd24Hr || '0');
    
    const priceInr = priceUsd * this.usdToInr;
    const marketCapInr = marketCapUsd * this.usdToInr;
    const volumeInr = volumeUsd * this.usdToInr;

    return {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      price: priceInr,
      priceChange: changePercent,
      marketCap: marketCapInr,
      volume: volumeInr
    };
  }

  /** Cache Management **/
  private cacheData(key: string, data: any[]): void {
    const cache = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(`crypto_${key}`, JSON.stringify(cache));
  }

  private getCachedData(key: string): any[] | null {
    const cached = localStorage.getItem(`crypto_${key}`);
    if (!cached) return null;
    
    try {
      const cache = JSON.parse(cached);
      if (Date.now() - cache.timestamp < this.cacheTime) {
        return cache.data;
      }
    } catch (e) {
      console.error('Error parsing cache:', e);
    }
    
    return null;
  }

  // ============ MOCK DATA FALLBACKS ============

  private getMockGainers(): CryptoData[] {
    return [
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 12450.75, priceChange: 12.34, marketCap: 45000000000, volume: 2500000000 },
      { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 3456.89, priceChange: 8.92, marketCap: 12000000000, volume: 800000000 },
      { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', price: 567.23, priceChange: 7.45, marketCap: 5000000000, volume: 300000000 },
      { id: 'fetch', name: 'Fetch.ai', symbol: 'FET', price: 234.56, priceChange: 15.67, marketCap: 2000000000, volume: 150000000 },
      { id: 'render', name: 'Render Token', symbol: 'RNDR', price: 789.12, priceChange: 22.34, marketCap: 3000000000, volume: 200000000 }
    ];
  }

  private getMockWeeklyGainers(): CryptoData[] {
    return [
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 12450.75, priceChange: 45.2, marketCap: 45000000000, volume: 2500000000 },
      { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 3456.89, priceChange: 38.7, marketCap: 12000000000, volume: 800000000 },
      { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', price: 567.23, priceChange: 28.3, marketCap: 5000000000, volume: 300000000 },
      { id: 'fetch', name: 'Fetch.ai', symbol: 'FET', price: 234.56, priceChange: 22.1, marketCap: 2000000000, volume: 150000000 }
    ];
  }

  private getMockMarketCap(): CryptoData[] {
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 6276766.19, priceChange: 3.95, marketCap: 123000000000, volume: 15000000000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 182489.30, priceChange: 4.43, marketCap: 56000000000, volume: 8000000000 },
      { id: 'tether', name: 'Tether', symbol: 'USDT', price: 91.91, priceChange: 0.01, marketCap: 85000000000, volume: 30000000000 },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 57847.28, priceChange: 2.81, marketCap: 32000000000, volume: 1200000000 },
      { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 125.46, priceChange: 2.93, marketCap: 18000000000, volume: 800000000 }
    ];
  }

  private getMockNewListings(): CryptoData[] {
    return [
      { id: 'hyperliquid', name: 'Hyperliquid', symbol: 'HPL', price: 2836.67, priceChange: 1.06, marketCap: 100000000, volume: 5000000 },
      { id: 'sentient', name: 'Sentient', symbol: 'SEN', price: 2.15, priceChange: 9.31, marketCap: 50000000, volume: 2000000 },
      { id: 'jupiter', name: 'Jupiter', symbol: 'JUP', price: 16.30, priceChange: -5.85, marketCap: 200000000, volume: 10000000 },
      { id: 'walrus', name: 'Walrus', symbol: 'WAL', price: 6.82, priceChange: -5.65, marketCap: 75000000, volume: 3000000 }
    ];
  }
}