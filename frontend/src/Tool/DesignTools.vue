<!-- DesignTools.vue -->
<template>
  <v-app>
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
        
    <v-main class="main-content">
      <div class="hero-section">
        <v-container
          fluid
          class="px-6 py-8"
        >
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                <span class="gradient-text">Design</span> Tools
              </h1>
              <p class="hero-subtitle">
                Discover and access your favorite design and productivity tools
              </p>
            </div>
          </div>
        </v-container>
      </div>
        

      <v-container
        fluid
        class="content-container px-6 pb-8"
      >
        <!-- Chat Tools Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="primary"
              >
                mdi-message-text
              </v-icon>
              <h2 class="section-heading">
                Chat Tools
              </h2>
            </div>
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="count-chip"
            >
              {{ chatTools.length }} tools
            </v-chip>
          </div>
          
          <div class="tools-grid">
            <div 
              v-for="tool in chatTools" 
              :key="tool.title"
              class="tool-item"
            >
              <a 
                :href="tool.link" 
                target="_blank" 
                class="tool-link"
              >
                <div class="tool-card">
                  <div class="tool-icon-wrapper">
                    <img 
                      :src="tool.icon" 
                      :alt="tool.title"
                      class="tool-icon"
                    >
                  </div>
                  <div class="tool-info">
                    <h3 class="tool-title">{{ tool.title }}</h3>
                    <div class="tool-link-indicator">
                      <v-icon size="small">mdi-open-in-new</v-icon>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
          
        <!-- Freelance Tools Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="success"
              >
                mdi-briefcase
              </v-icon>
              <h2 class="section-heading">
                Freelance Tools
              </h2>
            </div>
            <v-chip
              size="small"
              color="success"
              variant="outlined"
              class="count-chip"
            >
              {{ freelanceTools.length }} tools
            </v-chip>
          </div>
          
          <div class="tools-grid">
            <div 
              v-for="tool in freelanceTools" 
              :key="tool.title"
              class="tool-item"
            >
              <a 
                :href="tool.link" 
                target="_blank" 
                class="tool-link"
              >
                <div class="tool-card">
                  <div class="tool-icon-wrapper">
                    <img 
                      :src="tool.icon" 
                      :alt="tool.title"
                      class="tool-icon"
                    >
                  </div>
                  <div class="tool-info">
                    <h3 class="tool-title">{{ tool.title }}</h3>
                    <div class="tool-link-indicator">
                      <v-icon size="small">mdi-open-in-new</v-icon>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
          
        <!-- Design Tools Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="warning"
              >
                mdi-palette
              </v-icon>
              <h2 class="section-heading">
                Design Tools
              </h2>
            </div>
            <v-chip
              size="small"
              color="warning"
              variant="outlined"
              class="count-chip"
            >
              {{ designTools.length }} tools
            </v-chip>
          </div>
          
          <div class="tools-grid">
            <div 
              v-for="tool in designTools" 
              :key="tool.title"
              class="tool-item"
            >
              <a 
                :href="tool.link" 
                target="_blank" 
                class="tool-link"
              >
                <div class="tool-card">
                  <div class="tool-icon-wrapper">
                    <div 
                      v-if="tool.isAdobe && !tool.icon"
                      class="adobe-icon"
                      :class="tool.adobeClass"
                    >
                      {{ tool.adobeShort }}
                    </div>
                    <img 
                      v-else
                      :src="tool.icon" 
                      :alt="tool.title"
                      class="tool-icon"
                    >
                  </div>
                  <div class="tool-info">
                    <h3 class="tool-title">{{ tool.title }}</h3>
                    <div class="tool-link-indicator">
                      <v-icon size="small">mdi-open-in-new</v-icon>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
  
<script>
import { defineComponent, ref, onMounted } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';

