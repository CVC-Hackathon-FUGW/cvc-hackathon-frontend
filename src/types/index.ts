import { Address } from 'viem';

export interface Pool {
  APY: bigint;
  duration: bigint;
  poolId: bigint;
  tokenAddress: `0x${string}`;
  totalPoolAmount: bigint;
  state: boolean;
  image?: string;
}

export interface Loan {
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
  nftContract: Address;
  tokenId: bigint;
}

export interface MarketNft extends Nft {
  itemId: bigint;
  seller: Address;
  owner: Address;
  price: bigint;
  isOfferable: boolean;
  acceptVisaPayment: boolean;
  currentOfferValue: bigint;
  currentOfferer: Address;
  sold: boolean;
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
  token_address: string;
  image: string;
  is_active: boolean;
}
