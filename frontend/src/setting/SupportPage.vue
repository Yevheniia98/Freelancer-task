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
        class="pa-6 container-full-width"
      >
        <!-- Enhanced Header Section -->
        <div class="hero-section">
          <div class="header-content">
            <div>
              <h1 class="text-h3 font-weight-bold text-grey-darken-3 mb-3">
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
              class="px-4 support-chip"
            >
              <v-icon start>
                mdi-headset
              </v-icon>
              24/7 Support Available
            </v-chip>
          </div>
          
          <!-- Quick Stats Cards -->
          <div class="stats-grid">
            <v-card
              class="stat-card"
              variant="flat"
              color="#6C8CA1"
            >
              <v-card-text class="text-center py-6">
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
              class="stat-card"
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
              class="stat-card"
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
        <div class="content-section">
          <div class="section-header">
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
                  
                <v-card-text class="pa-5">
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
                  
                <v-card-text class="pa-5 d-flex flex-column">
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
                  
                <v-card-text class="pa-5 d-flex flex-column">
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
        <div class="content-section">
          <div class="section-header">
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
              <p class="text-body-2 text-white-lighten-1">
                Your feedback helps us improve Freelance Task
              </p>
            </div>
            
            <v-card-text class="feedback-content">
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
                  
                <div class="rating-section">
                  <p class="text-body-1 font-weight-medium mb-4 text-grey-darken-2">
                    <v-icon class="mr-2">
                      mdi-star
                    </v-icon>
                    Rate your overall experience
                  </p>
                  <div class="rating-controls">
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
                  class="file-input"
                  accept="image/*, application/pdf"
                />
                  
                <div class="submit-section">
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
        <div class="content-section-final">
          <div class="section-header">
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
                <v-card-text class="resource-content">
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
                <v-card-text class="resource-content">
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
                <v-card-text class="resource-content">
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
              
            <v-card-text class="dialog-content">
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
              
            <v-card-actions class="dialog-actions">
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
/* Layout */
/* Layout - Centered content with equal margins */
.ml-60 { 
  margin-left: 30px !important; /* sidebar width (240px) + 30px margin */
  margin-right: 30px !important; 
}
.ml-14 { 
  margin-left: 30px !important; /* collapsed sidebar width (72px) + 30px margin */
  margin-right: 30px !important; 
}
.transition-all { transition: all 0.3s ease; }

.container-full-width { 
  max-width: 1200px !important;
  margin: 0 auto !important;
  width: 100%;
  padding-left: 30px !important;
  padding-right: 30px !important;
}

/* Section Spacing */
.hero-section {
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.support-chip {
  flex-shrink: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.content-section {
  margin-bottom: 20px;
}

.content-section-final {
  margin-bottom: 10px;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  margin-bottom: 8px;
}

.section-header p {
  margin: 0;
}

/* Cards */
.support-card, .feedback-card, .resource-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.support-card:hover, .feedback-card:hover, .resource-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 20px;
  border-radius: 16px 16px 0 0;
  text-align: center;
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

.card-header-gradient {
  padding: 20px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

/* Feedback Card Content */
.feedback-content {
  padding: 24px;
}

.rating-section {
  margin-bottom: 20px;
}

.rating-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-input {
  margin-bottom: 24px;
}

.submit-section {
  display: flex;
  justify-content: flex-end;
}

/* Resource Cards */
.resource-content {
  padding: 24px;
  text-align: center;
}

/* Stats Cards */
.stat-card {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Dialog */
.support-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  padding: 24px;
  background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
  text-align: center;
}

.dialog-content {
  padding: 24px;
}

.dialog-actions {
  padding: 24px;
  padding-top: 0;
}

/* Fixed styles for left menu */
:deep(.left-menu-fixed) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 999 !important;
  width: 72px;
  overflow-y: hidden !important;
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.left-menu-fixed.expanded) {
  width: 0px !important;
}

/* Main Content */
.v-main {
  margin-left: 0px !important;
  background: #f8f9fb;
  overflow-y: auto;
  height: 99vh !important;
  transition: margin-left 0.2s cubic-bezier(.4,0,.2,1);
}

.v-main.ml-60 {
  margin-left: 30px !important;
}

/* Buttons */
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

/* Form Elements */
.v-text-field, .v-select, .v-textarea, .v-file-input {
  border-radius: 12px !important;
}

.v-text-field .v-field__outline__start,
.v-text-field .v-field__outline__end,
.v-select .v-field__outline__start,
.v-select .v-field__outline__end,
.v-textarea .v-field__outline__start,
.v-textarea .v-field__outline__end,
.v-file-input .v-field__outline__start,
.v-file-input .v-field__outline__end {
  border-radius: 12px !important;
}

/* Spacing utilities */
.pa-5 {
  padding: 20px !important;
}

.pa-6 {
  padding: 24px !important;
}

/* Color fixes */
.text-grey-darken-1, .text-grey-darken-2, .text-grey-darken-3 {
  color: #232946 !important;
}

.text-white-lighten-1 {
  color: #f4f4f4 !important;
}

.text-white-lighten-2 {
  color: #f0f0f0 !important;
}

/* Help Items */
.help-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.help-item:hover {
  background: rgba(26, 35, 126, 0.05);
}

/* Accessibility */
.support-card:focus-within, 
.feedback-card:focus-within, 
.resource-card:focus-within {
  box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.2);
}

.v-btn:focus, 
.v-list-item:focus {
  box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.3);
}

/* Responsive Design */
@media (max-width: 960px) {
  .v-main {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .support-chip {
    align-self: flex-start;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .hero-section {
    padding: 20px;
    margin-bottom: 16px;
  }
  
  .content-section {
    margin-bottom: 16px;
  }
  
  .section-header {
    margin-bottom: 16px;
  }
  
  .feedback-content {
    padding: 20px;
  }
  
  .resource-content {
    padding: 20px;
  }
  
  .dialog-header,
  .dialog-content {
    padding: 20px;
  }
  
  .rating-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 16px;
  }
  
  .feedback-content,
  .resource-content {
    padding: 16px;
  }
  
  .dialog-header,
  .dialog-content {
    padding: 16px;
  }
  
  .pa-5 {
    padding: 16px !important;
  }
  
  .pa-6 {
    padding: 18px !important;
  }
  
  .card-header,
  .card-header-gradient {
    padding: 16px;
  }
  
  .submit-section {
    justify-content: stretch;
  }
  
  .submit-section .v-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-section {
    padding: 12px;
  }
  
  .v-container {
    padding: 16px !important;
  }
}
</style>