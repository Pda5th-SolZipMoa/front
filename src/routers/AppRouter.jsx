import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/main/MainPage';
import Signup from '../pages/home/Signup';
import Login from '../pages/home/Login';
import MyPage from '../pages/mypage/MyPage';
import DetailIndex from '../pages/property_detail/info/DetailIndex';
import TradeMain from '../pages/property_detail/trade/TradeMain';
import FormIndex from '../pages/property_create/FormIndex';
import RealEstatePage from '../pages/side_detail/RealEstatePage';

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
    path: '/mypage',
    element: <MyPage />,
  },
  {
    path: '/property_detail/info/:id',
    element: <DetailIndex />,
  },
  {
    path: '/property/:id/trade',
    element: <TradeMain />,
  },
  {
    path: '/property_create',
    element: <FormIndex />,
  },
  {
    path: '/property_sidedetail',
    element: <RealEstatePage />,
  },
]);

export default AppRouter;
