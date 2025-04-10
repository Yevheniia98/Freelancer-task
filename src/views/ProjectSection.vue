<!-- ProjectSection.vue -->
<template>
  <div>
    <v-app>
        <LeftMenu />
      <v-navigation-drawer
        color="teal-darken-4"
        permanent
        width="65"
      >
        <v-list
          class="d-flex flex-column align-center pa-0"
          nav
        >
          <v-list-item class="mb-2">
            <v-avatar
              color="teal-darken-4"
              class="my-2"
            >
              <span class="text-h6 text-white">FT</span>
            </v-avatar>
          </v-list-item>
            
          <v-list-item
            v-for="item in menuItems"
            :key="item.icon"
            class="my-1"
          >
            <v-btn
              icon
              variant="text"
              color="white"
            >
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </v-list-item>
            
          <v-spacer />
            
          <v-list-item
            v-for="person in teamMembers"
            :key="person.id"
            class="my-1"
          >
            <v-avatar size="36">
              <v-img :src="person.avatar" />
            </v-avatar>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-main class="bg-grey-lighten-4">
        <v-container
          fluid
          class="pa-6"
        >
          <v-row
            class="mb-4"
            no-gutters
          >
            <v-col cols="6">
              <div class="text-h5 font-weight-bold">
                PROJECT LIST
              </div>
            </v-col>
            <v-col
              cols="6"
              class="d-flex justify-end"
            >
              <v-btn 
                color="teal-darken-1" 
                class="mr-4"
                prepend-icon="mdi-plus"
                variant="flat"
              >
                Add New
              </v-btn>
                
              <v-menu>
                <template #activator="{ props }">
                  <v-btn 
                    v-bind="props"
                    variant="outlined"
                    color="grey-darken-1"
                    class="px-4"
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
            >
              <v-card
                class="rounded-lg mb-6"
                color="grey-darken-3"
              >
                <v-card-title class="text-white pa-6">
                  New Tasks
                </v-card-title>
              </v-card>
  
              <!-- Task Card Inline Definition -->
              <v-card 
                v-for="task in newTasks" 
                :key="task.id"
                class="rounded-lg mb-4 pa-6"
                :class="{ 'cursor-pointer': task.id === 1 }"
                @click="task.id === 1 ? $router.push('/project-task') : null"
                
              >
                <div class="d-flex align-center mb-4">
                  <v-avatar
                    size="40"
                    :color="task.iconBg"
                    class="mr-4"
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
                  
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex">
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
                  
                <div class="d-flex justify-space-between align-center mt-4">
                  <v-btn
                    variant="text"
                    size="small"
                    color="grey-darken-1"
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
            >
              <v-card
                class="rounded-lg mb-6"
                color="grey-darken-3"
              >
                <v-card-title class="text-white pa-6">
                  In progress
                </v-card-title>
              </v-card>
  
              <!-- Task Card Inline Definition -->
              <v-card 
                v-for="task in inProgressTasks" 
                :key="task.id"
                class="rounded-lg mb-4 pa-6"
              >
                <div class="d-flex align-center mb-4">
                  <v-avatar
                    size="40"
                    :color="task.iconBg"
                    class="mr-4"
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
                  
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex">
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
                  
                <div class="d-flex justify-space-between align-center mt-4">
                  <v-btn
                    variant="text"
                    size="small"
                    color="grey-darken-1"
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
            >
              <v-card
                class="rounded-lg mb-6"
                color="grey-darken-3"
              >
                <v-card-title class="text-white pa-6">
                  Completed
                </v-card-title>
              </v-card>
  
              <detailed-task-card 
                v-for="task in completedTasks"
                :key="task.id"
                :task="task"
              />
            </v-col>
          </v-row>
  
          <v-row
            justify="center"
            class="mt-8"
          >
            <v-col cols="auto">
              <v-btn
                variant="text"
                class="mx-1"
              >
                Previous
              </v-btn>
              <v-btn 
                v-for="page in 4" 
                :key="page" 
                :color="page === 1 ? 'teal-darken-1' : ''" 
                :variant="page === 1 ? 'flat' : 'text'"
                class="mx-1"
              >
                {{ page }}
              </v-btn>
              <v-btn
                color="teal-darken-1"
                variant="flat"
                class="mx-1"
              >
                Next
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
  
  <script>
  import LeftMenu from '@/components/dashboard/LeftMenu.vue';
  import DetailedTaskCard from '@/components/DetailedTaskCard.vue';
  
  export default {
    name: 'ProjectSection',
    components: {
      LeftMenu,
      DetailedTaskCard
    },
    data() {
      return {
        menuItems: [
          { icon: 'mdi-view-dashboard-outline' },
          { icon: 'mdi-folder-outline' },
          { icon: 'mdi-account-group-outline' },
          { icon: 'mdi-file-document-outline' },
          { icon: 'mdi-chart-line' },
          { icon: 'mdi-calendar' },
          { icon: 'mdi-puzzle-outline' },
          { icon: 'mdi-cog-outline' },
        ],
        
        teamMembers: [
          { id: 1, name: 'John', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
          { id: 2, name: 'Sarah', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
          { id: 3, name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
          { id: 4, name: 'Lisa', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
        ],
        
        newTasks: [
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
        ],
        
        inProgressTasks: [
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
        ],
        
        completedTasks: [
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
        ]
      }
    },
    methods: {
      getTeamMemberAvatar(memberId) {
        const member = this.teamMembers.find(m => m.id === memberId);
        return member ? member.avatar : '';
      },
      handleTaskClick(task) {
    if (task.id === 1) {
      this.$router.push('/project-task');
    }
}, 
      getStatusColor(status) {
        const colors = {
          'new': 'blue',
          'planning': 'indigo',
          'in progress': 'amber-darken-1',
          'completed': 'teal-darken-1',
          'on hold': 'grey'
        };
        return colors[status.toLowerCase()] || 'blue';
      }
    }
  }
  </script>
  
  <style scoped>
  .task-card {
    transition: transform 0.2s;
  }
  .task-card:hover {
    transform: translateY(-4px);
  }
  </style>