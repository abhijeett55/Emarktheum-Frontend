import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NFT } from '../models/nft';

@Injectable({
  providedIn: 'root'
})
export class NFTService {
  // CoinGecko API base URL - free tier, no API key required for basic endpoints
  private apiUrl = 'https://api.coingecko.com/api/v3';
  
  // For NFT data, CoinGecko has specific endpoints
  private nftEndpoint = '/nfts/list'; // Gets list of all NFTs
  private nftMarketEndpoint = '/nfts/markets'; // Gets NFT market data

  constructor(private http: HttpClient) {}

  /**
   * Get NFTs with pagination
   * CoinGecko free tier limitations: 10-50 calls per minute
   */
  getNFTs(page: number = 1, limit: number = 20): Observable<NFT[]> {
    // CoinGecko doesn't have direct pagination for NFTs, so we'll fetch and paginate
    const url = `${this.apiUrl}/nfts/list?per_page=100&page=${page}`;
    
    return this.http.get<any[]>(url).pipe(
      map(response => this.transformNFTData(response, page, limit)),
      catchError(error => {
        console.error('Error fetching NFTs from CoinGecko:', error);
        // Fallback to mock data if API fails
        return of(this.getMockNFTs(page, limit));
      })
    );
  }

  /**
   * Get NFT by ID
   */
  getNFTById(id: string): Observable<NFT | null> {
    const url = `${this.apiUrl}/nfts/${id}`;
    
    return this.http.get<any>(url).pipe(
      map(response => this.transformSingleNFT(response)),
      catchError(error => {
        console.error('Error fetching NFT by ID:', error);
        return of(null);
      })
    );
  }

