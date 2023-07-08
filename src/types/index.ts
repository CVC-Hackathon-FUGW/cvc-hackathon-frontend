export interface Pool {
  APY: bigint;
  duration: bigint;
  poolId: bigint;
  tokenAddress: string;
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
  tokenAddress: string;
  state: boolean;
}
