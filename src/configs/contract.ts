import abiFile from './abi.json';

export const address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const abi = abiFile.abi;

export const contract = {
  address,
  abi,
};
