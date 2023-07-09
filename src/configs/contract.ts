import { onError } from 'src/helpers/contract-call';
import abiMortgage from './abiMortgage.json';
import abiNft from './abiNft.json';
import abiERC721Enumerable from './erc721enumerable.abi.json';

export const addressMortgage = import.meta.env.VITE_CONTRACT_ADDRESS_MORTGAGE;

export const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;

export const contractMortgage = {
  address: addressMortgage,
  abi: abiMortgage,
  onError,
};

export const borrowPrice = 1000000000000000n;

export { abiMortgage, abiNft, abiERC721Enumerable };
