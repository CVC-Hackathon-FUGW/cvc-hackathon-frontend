import { MarketNft } from 'src/components/Marketplace/types';
import { ContractNft } from 'src/types';
import { zeroAddress } from 'viem';

export const contractToMarket = (contractItem: ContractNft): MarketNft => {
  const {
    acceptVisaPayment,
    currentOfferValue = 0n,
    currentOfferer = zeroAddress,
    isOfferable,
    nftContract,
    owner = zeroAddress,
    price,
    seller,
    sold = false,
    tokenId,
  } = contractItem;

  return {
    accept_visa_payment: acceptVisaPayment,
    is_offerable: isOfferable,
    price: price,
    address: nftContract,
    current_offer_value: currentOfferValue,
    current_offerer: currentOfferer,
    owner,
    seller,
    token_id: tokenId,
    sold,
  };
};

export const marketToContract = (marketItem: MarketNft): ContractNft => {
  const {
    accept_visa_payment,
    is_offerable,
    price,
    address,
    current_offer_value,
    current_offerer,
    owner,
    seller,
    token_id,
    sold,
  } = marketItem;

  return {
    acceptVisaPayment: accept_visa_payment,
    currentOfferValue: current_offer_value,
    isOfferable: is_offerable,
    price,
    sold,
    tokenId: token_id,
    currentOfferer: current_offerer,
    owner,
    seller,
    nftContract: address,
  };
};
