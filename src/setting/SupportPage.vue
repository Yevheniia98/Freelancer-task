<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      @update:rail="sidebarExpanded = !$event"
    />
    <SearchBar />
      
    <v-main
      :class="{ 'ml-60': sidebarExpanded, 'ml-14': !sidebarExpanded }"
      class="transition-all duration-300 bg-grey-lighten-5"
    >
      <v-container
        fluid
        class="pa-8"
        max-width="1400"
      >
        <!-- Enhanced Header Section -->
        <div class="hero-section mb-12">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="lo text-h3 font-weight-bold text-grey-darken-3 mb-3 ">
                Support & Feedback
              </h1>
              <p class="text-h6 text-grey-darken-1 font-weight-regular">
                Get help, share your thoughts, and help us improve Freelance Task
              </p>
            </div>
            <v-chip
              color="default"
              size="large"
              variant="flat"
              class="px-4"
            >
              <v-icon start>
                mdi-headset
              </v-icon>
              24/7 Support Available
            </v-chip>
          </div>
          
          <!-- Quick Stats Cards -->
          <div class="d-flex flex-wrap gap-4 mb-8">
            <v-card
              class="stat-card flex-grow-1"
              variant="flat"
              color="#6C8CA1"
            >
              <v-card-text class="card text-center py-6">
                <v-icon
                  size="40"
                  color="white"
                  class="mb-3"
                >
                  mdi-clock-fast
                </v-icon>
                <div class="text-h6 font-weight-bold text-white">
                  &lt; 2 Hours
                </div>
                <div class="text-body-2 text-primary-lighten-3">
                  Average Response Time
                </div>
              </v-card-text>
            </v-card>
            
            <v-card
              class="stat-card flex-grow-1"
              variant="flat"
              color="#7AA871"
            >
              <v-card-text class="text-center py-6">
                <v-icon
                  size="40"
                  color="white"
                  class="mb-3"
                >
                  mdi-thumb-up
                </v-icon>
                <div class="text-h6 font-weight-bold text-white">
                  98%
                </div>
                <div class="text-body-2 text-success-lighten-3">
                  Satisfaction Rate
                </div>
              </v-card-text>
            </v-card>
            
            <v-card
              class="stat-card flex-grow-1"
              variant="flat"
              color="#9A7DBD"
            >
              <v-card-text class="text-center py-6">
                <v-icon
                  size="40"
                  color="white"
                  class="mb-3"
                >
                  mdi-forum
                </v-icon>
                <div class="text-h6 font-weight-bold text-white">
                  5k+
                </div>
                <div class="text-body-2 text-info-lighten-3">
                  Community Members
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
            
        <!-- Enhanced Help & Support Section -->
        <div class="mb-12">
          <div class="section-header mb-8">
            <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
              Help & Support
            </h2>
            <p class="text-subtitle-1 text-grey-darken-1">
              Find answers and get assistance quickly
            </p>
          </div>
              
          <v-row>
            <!-- Quick Help Card -->
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="support-card h-100"
                variant="flat"
                elevation="2"
              >
                <div class="card-header primary">
                  <v-icon
                    color="white"
                    size="32"
                    class="mb-2"
                  >
                    mdi-help-circle
                  </v-icon>
                  <h3 class="text-h6 font-weight-bold text-white">
                    Quick Help
                  </h3>
                </div>
                  
                <v-card-text class="pa-6">
                  <p class="text-body-1 text-grey-darken-1 mb-6">
                    Find quick answers to common questions and issues.
                  </p>
                  
                  <v-list class="bg-transparent">
                    <v-list-item
                      v-for="(item, index) in helpItems"
                      :key="index"
                      :title="item.title"
                      class="px-0 mb-2 help-item"
                      @click="openKnowledgeBase(item)"
                    >
                      <template #prepend>
                        <v-avatar
                          size="32"
                          color="primary-lighten-4"
                          class="mr-3"
                        >
                          <v-icon
                            color="primary"
                            size="16"
                          >
                            mdi-arrow-right
                          </v-icon>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
                
            <!-- Knowledge Base Card -->
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="support-card h-100"
                variant="flat"
                elevation="2"
              >
                <div class="card-header info">
                  <v-icon
                    color="white"
                    size="32"
                    class="mb-2"
                  >
                    mdi-book-open-page-variant
                  </v-icon>
                  <h3 class="text-h6 font-weight-bold text-white">
                    Knowledge Base
                  </h3>
                </div>
                  
                <v-card-text class="pa-6 d-flex flex-column">
                  <p class="text-body-1 text-grey-darken-1 mb-6">
                    Browse our comprehensive documentation and tutorials.
                  </p>
                  
                  <v-spacer />
                  
                  <v-btn
                    color="info"
                    variant="flat"
                    size="large"
                    block
                    class="mt-auto"
                    @click="openDocumentation"
                  >
                    Browse Documentation
                    <v-icon end>
                      mdi-arrow-right
                    </v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
                
            <!-- Contact Support Card -->
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="support-card h-100"
                variant="flat"
                elevation="2"
              >
                <div class="card-header success">
                  <v-icon
                    color="white"
                    size="32"
                    class="mb-2"
                  >
                    mdi-headset
                  </v-icon>
                  <h3 class="text-h6 font-weight-bold text-white">
                    Contact Support
                  </h3>
                </div>
                  
                <v-card-text class="pa-6 d-flex flex-column">
                  <p class="text-body-1 text-grey-darken-1 mb-6">
                    Need personalized help? Our support team is ready to assist you.
                  </p>
                  
                  <v-spacer />
                  
                  <v-btn
                    color="success"
                    variant="flat"
                    size="large"
                    block
                    class="mt-auto"
                    @click="openContactForm"
                  >
                    Contact Support
                    <v-icon end>
                      mdi-send
                    </v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
            
        <!-- Enhanced Feedback Section -->
        <div class="mb-12">
          <div class="section-header mb-8">
            <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
              Submit Feedback
            </h2>
            <p class="text-subtitle-1 text-grey-darken-1">
              Help us improve by sharing your thoughts and suggestions
            </p>
          </div>
              
          <v-card
            class="feedback-card"
            variant="flat"
            elevation="2"
          >
            <div class="card-header-gradient">
              <v-icon
                color="white"
                size="32"
                class="mb-2"
              >
                mdi-message-star
              </v-icon>
              <h3 class="text-h6 font-weight-bold text-white mb-1">
                Share Your Experience
              </h3>
              <p class="text-body-2 text-white-lighten-1.5">
                Your feedback helps us improve Freelance Task
              </p>
            </div>
            
            <v-card-text class="pa-8">
              <v-form @submit.prevent="submitFeedback">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-select
                      v-model="feedbackType"
                      :items="feedbackTypes"
                      label="Feedback Type"
                      variant="outlined"
                      color="primary"
                      required
                      prepend-inner-icon="mdi-tag"
                    />
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="feedbackSubject"
                      label="Subject"
                      variant="outlined"
                      color="primary"
                      required
                      prepend-inner-icon="mdi-format-title"
                    />
                  </v-col>
                </v-row>
                  
                <v-textarea
                  v-model="feedbackMessage"
                  label="Your Feedback"
                  variant="outlined"
                  color="primary"
                  rows="4"
                  counter="500"
                  :maxlength="500"
                  class="mb-6"
                  required
                  prepend-inner-icon="mdi-message-text"
                />
                  
                <div class="mb-6">
                  <p class="text-body-1 font-weight-medium mb-4 text-grey-darken-2">
                    <v-icon class="mr-2">
                      mdi-star
                    </v-icon>
                    Rate your overall experience
                  </p>
                  <div class="d-flex align-center gap-4">
                    <v-rating
                      v-model="feedbackRating"
                      hover
                      half-increments
                      size="large"
                      color="amber"
                      active-color="amber"
                    />
                    <v-chip
                      :color="getRatingColor(feedbackRating)"
                      variant="flat"
                      size="small"
                    >
                      {{ getRatingText(feedbackRating) }}
                    </v-chip>
                  </div>
                </div>
                  
                <v-file-input
                  v-model="attachments"
                  label="Attach Screenshots or Files (Optional)"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                  counter
                  multiple
                  class="mb-8"
                  accept="image/*, application/pdf"
                />
                  
                <div class="d-flex justify-end">
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="large"
                    type="submit"
                    :loading="submitting"
                    class="px-8"
                  >
                    <v-icon start>
                      mdi-send
                    </v-icon>
                    Submit Feedback
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
            
        <!-- Enhanced Community & Resources Section -->
        <div>
          <div class="section-header mb-8">
            <h2 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
              Community & Resources
            </h2>
            <p class="text-subtitle-1 text-grey-darken-1">
              Connect, learn, and stay updated with our community
            </p>
          </div>
              
          <v-row>
            <!-- Community Forums Card -->
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="resource-card h-100"
                variant="flat"
                elevation="2"
              >
                <v-card-text class="pa-6 text-center">
                  <v-avatar
                    size="80"
                    color="orange-lighten-4"
                    class="mb-4"
                  >
                    <v-icon
                      color="orange"
                      size="40"
                    >
                      mdi-forum
                    </v-icon>
                  </v-avatar>
                  
                  <h3 class="text-h6 font-weight-bold mb-3">
                    Community Forums
                  </h3>
                  
                  <p class="text-body-2 text-grey-darken-1 mb-6">
                    Connect with other freelancers, share tips, and get advice from the community.
                  </p>
                  
                  <v-btn
                    color="orange"
                    variant="flat"
                    block
                    @click="openForums"
                  >
                    Join Discussion
                    <v-icon end>
                      mdi-arrow-right
                    </v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
                
            <!-- Tutorials Card -->
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="resource-card h-100"
                variant="flat"
                elevation="2"
              >
                <v-card-text class="pa-6 text-center">
                  <v-avatar
                    size="80"
                    color="purple-lighten-4"
                    class="mb-4"
                  >
                    <v-icon
                      color="purple"
                      size="40"
                    >
                      mdi-video
                    </v-icon>
                  </v-avatar>
                  
                  <h3 class="text-h6 font-weight-bold mb-3">
                    Video Tutorials
                  </h3>
                  
                  <p class="text-body-2 text-grey-darken-1 mb-6">
                    Watch step-by-step video guides to master Freelance Task features.
                  </p>
                  
                  <v-btn
                    color="purple"
                    variant="flat"
                    block
                    @click="openTutorials"
                  >
                    Watch Videos
                    <v-icon end>
                      mdi-play
                    </v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
                
            <!-- Blog Card -->
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                class="resource-card h-100"
                variant="flat"
                elevation="2"
              >
                <v-card-text class="pa-6 text-center">
                  <v-avatar
                    size="80"
                    color="teal-lighten-4"
                    class="mb-4"
                  >
                    <v-icon
                      color="teal"
                      size="40"
                    >
                      mdi-newspaper
                    </v-icon>
                  </v-avatar>
                  
                  <h3 class="text-h6 font-weight-bold mb-3">
                    Blog & Updates
                  </h3>
                  
                  <p class="text-body-2 text-grey-darken-1 mb-6">
                    Stay updated with the latest features, tips, and freelancing trends.
                  </p>
                  
                  <v-btn
                    color="teal"
                    variant="flat"
                    block
                    @click="openBlog"
                  >
                    Read Articles
                    <v-icon end>
                      mdi-book-open
                    </v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
          
        <!-- Enhanced Contact Support Dialog -->
        <v-dialog
          v-model="showContactDialog"
          max-width="700"
          persistent
        >
          <v-card class="support-dialog">
            <div class="dialog-header">
              <v-icon
                color="white"
                size="32"
                class="mb-2"
              >
                mdi-headset
              </v-icon>
              <h2 class="text-h5 font-weight-bold text-white">
                Contact Support
              </h2>
              <p class="text-body-2 text-white-lighten-2 mb-0">
                We're here to help you succeed
              </p>
            </div>
              
            <v-card-text class="pa-8">
              <v-form @submit.prevent="submitSupportRequest">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="supportName"
                      label="Full Name"
                      variant="outlined"
                      color="primary"
                      required
                      prepend-inner-icon="mdi-account"
                    />
                  </v-col>
                  
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="supportEmail"
                      label="Email Address"
                      variant="outlined"
                      color="primary"
                      required
                      type="email"
                      prepend-inner-icon="mdi-email"
                    />
                  </v-col>
                </v-row>
                  
                <v-select
                  v-model="supportCategory"
                  :items="supportCategories"
                  label="Issue Category"
                  variant="outlined"
                  color="primary"
                  class="mb-4"
                  required
                  prepend-inner-icon="mdi-tag"
                />
                  
                <v-textarea
                  v-model="supportMessage"
                  label="Describe your issue in detail"
                  variant="outlined"
                  color="primary"
                  rows="4"
                  class="mb-6"
                  required
                  prepend-inner-icon="mdi-message-text"
                />
                  
                <v-file-input
                  v-model="supportAttachments"
                  label="Attach Screenshots or Files (Optional)"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-paperclip"
                  show-size
                  counter
                  multiple
                  accept="image/*, application/pdf"
                />
              </v-form>
            </v-card-text>
              
            <v-card-actions class="pa-8 pt-0">
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="text"
                size="large"
                @click="showContactDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                size="large"
                :loading="submittingSupport"
                class="px-8"
                @click="submitSupportRequest"
              >
                <v-icon start>
                  mdi-send
                </v-icon>
                Submit Request
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
          
        <!-- Enhanced Success Snackbar -->
        <v-snackbar
          v-model="successSnackbar"
          color="success"
          timeout="4000"
          location="top right"
          variant="flat"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-2">
              mdi-check-circle
            </v-icon>
            {{ snackbarMessage }}
          </div>
          <template #actions>
            <v-btn
              color="white"
              variant="text"
              icon="mdi-close"
              @click="successSnackbar = false"
            />
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>
  
