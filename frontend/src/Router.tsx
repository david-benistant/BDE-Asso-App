import { createBrowserRouter } from 'react-router-dom';
import Home from '@pages/Home/Home';
// import Profile from './components/Profile'
import NotFound from '@pages/NotFound/NotFound';
import Club from '@pages/Club/Club'
import { ClubSettings } from '@pages/Club/Settings/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    // element: <Layout />, // Le layout contient la navigation commune
    errorElement: <NotFound />, // Page d'erreur 404
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'club/:id',
        element: <Club />,
      },
      {
        path: 'club/:id/settings',
        element: <ClubSettings />,
      },
    ],
  },
]);