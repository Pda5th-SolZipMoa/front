import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/main/MainPage';
import Signup from '../pages/home/Signup';
import Login from '../pages/home/Login';
import DetailIndex from '../pages/property_detail/info/DetailIndex';


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
    path: '/property_detail/info/:id',
    element: <DetailIndex/>,
  }
]);

export default AppRouter;