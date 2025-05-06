<template>
    <v-app>
      <LeftMenu
        :rail="!sidebarExpanded"
        @update:rail="sidebarExpanded = !$event"
      />
      
      <v-main
        :class="{ 'ml-60': sidebarExpanded, 'ml-14': !sidebarExpanded }"
        class="transition-all duration-300"
      >
        <v-container
          fluid
          class="pa-6"
        >
          <!-- Header with Search -->
          <div class="d-flex justify-space-between align-center mb-10">
            <div class="logo">
              <!-- You can add your logo here if needed -->
            </div>
            
            <div class="d-flex align-center gap-4">
              <div class="search-container">
                <v-text-field
                  density="compact"
                  placeholder="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  class="rounded-pill"
                  style="max-width: 240px;"
                />
              </div>
              
              <v-btn
                icon
                class="bg-purple-lighten-4"
                color="purple"
              >
                <v-icon>mdi-earth</v-icon>
              </v-btn>
              
              <v-btn
                icon
                class="bg-amber-lighten-4"
                color="amber"
              >
                <v-icon>mdi-bell</v-icon>
              </v-btn>
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="support-container">
            <h1 class="text-h4 font-weight-bold mb-2">Support & Feedback</h1>
            <p class="text-subtitle-1 text-grey mb-8">Get help, share your thoughts, and help us improve Freelance Task</p>
            
            <!-- Help & Support Section -->
            <div class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-6">Help & Support</h2>
              
              <div class="d-flex flex-wrap gap-6 mb-8">
                <!-- Quick Help Card -->
                <v-card
                  width="320"
                  height="220"
                  class="support-card"
                  variant="outlined"
                >
                  <v-card-item>
                    <v-card-title class="d-flex align-center gap-2 text-primary">
                      <v-icon color="primary" size="large">mdi-help-circle</v-icon>
                      Quick Help
                    </v-card-title>
                  </v-card-item>
                  
                  <v-card-text>
                    <p class="mb-4">Find quick answers to common questions and issues.</p>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in helpItems"
                        :key="index"
                        :title="item.title"
                        density="compact"
                        class="pl-0"
                        @click="openKnowledgeBase(item)"
                      >
                        <template v-slot:prepend>
                          <v-icon color="primary" size="small">mdi-arrow-right</v-icon>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
                
                <!-- Knowledge Base Card -->
                <v-card
                  width="320"
                  height="220"
                  class="support-card"
                  variant="outlined"
                >
                  <v-card-item>
                    <v-card-title class="d-flex align-center gap-2 text-primary">
                      <v-icon color="primary" size="large">mdi-book-open-page-variant</v-icon>
                      Knowledge Base
                    </v-card-title>
                  </v-card-item>
                  
                  <v-card-text>
                    <p class="mb-4">Browse our comprehensive documentation and tutorials.</p>
                    <v-btn
                      color="primary"
                      variant="text"
                      class="px-0"
                      @click="openDocumentation"
                    >
                      Browse documentation
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
                
                <!-- Contact Support Card -->
                <v-card
                  width="320"
                  height="220"
                  class="support-card"
                  variant="outlined"
                >
                  <v-card-item>
                    <v-card-title class="d-flex align-center gap-2 text-primary">
                      <v-icon color="primary" size="large">mdi-headset</v-icon>
                      Contact Support
                    </v-card-title>
                  </v-card-item>
                  
                  <v-card-text>
                    <p class="mb-4">Need personalized help? Our support team is ready to assist you.</p>
                    <v-btn
                      color="primary"
                      variant="flat"
                      @click="openContactForm"
                    >
                      Contact Support
                    </v-btn>
                  </v-card-text>
                </v-card>
              </div>
            </div>
            
            <!-- Submit Feedback Section -->
            <div class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-6">Submit Feedback</h2>
              
              <v-card class="mb-6 pa-6" variant="outlined">
                <p class="text-body-1 mb-6">
                  Your feedback helps us improve Freelance Task. Tell us what you love, what could be better, or suggest new features.
                </p>
                
                <v-form @submit.prevent="submitFeedback">
                  <v-select
                    v-model="feedbackType"
                    :items="feedbackTypes"
                    label="Feedback Type"
                    variant="outlined"
                    class="mb-4"
                    required
                  />
                  
                  <v-text-field
                    v-model="feedbackSubject"
                    label="Subject"
                    variant="outlined"
                    class="mb-4"
                    required
                  />
                  
                  <v-textarea
                    v-model="feedbackMessage"
                    label="Your Feedback"
                    variant="outlined"
                    rows="4"
                    counter="500"
                    :maxlength="500"
                    class="mb-4"
                    required
                  />
                  
                  <div class="mb-4">
                    <p class="mb-2 text-body-2">Rate your overall experience</p>
                    <v-rating
                      v-model="feedbackRating"
                      hover
                      half-increments
                      size="large"
                      color="amber"
                    />
                  </div>
                  
                  <v-file-input
                    v-model="attachments"
                    label="Attach Screenshots or Files"
                    variant="outlined"
                    prepend-icon="mdi-paperclip"
                    show-size
                    counter
                    multiple
                    class="mb-6"
                    accept="image/*, application/pdf"
                  />
                  
                  <div class="d-flex justify-end">
                    <v-btn
                      color="primary"
                      variant="flat"
                      type="submit"
                      :loading="submitting"
                    >
                      Submit Feedback
                    </v-btn>
                  </div>
                </v-form>
              </v-card>
            </div>
            
            <!-- Community & Resources Section -->
            <div>
              <h2 class="text-h5 font-weight-bold mb-6">Community & Resources</h2>
              
              <div class="d-flex flex-wrap gap-6">
                <!-- Community Forums Card -->
                <v-card
                  width="320"
                  class="support-card"
                  variant="outlined"
                >
                  <v-card-item>
                    <v-card-title class="d-flex align-center gap-2">
                      <v-icon color="primary" size="large">mdi-forum</v-icon>
                      Community Forums
                    </v-card-title>
                  </v-card-item>
                  
                  <v-card-text>
                    <p class="mb-4">Connect with other freelancers, share tips, and get advice from the community.</p>
                    <v-btn
                      color="primary"
                      variant="text"
                      class="px-0"
                      @click="openForums"
                    >
                      Join the conversation
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
                
                <!-- Tutorials Card -->
                <v-card
                  width="320"
                  class="support-card"
                  variant="outlined"
                >
                  <v-card-item>
                    <v-card-title class="d-flex align-center gap-2">
                      <v-icon color="primary" size="large">mdi-video</v-icon>
                      Video Tutorials
                    </v-card-title>
                  </v-card-item>
                  
                  <v-card-text>
                    <p class="mb-4">Watch step-by-step video guides to master Freelance Task features.</p>
                    <v-btn
                      color="primary"
                      variant="text"
                      class="px-0"
                      @click="openTutorials"
                    >
                      View tutorials
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
                
                <!-- Blog Card -->
                <v-card
                  width="320"
                  class="support-card"
                  variant="outlined"
                >
                  <v-card-item>
                    <v-card-title class="d-flex align-center gap-2">
                      <v-icon color="primary" size="large">mdi-newspaper</v-icon>
                      Blog & Updates
                    </v-card-title>
                  </v-card-item>
                  
                  <v-card-text>
                    <p class="mb-4">Stay updated with the latest features, tips, and freelancing trends.</p>
                    <v-btn
                      color="primary"
                      variant="text"
                      class="px-0"
                      @click="openBlog"
                    >
                      Read our blog
                      <v-icon end>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </div>
          
          <!-- Contact Support Dialog -->
          <v-dialog
            v-model="showContactDialog"
            max-width="600"
            persistent
          >
            <v-card class="pa-6">
              <v-card-title class="text-h5 font-weight-bold">
                Contact Support
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-form @submit.prevent="submitSupportRequest">
                  <v-text-field
                    v-model="supportName"
                    label="Name"
                    variant="outlined"
                    class="mb-4"
                    required
                  />
                  
                  <v-text-field
                    v-model="supportEmail"
                    label="Email"
                    variant="outlined"
                    class="mb-4"
                    required
                    type="email"
                  />
                  
                  <v-select
                    v-model="supportCategory"
                    :items="supportCategories"
                    label="Issue Category"
                    variant="outlined"
                    class="mb-4"
                    required
                  />
                  
                  <v-textarea
                    v-model="supportMessage"
                    label="Describe your issue"
                    variant="outlined"
                    rows="4"
                    class="mb-4"
                    required
                  />
                  
                  <v-file-input
                    v-model="supportAttachments"
                    label="Attach Screenshots or Files"
                    variant="outlined"
                    prepend-icon="mdi-paperclip"
                    show-size
                    counter
                    multiple
                    class="mb-6"
                    accept="image/*, application/pdf"
                  />
                </v-form>
              </v-card-text>
              
              <v-card-actions class="pt-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="grey-darken-1"
                  variant="text"
                  @click="showContactDialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  variant="flat"
                  @click="submitSupportRequest"
                  :loading="submittingSupport"
                >
                  Submit Request
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          <!-- Success Snackbar -->
          <v-snackbar
            v-model="successSnackbar"
            color="success"
            timeout="3000"
          >
            {{ snackbarMessage }}
            <template v-slot:actions>
              <v-btn
                color="white"
                variant="text"
                @click="successSnackbar = false"
              >
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import LeftMenu from '@/dashboard/LeftMenu.vue'
  
  export default {
    name: 'SupportFeedbackPage',
    components: {
      LeftMenu
    },
    data() {
      return {
        sidebarExpanded: true,
        
        // Quick help items
        helpItems: [
          { title: 'Getting started guide', link: '/help/getting-started' },
          { title: 'Account settings', link: '/help/account-settings' },
          { title: 'Billing & payments', link: '/help/billing-payments' }
        ],
        
        // Feedback form
        feedbackType: '',
        feedbackTypes: [
          'Feature suggestion',
          'Bug report',
          'User experience',
          'General feedback',
          'Other'
        ],
        feedbackSubject: '',
        feedbackMessage: '',
        feedbackRating: 3,
        attachments: [],
        submitting: false,
        
        // Support form
        showContactDialog: false,
        supportName: '',
        supportEmail: '',
        supportCategory: '',
        supportCategories: [
          'Technical issue',
          'Billing issue',
          'Account problem',
          'Feature question',
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
      openKnowledgeBase(item) {
        console.log('Opening knowledge base:', item.link);
        // Navigate to the help article
        // this.$router.push(item.link);
      },
      
      openDocumentation() {
        console.log('Opening documentation');
        // Navigate to documentation page
        // this.$router.push('/documentation');
        
        // Or open in new tab
        // window.open('/documentation', '_blank');
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
          
          // Example API call:
          // this.$api.feedback.submit({
          //   type: this.feedbackType,
          //   subject: this.feedbackSubject,
          //   message: this.feedbackMessage,
          //   rating: this.feedbackRating,
          //   attachments: this.attachments
          // })
          //   .then(response => {
          //     this.showSnackbar('Thank you for your feedback!');
          //     this.resetFeedbackForm();
          //   })
          //   .catch(error => {
          //     console.error('Error submitting feedback:', error);
          //   })
          //   .finally(() => {
          //     this.submitting = false;
          //   });
          
          this.submitting = false;
          this.showSnackbar('Thank you for your feedback!');
          this.resetFeedbackForm();
        }, 1500);
      },
      
      resetFeedbackForm() {
        this.feedbackType = '';
        this.feedbackSubject = '';
        this.feedbackMessage = '';
        this.feedbackRating = 3;
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
          
          // Example API call:
          // this.$api.support.submit({
          //   name: this.supportName,
          //   email: this.supportEmail,
          //   category: this.supportCategory,
          //   message: this.supportMessage,
          //   attachments: this.supportAttachments
          // })
          //   .then(response => {
          //     this.showContactDialog = false;
          //     this.showSnackbar('Support request submitted. We\'ll get back to you soon!');
          //     this.resetSupportForm();
          //   })
          //   .catch(error => {
          //     console.error('Error submitting support request:', error);
          //   })
          //   .finally(() => {
          //     this.submittingSupport = false;
          //   });
          
          this.submittingSupport = false;
          this.showContactDialog = false;
          this.showSnackbar('Support request submitted. We\'ll get back to you soon!');
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
  .support-card {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .support-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
  
  /* Table styling */
  :deep(.v-table) {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    overflow: hidden;
  }
  
  /* Button styling */
  :deep(.v-btn) {
    text-transform: none;
    font-weight: 500;
  }
  
  /* Rounded search field */
  :deep(.v-text-field .v-field__outline__start) {
    border-radius: 20px 0 0 20px;
  }
  
  :deep(.v-text-field .v-field__outline__end) {
    border-radius: 0 20px 20px 0;
  }
  </style>