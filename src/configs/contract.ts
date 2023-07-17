import { onError } from 'src/helpers/contract-call';
import abiMortgage from './abiMortgage.json';
import abiNft from './abiNftEnum.json';
import abiMarket from './abiNftMarket.json';
import abiCheckIn from './abiCheckIn.json';

export const addressMortgage = import.meta.env.VITE_CONTRACT_ADDRESS_MORTGAGE;
export const addressMarket = import.meta.env.VITE_CONTRACT_ADDRESS_MARKET;
export const addressCheckIn = import.meta.env.VITE_CONTRACT_ADDRESS_CHECK_IN;

export const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;

export const contractMortgage = {
  address: addressMortgage,
  abi: abiMortgage,
  onError,
};

export const contractMarket = {
  address: addressMarket,
  abi: abiMarket,
  onError,
};

export const contractCheckIn = {
  address: addressCheckIn,
  abi: abiCheckIn,
  onError,
};

export const borrowPrice = 1000000000000000n;

export { abiMortgage, abiNft, abiMarket, abiCheckIn };
