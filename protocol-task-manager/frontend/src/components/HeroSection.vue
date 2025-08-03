<template>
  <section class="hero">
    <!-- Background Elements -->
    <div class="hero-background">
      <div class="bg-shape shape-1" />
      <div class="bg-shape shape-2" />
      <div class="bg-shape shape-3" />
      <div class="floating-dots">
        <div class="dot dot-1" />
        <div class="dot dot-2" />
        <div class="dot dot-3" />
        <div class="dot dot-4" />
      </div>
    </div>

    <!-- Hero Content -->
    <div class="hero-content">
      <!-- Badge -->
      <div
        class="hero-badge"
        data-aos="fade-up"
      >
        <i class="fas fa-rocket" />
        <span>All-in-One Freelance Platform</span>
      </div>

      <!-- Main Title -->
      <h1
        class="hero-title"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        Freelancing Simplified: 
        <span class="highlight-text">Integrate Projects</span>, 
        Invoices, Income Tracking, and More.
      </h1>

      <!-- Subtitle -->
      <p
        class="hero-subtitle"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        Manage your freelance work, projects, and income across UpWork, Fiverr, 
        and more—all in one powerful platform designed for modern freelancers.
      </p>

      <!-- CTA Button -->
      <div
        class="hero-cta"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <a
          href="#"
          class="btn-primary"
        >
          <span>Start Your Free Trial</span>
          <i class="fas fa-arrow-right" />
        </a>
        <div class="cta-note">
          <i class="fas fa-check-circle" />
          <span>No credit card required • 14-day free trial</span>
        </div>
      </div>

      <!-- Social Proof -->
      <div
        class="social-proof"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <div class="proof-item">
          <div class="proof-number">
            10K+
          </div>
          <div class="proof-label">
            Active Users
          </div>
        </div>
        <div class="proof-item">
          <div class="proof-number">
            98%
          </div>
          <div class="proof-label">
            Satisfaction
          </div>
        </div>
        <div class="proof-item">
          <div class="proof-number">
            $2M+
          </div>
          <div class="proof-label">
            Revenue Tracked
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Product Showcase -->
    <div
      class="product-showcase"
      data-aos="fade-up"
      data-aos-delay="500"
    >
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-button', { active: activeTab === index }]"
          @click="switchTab(index)"
        >
          <i :class="tab.icon" />
          <span>{{ tab.name }}</span>
        </button>
      </div>

      <!-- Content Display -->
      <div class="showcase-content">
        <div class="content-wrapper">
          <!-- Feature Info -->
          <div class="feature-info">
            <h3 class="feature-title">
              {{ tabs[activeTab].title }}
            </h3>
            <p class="feature-description">
              {{ tabs[activeTab].description }}
            </p>
            
            <div class="feature-highlights">
              <div 
                v-for="(highlight, index) in tabs[activeTab].highlights" 
                :key="index"
                class="highlight-item"
              >
                <i class="fas fa-check" />
                <span>{{ highlight }}</span>
              </div>
            </div>
          </div>

          <!-- Image Showcase -->
          <div class="image-showcase">
            <div class="showcase-wrapper">
              <div 
                v-for="(product, index) in tabs[activeTab].content"
                :key="index"
                class="showcase-item"
                :class="{ active: index === 0 }"
              >
                <div class="image-container">
                  <img
                    :src="product.image"
                    :alt="tabs[activeTab].name"
                  >
                  <!-- Floating UI Elements -->
                  <div
                    v-if="index === 0"
                    class="floating-ui"
                  >
                    <div class="ui-element element-1">
                      <i class="fas fa-check-circle" />
                      <span>Task Completed</span>
                    </div>
                    <div class="ui-element element-2">
                      <i class="fas fa-dollar-sign" />
                      <span>$2,450 Earned</span>
                    </div>
                    <div class="ui-element element-3">
                      <i class="fas fa-users" />
                      <span>5 Active Clients</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Feature Cards -->
            <div class="feature-cards">
              <div class="feature-card card-1">
                <i class="fas fa-chart-line" />
                <div class="card-content">
                  <h4>Revenue Analytics</h4>
                  <p>Track earnings in real-time</p>
                </div>
              </div>
              <div class="feature-card card-2">
                <i class="fas fa-shield-alt" />
                <div class="card-content">
                  <h4>Secure & Reliable</h4>
                  <p>Bank-level security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HeroSection",
  data() {
    return {
      tabs: [
        {
          name: "Projects",
          icon: "fas fa-project-diagram",
          title: "Project Management Made Simple",
          description: "Organize, track, and deliver projects on time with our intuitive project management tools.",
          highlights: [
            "Drag & drop task management",
            "Real-time collaboration",
            "Progress tracking",
            "Deadline management"
          ],
          content: [
            { image: "/ProjectList.png" },
            { image: "/ProjectList.png" }
          ]
        },
        {
          name: "Clients",
          icon: "fas fa-users",
          title: "Client Relationship Management",
          description: "Build stronger relationships with powerful client management and communication tools.",
          highlights: [
            "Client profiles & history",
            "Communication tracking",
            "Contract management",
            "Invoice integration"
          ],
          content: [
            { image: "/Clients.png" },
            { image: "/Clients.png" }
          ]
        },
        {
          name: "Tasks",
          icon: "fas fa-tasks",
          title: "Smart Task Organization",
          description: "Stay organized and productive with intelligent task management and automated workflows.",
          highlights: [
            "Smart task prioritization",
            "Time tracking",
            "Automated reminders",
            "Performance analytics"
          ],
          content: [
            { image: "/Tasks.png" },
            { image: "/Tasks.png" }
          ]
        }
      ],
      activeTab: 0
    };
  },
  mounted() {
    // Initialize AOS animations
    this.initScrollAnimations();
  },
  methods: {
    switchTab(index) {
      this.activeTab = index;
    },
    initScrollAnimations() {
      // Simple scroll animation observer
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      }, observerOptions);

      // Observe all elements with data-aos attribute
      this.$nextTick(() => {
        document.querySelectorAll('[data-aos]').forEach(el => {
          observer.observe(el);
        });
      });
    }
  }
};
</script>

