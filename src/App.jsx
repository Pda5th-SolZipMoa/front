import { RouterProvider } from 'react-router-dom';
import AppRouter from './routers/AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <RouterProvider router={AppRouter} />
    </>
  );
}

export default App;
