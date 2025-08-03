<!--DetailedTaskCard-->
<template>
  <v-card
    class="rounded-lg mb-4 pa-4 pa-sm-6"
    elevation="1"
  >
    <div class="d-flex justify-space-between align-center mb-4 flex-wrap">
      <div
        class="text-subtitle-1 font-weight-bold mb-2 mb-sm-0 text-truncate pr-2"
        style="max-width: 100%;"
      >
        {{ task.title }}
      </div>
      <v-chip 
        :color="getStatusColor(task.status)" 
        size="small" 
        class="text-capitalize"
      >
        {{ task.status }}
      </v-chip>
    </div>
      
    <div class="d-flex align-center mb-5">
      <v-icon
        size="small"
        color="grey-darken-1"
        class="mr-2"
      >
        mdi-calendar-outline
      </v-icon>
      <span class="text-caption text-grey-darken-1">{{ task.deadline }}</span>
    </div>
      
    <div class="d-flex mb-5">
      <v-avatar 
        v-for="(memberId, index) in task.teamMembers.slice(0, 4)" 
        :key="memberId" 
        size="32" 
        class="ml-n2"
        :style="{ zIndex: index }"
      >
        <v-img :src="memberAvatars[memberId] || 'https://randomuser.me/api/portraits/lego/1.jpg'" />
      </v-avatar>
        
      <v-avatar 
        v-if="task.teamMembers.length > 4" 
        size="32" 
        color="grey-lighten-1"
        class="ml-n2"
        :style="{ zIndex: 4 }"
      >
        <span class="text-caption">+{{ task.teamMembers.length - 4 }}</span>
      </v-avatar>
    </div>
      
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="text-caption text-grey-darken-1">
        Progress
      </div>
      <div class="text-caption font-weight-medium">
        {{ task.progress }}%
      </div>
    </div>
      
    <v-progress-linear 
      :model-value="task.progress"
      :color="getProgressColor(task.progress)"
      height="6"
      rounded
      class="mb-3"
    />
      
    <div class="d-flex justify-end mt-4">
      <v-btn
        icon
        variant="text"
        size="small"
        class="mr-2"
      >
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn
        icon
        variant="text"
        size="small"
      >
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>
  
  <script>
  
export default {
  name: 'DetailedTaskCard',
  props: {
    task: {
      type: Object,
      required: true
    },
    memberAvatars: {
      type: Object,
      default: () => ({
        1: 'https://randomuser.me/api/portraits/men/1.jpg',
        2: 'https://randomuser.me/api/portraits/women/2.jpg',
        3: 'https://randomuser.me/api/portraits/men/3.jpg',
        4: 'https://randomuser.me/api/portraits/women/4.jpg'
      })
    }
  },
  methods: {
    getStatusColor(status) {
      const colors = {
        'new': 'blue',
        'planning': 'indigo',
        'in progress': 'amber-darken-1',
        'completed': 'teal-darken-1',
        'on hold': 'grey'
      };
      return colors[status.toLowerCase()] || 'blue';
    },
    getProgressColor(progress) {
      if (progress >= 75) return 'teal-darken-1';
      if (progress >= 50) return 'amber-darken-1';
      if (progress >= 25) return 'orange';
      return 'red';
    }
  }
}
  </script>