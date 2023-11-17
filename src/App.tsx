import { AppShell, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import MyFooter from './components/Layout/Footer';
import MyHeader from './components/Layout/Header';
import { cvcTestnet } from './configs/networks';
import { paypalOptions } from './configs/payment';
import { onError } from './helpers/contract-call';
import router from './routes';

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
            <BrowserRouter>
              <ModalsProvider>
                <AppShell
                  padding="md"
                  header={<MyHeader />}
                  footer={<MyFooter />}
                >
                  <Routes>
                    {router.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                  </Routes>
                </AppShell>
              </ModalsProvider>
            </BrowserRouter>
          </PayPalScriptProvider>
        </MantineProvider>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <Notifications className="pb-10" />
    </QueryClientProvider>
  );
}

export default App;
