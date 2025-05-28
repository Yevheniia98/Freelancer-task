import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';
import CreateAccount from '@/views/CreateAccount.vue'; 
import LoginPage from '@/views/LoginPage.vue';
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

export default router;