  /**
   * Get trending NFTs (using CoinGecko's trending search)
   */
  getTrendingNFTs(limit: number = 10): Observable<NFT[]> {
    const url = `${this.apiUrl}/search/trending`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.nfts) {
          return response.nfts.slice(0, limit).map((item: any, index: number) => this.transformTrendingNFT(item, index));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching trending NFTs:', error);
        return of(this.getMockNFTs(1, limit));
      })
    );
  }

  /**
   * Get NFTs by collection
   */
  getNFTsByCollection(collectionId: string, page: number = 1): Observable<NFT[]> {
    // CoinGecko has collection endpoints
    const url = `${this.apiUrl}/nfts/${collectionId}/market_chart?days=30`;
    
    return this.http.get<any>(url).pipe(
      map(response => this.transformCollectionData(response, collectionId)),
      catchError(error => {
        console.error('Error fetching collection:', error);
        return of(this.getMockNFTs(page, 10));
      })
    );
  }

  /**
   * Transform CoinGecko response to your NFT interface
   */
  private transformNFTData(apiResponse: any[], page: number, limit: number): NFT[] {
    if (!apiResponse || !Array.isArray(apiResponse)) {
      return [];
    }

    const startIndex = (page - 1) * limit;
    const paginatedData = apiResponse.slice(startIndex, startIndex + limit);
    
    return paginatedData.map((item, index) => ({
      id: item.id || `nft-${Date.now()}-${index}`,
      name: item.name || 'Unknown NFT',
      image: item.image?.small || item.image?.thumb || `https://via.placeholder.com/400x400/2a1e3c/a18cd1?text=NFT`,
      creator: item.creator || item.contract_address?.slice(0, 10) || '0xUnknown',
      collection: item.asset_platform_id || item.symbol?.toUpperCase() || 'Unknown',
      tokenId: Math.floor(Math.random() * 10000), // CoinGecko doesn't provide tokenId in list endpoint
      currentPrice: item.floor_price || Math.random() * 5 + 0.1,
      floorPrice: item.floor_price || Math.random() * 4 + 0.05,
      priceChange24h: item.floor_price_in_usd_24h_percentage_change || (Math.random() * 30 - 15),
      rarity: this.getRandomRarity(),
      description: item.description || `A unique NFT from the ${item.name || 'Unknown'} collection`,
      contractAddress: item.contract_address,
      chain: this.getChainFromPlatform(item.asset_platform_id)
    }));
  }

  /**
   * Transform single NFT response
   */
  private transformSingleNFT(apiResponse: any): NFT {
    return {
      id: apiResponse.id || `nft-${Date.now()}`,
      name: apiResponse.name || 'Unknown NFT',
      image: apiResponse.image?.large || apiResponse.image?.small || `https://via.placeholder.com/400x400/2a1e3c/a18cd1?text=NFT`,
      creator: apiResponse.creator || apiResponse.contract_address?.slice(0, 10) || '0xUnknown',
      collection: apiResponse.asset_platform_id || apiResponse.symbol?.toUpperCase() || 'Unknown',
      tokenId: Math.floor(Math.random() * 10000),
      currentPrice: apiResponse.floor_price || Math.random() * 5 + 0.1,
      floorPrice: apiResponse.floor_price || Math.random() * 4 + 0.05,
      priceChange24h: apiResponse.floor_price_in_usd_24h_percentage_change || (Math.random() * 30 - 15),
      rarity: this.getRandomRarity(),
      description: apiResponse.description || `A unique NFT from the ${apiResponse.name || 'Unknown'} collection`,
      contractAddress: apiResponse.contract_address,
      chain: this.getChainFromPlatform(apiResponse.asset_platform_id)
    };
  }

  /**
   * Transform trending NFT data
   */
  private transformTrendingNFT(item: any, index: number): NFT {
    return {
      id: item.id || `trending-${index}`,
      name: item.name || `Trending NFT #${index + 1}`,
      image: item.thumb || `https://via.placeholder.com/400x400/2a1e3c/a18cd1?text=TRENDING`,
      creator: 'Trending Collection',
      collection: item.symbol?.toUpperCase() || 'TRENDING',
      tokenId: Math.floor(Math.random() * 10000),
      currentPrice: Math.random() * 10 + 0.5,
      floorPrice: Math.random() * 8 + 0.3,
      priceChange24h: Math.random() * 40 - 10,
      rarity: 'Rare',
      chain: 'Ethereum'
    };
  }

  /**
   * Transform collection data
   */
  private transformCollectionData(apiResponse: any, collectionId: string): NFT[] {
    // Create mock NFTs for the collection
    const nfts: NFT[] = [];
    for (let i = 0; i < 10; i++) {
      nfts.push({
        id: `${collectionId}-${i}`,
        name: `${collectionId} #${Math.floor(Math.random() * 10000)}`,
        image: `https://via.placeholder.com/400x400/2a1e3c/a18cd1?text=${collectionId.charAt(0)}${i}`,
        creator: `0x${Math.random().toString(36).substring(2, 10)}`,
        collection: collectionId,
        tokenId: Math.floor(Math.random() * 10000),
        currentPrice: parseFloat((Math.random() * 15 + 0.1).toFixed(2)),
        floorPrice: parseFloat((Math.random() * 12 + 0.05).toFixed(2)),
        priceChange24h: parseFloat((Math.random() * 30 - 15).toFixed(2)),
        rarity: this.getRandomRarity(),
        chain: 'Ethereum'
      });
    }
    return nfts;
  }

  /**
   * Get chain from platform ID
   */
  private getChainFromPlatform(platformId: string): 'Ethereum' | 'Polygon' | 'Solana' | 'Binance' {
    const platform = platformId?.toLowerCase() || '';
    if (platform.includes('eth')) return 'Ethereum';
    if (platform.includes('polygon')) return 'Polygon';
    if (platform.includes('sol')) return 'Solana';
    if (platform.includes('bnb') || platform.includes('bsc')) return 'Binance';
    return 'Ethereum'; // Default
  }

  /**
   * Get random rarity for mock data
   */
  private getRandomRarity(): 'Common' | 'Rare' | 'Epic' | 'Legendary' {
    const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    const weights = [0.5, 0.3, 0.15, 0.05]; // 50% Common, 30% Rare, etc.
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < rarities.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return rarities[i] as any;
      }
    }
    return 'Common';
  }

  /**
   * Mock data fallback
   */
  private getMockNFTs(page: number, limit: number): NFT[] {
    const collections = ['Bored Ape', 'CryptoPunk', 'Azuki', 'Moonbirds', 'Doodles', 'CloneX', 'Otherside'];
    const creators = ['0x1234...5678', '0x8765...4321', '0x2468...1357', '0x1357...2468', '0x9876...5432'];
    const rarities: Array<'Common' | 'Rare' | 'Epic' | 'Legendary'> = ['Common', 'Rare', 'Epic', 'Legendary'];
    const chains: Array<'Ethereum' | 'Polygon' | 'Solana' | 'Binance'> = ['Ethereum', 'Polygon', 'Solana', 'Binance'];
    
    const nfts: NFT[] = [];
    const startIndex = (page - 1) * limit;
    
    for (let i = 0; i < limit; i++) {
      const index = startIndex + i;
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      const priceChange = (Math.random() * 30 - 15);
      const collection = collections[Math.floor(Math.random() * collections.length)];
      
      nfts.push({
        id: `nft-${index + 1}`,
        name: `${collection} #${Math.floor(Math.random() * 10000)}`,
        image: `https://via.placeholder.com/400x400/2a1e3c/a18cd1?text=${collection.charAt(0)}${index + 1}`,
        creator: creators[Math.floor(Math.random() * creators.length)],
        collection: collection,
        tokenId: Math.floor(Math.random() * 10000),
        currentPrice: parseFloat((Math.random() * 15 + 0.1).toFixed(2)),
        floorPrice: parseFloat((Math.random() * 12 + 0.05).toFixed(2)),
        priceChange24h: parseFloat(priceChange.toFixed(2)),
        rarity: rarity,
        description: `A unique ${rarity.toLowerCase()} NFT from the ${collection} collection.`,
        owner: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
        contractAddress: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
        chain: chains[Math.floor(Math.random() * chains.length)]
      });
    }
    
    return nfts;
  }
}