<style scoped>
.hero {
  position: relative;
  background: linear-gradient(135deg, #e6f8f7 0%, #f0fdfc 50%, #e6f8f7 100%);
  font-family: 'Poppins', sans-serif;
  padding: 6rem 2rem 4rem;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Background Elements */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.bg-shape {
  position: absolute;
  opacity: 0.1;
  border-radius: 50%;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: #0A7668;
  top: 10%;
  right: 10%;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: #0A7668;
  bottom: 20%;
  left: 5%;
  animation: float 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: #0A7668;
  top: 50%;
  left: 50%;
  animation: float 6s ease-in-out infinite;
}

.floating-dots {
  position: absolute;
  width: 100%;
  height: 100%;
}

.dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #0A7668;
  border-radius: 50%;
  opacity: 0.3;
}

.dot-1 { top: 20%; left: 20%; animation: pulse 3s ease-in-out infinite; }
.dot-2 { top: 40%; right: 30%; animation: pulse 4s ease-in-out infinite; }
.dot-3 { bottom: 30%; left: 40%; animation: pulse 5s ease-in-out infinite; }
.dot-4 { bottom: 20%; right: 20%; animation: pulse 3.5s ease-in-out infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.5); }
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 4rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(10, 118, 104, 0.1);
  color: #0A7668;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(10, 118, 104, 0.2);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  word-wrap: break-word;
}

.highlight-text {
  background: linear-gradient(135deg, #0A7668 0%, #0d8b7a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  margin-bottom: 3rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  color: white;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #0A7668 0%, #0d8b7a 100%);
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(10, 118, 104, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(10, 118, 104, 0.4);
}

.btn-primary i {
  font-size: 0.875rem;
  transition: transform 0.3s ease;
}

.btn-primary:hover i {
  transform: translateX(3px);
}

.cta-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #0A7668;
}

.social-proof {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.proof-item {
  text-align: center;
  gap: 40px !important;
}

.proof-number {
  font-size: 2rem;
  font-weight: 800;
  color: #0A7668;
  margin-bottom: 0.5rem;
}

.proof-label {
  font-size: 0.875rem;
  color: #4a5568;
  font-weight: 500;
}

/* Product Showcase */
.product-showcase {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

.tab-navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  cursor: pointer;
  color: #4a5568;
  border-radius: 50px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0A7668 0%, #0d8b7a 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab-button span,
.tab-button i {
  position: relative;
  z-index: 2;
}

.tab-button.active::before {
  opacity: 1;
}

.tab-button.active {
  color: white;
  border-color: #0A7668;
  transform: translateY(-2px);
}

.tab-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.showcase-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  min-height: 600px;
}

.feature-info {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.feature-description {
  font-size: 1.125rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.feature-highlights {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #2d3748;
}

.highlight-item i {
  color: #0A7668;
  font-size: 0.875rem;
}

.image-showcase {
  position: relative;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.showcase-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.showcase-item {
  width: 100%;
}

.image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform: perspective(1000px) rotateX(5deg) rotateY(-5deg);
  transition: transform 0.3s ease;
}

.image-container:hover {
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
}

.showcase-item img {
  width: 100%;
  height: auto;
  display: block;
}

/* Floating UI Elements */
.floating-ui {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.ui-element {
  position: absolute;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
}

.element-1 {
  top: 15%;
  right: -15%;
  color: #0A7668;
  animation: floatElement 4s ease-in-out infinite;
}

.element-2 {
  top: 50%;
  left: -20%;
  color: #d69e2e;
  animation: floatElement 5s ease-in-out infinite reverse;
}

.element-3 {
  bottom: 20%;
  right: -10%;
  color: #3182ce;
  animation: floatElement 6s ease-in-out infinite;
}

@keyframes floatElement {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
}

/* Feature Cards */
.feature-cards {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  display: flex;
  gap: 1rem;
}

.feature-card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  min-width: 150px;
}

.feature-card i {
  font-size: 1.25rem;
  color: #0A7668;
}

.card-content h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.card-content p {
  font-size: 0.75rem;
  color: #4a5568;
  margin: 0;
}

/* Animation Classes */
[data-aos] {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-aos].aos-animate {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    padding: 4rem 1rem 3rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .social-proof {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .tab-navigation {
    flex-direction: column;
    align-items: center;
  }
  
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .feature-info {
    padding: 2rem;
    text-align: center;
  }
  
  .image-showcase {
    padding: 2rem 1rem;
  }
  
  .image-container {
    transform: none;
  }
  
  .floating-ui {
    display: none;
  }
  
  .feature-cards {
    position: static;
    margin-top: 2rem;
    justify-content: center;
  }
  
  .shape-1, .shape-2, .shape-3 {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .btn-primary {
    font-size: 1rem;
    padding: 0.875rem 2rem;
  }
  
  .tab-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .feature-title {
    font-size: 1.5rem;
  }
  
  .feature-description {
    font-size: 1rem;
  }
  
  .feature-cards {
    flex-direction: column;
  }
}
</style>