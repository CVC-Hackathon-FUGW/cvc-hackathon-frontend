import { Address } from 'viem';

export interface ListNftContractParams {
  nftContract?: Address;
  tokenId?: bigint;
  price: string;
  isVisaAccepted: boolean;
  isOfferable: boolean;
}

export interface MarketNft {
  address?: Address;
  token_id: bigint;
  seller?: Address;
  owner?: Address;
  price: bigint;
  is_offerable: boolean;
  accept_visa_payment: boolean;
  current_offer_value: bigint;
  current_offerer?: Address;
  sold: boolean;
  item_id?: bigint;
  is_active?: boolean;
}
