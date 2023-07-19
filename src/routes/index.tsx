import { createBrowserRouter } from 'react-router-dom';
import NftDetails from 'src/components/Nft/NftDetails';
import HomePage from './Home';
import Admin from './admin/Index';
import BorrowPage from './borrow';
import CheckIn from './checkIn';
import LendPage from './lend';
import LoansPage from './loans';
import MarketplacePage from './marketplace';
import MarketItem from './marketplace/MarketItem';
import NftPage from './nft';
import OffersPage from './offers';
import MarketplaceCollectionPage from './marketplaceCollection';
import SellerOnboarding from './seller-onboarding';

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
    path: '/marketplace/collection',
    element: <MarketplaceCollectionPage />,
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
  {
    path: '/check-in',
    element: <CheckIn />,
  },
  {
    path: '/seller-onboarding',
    element: <SellerOnboarding />,
  },
]);

export default router;