<script>
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';

export default {
  name: 'SupportFeedbackPage',
  components: {
    LeftMenu,
    SearchBar 
  },
  data() {
    return {
      sidebarExpanded: true,
      
      // Quick help items
      helpItems: [
        { title: 'Getting Started Guide', link: '/help/getting-started' },
        { title: 'Account Settings', link: '/help/account-settings' },
        { title: 'Billing & Payments', link: '/help/billing-payments' },
        { title: 'Project Management', link: '/help/project-management' }
      ],
      
      // Feedback form
      feedbackType: '',
      feedbackTypes: [
        'Feature Suggestion',
        'Bug Report',
        'User Experience',
        'General Feedback',
        'Performance Issue',
        'Other'
      ],
      feedbackSubject: '',
      feedbackMessage: '',
      feedbackRating: 4,
      attachments: [],
      submitting: false,
      
      // Support form
      showContactDialog: false,
      supportName: '',
      supportEmail: '',
      supportCategory: '',
      supportCategories: [
        'Technical Issue',
        'Billing Question',
        'Account Problem',
        'Feature Request',
        'Integration Help',
        'Other'
      ],
      supportMessage: '',
      supportAttachments: [],
      submittingSupport: false,
      
      // Snackbar
      successSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    getRatingColor(rating) {
      if (rating >= 4.5) return 'success';
      if (rating >= 3.5) return 'info';
      if (rating >= 2.5) return 'warning';
      return 'error';
    },
    
    getRatingText(rating) {
      if (rating >= 4.5) return 'Excellent';
      if (rating >= 3.5) return 'Good';
      if (rating >= 2.5) return 'Average';
      if (rating >= 1.5) return 'Poor';
      return 'Very Poor';
    },
    
    openKnowledgeBase(item) {
      console.log('Opening knowledge base:', item.link);
      // Navigate to the help article
      // this.$router.push(item.link);
    },
    
    openDocumentation() {
      console.log('Opening documentation');
      // Navigate to documentation page
      // this.$router.push('/documentation');
    },
    
    openContactForm() {
      this.showContactDialog = true;
    },
    
    openForums() {
      console.log('Opening community forums');
      // Navigate to forums
      // window.open('/community', '_blank');
    },
    
    openTutorials() {
      console.log('Opening video tutorials');
      // Navigate to tutorials
      // window.open('/tutorials', '_blank');
    },
    
    openBlog() {
      console.log('Opening blog');
      // Navigate to blog
      // window.open('/blog', '_blank');
    },
    
    submitFeedback() {
      this.submitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Submitting feedback:', {
          type: this.feedbackType,
          subject: this.feedbackSubject,
          message: this.feedbackMessage,
          rating: this.feedbackRating,
          attachments: this.attachments
        });
        
        this.submitting = false;
        this.showSnackbar('Thank you for your feedback! We appreciate your input.');
        this.resetFeedbackForm();
      }, 1500);
    },
    
    resetFeedbackForm() {
      this.feedbackType = '';
      this.feedbackSubject = '';
      this.feedbackMessage = '';
      this.feedbackRating = 4;
      this.attachments = [];
    },
    
    submitSupportRequest() {
      this.submittingSupport = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Submitting support request:', {
          name: this.supportName,
          email: this.supportEmail,
          category: this.supportCategory,
          message: this.supportMessage,
          attachments: this.supportAttachments
        });
        
        this.submittingSupport = false;
        this.showContactDialog = false;
        this.showSnackbar('Support request submitted successfully! We\'ll get back to you within 2 hours.');
        this.resetSupportForm();
      }, 1500);
    },
    
    resetSupportForm() {
      this.supportName = '';
      this.supportEmail = '';
      this.supportCategory = '';
      this.supportMessage = '';
      this.supportAttachments = [];
    },
    
    showSnackbar(message) {
      this.snackbarMessage = message;
      this.successSnackbar = true;
    }
  }
}
</script>
  
