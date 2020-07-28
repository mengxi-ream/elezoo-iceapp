import BasicLayout from '@/layouts/BasicLayout';
import UserLayout from '@/layouts/UserLayout';
import Vote from '@/pages/Vote';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Setting from '@/pages/Setting';
import VotePropose from '@/pages/VotePropose';

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
    children: [{ path: '/propose/:id', exact: true, component: VotePropose }],
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
