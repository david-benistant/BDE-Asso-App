import { createBrowserRouter } from 'react-router-dom';
import Home from '@pages/Home/Home';
// import Profile from './components/Profile'
import NotFound from '@pages/NotFound/NotFound';
import Club from '@pages/Club/Club'
import ClubSettings from '@pages/Club/Settings/Settings';
import ClubMembers from '@pages/Club/Settings/Members';
import Calendar from "@pages/Calendar/Calendar"
import DangerZone from "@pages/Club/Settings/DangerZone"

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
        path: 'club/:id/event/:eventId',
        element: <Club />,
      },
      {
        path: 'club/:id/settings',
        element: <ClubSettings />,
      },
      {
        path: 'club/:id/danger',
        element: <DangerZone />,
      },
      {
        path: 'club/:id/members',
        element: <ClubMembers />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
    ],
  },
]);