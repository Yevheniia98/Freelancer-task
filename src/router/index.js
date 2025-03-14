import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';
import CreateAccount from '@/views/CreateAccount.vue'; 
import LoginPage from '@/views/LoginPage.vue';
import PricingSection from '@/components/PricingSection.vue'; // ✅ Correct import
import CardPayment from '@/views/CardPayment.vue';
import HomeSaas from '@/views/HomeSaas.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
  },
  { 
    path: '/create-account',
    name: 'CreateAccount',
    component: CreateAccount,
  },
  { 
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  { 
    path: '/pricing',
    name: 'Pricing',
    component: PricingSection // ✅ Fixed the component reference
  },
  { 
    path: '/card-payment',
    name: 'CardPayment',
    component: CardPayment 
  },

  { 
    path: '/home-saas',
    name: 'HomeSaas',
    component: HomeSaas 
  } 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
