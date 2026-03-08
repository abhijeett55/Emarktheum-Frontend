export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  marketCap?: number;
  volume?: number;
}
