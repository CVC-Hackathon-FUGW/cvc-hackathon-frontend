export interface Pool {
  APY: bigint;
  duration: bigint;
  poolId: bigint;
  tokenAddress: string;
  totalPoolAmount: bigint;
  state: boolean;
  image?: string;
}
