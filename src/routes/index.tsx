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
  {
    path: '/test-firebase',
    element: (
      <div>
        <img
          alt="test"
          src="https://firebasestorage.googleapis.com/v0/b/cvc-hackathon-frontend.appspot.com/o/public%2F360161843_5575879599181195_2087333185588283944_n.png?alt=media&token=33c5bfb7-98fc-4f10-aaaf-bc6695a6b4eb"
        />
      </div>
    ),
  },
]);

export default router;
