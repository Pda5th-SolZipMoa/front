import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/main/MainPage';
import Signup from '../pages/home/Signup';
import Login from '../pages/home/Login';

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
]);

export default AppRouter;
