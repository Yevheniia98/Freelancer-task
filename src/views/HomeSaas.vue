<template>
  <v-app>
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
  </v-app>
</template>

<script>
import LeftMenu from '@/components/dashboard/LeftMenu.vue';
import SearchBar from '@/components/dashboard/SearchBar.vue';
import CardsLine from '@/components/dashboard/CardsLine.vue';
import ReminderMeeting from '@/components/dashboard/ReminderMeeting.vue';
import ChatSection from '@/components/dashboard/ChatSection.vue';
import TaxSection from '@/components/dashboard/TaxSection.vue';
import GranttChart from '@/components/dashboard/GranttChart.vue';

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