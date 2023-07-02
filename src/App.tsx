import { AppShell } from '@mantine/core';
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

const chains = [cvcTestnet];
const projectId: string = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <AppShell padding="md" header={<MyHeader />}>
          <RouterProvider router={router} />
        </AppShell>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <Notifications />
    </>
  );
}

export default App;