<style scoped>
/* Fixed styles for left menu */
:deep(.left-menu-fixed) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important; /* Changed from 102vh to 100vh */
  z-index: 999 !important;
  width: 72px ;
  overflow-y: hidden !important; /* Prevent scrolling within the menu itself */
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.left-menu-fixed.expanded) {
  width: 240px !important;
}

/* --- Main Content --- */
.v-main {
  margin-left: 0px !important;
  background: #f8f9fb;
  border-radius: 0 0 0 0;
  overflow-y: auto;
  height: 99vh !important;
  transition: margin-left 0.2s cubic-bezier(.4,0,.2,1);
}

.lo{
 text-align: left;
}

.v-main.ml-60 {
  margin-left: 240px !important;
}

@media (max-width: 900px) {
  .v-main {
    margin-left: 0 !important;
    height: auto;
  }
  .left-menu-fixed {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 56px;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    overflow: visible;
    padding: 0;
  }
}

/* --- Hero Section --- */
.hero-section {
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  border-radius: 24px;
  padding: 2.5rem;
  color: white;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.1;
}

/* --- Cards --- */
.support-card, .feedback-card, .resource-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.support-card:hover, .feedback-card:hover, .resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 2rem;
  border-radius: 16px 16px 0 0;
  position: relative;
  overflow: hidden;
}

