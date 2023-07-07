import abimortgage from './abimortgage.json';

export const addressMortgage = import.meta.env.VITE_CONTRACT_ADDRESS_MORTGAGE;
export const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;

export const contractMortgage = {
  address: addressMortgage,
  abi: abimortgage,
};
