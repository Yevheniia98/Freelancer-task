<template>
  <section class="faq">
    <!-- Background Elements -->
    <div class="background-elements">
      <div class="bg-pattern pattern-1" />
      <div class="bg-pattern pattern-2" />
      <div class="floating-elements">
        <div class="floating-question question-1">
          ?
        </div>
        <div class="floating-question question-2">
          ?
        </div>
        <div class="floating-question question-3">
          ?
        </div>
      </div>
      <div class="gradient-overlay" />
    </div>

    <div class="container">
      <!-- Section Header -->
      <div
        class="section-header"
        data-aos="fade-up"
      >
        <div class="faq-badge">
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
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          <span>Got Questions?</span>
        </div>
        
        <h2 class="main-title">
          Frequently Asked <span class="highlight">Questions</span>
        </h2>
        
        <p class="section-subtitle">
          Find answers to common questions about our platform. Can't find what you're looking for? 
          <a
            href="#contact"
            class="contact-link"
          >Contact our support team</a>.
        </p>
      </div>

      <!-- FAQ Container -->
      <div class="faq-container">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="faq-item"
          :class="{ expanded: faq.show, featured: index < 3 }"
          :data-aos="'fade-up'"
          :data-aos-delay="index * 50"
        >
          <!-- FAQ Question -->
          <div
            class="faq-question"
            :aria-expanded="faq.show"
            :aria-controls="`faq-answer-${index}`"
            role="button"
            tabindex="0"
            @click="toggleAnswer(index)"
            @keydown.enter="toggleAnswer(index)"
            @keydown.space.prevent="toggleAnswer(index)"
          >
            <div class="question-content">
              <div class="question-number">
                {{ String(index + 1).padStart(2, '0') }}
              </div>
              <span class="question-text">{{ faq.question }}</span>
            </div>
            <div class="faq-icon">
              <svg 
                class="chevron-icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </div>
          </div>

          <!-- FAQ Answer -->
          <div 
            :id="`faq-answer-${index}`"
            class="faq-answer-wrapper"
          >
            <div class="faq-answer">
              <div class="answer-content">
                <p>{{ faq.answer }}</p>
                
                <!-- Special CTA for first question -->
                <div
                  v-if="index === 0"
                  class="answer-cta"
                >
                  <a
                    href="#signup"
                    class="cta-button"
                  >
                    <span>Get Started Today</span>
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
                  </a>
                </div>

                <!-- Help link for support question -->
                <div
                  v-if="index === 4"
                  class="answer-cta"
                >
                  <a
                    href="mailto:support@yourproduct.com"
                    class="help-link"
                  >
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
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>Contact Support</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Decorative element -->
          <div class="faq-decoration" />
        </div>
      </div>

      <!-- Bottom CTA Section -->
      <div
        class="bottom-cta"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div class="cta-content">
          <div class="cta-icon">
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div class="cta-text">
            <h3>Still have questions?</h3>
            <p>Our support team is here to help you get the most out of our platform.</p>
          </div>
          <div class="cta-buttons">
            <a
              href="#contact"
              class="btn-primary"
            >
              <span>Contact Support</span>
            </a>
            <a
              href="#live-chat"
              class="btn-secondary"
            >
              <span>Live Chat</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FAQSection",
  data() {
    return {
      faqs: [
        { 
          question: "What is this product for?", 
          answer: "Our SaaS product is designed specifically for freelancers. It's an all-in-one platform that helps freelancers manage projects, clients, tasks, and finances across multiple freelancing platforms like UpWork, Fiverr, Toptal, and others. The goal is to simplify your freelance life by keeping everything in one place, allowing you to focus on doing what you love.", 
          show: false 
        },
        { 
          question: "How do I get started?", 
          answer: "Getting started is easy! Simply sign up with your email or use your Google/LinkedIn account for a quick registration. Once you've signed up, you can start linking your freelance accounts and customizing your dashboard.", 
          show: false 
        },
        { 
          question: "What payment methods do you accept?", 
          answer: "We accept payments via major credit/debit cards, PayPal and Stripe. All transactions are securely processed, and you can choose a monthly or annual subscription plan that fits your needs.", 
          show: false 
        },
        { 
          question: "Is there a free trial available?", 
          answer: "Yes, we offer a 7-day free trial with full access to all features. You can try out the platform and see how it helps streamline your freelance work before committing to a subscription.", 
          show: false
        },
        { 
          question: "What happens if I encounter an issue?", 
          answer: "If you experience any issues while using the platform, you can reach out to us through our support system. Our dedicated support team is here to help you resolve any problems quickly and efficiently.", 
          show: false
        },
        { 
          question: "Can I customize the dashboard?", 
          answer: "Absolutely! The dashboard is fully customizable. You can choose what information to display, rearrange sections, and set up notifications based on your preferences to create a workflow that works best for you.", 
          show: false
        },
        { 
          question: "How secure is my data?", 
          answer: "We take data security very seriously. All your information is encrypted and stored securely using industry-standard protocols. We also provide options for two-factor authentication and regular data backups to ensure your data remains safe.", 
          show: false
        },
        { 
          question: "Can I cancel my subscription anytime?", 
          answer: "Yes, you can cancel your subscription at any time through your account settings. If you cancel during the free trial, you won't be charged. For paid plans, you will continue to have access until the end of the current billing period.", 
          show: false
        },
        { 
          question: "What if I need help setting up?", 
          answer: "If you need assistance getting started, we offer a comprehensive onboarding process with step-by-step guides and video tutorials. You can also reach out to our support team for personalized assistance.", 
          show: false
        },
        { 
          question: "Are there any discounts for long-term subscriptions?", 
          answer: "Yes, we offer significant savings for annual subscriptions - up to 20% off compared to monthly billing. This allows you to save money while getting uninterrupted access to all premium features.", 
          show: false
        },
      ],
    };
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
    toggleAnswer(index) {
      // Close other answers for accordion effect (optional)
      // this.faqs.forEach((faq, i) => {
      //   if (i !== index) faq.show = false;
      // });
      
      this.faqs[index].show = !this.faqs[index].show;
      
      // Ensure proper height calculation after DOM update
      this.$nextTick(() => {
        const faqItem = document.querySelectorAll('.faq-item')[index];
        const answerWrapper = faqItem.querySelector('.faq-answer-wrapper');
        const answerContent = faqItem.querySelector('.faq-answer');
        
        if (this.faqs[index].show && answerContent) {
          const contentHeight = answerContent.scrollHeight;
          answerWrapper.style.maxHeight = (contentHeight + 20) + 'px';
        } else {
          answerWrapper.style.maxHeight = '0px';
        }
      });
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
  },
};
</script>

