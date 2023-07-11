import { createBrowserRouter } from 'react-router-dom';
import HomePage from './Home';
import LendPage from './lend';
import OffersPage from './offers';
import BorrowPage from './borrow';
import LoansPage from './loans';
import Admin from './admin/Index';
import MarketplacePage from './marketplace';
import NftPage from './nft';
import NftDetails from 'src/components/Nft/NftDetails';
import MarketItem from './marketplace/MarketItem';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/lend',
    element: <LendPage />,
  },
  {
    path: '/offers',
    element: <OffersPage />,
  },
  {
    path: '/borrow',
    element: <BorrowPage />,
  },
  {
    path: '/loans',
    element: <LoansPage />,
  },
  {
    path: '/marketplace',
    element: <MarketplacePage />,
  },
  {
    path: '/marketplace/:itemId/details',
    element: <MarketItem />,
  },
  {
    path: '/nft/:id',
    element: <NftPage />,
  },
  {
    path: '/nft/:id/details',
    element: <NftDetails />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
]);

export default router;
