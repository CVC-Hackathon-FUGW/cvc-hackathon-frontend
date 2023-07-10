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
  currentOfferValue: string;
  currentOfferer: Address;
  sold: boolean;
}
