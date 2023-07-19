'use strict';

import axios from 'axios';
import { config } from 'dotenv';
config();

const createPartnerReferral = async () => {
  const accessToken = process.argv[2];
  const return_url = process.argv[3];
  console.log(accessToken, return_url);

  const res = await axios.post(
    'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals',
    {
      preferred_language_code: 'en-US',
      partner_config_override: {
        partner_logo_url: 'https://cvc-hackathon-frontend.web.app/logo.png',
        return_url: `${return_url}/seller-onboarding`,
        return_url_description:
          'Merchant onboarding has been completed. You will be redirected to the merchant’s website shortly.',
        show_add_credit_card: true,
      },
      tracking_id: 'cvc-hackathon-frontend',
      operations: [
        {
          operation: 'API_INTEGRATION',
          api_integration_preference: {
            rest_api_integration: {
              integration_method: 'PAYPAL',
              integration_type: 'THIRD_PARTY',
              third_party_details: {
                features: ['PAYMENT', 'REFUND'],
              },
            },
          },
        },
      ],
      products: ['EXPRESS_CHECKOUT'],
      legal_consents: [
        {
          type: 'SHARE_DATA_CONSENT',
          granted: true,
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.data;

  console.log(data);
};

createPartnerReferral();

// Path: scripts/create-partner-referral.mjs
// to run: node scripts/create-partner-referral.mjs <access_token> <return_url>
