export interface Transaction {
  id?: string;
  transactionHash?: string;
  title?: string;
  price?: number;
  seller?: string;
  buyer?: string;
  timestamp?: number; // Blockchain timestamp
  date?: Date; // For display
  status?: 'completed' | 'pending' | 'failed';
  blockNumber?: number;
  gasUsed?: number;
  // Add any other properties your blockchain transaction has
}