<style scoped>
.faq {
  position: relative;
  padding: 6rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fffe 50%, #ffffff 100%);
  font-family: 'Poppins', sans-serif;
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

.bg-pattern {
  position: absolute;
  opacity: 0.02;
  background: repeating-linear-gradient(
    45deg,
    #0C9C8D,
    #0C9C8D 2px,
    transparent 2px,
    transparent 20px
  );
}

.pattern-1 {
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  transform: rotate(15deg);
}

.pattern-2 {
  bottom: 0;
  right: 0;
  width: 40%;
  height: 80%;
  transform: rotate(-15deg);
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-question {
  position: absolute;
  font-size: 4rem;
  font-weight: 800;
  color: rgba(12, 156, 141, 0.05);
  pointer-events: none;
}

.question-1 {
  top: 15%;
  left: 10%;
  animation: float-question 12s ease-in-out infinite;
}

.question-2 {
  top: 50%;
  right: 15%;
  animation: float-question 15s ease-in-out infinite reverse;
}

.question-3 {
  bottom: 20%;
  left: 60%;
  animation: float-question 10s ease-in-out infinite;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(12, 156, 141, 0.02) 100%);
}

@keyframes float-question {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(10deg); }
}

.container {
  max-width: 900px;
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

.faq-badge {
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
  max-width: 600px;
  margin: 0 auto;
}

.contact-link {
  color: #0C9C8D;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #0a7063;
  text-decoration: underline;
}

/* FAQ Container */
.faq-container {
  margin-bottom: 4rem;
}

.faq-item {
  position: relative;
  background: white;
  border-radius: 16px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(12, 156, 141, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.faq-item:hover {
  box-shadow: 0 8px 30px rgba(12, 156, 141, 0.1);
  transform: translateY(-2px);
}

.faq-item.expanded {
  box-shadow: 0 12px 40px rgba(12, 156, 141, 0.15);
  border-color: rgba(12, 156, 141, 0.3);
}

.faq-item.featured {
  border-left: 4px solid #0C9C8D;
}

/* FAQ Question */
.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.faq-question:hover {
  background: rgba(12, 156, 141, 0.02);
}

.question-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.question-number {
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.question-text {
  font-weight: 600;
  font-size: 1.125rem;
  color: #333;
  line-height: 1.4;
}

.faq-icon {
  margin-left: 1rem;
  transition: transform 0.3s ease;
  color: #0C9C8D;
}

.chevron-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.expanded .chevron-icon {
  transform: rotate(180deg);
}

/* FAQ Answer */
.faq-answer-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.expanded .faq-answer-wrapper {
  max-height: 1000px;
}

.faq-answer {
  padding: 0 2rem 2rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease 0.1s;
}

.faq-item.expanded .faq-answer {
  opacity: 1;
  transform: translateY(0);
}

.answer-content {
  padding-top: 1.5rem;
}

.answer-content p {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
  margin: 0 0 1rem 0;
}

.answer-cta {
  margin-top: 1.5rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(12, 156, 141, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 156, 141, 0.4);
}

.help-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #0C9C8D;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.help-link:hover {
  color: #0a7063;
}

/* Decorative element */
.faq-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 0;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  transition: height 0.3s ease;
}

.faq-item.expanded .faq-decoration {
  height: 100%;
}

/* Bottom CTA */
.bottom-cta {
  background: linear-gradient(135deg, rgba(12, 156, 141, 0.05) 0%, rgba(12, 156, 141, 0.1) 100%);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(12, 156, 141, 0.1);
}

.cta-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

.cta-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.cta-text h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.cta-text p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(12, 156, 141, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 156, 141, 0.4);
}

.btn-secondary {
  background: white;
  color: #0C9C8D;
  border: 2px solid #0C9C8D;
}

.btn-secondary:hover {
  background: #0C9C8D;
  color: white;
  transform: translateY(-2px);
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
  .faq {
    padding: 4rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .faq-question {
    padding: 1.25rem 1.5rem;
  }

  .question-content {
    gap: 0.75rem;
  }

  .question-number {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  .question-text {
    font-size: 1rem;
  }

  .faq-answer {
    padding: 0 1.5rem 1.5rem;
  }

  .faq-item.expanded .faq-answer-wrapper {
    max-height: 1500px;
  }

  .cta-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }

  .cta-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .floating-question {
    display: none;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .faq-question {
    padding: 1rem;
  }

  .question-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .question-number {
    align-self: flex-start;
  }

  .faq-answer {
    padding: 0 1rem 1rem;
  }

  .bottom-cta {
    padding: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn-primary, .btn-secondary {
    text-align: center;
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
.faq-question:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 2px;
}

.cta-button:focus,
.btn-primary:focus,
.btn-secondary:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 2px;
}
</style>