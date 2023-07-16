import { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

export const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
export const paypalSecret = import.meta.env.VITE_PAYPAL_SECRET_KEY;
export const nftSellerPlanId = 'P-6SA80432GW616034VMS2EULA';

export const paypalOptions: ReactPayPalScriptOptions = {
  clientId,
  components: 'buttons',
  currency: 'USD',
  intent: 'subscription',
  vault: true,
};
