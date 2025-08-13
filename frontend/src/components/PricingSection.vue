<template>
  <section
    id="pricing"
    class="pricing-section"
  >
    <!-- Background Elements -->
    <div class="background-elements">
      <div class="bg-shape shape-1" />
      <div class="bg-shape shape-2" />
      <div class="floating-icons">
        <div class="floating-icon icon-1">
          €
        </div>
        <div class="floating-icon icon-2">
          💼
        </div>
        <div class="floating-icon icon-3">
          ⚡
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Section Header -->
      <div
        class="section-header"
        data-aos="fade-up"
      >
        <div class="pricing-badge">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <path d="M16 8l-4-4-4 4" />
            <path d="M12 4v12" />
          </svg>
          <span>Transparent Pricing</span>
        </div>
        
        <h2 class="main-title">
          Simple Pricing. <span class="highlight">No Surprises</span>.
        </h2>
        
        <p class="section-subtitle">
          Choose the perfect plan for your freelance business. Start with our Basic plan 
          and scale up as your business grows.
        </p>

        <!-- Billing Toggle -->
        <div class="billing-toggle">
          <span
            class="toggle-label"
            :class="{ active: !isAnnual }"
          >Monthly</span>
          <div
            class="toggle-switch"
            @click="toggleBilling"
          >
            <div
              class="toggle-slider"
              :class="{ annual: isvisa}"
            />
          </div>
          <span
            class="toggle-label"
            :class="{ active: isAnnual }"
          >
            Annual 
            <span class="discount-badge">Save 20%</span>
          </span>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="pricing-cards">
        <!-- Basic Plan -->
        <div
          class="pricing-card"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div class="card-header">
            <h4>Basic Plan</h4>
            <div class="price-container">
              <div class="price">
                <span class="currency">€</span>
                <span class="amount">{{ getPrice(20) }}</span>
                <span class="period">/month</span>
              </div>
              <div class="tax-note">
                + {{ getTax(20) }} German tax
              </div>
            </div>
            <p class="plan-description">
              Perfect for individual freelancers starting out
            </p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Project Management (Max 5 active projects)</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Basic Task Management</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Client Management</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Income & Expense Tracking</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Time Tracking (150 hours/month)</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Calendar & Reminders</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Platform Integration (3 platforms)</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Tax Calculator</span>
            </div>
            
            <!-- Limited Features -->
            <div class="limited-features">
              <div class="feature-item limited">
                <svg
                  class="limited-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  />
                  <path d="M15 9l-6 6" />
                  <path d="M9 9l6 6" />
                </svg>
                <span>No Gantt Charts (Available with upgrade)</span>
              </div>
              <div class="feature-item limited">
                <svg
                  class="limited-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  />
                  <path d="M15 9l-6 6" />
                  <path d="M9 9l6 6" />
                </svg>
                <span>No Team Collaboration (Available with upgrade)</span>
              </div>
            </div>
          </div>

          <button
            class="price-btn"
            @click="goToPayment(20)"
          >
            <span>Start Basic Plan</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Team Plan -->
        <div
          class="pricing-card featured"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div class="popular-badge">
            Most Popular
          </div>
          <div class="card-header">
            <h4>Team Plan</h4>
            <div class="price-container">
              <div class="price">
                <span class="currency">€</span>
                <span class="amount">{{ getPrice(85) }}</span>
                <span class="period">/month</span>
              </div>
              <div class="tax-note">
                + {{ getTax(85) }} German tax
              </div>
              <div class="team-note">
                Up to 5 team members
              </div>
            </div>
            <p class="plan-description">
              Perfect for growing teams and agencies
            </p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Unlimited Project Management</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Advanced Task Management</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Advanced Client Management</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Team Collaboration (5 members)</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Team Chat & Communication</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Gantt Charts & Timeline Tracking</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Unlimited Time Tracking</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Unlimited Platform Integration</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Advanced Reporting & Analytics</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Priority Support</span>
            </div>
          </div>

          <button
            class="price-btn featured-btn"
            @click="goToPayment(85)"
          >
            <span>Start Team Plan</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Premium Plan -->
        <div
          class="pricing-card"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div class="card-header">
            <h4>Premium Business</h4>
            <div class="price-container">
              <div class="price">
                <span class="currency">€</span>
                <span class="amount">{{ getPrice(149) }}</span>
                <span class="period">/month</span>
              </div>
              <div class="tax-note">
                + {{ getTax(149) }} German tax
              </div>
              <div class="team-note">
                For startups & small businesses
              </div>
            </div>
            <p class="plan-description">
              Enterprise features for growing businesses
            </p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Everything in Team Plan</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Unlimited Team Members</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Advanced Automation</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Custom Workflows</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>API Access & Integrations</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>White-label Options</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Advanced Security & Compliance</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Dedicated Account Manager</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>Custom Onboarding & Training</span>
            </div>
            <div class="feature-item">
              <svg
                class="check-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span>24/7 Premium Support</span>
            </div>
          </div>

          <button
            class="price-btn"
            @click="goToPayment(149)"
          >
            <span>Contact Sales</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Bottom Section -->
      <div
        class="bottom-section"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <div class="guarantee-section">
          <div class="guarantee-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div class="guarantee-content">
            <h4>30-Day Money-Back Guarantee</h4>
            <p>Try any plan risk-free. If you're not satisfied, get a full refund within 30 days.</p>
          </div>
        </div>

        <div class="faq-section">
          <h4>Have questions?</h4>
          <p>Check our <a href="#faq">FAQ section</a> or <a href="#contact">contact our support team</a></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const goToPayment = (price) => {
      router.push(`/card-payment?plan=${price}`);
    };

    return { goToPayment };
  },
  data() {
    return {
      isAnnual: false
    };
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
    toggleBilling() {
      this.isAnnual = !this.isAnnual;
    },
    getPrice(monthlyPrice) {
      if (this.isAnnual) {
        const annualPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount
        return Math.round(annualPrice / 12);
      }
      return monthlyPrice;
    },
    getTax(price) {
      const finalPrice = this.getPrice(price);
      const tax = Math.round(finalPrice * 0.19); // 19% German VAT
      return `€${tax}`;
    },
    initScrollAnimations() {
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
.pricing-section {
  position: relative;
  font-family: 'Poppins', sans-serif;
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

.bg-shape {
  position: absolute;
  opacity: 0.05;
  border-radius: 50%;
  background: #0C9C8D;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  right: 5%;
  animation: float 10s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  left: 10%;
  animation: float 12s ease-in-out infinite reverse;
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-icon {
  position: absolute;
  font-size: 2rem;
  opacity: 0.1;
  color: #0C9C8D;
}

.icon-1 { top: 20%; left: 15%; animation: float 8s ease-in-out infinite; }
.icon-2 { top: 50%; right: 20%; animation: float 10s ease-in-out infinite reverse; }
.icon-3 { bottom: 30%; left: 50%; animation: float 6s ease-in-out infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
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

.pricing-badge {
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
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 3rem;
}

/* Billing Toggle */
.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.toggle-label {
  font-weight: 600;
  color: #666;
  transition: color 0.3s ease;
}

.toggle-label.active {
  color: #0C9C8D;
}

.toggle-switch {
  position: relative;
  width: 60px;
  height: 30px;
  background: #e2e8f0;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-slider.annual {
  transform: translateX(30px);
}

.discount-badge {
  background: #0C9C8D;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

/* Pricing Cards */
.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.pricing-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.pricing-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(12, 156, 141, 0.15);
  border-color: rgba(12, 156, 141, 0.2);
}

.pricing-card.featured {
  border-color: #0C9C8D;
  transform: scale(1.05);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-10px);
}

.popular-badge {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  color: white;
  padding: 0.5rem 2rem;
  border-radius: 0 0 20px 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h4 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.price-container {
  margin-bottom: 1rem;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.5rem;
  color: #0C9C8D;
  font-weight: 600;
}

.amount {
  font-size: 3rem;
  font-weight: 800;
  color: #333;
  margin: 0 0.25rem;
}

.period {
  font-size: 1.125rem;
  color: #666;
}

.tax-note, .team-note {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.plan-description {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

/* Features List */
.features-list {
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #4a5568;
}

.check-icon {
  color: #0C9C8D;
  flex-shrink: 0;
  margin-top: 2px;
}

.limited-features {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.feature-item.limited {
  opacity: 0.6;
}

.limited-icon {
  color: #e53e3e;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Buttons */
.price-btn {
  width: 100%;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.price-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.price-btn:hover::before {
  left: 100%;
}

.price-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(12, 156, 141, 0.3);
}

.featured-btn {
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  box-shadow: 0 15px 40px rgba(12, 156, 141, 0.3);
}

.featured-btn:hover {
  box-shadow: 0 20px 50px rgba(12, 156, 141, 0.4);
}

/* Bottom Section */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 4rem;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(12, 156, 141, 0.05) 0%, rgba(12, 156, 141, 0.1) 100%);
  border-radius: 20px;
  border: 1px solid rgba(12, 156, 141, 0.1);
}

.guarantee-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.guarantee-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.guarantee-content h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.guarantee-content p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.faq-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.faq-section h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.faq-section p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.faq-section a {
  color: #0C9C8D;
  text-decoration: none;
  font-weight: 600;
}

.faq-section a:hover {
  text-decoration: underline;
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
  .pricing-section {
    padding: 4rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .billing-toggle {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pricing-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .pricing-card {
    padding: 2rem;
  }

  .pricing-card.featured {
    transform: none;
  }

  .pricing-card.featured:hover {
    transform: translateY(-10px);
  }

  .amount {
    font-size: 2.5rem;
  }

  .bottom-section {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .guarantee-section {
    flex-direction: column;
    text-align: center;
  }

  .floating-icon {
    display: none;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .pricing-card {
    padding: 1.5rem;
  }

  .amount {
    font-size: 2rem;
  }

  .feature-item {
    font-size: 0.875rem;
  }

  .bottom-section {
    padding: 1.5rem;
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
.pricing-card:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 4px;
}

.price-btn:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 2px;
}

.toggle-switch:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 2px;
}
</style>