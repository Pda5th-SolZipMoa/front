import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/main/MainPage';
import Signup from '../pages/home/Signup';
import Login from '../pages/home/Login';
import TradeMain from '../pages/property_detail/trade/TradeMain';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/main/',
    element: <MainPage />,
  },
  {
    path: '/property/trade',
    element: <TradeMain />,
  },
]);

export default AppRouter;
