import BlankLayout from '@layouts/BlankLayout';
import MainLayout from '@layouts/MainLayout';

import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import Register from '@pages/Register';
import Profile from '@pages/Profile';
import ChangePassword from '@pages/ChangePassword';
import ItemDetail from '@pages/ItemDetail';
import MyBids from '@pages/MyBids';

const routes = [
  {
    path: '/',
    name: 'Home',
    protected: false,
    component: Home,
    layout: MainLayout,
    role: '*',
  },
  {
    path: '/login',
    name: 'Login',
    protected: false,
    component: Login,
    layout: BlankLayout,
    role: '*',
  },
  {
    path: '/profile',
    name: 'Profile',
    protected: true,
    component: Profile,
    layout: MainLayout,
    role: '*',
  },
  {
    path: '/profile/change-password',
    name: 'Profile',
    protected: true,
    component: ChangePassword,
    layout: MainLayout,
    role: '*',
  },
  {
    path: '/register',
    name: 'Register',
    protected: false,
    component: Register,
    layout: BlankLayout,
    role: '*',
  },
  {
    path: '/item/:id',
    name: 'Item Detail',
    protected: false,
    component: ItemDetail,
    layout: MainLayout,
    role: '*',
  },
  {
    path: '/mybids',
    name: 'My Bids',
    protected: true,
    component: MyBids,
    layout: MainLayout,
    role: '*',
  },
  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false, role: '*' },
];

export default routes;
