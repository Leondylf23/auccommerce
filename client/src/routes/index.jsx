import BlankLayout from '@layouts/BlankLayout';
import MainLayout from '@layouts/MainLayout';

import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import Register from '@pages/Register';
import Profile from '@pages/Profile';
import ItemDetail from '@pages/ItemDetail';
import MyBids from '@pages/MyBids';
import Payment from '@pages/Payment';
import MyBidDetail from '@pages/MyBidDetail';
import AuctionForm from '@pages/AuctionForm';
import MyAuctions from '@pages/MyAuctions';
import Orders from '@pages/Orders';

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
    path: '/my-bids',
    name: 'My Bids',
    protected: true,
    component: MyBids,
    layout: MainLayout,
    role: 'buyer',
  },
  {
    path: '/my-bids/:id',
    name: 'My Bid Detail',
    protected: true,
    component: MyBidDetail,
    layout: MainLayout,
    role: 'buyer',
  },
  {
    path: '/my-bids/:id/payment',
    name: 'Payment',
    protected: true,
    component: Payment,
    layout: MainLayout,
    role: 'buyer',
  },
  {
    path: '/create-auction',
    name: 'Create Aution',
    protected: true,
    component: AuctionForm,
    layout: MainLayout,
    role: 'seller',
  },
  {
    path: '/edit-auction/:id',
    name: 'Edit Aution',
    protected: true,
    component: AuctionForm,
    layout: MainLayout,
    role: 'seller',
  },
  {
    path: '/my-auction',
    name: 'My Aution',
    protected: true,
    component: MyAuctions,
    layout: MainLayout,
    role: 'seller',
  },
  {
    path: '/orders',
    name: 'Orders',
    protected: true,
    component: Orders,
    layout: MainLayout,
    role: 'seller',
  },
  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false, role: '*' },
];

export default routes;
