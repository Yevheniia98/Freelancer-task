<template>
  <div id="dashboard">
    <!-- No need to add HeaderSection here again -->
    <LeftMenu /> <!-- Only here -->
    <SearchBar />
    <CardsLine />
    <ReminderMeeting />
  </div>
</template>

<script>
import LeftMenu from '../components/dashboard/LeftMenu.vue'; // Import HeaderSection here
import SearchBar from '../components/dashboard/SearchBar.vue'
import CardsLine from '../components/dashboard/CardsLine.vue'
import ReminderMeeting from '../components/dashboard/ReminderMeeting.vue';


export default {
  name: 'HomeSaas',
  components: {
    LeftMenu,
    SearchBar,
    CardsLine,
    ReminderMeeting,
    
  }
}
</script>

<style>
#dashboard {
  
  align-items: flex-start; /* Prevents unnecessary stretching */
  justify-content: space-between;
  padding: 0;
  margin-top: 50px;
  min-height: auto; /* Ensures no extra space */
}
</style>
