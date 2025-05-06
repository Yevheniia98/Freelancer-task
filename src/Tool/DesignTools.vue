<!-- DesignTools.vue -->
<template>
  <v-app>
    <LeftMenu />
        
    <v-main class="bg-grey-lighten-4">
      <v-container
        fluid
        class="pa-4 pa-sm-6"
      >
        <div class="d-flex justify-space-between align-center mb-6 flex-wrap">
          <h1 class="text-h4 text-h5-sm font-weight-bold">
            Design Tools
          </h1>
            
          <!-- Search and Action Buttons -->
          <div class="d-flex align-center gap-3 mt-2 mt-sm-0">
            <v-text-field
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              class="search-field"
              bg-color="white"
            />
              
            <v-btn 
              icon 
              color="purple-lighten-4" 
              variant="flat"
              class="text-purple-darken-2"
            >
              <v-icon>mdi-earth</v-icon>
            </v-btn>
              
            <v-btn 
              icon 
              color="amber-lighten-4" 
              variant="flat"
              class="text-amber-darken-2"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </div>
        </div>
          
        <!-- Chat Tools Section -->
        <div class="mb-8">
          <h2 class="text-h5 text-h6-sm font-weight-bold mb-4">
            Chat Tools
          </h2>
            
          <v-row class="tool-grid">
            <v-col 
              v-for="tool in chatTools" 
              :key="tool.title"
              cols="4"
              sm="3"
              md="2"
              lg="1"
              class="tool-col"
            >
              <v-card
                :title="tool.title"
                :href="tool.link"
                target="_blank"
                elevation="1"
                rounded="lg"
                height="100%"
                class="tool-card d-flex align-center justify-center"
                variant="flat"
              >
                <v-img
                  :src="tool.icon"
                  width="60"
                  height="60"
                  contain
                  class="tool-icon"
                />
              </v-card>
            </v-col>
          </v-row>
        </div>
          
        <!-- Freelance Tools Section -->
        <div class="mb-8">
          <h2 class="text-h5 text-h6-sm font-weight-bold mb-4">
            Freelance Tools
          </h2>
            
          <v-row class="tool-grid">
            <v-col 
              v-for="tool in freelanceTools" 
              :key="tool.title"
              cols="4"
              sm="3"
              md="2"
              lg="1"
              class="tool-col"
            >
              <v-card
                :title="tool.title"
                :href="tool.link"
                target="_blank"
                elevation="1"
                rounded="lg"
                height="100%"
                class="tool-card d-flex align-center justify-center"
                variant="flat"
              >
                <v-img
                  :src="tool.icon"
                  width="60"
                  height="60"
                  contain
                  class="tool-icon"
                />
              </v-card>
            </v-col>
          </v-row>
        </div>
          
        <!-- Design Tools Section -->
        <div class="mb-8">
          <h2 class="text-h5 text-h6-sm font-weight-bold mb-4">
            Design Tools
          </h2>
            
          <v-row class="tool-grid">
            <v-col 
              v-for="tool in designTools" 
              :key="tool.title"
              cols="4"
              sm="3"
              md="2"
              lg="1"
              class="tool-col"
            >
              <v-card
                :title="tool.title"
                :href="tool.link"
                target="_blank"
                elevation="1"
                rounded="lg"
                height="100%"
                class="tool-card d-flex align-center justify-center"
                variant="flat"
              >
                <template v-if="tool.isAdobe && !tool.icon">
                  <div
                    class="adobe-icon"
                    :class="tool.adobeClass"
                  >
                    {{ tool.adobeShort }}
                  </div>
                </template>
                <template v-else>
                  <v-img
                    :src="tool.icon"
                    width="60"
                    height="60"
                    contain
                    class="tool-icon"
                  />
                </template>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import LeftMenu from '@/dashboard/LeftMenu.vue';
  
  export default defineComponent({
    name: 'DesignTools',
    components: {
      LeftMenu
    },
    setup() {
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
      
      // Chat Tools data
      const chatTools = ref([
        { 
          title: 'Slack', 
          link: 'https://slack.com/intl/en-gb/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' 
        },
        { 
          title: 'Microsoft Teams', 
          link: 'https://www.microsoft.com/en-us/microsoft-teams/group-chat-software', 
          icon: 'https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg' 
        },
        { 
          title: 'Google Chat', 
          link: 'https://mail.google.com/chat/u/0/#chat/home', 
          icon: 'https://cdn.worldvectorlogo.com/logos/google-chat-1.svg' 
        },
        { 
          title: 'Zoom', 
          link: 'https://www.zoom.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo-freelogovectors.net_.svg' 
        },
        { 
          title: 'ChatGPT', 
          link: 'https://openai.com/index/chatgpt/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/chatgpt-1.svg' 
        },
        { 
          title: 'Claude AI', 
          link: 'https://claude.ai/new', 
          icon: 'https://cdn.worldvectorlogo.com/logos/anthropic-claude-1.svg' 
        }
      ]);
      
      // Freelance Tools data
      const freelanceTools = ref([
        { 
          title: 'Upwork', 
          link: 'https://www.upwork.com/ab/account-security/login', 
          icon: 'https://cdn.worldvectorlogo.com/logos/upwork-1.svg' 
        },
        { 
          title: 'Fiverr', 
          link: 'https://www.fiverr.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/fiverr-1.svg' 
        },
        { 
          title: 'Freelancer', 
          link: 'https://www.freelancer.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/freelancer-1.svg' 
        },
        { 
          title: 'DesignCrowd', 
          link: 'https://www.designcrowd.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/designcrowd-logo.svg' 
        },
        { 
          title: '99designs', 
          link: 'https://en.99designs.de/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/99designs-logo.svg' 
        },
        { 
          title: 'Behance', 
          link: 'https://www.behance.net/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/behance-1.svg' 
        },
        { 
          title: 'Freelance Guru', 
          link: 'https://www.guru.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/guru-2.svg' 
        },
        { 
          title: 'GitHub', 
          link: 'https://github.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg' 
        }
      ]);
      
      // Design Tools data
      const designTools = ref([
        { 
          title: 'Adobe Photoshop', 
          link: 'https://www.adobe.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/adobe-photoshop-2.svg', 
          isAdobe: true, 
          adobeClass: 'ps', 
          adobeShort: 'Ps' 
        },
        { 
          title: 'Adobe Illustrator', 
          link: 'https://www.adobe.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/adobe-illustrator-cc-icon.svg', 
          isAdobe: true, 
          adobeClass: 'ai', 
          adobeShort: 'Ai' 
        },
        { 
          title: 'Adobe Animate', 
          link: 'https://www.adobe.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/animate-1.svg', 
          isAdobe: true, 
          adobeClass: 'an', 
          adobeShort: 'An' 
        },
        { 
          title: 'Adobe After Effects', 
          link: 'https://www.adobe.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/after-effects-cc.svg', 
          isAdobe: true, 
          adobeClass: 'ae', 
          adobeShort: 'Ae' 
        },
        { 
          title: 'Adobe InDesign', 
          link: 'https://www.adobe.com/products/indesign.html', 
          icon: 'https://cdn.worldvectorlogo.com/logos/indesign-cc.svg', 
          isAdobe: true, 
          adobeClass: 'id', 
          adobeShort: 'Id' 
        },
        { 
          title: 'Adobe Media Encoder', 
          link: 'https://www.adobe.com/products/media-encoder.html', 
          icon: 'https://cdn.worldvectorlogo.com/logos/media-encoder.svg', 
          isAdobe: true, 
          adobeClass: 'me', 
          adobeShort: 'Me' 
        },
        { 
          title: 'Adobe Lightroom', 
          link: 'https://www.adobe.com/de/products/photoshop-lightroom/campaign/pricing.html', 
          icon: 'https://cdn.worldvectorlogo.com/logos/lightroom-cc.svg', 
          isAdobe: true, 
          adobeClass: 'lr', 
          adobeShort: 'Lr' 
        },
        { 
          title: 'Adobe Premiere Pro', 
          link: 'https://www.adobe.com/de/products/premiere/campaign/pricing.html', 
          icon: 'https://cdn.worldvectorlogo.com/logos/premiere-cc.svg', 
          isAdobe: true, 
          adobeClass: 'pr', 
          adobeShort: 'Pr' 
        },
        { 
          title: 'Canva', 
          link: 'https://www.canva.com/en_gb/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/canva-1.svg' 
        },
        { 
          title: 'Figma', 
          link: 'https://www.figma.com/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/figma-5.svg' 
        },
        { 
          title: 'Midjourney', 
          link: 'https://www.midjourney.com/home', 
          icon: 'https://cdn.worldvectorlogo.com/logos/midjourney-1.svg' 
        },
        { 
          title: 'Fotor', 
          link: 'https://www.fotor.com/', 
          icon: 'https://is3-ssl.mzstatic.com/image/thumb/Purple112/v4/1d/cc/b7/1dccb7a2-c4be-b84d-fd22-c5073ba00f0b/AppIcon-0-1x_U007emarketing-0-7-0-sRGB-85-220.png/512x512bb.jpg' 
        },
        { 
          title: 'Excel', 
          link: 'https://excel.cloud.microsoft/en-gb/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/excel-4.svg' 
        },
        { 
          title: 'Google Docs', 
          link: 'https://docs.google.com/document/u/0/', 
          icon: 'https://cdn.worldvectorlogo.com/logos/google-docs-icon-2.svg' 
        }
      ]);
      
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
      
      return {
        isMobile,
        isTablet,
        chatTools,
        freelanceTools,
        designTools
      };
    }
  });
  </script>
  
  <style scoped>
  /* Search field */
  .search-field {
    max-width: 240px;
  }
  
  /* Tool grid styling */
  .tool-grid {
    margin: 0 -8px;
  }
  
  .tool-col {
    padding: 8px;
  }
  
  .tool-card {
    transition: all 0.2s ease;
    cursor: pointer;
    padding: 15px;
  }
  
  .tool-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
  }
  
  .tool-icon {
    transition: transform 0.2s;
  }
  
  .tool-card:hover .tool-icon {
    transform: scale(1.05);
  }
  
  /* Adobe Icons */
  .adobe-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
    border-radius: 8px;
    transition: transform 0.2s;
  }
  
  .tool-card:hover .adobe-icon {
    transform: scale(1.05);
  }
  
  .ps {
    background-color: #001e36;
    color: #31a8ff;
  }
  
  .ai {
    background-color: #330000;
    color: #ff9a00;
  }
  
  .an {
    background-color: #1f0040;
    color: #9999ff;
  }
  
  .ae {
    background-color: #1f0040;
    color: #9999ff;
  }
  
  .id {
    background-color: #49021f;
    color: #ff3366;
  }
  
  .me {
    background-color: #00005b;
    color: #8e9ef3;
  }
  
  .lr {
    background-color: #001e36;
    color: #31a8ff;
  }
  
  .pr {
    background-color: #00005b;
    color: #31a8ff;
  }
  
  /* Spacing for content */
  .gap-3 {
    gap: 12px;
  }
  
  /* Responsive Typography */
  @media (max-width: 600px) {
    .text-h5-sm {
      font-size: 1.25rem !important;
    }
    
    .text-h6-sm {
      font-size: 1rem !important;
    }
    
    .adobe-icon {
      width: 50px;
      height: 50px;
      font-size: 20px;
    }
    
    .tool-icon,
    .v-img.tool-icon {
      width: 50px !important;
      height: 50px !important;
    }
    
    .tool-card {
      padding: 10px;
    }
  }
  
  /* More adjustments for smaller screens */
  @media (max-width: 600px) {
    .pa-sm-6 {
      padding: 24px !important;
    }
    
    .search-field {
      max-width: 170px;
    }
  }
  
  /* Button colors */
  .text-purple-darken-2 {
    color: #6e5dc6 !important;
  }
  
  .text-amber-darken-2 {
    color: #ffb020 !important;
  }
  
  /* Prevent text overflow */
  .text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>