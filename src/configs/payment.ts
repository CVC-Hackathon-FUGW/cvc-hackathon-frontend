import { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

export const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
export const paypalSecret = import.meta.env.VITE_PAYPAL_SECRET_KEY;
export const sellerRedirectUrl = import.meta.env.VITE_SELLER_REDIRECT_URL;
export const paypalAuthorization = import.meta.env.VITE_PAYPAL_AUTHORIZATION;

export const paypalOptions: ReactPayPalScriptOptions = {
  clientId,
  components: 'buttons,marks',
  currency: 'USD',
  intent: 'subscription',
  vault: true,
};

import axios from 'axios';

export const getAccessToken = async () => {
  const res = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    {
      grant_type: 'client_credentials',
      ignoreCache: 'true',
      return_authn_schemes: 'true',
      return_client_metadata: 'true',
      return_unconsented_scopes: 'true',
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${paypalAuthorization}`,
      },
    }
  );

  const data = await res.data;
  console.log(data.access_token);
  return data;
};
