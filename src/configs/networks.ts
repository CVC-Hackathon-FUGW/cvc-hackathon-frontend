import { Chain } from 'wagmi';

export const cvcTestnet = {
  id: 5555,
  name: 'CVC-Testnet',
  testnet: true,
  network: 'cvc-testnet',
  nativeCurrency: {
    name: 'CVC-Testnet',
    symbol: 'XCR',
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: 'CVC-Testnet Explorer',
      url: 'https://testnet.cvcscan.com',
    },
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-kura.cross.technology'],
    },
    public: {
      http: ['https://rpc-kura.cross.technology'],
    },
  },
} as const satisfies Chain;
