import BlankLayout from '@layouts/BlankLayout';
import MainLayout from '@layouts/MainLayout';

import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import PaymentPage from '@pages/PaymentPage';
import Register from '@pages/Register';
import ProductDetail from '@pages/ProductDetail';
import Orderings from '@pages/Orderings';
import ProductCreation from '@pages/ProductCreation';
import Profile from '@pages/Profile';
import ChangePassword from '@pages/ChangePassword';

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
    path: '/product/:id',
    name: 'Product Detail',
    protected: false,
    component: ProductDetail,
    layout: MainLayout,
    role: 'customer',
  },
  {
    path: '/product/:id/pay',
    name: 'Product Payment',
    protected: true,
    component: PaymentPage,
    layout: MainLayout,
    role: 'customer',
  },
  {
    path: '/orderings',
    name: 'Orderings',
    protected: true,
    component: Orderings,
    layout: MainLayout,
    role: '*',
  },
  {
    path: '/product-creation',
    name: 'Product Creation',
    protected: true,
    component: ProductCreation,
    layout: MainLayout,
    role: 'business',
  },
  {
    path: '/product-creation/:id',
    name: 'Product Creation Edit',
    protected: true,
    component: ProductCreation,
    layout: MainLayout,
    role: 'business',
  },
  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false, role: '*' },
];

export default routes;
