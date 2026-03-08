export interface NFT {
  id: string;
  name: string;
  image: string;
  creator: string;
  collection: string;
  tokenId: number;
  currentPrice: number;
  floorPrice: number;
  priceChange24h: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description?: string;
  owner?: string;
  contractAddress?: string;
  chain?: 'Ethereum' | 'Polygon' | 'Solana' | 'Binance';
}



export interface NFTTransaction {
  id: string;
  nftId: string;
  from: string;
  to: string;
  price: number;
  timestamp: Date;
  transactionHash: string;
}