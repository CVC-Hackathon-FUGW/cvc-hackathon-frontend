import { Address } from 'viem';

export interface ContractPool {
  APY: bigint;
  duration: bigint;
  poolId: bigint;
  tokenAddress: `0x${string}`;
  totalPoolAmount: bigint;
  state: boolean;
  image?: string;
}

export interface ContractLoan {
  loanId: bigint;
  lender: string;
  borrower: string;
  amount: bigint;
  startTime: bigint;
  duration: bigint;
  tokenId: bigint;
  poolId: bigint;
  tokenAddress: `0x${string}`;
  state: boolean;
}

export interface Nft {
  nftContract?: Address;
  tokenId: bigint;
}

export interface ContractNft extends Nft {
  itemId?: bigint;
  seller?: Address;
  owner?: Address;
  price: bigint;
  isOfferable: boolean;
  acceptVisaPayment: boolean;
  currentOfferValue: bigint;
  currentOfferer?: Address;
  sold: boolean;
  isActive?: boolean;
  merchantId?: string;
}

export interface NftMetadata {
  dna: string;
  name: string;
  edition: number;
  description: string;
  image: string;
  date: number;
  compiler: string;
  attributes: Attribute[];
}

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface Collection {
  collection_id: number;
  collection_name: string;
  token_address: Address;
  image: string;
  is_active: boolean;
  volume: bigint;
}

export interface Pool {
  pool_id?: number;
  token_address?: Address;
  collection_name?: string;
  total_pool_amount?: bigint;
  apy?: bigint;
  duration?: bigint;
  state?: boolean;
  image?: string;
  is_active?: boolean;
}

export interface Loan
  extends Omit<
    Pool,
    'total_pool_amount' | 'apy' | 'collection_name' | 'image'
  > {
  loan_id?: number;
  lender?: Address;
  borrower?: Address;
  amount: bigint;
  start_time?: number;
  token_id?: number;
  created_at?: number;
  updated_at?: number;
}

export interface MarketItemData {
  item_id?: number;
  address?: Address;
  token_id?: number;
  seller?: string;
  owner?: string;
  price?: bigint;
  is_offerable?: boolean;
  accept_visa_payment?: boolean;
  current_offer_value?: bigint;
  current_offerer?: string;
  sold?: boolean;
  is_active?: boolean;
}
