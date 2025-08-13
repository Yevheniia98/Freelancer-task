import { createRouter, createWebHistory } from 'vue-router';
import { apiUtils } from '@/services/api.js';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';
import CreateAccount from '@/views/CreateAccount.vue'; 
import Login from '@/views/Login.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import PricingSection from '@/components/PricingSection.vue'; // ✅ Correct import
import CardPayment from '@/views/CardPayment.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import ProjectSection from '@/views/ProjectSection.vue';
import ProjectTaskVue from '@/views/ProjectTaskVue.vue';
import ProjectCreate from '@/views/ProjectCreate.vue';
import ClientMain from '@/Clients Section/ClientMain.vue';
import CreateClient from '@/Clients Section/CreateClient.vue';
import MyTeam from '@/Clients Section/MyTeam.vue';
import InviteMember from '@/Invite member/InviteMember.vue';
import InviteEmail from '@/Invite member/InviteEmail.vue';
import InviteApp from '@/Invite member/InviteApp.vue';
import TaskDashboard from '@/Tasks/TaskDashboard.vue';
import FinanceDashboard from '@/Finance/FinanceDashboard.vue';
import CalendarSection from '@/Calendar/CalendarSection.vue';
import DesignTools from '@/Tool/DesignTools.vue';
import AccountSetting from '@/setting/AccountSetting.vue';
import PasswordSecurity from '@/setting/PasswordSecurity.vue';
import NotificationPage from '@/setting/NotificationPage.vue';
import DataExport from '@/setting/DataExport.vue';
import LogOut from '@/setting/LogOut.vue';
import SubscriptionPage from '@/setting/SubscriptionPage.vue';
import CustomizationPage from '@/setting/CustomizationPage.vue';
import SecurityPage from '@/setting/SecurityPage.vue';
import IntegretionPage from '@/setting/IntegretionPage.vue';
import BackUp from '@/setting/BackUp.vue';
import SupportPage from '@/setting/SupportPage.vue';

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
    component: Login,
  },
  { 
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  { 
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
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
    path: '/dashboard',
    name: 'DashboardPage',
    component: DashboardPage 
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

  {
    path: '/task-dashboard',
    name: 'TaskDashboard',
    component: TaskDashboard,
  },

  {
    path: '/finance-dashboard',
    name: 'FinanceDashboard',
    component: FinanceDashboard,
  },
   
  {
    path: '/calendar',
    name: 'CalendarSection',
    component: CalendarSection,
  },

  {
    path: '/tools',
    name: 'DesignTools',
    component: DesignTools,
  },

  {
    path: '/account',
    name: 'AccountSetting',
    component: AccountSetting,
  },

  {
    path: '/password1',
    name: 'PasswordSecurity',
    component: PasswordSecurity,
  },

  {
    path: '/notification',
    name: 'NotificationPage',
    component: NotificationPage,
  },

  { 
    path: '/data-export',
    name: 'DataExport',
    component: DataExport 
  },

  { 
    path: '/log-out',
    name: 'LogOut',
    component: LogOut 
  },

  { 
    path: '/sub',
    name: 'Subscription',
    component: SubscriptionPage 
  },

  { 
    path: '/custom',
    name: 'Customization',
    component: CustomizationPage 
  },

  { 
    path: '/secure',
    name: 'Security',
    component: SecurityPage 
  },

  { 
    path: '/integrate',
    name: 'Integration',
    component: IntegretionPage 
  },

  { 
    path: '/backup',
    name: 'BackUp',
    component: BackUp 
  },

  { 
    path: '/support',
    name: 'Support',
    component: SupportPage 
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guards for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = apiUtils.isAuthenticated();
  
  // Define routes that require authentication
  const protectedRoutes = [
    'DashboardPage', 'ProjectSection', 'ProjectTaskVue', 'ProjectCreate',
    'ClientMain', 'CreateClient', 'MyTeam', 'InviteMember', 'InviteEmail', 
    'InviteApp', 'TaskDashboard', 'FinanceDashboard', 'CalendarSection',
    'DesignTools', 'AccountSetting', 'PasswordSecurity', 'NotificationPage',
    'DataExport', 'LogOut', 'Subscription', 'Customization', 'Security',
    'Integration', 'BackUp', 'Support'
  ];
  
  // Define public routes (don't require authentication)
  const publicRoutes = ['Home', 'About', 'CreateAccount', 'Login', 'ForgotPassword', 'ResetPassword', 'PricingSection', 'CardPayment'];
  
  if (protectedRoutes.includes(to.name) && !isAuthenticated) {
    // Redirect to login if trying to access protected route without authentication
    next({ name: 'Login' });
  } else if (publicRoutes.includes(to.name) && isAuthenticated && to.name !== 'Home') {
    // If user is already authenticated and trying to access login/signup, redirect to dashboard
    // Exception: Allow access to Home page even when authenticated
    if (to.name === 'Login' || to.name === 'CreateAccount' || to.name === 'ForgotPassword' || to.name === 'ResetPassword') {
      next({ name: 'DashboardPage' });
    } else {
      next();
    }
  } else {
    next();
  }
});

// After each route change, clear browser history if user logged out
router.afterEach((to, from) => {
  if (to.name === 'Home' && from.name && !apiUtils.isAuthenticated()) {
    // Clear browser history when redirected to home after logout
    if (window.history.length > 1) {
      window.history.replaceState(null, '', '/');
    }
  }
});

export default router;
