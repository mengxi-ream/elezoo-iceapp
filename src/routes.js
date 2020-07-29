import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import Vote from '@/pages/Vote';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Setting from '@/pages/Setting';
import VoteNotStarted from '@/pages/VoteNotStarted';
import VotePropose from '@/pages/VotePropose';
import VoteVote from '@/pages/VoteVote';

const routerConfig = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/register',
        component: Register,
      },
      {
        path: '/',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/vote',
    component: BasicLayout,
    children: [
      { path: '/notstarted/:id', exact: true, component: VoteNotStarted },
      { path: '/proposing/:id', exact: true, component: VotePropose },
      { path: '/voting/:id', exact: true, component: VoteVote },
    ],
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/setting',
        component: Setting,
      },
      {
        path: '/',
        component: Vote,
      },
    ],
  },
];
export default routerConfig;
