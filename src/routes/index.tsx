import { RouteProps } from 'react-router-dom';
import NftDetails from 'src/components/Nft/NftDetails';
import HomePage from './Home';
import Admin from './admin/Index';
import BorrowPage from './borrow';
import Profile from './profile';
import LendPage from './lend';
import LoansPage from './loans';
import MarketplacePage from './marketplace';
import MarketItem from './marketplace/MarketItem';
import MarketplaceCollectionPage from './marketplaceCollection';
import NftPage from './nft';
import OffersPage from './offers';
import SellerOnboarding from './seller-onboarding';
import BoxPage from './box';
import BoxItem from './box/BoxItem';
import ProjectPage from './projects';
import InvestmentsPage from './investments';

const router: RouteProps[] = [
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
    element: <MarketplaceCollectionPage />,
  },
  {
    path: '/marketplace/collection/:collectionId',
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
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/seller-onboarding',
    element: <SellerOnboarding />,
  },
  {
    path: '/box',
    element: <BoxPage />,
  },
  {
    path: '/box/:itemId',
    element: <BoxItem />,
  },
  {
    path: '/investments',
    element: <InvestmentsPage />,
  },
  {
    path: '/projects',
    element: <ProjectPage />,
  },
  // {
  //   path: '/projects/:itemId',
  //   element: <BoxItem />,
  // },
];

export default router;
