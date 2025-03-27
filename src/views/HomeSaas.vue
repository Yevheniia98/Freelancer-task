<template>
  <div id="dashboard">
    <!-- No need to add HeaderSection here again -->
    <LeftMenu /> <!-- Only here -->
    <SearchBar />
    <CardsLine />
    <ReminderMeeting />
    <ChatSection />
    <TaxSection />
    <GranttChart />
  </div>
</template>

<script>
import LeftMenu from '../components/dashboard/LeftMenu.vue'; // Import HeaderSection here
import SearchBar from '../components/dashboard/SearchBar.vue'
import CardsLine from '../components/dashboard/CardsLine.vue'
import ReminderMeeting from '../components/dashboard/ReminderMeeting.vue';
import ChatSection from '@/components/dashboard/ChatSection.vue';
import TaxSection from '@/components/dashboard/TaxSection.vue';
import GranttChart from '@/components/dashboard/GranttChart.vue';


export default {
  name: 'HomeSaas',
  components: {
    LeftMenu,
    SearchBar,
    CardsLine,
    ReminderMeeting,
    ChatSection,
    TaxSection,
    GranttChart
  }
}
</script>

<style>
#dashboard {
  
  align-items: center; /* Prevents unnecessary stretching */
  justify-content: center;
  padding: 0;
  margin-top: 50px;
  margin-left: 50px;
  min-height: auto; /* Ensures no extra space */
}
</style>