export default defineComponent({
  name: 'DesignTools',
  components: {
    LeftMenu,
    SearchBar
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
        icon: 'zoom.png' 
      },
      { 
        title: 'ChatGPT', 
        link: 'https://openai.com/index/chatgpt/', 
        icon: 'https://cdn.worldvectorlogo.com/logos/chatgpt-1.svg' 
      },
      { 
        title: 'Claude AI', 
        link: 'https://claude.ai/new', 
        icon: 'claude.jpg' 
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
        icon: 'dc.jpg' 
      },
      { 
        title: '99designs', 
        link: 'https://en.99designs.de/', 
        icon: '99d.png' 
      },
      { 
        title: 'Behance', 
        link: 'https://www.behance.net/', 
        icon: 'https://cdn.worldvectorlogo.com/logos/behance-1.svg' 
      },
      { 
        title: 'Freelance Guru', 
        link: 'https://www.guru.com/', 
        icon: 'guru.png' 
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
        icon: 'Adobe.png', 
        isAdobe: true, 
        adobeClass: 'ai', 
        adobeShort: 'Ai' 
      },
      { 
        title: 'Adobe Animate', 
        link: 'https://www.adobe.com/', 
        icon: 'An.png', 
        isAdobe: true, 
        adobeClass: 'an', 
        adobeShort: 'An' 
      },
      { 
        title: 'Adobe After Effects', 
        link: 'https://www.adobe.com/', 
        icon: 'Ae.png', 
        isAdobe: true, 
        adobeClass: 'ae', 
        adobeShort: 'Ae' 
      },
      { 
        title: 'Adobe InDesign', 
        link: 'https://www.adobe.com/products/indesign.html', 
        icon: 'ain.png', 
        isAdobe: true, 
        adobeClass: 'id', 
        adobeShort: 'Id' 
      },
      { 
        title: 'Adobe Media Encoder', 
        link: 'https://www.adobe.com/products/media-encoder.html', 
        icon: 'me.png', 
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
        icon: 'Pr.png', 
        isAdobe: true, 
        adobeClass: 'pr', 
        adobeShort: 'Pr' 
      },
      { 
        title: 'Canva', 
        link: 'https://www.canva.com/en_gb/', 
        icon: 'canva.jpeg' 
      },
      { 
        title: 'Figma', 
        link: 'https://www.figma.com/', 
        icon: 'figma.png' 
      },
      { 
        title: 'Midjourney', 
        link: 'https://www.midjourney.com/home', 
        icon: 'Midjourney.png' 
      },
      { 
        title: 'Fotor', 
        link: 'https://www.fotor.com/', 
        icon: 'fotor.jpeg' 
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

/* Main Layout */
.main-content {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FFA726);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0 0 0;
  font-weight: 400;
}

.search-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-wrapper {
  min-width: 300px;
  max-width: 400px;
}

.search-field {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.search-field :deep(.v-input__control) {
  min-height: 56px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.globe-btn:hover {
  color: #4CAF50;
}

.notification-btn:hover {
  color: #FF9800;
}

/* Content Container */
.content-container {
  background: #f8fafc;
  margin-top: -2rem;
  border-radius: 2rem 2rem 0 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

/* Tool Sections */
.tool-section {
  margin-bottom: 3rem;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 1.8rem;
}

.section-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.01em;
}

.count-chip {
  font-weight: 600;
}

/* Tools Grid */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tool-item {
  position: relative;
}

.tool-link {
  text-decoration: none;
  display: block;
  height: 100%;
}

.tool-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.tool-card:hover::before {
  opacity: 1;
}

.tool-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.tool-card:hover .tool-icon-wrapper {
  background: #f1f5f9;
  transform: scale(1.05);
}

.tool-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.tool-card:hover .tool-icon {
  transform: scale(1.1);
}

.tool-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
}

.tool-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-link-indicator {
  color: #64748b;
  opacity: 0;
  transition: all 0.3s ease;
  transform: translateX(-10px);
}

.tool-card:hover .tool-link-indicator {
  opacity: 1;
  transform: translateX(0);
  color: #0D7C66;
}

/* Adobe Icons */
.adobe-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  color: white;
}

.tool-card:hover .adobe-icon {
  transform: scale(1.1);
}

.ps {
  background: linear-gradient(135deg, #001e36, #31a8ff);
}

.ai {
  background: linear-gradient(135deg, #330000, #ff9a00);
}

.an {
  background: linear-gradient(135deg, #1f0040, #9999ff);
}

.ae {
  background: linear-gradient(135deg, #1f0040, #9999ff);
}

.id {
  background: linear-gradient(135deg, #49021f, #ff3366);
}

.me {
  background: linear-gradient(135deg, #00005b, #8e9ef3);
}

.lr {
  background: linear-gradient(135deg, #001e36, #31a8ff);
}

.pr {
  background: linear-gradient(135deg, #00005b, #31a8ff);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .search-controls {
    width: 100%;
    justify-content: center;
  }
  
  .search-wrapper {
    min-width: 280px;
    max-width: 100%;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-heading {
    font-size: 1.5rem;
  }
  
  .content-container {
    margin-top: -1rem;
    border-radius: 1.5rem 1.5rem 0 0;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .tool-card {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .tool-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .tool-icon-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .tool-icon,
  .adobe-icon {
    width: 32px;
    height: 32px;
  }
  
  .adobe-icon {
    font-size: 14px;
  }
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-section {
  animation: fadeInUp 0.6s ease-out;
}

.tool-section:nth-child(2) {
  animation-delay: 0.1s;
}

.tool-section:nth-child(3) {
  animation-delay: 0.2s;
}

.tool-section:nth-child(4) {
  animation-delay: 0.3s;
}
</style>