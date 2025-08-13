<template>
  <section class="benefits">
    <!-- Background Elements -->
    <div class="background-elements">
      <div class="bg-gradient-1" />
      <div class="bg-gradient-2" />
      <div class="floating-shapes">
        <div class="shape shape-1" />
        <div class="shape shape-2" />
        <div class="shape shape-3" />
      </div>
    </div>

    <div class="container">
      <!-- Section Header -->
      <div
        class="section-header"
        data-aos="fade-up"
      >
        <div class="header-badge">
          <v-icon size="16">
            mdi-check-decagram
          </v-icon>
          <span>Why Choose Us</span>
        </div>
        <h2 class="main-title">
          Managing Freelance Work is 
          <span class="highlight">Complicated</span>.<br>
          We Make it <span class="highlight">Simple</span>.
        </h2>
        <p class="section-subtitle">
          Transform your freelance workflow with powerful tools designed to streamline 
          every aspect of your business from project management to financial tracking.
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="benefit-items">
        <div
          v-for="(item, index) in benefits"
          :key="index"
          class="benefit-item"
          :data-aos="`fade-up`"
          :data-aos-delay="index * 100"
        >
          <!-- Icon Container -->
          <div class="icon-container">
            <div class="icon-background" />
            <div class="icon">
              <v-icon
                :icon="item.icon"
                size="50"
                color="#0C9C8D"
              />
            </div>
            <div class="icon-glow" />
          </div>

          <!-- Content -->
          <div class="benefit-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>

          <!-- Hover Effect -->
          <div class="hover-overlay" />
          
          <!-- Number Badge -->
          <div class="number-badge">
            {{ String(index + 1).padStart(2, '0') }}
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div
        class="bottom-cta"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <h3>Ready to Simplify Your Freelance Business?</h3>
        <p>Join thousands of freelancers who have streamlined their workflow with our platform.</p>
        <div class="cta-buttons">
          <a
            href="#"
            class="btn-primary"
          >
            <span>Get Started Free</span>
            <v-icon size="16">mdi-arrow-right</v-icon>
          </a>
          <a
            href="#"
            class="btn-secondary"
          >
            <v-icon size="16">mdi-play</v-icon>
            <span>Watch Demo</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "BenefitsSection",
  data() {
    return {
      benefits: [
        {
          icon: "mdi-folder-open",
          title: "Project Management",
          description:
            "Easily manage all your projects from a single dashboard. Organize, prioritize, and track progress to ensure timely delivery and improved productivity.",
        },
        {
          icon: "mdi-checkbox-outline",
          title: "Task Management",
          description:
            "Break down projects into manageable tasks. Assign deadlines, set reminders, and keep everything organized so you never miss a deadline.",
        },
        {
          icon: "mdi-account-group",
          title: "Client Management",
          description:
            "Maintain strong client relationships with our client management feature. Keep track of communication, project status, and important details all in one place.",
        },
        {
          icon: "mdi-trending-up",
          title: "Income Tracking",
          description:
            "Automatically track your income from multiple platforms like UpWork, Fiverr, and Freelancer.com. Gain insights into your earnings and streamline your financial planning.",
        },
        {
          icon: "mdi-credit-card-outline",
          title: "Expense Tracking",
          description:
            "Keep an eye on your expenses effortlessly. Record and categorize all your business expenses to have a clear understanding of your financial health.",
        },
        {
          icon: "mdi-calculator",
          title: "Tax Estimation/Calculator",
          description:
            "Easily estimate your taxes with our built-in tax calculator. Get insights on your tax obligations so you can plan ahead and avoid surprises at tax time.",
        },
      ],
    };
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
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
.benefits {
  position: relative;
  padding: 6rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fffe 50%, #ffffff 100%);
  overflow: hidden;
}

/* Background Elements */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-gradient-1 {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 60%;
  height: 120%;
  background: radial-gradient(circle, rgba(12, 156, 141, 0.03) 0%, transparent 70%);
  transform: rotate(45deg);
}

.bg-gradient-2 {
  position: absolute;
  bottom: -50%;
  left: -20%;
  width: 60%;
  height: 120%;
  background: radial-gradient(circle, rgba(12, 156, 141, 0.05) 0%, transparent 70%);
  transform: rotate(-45deg);
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  opacity: 0.1;
}

.shape-1 {
  width: 100px;
  height: 100px;
  background: #0C9C8D;
  border-radius: 50%;
  top: 20%;
  left: 10%;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 80px;
  height: 80px;
  background: #0C9C8D;
  border-radius: 30%;
  top: 60%;
  right: 15%;
  animation: float 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 60px;
  height: 60px;
  background: #0C9C8D;
  border-radius: 20%;
  bottom: 30%;
  left: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(12, 156, 141, 0.1);
  color: #0C9C8D;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(12, 156, 141, 0.2);
}

.main-title {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(135deg, #0C9C8D 0%, #0db3a1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto;
}

/* Benefits Grid */
.benefit-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.benefit-item {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(12, 156, 141, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  cursor: pointer;
}

.benefit-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(12, 156, 141, 0.02) 0%, rgba(12, 156, 141, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.benefit-item:hover::before {
  opacity: 1;
}

.benefit-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(12, 156, 141, 0.1);
  border-color: rgba(12, 156, 141, 0.2);
}

/* Icon Container */
.icon-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.icon-background {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(12, 156, 141, 0.1) 0%, rgba(12, 156, 141, 0.2) 100%);
  border-radius: 20px;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.icon {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon .v-icon {
  transition: all 0.3s ease;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(12, 156, 141, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.benefit-item:hover .icon-background {
  background: linear-gradient(135deg, rgba(12, 156, 141, 0.2) 0%, rgba(12, 156, 141, 0.3) 100%);
  transform: translate(-50%, -50%) rotate(10deg) scale(1.1);
}

.benefit-item:hover .icon .v-icon {
  transform: scale(1.1);
  color: #0db3a1 !important;
}

.benefit-item:hover .icon-glow {
  opacity: 1;
}

/* Content */
.benefit-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.benefit-item h3 {
  font-size: 1.5rem;
  color: #0C9C8D;
  margin-bottom: 1rem;
  font-weight: 600;
  transition: color 0.3s ease;
}

.benefit-item:hover h3 {
  color: #0db3a1;
}

.benefit-item p {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Number Badge */
.number-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 30px;
  height: 30px;
  background: rgba(12, 156, 141, 0.1);
  color: #0C9C8D;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.benefit-item:hover .number-badge {
  background: #0C9C8D;
  color: white;
  transform: scale(1.1);
}

/* Hover Overlay */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(12, 156, 141, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.benefit-item:hover .hover-overlay {
  opacity: 1;
}

/* Bottom CTA */
.bottom-cta {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(12, 156, 141, 0.05) 0%, rgba(12, 156, 141, 0.1) 100%);
  border-radius: 20px;
  border: 1px solid rgba(12, 156, 141, 0.1);
}

.bottom-cta h3 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.bottom-cta p {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #0C9C8D 0%, #0db3a1 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(12, 156, 141, 0.3);
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
  box-shadow: 0 12px 35px rgba(12, 156, 141, 0.4);
}

.btn-secondary {
  background: white;
  color: #0C9C8D;
  border: 2px solid #0C9C8D;
  box-shadow: 0 4px 15px rgba(12, 156, 141, 0.1);
}

.btn-secondary:hover {
  background: #0C9C8D;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(12, 156, 141, 0.3);
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
  .benefits {
    padding: 4rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .benefit-items {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .benefit-item {
    padding: 2rem;
  }
  
  .bottom-cta {
    padding: 2rem 1rem;
  }
  
  .bottom-cta h3 {
    font-size: 1.75rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }
  
  .benefit-items {
    grid-template-columns: 1fr;
  }
  
  .benefit-item {
    padding: 1.5rem;
  }
  
  .icon-container {
    width: 60px;
    height: 60px;
    margin-bottom: 1.5rem;
  }
  
  .icon .v-icon {
    font-size: 40px !important;
  }
  
  .benefit-item h3 {
    font-size: 1.25rem;
  }
  
  .bottom-cta h3 {
    font-size: 1.5rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles */
.benefit-item:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 4px;
}

.btn-primary:focus,
.btn-secondary:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 2px;
}
</style>