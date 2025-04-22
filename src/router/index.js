import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';
import CreateAccount from '@/views/CreateAccount.vue'; 
import LoginPage from '@/views/LoginPage.vue';
import PricingSection from '@/components/PricingSection.vue'; // ✅ Correct import
import CardPayment from '@/views/CardPayment.vue';
import HomeSaas from '@/views/HomeSaas.vue';
import ProjectSection from '@/views/ProjectSection.vue';
import ProjectTaskVue from '@/views/ProjectTaskVue.vue';
import ProjectCreate from '@/views/ProjectCreate.vue';
import ClientMain from '@/Clients Section/ClientMain.vue';
import CreateClient from '@/Clients Section/CreateClient.vue';
import MyTeam from '@/Clients Section/MyTeam.vue';
import InviteMember from '@/Invite member/InviteMember.vue';
import InviteEmail from '@/Invite member/InviteEmail.vue';
import InviteApp from '@/Invite member/InviteApp.vue';

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
  },

  { 
    path: '/projects',
    name: 'Projects',
    component: ProjectSection 
  }, 

  { 
    path: '/project-task',
    name: 'ProjectTask',
    component: ProjectTaskVue 
  },

  { 
    path: '/project-create',
    name: 'ProjectCreate',
    component: ProjectCreate 
  },

  {
    path: '/client-main',
    name: 'ClientMain',
    component: ClientMain,
  },

  {
    path: '/invite-member',
    name: 'InviteMember',
    component: InviteMember,
  },

  { 
    path: '/invite-email',
    name: 'InviteEmail',
    component: InviteEmail 
  },

  {
    path: '/invite-app',
    name: 'InviteApp',
    component: InviteApp,
  },

  {
    path: '/create-client',
    name: 'CreateClient',
    component: CreateClient,
  },

  {
    path: '/my-team',
    name: 'MyTeam',
    component: MyTeam,
  },



];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
