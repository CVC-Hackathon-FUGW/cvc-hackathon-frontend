import { createBrowserRouter } from 'react-router-dom';
import HomePage from './Home';
import LendPage from './lend';
import OffersPage from './offers';
import BorrowPage from './borrow';
import LoansPage from './loans';

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
]);

export default router;
