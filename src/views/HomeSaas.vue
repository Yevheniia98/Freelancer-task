<template>
  <LeftMenu />
  <v-main class="main-content">
    <div class="dashboard-container">
      <SearchBar />
      <CardsLine />
      <ReminderMeeting />
      <ChatSection />
      <TaxSection />
      <GranttChart />
    </div>
  </v-main>
</template>

<script>
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';
import CardsLine from '@/dashboard/CardsLine.vue';
import ReminderMeeting from '@/dashboard/ReminderMeeting.vue';
import ChatSection from '@/dashboard/ChatSection.vue';
import TaxSection from '@/dashboard/TaxSection.vue';
import GranttChart from '@/dashboard/GranttChart.vue';

export default {
  name: 'HomeSaasLayout',
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
.main-content {
  padding-left: 80px !important; /* Width of collapsed sidebar */
}

.dashboard-container {
  padding: 20px;
}

/* Ensure the app takes full height */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Make sure v-app fills the viewport */
.v-application {
  min-height: 100vh;
}
</style>