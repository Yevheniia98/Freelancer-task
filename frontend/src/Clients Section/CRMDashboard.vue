<template>
  <div class="crm-dashboard">
    <h1>CRM Dashboard</h1>
    
    <v-tabs v-model="activeTab" color="primary">
      <v-tab value="clients">Clients</v-tab>
      <v-tab value="communications">Communications</v-tab>
      <v-tab value="deals">Deals</v-tab>
      <v-tab value="invoices">Invoices</v-tab>
      <v-tab value="notes">Notes</v-tab>
    </v-tabs>

    <v-tab-window v-model="activeTab">
      <v-tab-window-item value="clients">
        <ClientsSection />
      </v-tab-window-item>
      
      <v-tab-window-item value="communications">
        <CommunicationsSection />
      </v-tab-window-item>
      
      <v-tab-window-item value="deals">
        <DealsSection />
      </v-tab-window-item>
      
      <v-tab-window-item value="invoices">
        <InvoicesSection />
      </v-tab-window-item>
      
      <v-tab-window-item value="notes">
        <NotesSection />
      </v-tab-window-item>
    </v-tab-window>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClientsSection from './CRM/ClientsSection.vue'
import CommunicationsSection from './CRM/CommunicationsSection.vue'
import DealsSection from './CRM/DealsSection.vue'
import InvoicesSection from './CRM/InvoicesSection.vue'
import NotesSection from './CRM/NotesSection.vue'

const activeTab = ref('clients')
</script>

<style scoped>
.crm-dashboard {
  padding: 20px;
}
</style>