.card-header.primary {
  background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
}

.card-header.info {
  background: linear-gradient(135deg, #0277bd 0%, #039be5 100%);
}

.card-header.success {
  background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%);
}

/* --- Stats Cards --- */
.stat-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  margin-right: 20px;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* --- Buttons --- */
.v-btn {
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
}

/* --- Form Elements --- */
.v-text-field, .v-select, .v-textarea {
  border-radius: 12px !important;
}

.v-text-field .v-field__outline__start,
.v-text-field .v-field__outline__end {
  border-radius: 12px !important;
}

/* --- Section Headers --- */
.section-header {
  position: relative;
  margin-bottom: 2.5rem;
}

.section-header::before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #1a237e 0%, #3949ab 100%);
  border-radius: 4px;
}

/* --- Accessibility Improvements --- */
.support-card, .feedback-card, .resource-card {
  box-shadow: 0 2px 16px rgba(44, 62, 80, 0.06);
  outline: none;
}

.support-card:focus-within, .feedback-card:focus-within, .resource-card:focus-within {
  box-shadow: 0 0 0 3px #ffd70055;
}

.v-btn, .v-list-item {
  outline: none;
}

.v-btn:focus, .v-list-item:focus {
  box-shadow: 0 0 0 2px #ffd70099;
}

/* --- Card and Section Spacing --- */
.v-card-text, .pa-6, .pa-8 {
  padding: 2rem !important;
}

.section-header {
  margin-bottom: 2rem !important;
}

/* --- Color Contrast Fixes --- */
.text-grey-darken-1, .text-grey-darken-2, .text-grey-darken-3 {
  color: #232946 !important;
}

.text-white-lighten-2 {
  color: #f4f4f4 !important;
}

/* --- Miscellaneous --- */
@media (max-width: 900px) {
  .v-main {
    margin-left: 0 !important;
  }
  .left-menu-fixed {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 56px;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>