import { notifications } from '@mantine/notifications';
import abimortgage from './abimortgage.json';

export const addressMortgage = import.meta.env.VITE_CONTRACT_ADDRESS_MORTGAGE;
export const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;

export const contractMortgage = {
  address: addressMortgage,
  abi: abimortgage,
  onError: (error: any) =>
    notifications.show({
      title: error.name,
      message: error.message,
      color: 'red',
    }),
};
