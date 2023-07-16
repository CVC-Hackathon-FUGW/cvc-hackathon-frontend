import { AppShell, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { RouterProvider } from 'react-router-dom';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import MyHeader from './components/Layout/Header';
import { cvcTestnet } from './configs/networks';
import router from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ModalsProvider } from '@mantine/modals';
import { onError } from './helpers/contract-call';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { paypalOptions } from './configs/payment';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 500,
      onError,
    },
  },
});

const chains = [cvcTestnet];
const projectId: string = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
  queryClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <PayPalScriptProvider options={paypalOptions}>
            <ModalsProvider>
              <AppShell padding="md" header={<MyHeader />}>
                <RouterProvider router={router} />
              </AppShell>
            </ModalsProvider>
          </PayPalScriptProvider>
        </MantineProvider>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <Notifications />
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
