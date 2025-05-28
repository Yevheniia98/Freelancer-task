<!-- ProjectSection.vue -->
<template>
  <v-app>
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
      
    <v-main class="bg-grey-lighten-4">
      <v-container
        fluid
        class="pa-4 pa-sm-6"
      >
        <v-row
          class="mb-4"
          no-gutters
        >
          <v-col
            cols="12"
            sm="6"
            class="mb-3 mb-sm-0"
          >
            <div class="text-h5 font-weight-bold">
              PROJECT LIST
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            class="d-flex justify-start justify-sm-end flex-wrap"
          >
            <v-btn 
              color="teal-darken-1" 
              class="mr-2 mb-2 mb-sm-0 flex-grow-1 flex-sm-grow-0"
              prepend-icon="mdi-plus"
              variant="flat"
              @click="navigateToProjectCreate"
            >
              Add New
            </v-btn>
              
            <v-menu>
              <template #activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="outlined"
                  color="grey-darken-1"
                  class="px-4 flex-grow-1 flex-sm-grow-0"
                >
                  Yesterday
                  <v-icon end>
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item value="today">
                  Today
                </v-list-item>
                <v-list-item value="yesterday">
                  Yesterday
                </v-list-item>
                <v-list-item value="week">
                  This Week
                </v-list-item>
                <v-list-item value="month">
                  This Month
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <!-- New Tasks Column -->
          <v-col
            cols="12"
            md="4"
            class="mb-6"
          >
            <v-card
              class="rounded-lg mb-6"
              color="grey-darken-3"
              elevation="1"
            >
              <v-card-title class="text-white pa-6">
                New Tasks
              </v-card-title>
            </v-card>

            <!-- Task Card Inline Definition -->
            <v-card 
              v-for="task in newTasks" 
              :key="task.id"
              class="rounded-lg mb-4 pa-4 pa-sm-6 task-card"
              :class="{ 'cursor-pointer': task.id === 1 }"
              elevation="1"
              @click="task.id === 1 ? $router.push('/project-task') : null"
            >
              <div class="d-flex align-center mb-4 flex-wrap">
                <v-avatar
                  size="40"
                  :color="task.iconBg"
                  class="mr-4 mb-2 mb-sm-0"
                >
                  <v-icon :color="task.iconColor">
                    {{ task.icon }}
                  </v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ task.title }}
                  </div>
                  <div class="text-body-2 text-grey">
                    {{ task.description }}
                  </div>
                </div>
              </div>
                
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-caption text-grey-darken-1">
                  {{ task.progress }} of {{ task.total }} tasks
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ Math.round((task.progress / task.total) * 100) }}%
                </div>
              </div>
                
              <v-progress-linear 
                :model-value="(task.progress / task.total) * 100"
                color="teal-darken-1"
                height="6"
                rounded
                class="mb-6"
              />
                
              <div class="d-flex justify-space-between align-center flex-wrap">
                <div class="d-flex mb-2 mb-sm-0">
                  <v-avatar 
                    v-for="memberId in task.teamMembers.slice(0, 3)" 
                    :key="memberId" 
                    size="28" 
                    class="ml-n2"
                    :style="{ zIndex: task.teamMembers.indexOf(memberId) }"
                  >
                    <v-img :src="getTeamMemberAvatar(memberId)" />
                  </v-avatar>
                    
                  <v-avatar 
                    v-if="task.teamMembers.length > 3" 
                    size="28" 
                    color="grey-lighten-1"
                    class="ml-n2"
                    :style="{ zIndex: 3 }"
                  >
                    <span class="text-caption">+{{ task.teamMembers.length - 3 }}</span>
                  </v-avatar>
                </div>
                  
                <div class="d-flex flex-column align-end">
                  <div class="text-caption text-grey-darken-1">
                    Due date
                  </div>
                  <div class="text-caption font-weight-medium">
                    {{ task.date }}
                  </div>
                </div>
              </div>
                
              <div class="d-flex justify-space-between align-center mt-4 flex-wrap">
                <v-btn
                  variant="text"
                  size="small"
                  color="grey-darken-1"
                  class="mb-2 mb-sm-0"
                >
                  <v-icon
                    size="small"
                    class="mr-1"
                  >
                    mdi-comment-outline
                  </v-icon>
                  Comments
                </v-btn>
                  
                <div class="text-caption text-grey-darken-2">
                  {{ task.lastUpdate }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- In Progress Column -->
          <v-col
            cols="12"
            md="4"
            class="mb-6"
          >
            <v-card
              class="rounded-lg mb-6"
              color="grey-darken-3"
              elevation="1"
            >
              <v-card-title class="text-white pa-6">
                In progress
              </v-card-title>
            </v-card>

            <!-- Task Card Inline Definition -->
            <v-card 
              v-for="task in inProgressTasks" 
              :key="task.id"
              class="rounded-lg mb-4 pa-4 pa-sm-6 task-card"
              elevation="1"
            >
              <div class="d-flex align-center mb-4 flex-wrap">
                <v-avatar
                  size="40"
                  :color="task.iconBg"
                  class="mr-4 mb-2 mb-sm-0"
                >
                  <v-icon :color="task.iconColor">
                    {{ task.icon }}
                  </v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ task.title }}
                  </div>
                  <div class="text-body-2 text-grey">
                    {{ task.description }}
                  </div>
                </div>
              </div>
                
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-caption text-grey-darken-1">
                  {{ task.progress }} of {{ task.total }} tasks
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ Math.round((task.progress / task.total) * 100) }}%
                </div>
              </div>
                
              <v-progress-linear 
                :model-value="(task.progress / task.total) * 100"
                color="teal-darken-1"
                height="6"
                rounded
                class="mb-6"
              />
                
              <div class="d-flex justify-space-between align-center flex-wrap">
                <div class="d-flex mb-2 mb-sm-0">
                  <v-avatar 
                    v-for="memberId in task.teamMembers.slice(0, 3)" 
                    :key="memberId" 
                    size="28" 
                    class="ml-n2"
                    :style="{ zIndex: task.teamMembers.indexOf(memberId) }"
                  >
                    <v-img :src="getTeamMemberAvatar(memberId)" />
                  </v-avatar>
                    
                  <v-avatar 
                    v-if="task.teamMembers.length > 3" 
                    size="28" 
                    color="grey-lighten-1"
                    class="ml-n2"
                    :style="{ zIndex: 3 }"
                  >
                    <span class="text-caption">+{{ task.teamMembers.length - 3 }}</span>
                  </v-avatar>
                </div>
                  
                <div class="d-flex flex-column align-end">
                  <div class="text-caption text-grey-darken-1">
                    Due date
                  </div>
                  <div class="text-caption font-weight-medium">
                    {{ task.date }}
                  </div>
                </div>
              </div>
                
              <div class="d-flex justify-space-between align-center mt-4 flex-wrap">
                <v-btn
                  variant="text"
                  size="small"
                  color="grey-darken-1"
                  class="mb-2 mb-sm-0"
                >
                  <v-icon
                    size="small"
                    class="mr-1"
                  >
                    mdi-comment-outline
                  </v-icon>
                  Comments
                </v-btn>
                  
                <div class="text-caption text-grey-darken-2">
                  {{ task.lastUpdate }}
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Completed Column -->
          <v-col
            cols="12"
            md="4"
            class="mb-6"
          >
            <v-card
              class="rounded-lg mb-6"
              color="grey-darken-3"
              elevation="1"
            >
              <v-card-title class="text-white pa-6">
                Completed
              </v-card-title>
            </v-card>

            <detailed-task-card 
              v-for="task in completedTasks"
              :key="task.id"
              :task="task"
              :member-avatars="memberAvatars"
              class="task-card"
            />
          </v-col>
        </v-row>

        <v-row
          justify="center"
          class="mt-8"
        >
          <v-col
            cols="12"
            class="d-flex justify-center flex-wrap"
          >
            <v-btn
              variant="text"
              class="mx-1 mb-2"
            >
              Previous
            </v-btn>
            <v-btn 
              v-for="page in 4" 
              :key="page" 
              :color="page === 1 ? 'teal-darken-1' : ''" 
              :variant="page === 1 ? 'flat' : 'text'"
              class="mx-1 mb-2"
            >
              {{ page }}
            </v-btn>
            <v-btn
              color="teal-darken-1"
              variant="flat"
              class="mx-1 mb-2"
            >
              Next
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LeftMenu from '@/dashboard/LeftMenu.vue';
 import SearchBar from '@/dashboard/SearchBar.vue';
