import { createBrowserRouter } from 'react-router-dom';
import HomePage from './Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/hello',
    element: <div>Hello world!</div>,
  },
]);

export default router;