import DetailedTaskCard from '@/components/DetailedTaskCard.vue';

export default defineComponent({
  name: 'ProjectSection',
  components: {
    LeftMenu,
    SearchBar,
    DetailedTaskCard
  },
  setup() {
    const router = useRouter();
    
    // Responsive state
    const isMobile = ref(false);
    const isTablet = ref(false);
    
    // Update responsive state based on screen size
    const updateResponsiveState = () => {
      isMobile.value = window.innerWidth < 600;
      isTablet.value = window.innerWidth >= 600 && window.innerWidth < 960;
    };
    
    // Window resize handler
    const handleResize = () => {
      updateResponsiveState();
    };
    
    // Member avatars mapping
    const memberAvatars = {
      1: 'https://randomuser.me/api/portraits/men/1.jpg',
      2: 'https://randomuser.me/api/portraits/women/2.jpg',
      3: 'https://randomuser.me/api/portraits/men/3.jpg',
      4: 'https://randomuser.me/api/portraits/women/4.jpg'
    };
    
    // Lifecycle hooks
    onMounted(() => {
      // Initialize window resize listener
      window.addEventListener('resize', handleResize);
      updateResponsiveState();
      
      // Remove event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });
    
    const menuItems = [
      { icon: 'mdi-view-dashboard-outline' },
      { icon: 'mdi-folder-outline' },
      { icon: 'mdi-account-group-outline' },
      { icon: 'mdi-file-document-outline' },
      { icon: 'mdi-chart-line' },
      { icon: 'mdi-calendar' },
      { icon: 'mdi-puzzle-outline' },
      { icon: 'mdi-cog-outline' },
    ];

    const teamMembers = [
      { id: 1, name: 'John', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { id: 2, name: 'Sarah', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { id: 3, name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { id: 4, name: 'Lisa', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    ];
    
    const newTasks = [
      {
        id: 1,
        route: "/project-task",
        title: 'Slack brand logo design',
        description: 'Create a brand logo design for admin',
        icon: 'mdi-pound',
        iconBg: 'pink-lighten-4',
        iconColor: 'pink-darken-1',
        progress: 22,
        total: 56,
        teamMembers: [1, 2, 3],
        date: '10 Jul, 2024',
        lastUpdate: '3hrs ago'
      },
      {
        id: 2,
        title: 'Redesign - Landing page',
        description: 'Make new design system. Improve ...',
        icon: 'mdi-penguin',
        iconBg: 'amber-lighten-4',
        iconColor: 'amber-darken-1',
        progress: 10,
        total: 20,
        teamMembers: [2, 3, 4],
        date: '19 Jul, 2024',
        lastUpdate: '8 May'
      },
      {
        id: 3,
        title: 'Chat Application',
        description: 'Create a Chat application for business ...',
        icon: 'mdi-paypal',
        iconBg: 'blue-lighten-4',
        iconColor: 'blue-darken-1',
        progress: 5,
        total: 36,
        teamMembers: [1, 2, 4],
        date: '2 Aug, 2024',
        lastUpdate: '5hrs ago'
      },
      {
        id: 4,
        title: 'Project App',
        description: 'Create a responsive design for 2 devices',
        icon: 'mdi-diamond-stone',
        iconBg: 'green-lighten-4',
        iconColor: 'green-darken-1',
        progress: 35,
        total: 42,
        teamMembers: [1, 3, 4],
        date: '9 Jun, 2024',
        lastUpdate: '1 June'
      }
    ];
    
    const inProgressTasks = [
      {
        id: 5,
        title: 'Slack brand logo design',
        description: 'Create a brand logo design for admin',
        icon: 'mdi-pound',
        iconBg: 'pink-lighten-4',
        iconColor: 'pink-darken-1',
        progress: 22,
        total: 56,
        teamMembers: [1, 2, 3],
        date: '10 Jul, 2024',
        lastUpdate: '3hrs ago'
      },
      {
        id: 6,
        title: 'Redesign - Landing page',
        description: 'Make new design system. Improve ...',
        icon: 'mdi-penguin',
        iconBg: 'amber-lighten-4',
        iconColor: 'amber-darken-1',
        progress: 10,
        total: 20,
        teamMembers: [2, 3, 4],
        date: '19 Jul, 2024',
        lastUpdate: '8 May'
      },
      {
        id: 7,
        title: 'Chat Application',
        description: 'Create a Chat application for business ...',
        icon: 'mdi-paypal',
        iconBg: 'blue-lighten-4',
        iconColor: 'blue-darken-1',
        progress: 5,
        total: 36,
        teamMembers: [1, 2, 4],
        date: '2 Aug, 2024',
        lastUpdate: '5hrs ago'
      },
      {
        id: 8,
        title: 'Project App',
        description: 'Create a responsive design for 2 devices',
        icon: 'mdi-diamond-stone',
        iconBg: 'green-lighten-4',
        iconColor: 'green-darken-1',
        progress: 35,
        total: 42,
        teamMembers: [1, 3, 4],
        date: '9 Jun, 2024',
        lastUpdate: '1 June'
      }
    ];
    
    const completedTasks = [
      {
        id: 9,
        title: 'Multipurpose landing template',
        status: 'in progress',
        deadline: '18 Oct, 2024',
        teamMembers: [1, 2, 3, 4],
        progress: 56
      },
      {
        id: 10,
        title: 'Dashboard UI',
        status: 'completed',
        deadline: '1 Sep, 2024',
        teamMembers: [1, 2, 3, 4],
        progress: 100
      },
      {
        id: 11,
        title: 'Vector Images',
        status: 'in progress',
        deadline: '1 Sep, 2024',
        teamMembers: [1, 2, 3, 4],
        progress: 75
      },
      {
        id: 12,
        title: 'Authentication',
        status: 'in progress',
        deadline: '2 Dec, 2024',
        teamMembers: [1, 4],
        progress: 15
      }
    ];
    
    // Methods
    const getTeamMemberAvatar = (memberId) => {
      const member = teamMembers.find(m => m.id === memberId);
      return member ? member.avatar : '';
    };
    
    const handleTaskClick = (task) => {
      if (task.id === 1) {
        router.push('/project-task');
      }
    };
    
    const navigateToProjectCreate = () => {
      router.push({ name: 'ProjectCreate' });
    };

    const getStatusColor = (status) => {
      const colors = {
        'new': 'blue',
        'planning': 'indigo',
        'in progress': 'amber-darken-1',
        'completed': 'teal-darken-1',
        'on hold': 'grey'
      };
      return colors[status.toLowerCase()] || 'blue';
    };
    
    const getProgressColor = (progress) => {
      if (progress >= 75) return 'teal-darken-1';
      if (progress >= 50) return 'amber-darken-1';
      if (progress >= 25) return 'orange';
      return 'red';
    };

    return {
      isMobile,
      isTablet,
      menuItems,
      teamMembers,
      newTasks,
      inProgressTasks,
      completedTasks,
      memberAvatars,
      getTeamMemberAvatar,
      handleTaskClick,
      navigateToProjectCreate,
      getStatusColor,
      getProgressColor
    };
  }
});
  </script>
  
  <style scoped>

  :deep(.left-menu-component),
  :deep(.v-navigation-drawer) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    height: 100vh !important;
    z-index: 999 !important;
    overflow-y: hidden !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
 :deep(.v-navigation-drawer--rail) {
    width: 72px ;
  }
  
  :deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
    width: 240px !important;
  }

  .task-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Responsive Typography */
@media (max-width: 600px) {
  .text-h5 {
    font-size: 1.25rem !important;
  }
  
  .text-subtitle-1 {
    font-size: 1rem !important;
  }
  
  .text-body-2 {
    font-size: 0.875rem !important;
  }
  
  .text-caption {
    font-size: 0.75rem !important;
  }
  
  .v-card-title {
    font-size: 1.1rem !important;
  }
}

/* Improved spacing for mobile */
@media (max-width: 600px) {
  .pa-sm-6 {
    padding: 24px !important;
  }
  
  .v-col {
    padding: 8px !important;
  }
  
  .mb-6 {
    margin-bottom: 16px !important;
  }
}

/* Fix button layout on mobile */
@media (max-width: 600px) {
  .flex-grow-1 {
    flex-grow: 1 !important;
  }
  
  .justify-sm-end {
    justify-content: flex-end !important;
  }
  
  .justify-start {
    justify-content: flex-start !important;
  }
}

/* Responsive columns */
@media (max-width: 960px) and (min-width: 600px) {
  .v-col[class*="md-4"] {
    flex: 0 0 50% !important;
    max-width: 50% !important;
  }
}

/* Improve task card hover on mobile */
@media (max-width: 600px) {
  .task-card:hover {
    transform: translateY(-2px);
  }
}

/* Improve avatar visibility */
.v-avatar.ml-n2 {
  box-shadow: 0 0 0 2px white;
}

/* Progress bar style improvements */
.v-progress-linear {
  border-radius: 4px !important;
}

/* Better button spacing in flex layouts */
.flex-wrap .v-btn {
  margin-right: 4px;
  margin-bottom: 4px;
}

/* Add shadow to cards for better depth */
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

/* Improve task card padding on mobile */
@media (max-width: 600px) {
  .pa-4 {
    padding: 16px !important;
  }
}

/* Fix text overflow issues */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
  </style>