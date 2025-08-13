<template>
  <section class="review">
    <!-- Background Elements -->
    <div class="background-elements">
      <div class="bg-wave wave-1" />
      <div class="bg-wave wave-2" />
      <div class="floating-testimonials">
        <div class="floating-quote quote-1">
          "
        </div>
        <div class="floating-quote quote-2">
          "
        </div>
        <div class="floating-quote quote-3">
          "
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
        <div class="trust-badge">
          <svg
            width="20"
            height="20"
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
          <span>Trusted Worldwide</span>
        </div>
        
        <h3 class="main-title">
          We are <span class="highlight">Trusted</span> by 
          <span class="highlight">Freelancers</span> 
          Around the World
        </h3>
        
        <p class="section-subtitle">
          Join thousands of freelancers who have transformed their workflow and 
          increased their productivity with our platform.
        </p>

        <!-- Trust Stats -->
        <div class="trust-stats">
          <div class="stat-item">
            <div class="stat-number">
              10K+
            </div>
            <div class="stat-label">
              Happy Users
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-number">
              4.9
            </div>
            <div class="stat-label">
              Rating
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-number">
              98%
            </div>
            <div class="stat-label">
              Satisfaction
            </div>
          </div>
        </div>
      </div>

      <!-- Review Cards Section -->
      <div class="review-cards">
        <div
          v-for="(review, index) in reviews"
          :key="index"
          class="review-card"
          :data-aos="'fade-up'"
          :data-aos-delay="index * 100"
        >
          <!-- Quote Icon -->
          <div class="quote-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </div>

          <!-- Review Content -->
          <div class="review-content">
            <p class="review-text">
              {{ review.comment }}
            </p>
          </div>

          <!-- Author Section -->
          <div class="author-section">
            <div class="author-avatar">
              {{ getInitials(review.author) }}
            </div>
            <div class="author-info">
              <div class="author-name">
                {{ review.author }}
              </div>
              <div class="author-title">
                {{ review.title }}
              </div>
            </div>
            <div class="rating-stars">
              <svg
                v-for="star in 5"
                :key="star"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
          </div>

          <!-- Card Decoration -->
          <div class="card-decoration" />
        </div>
      </div>

      <!-- Bottom Section -->
      <div
        class="bottom-section"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <div class="social-proof">
          <p>Join the growing community of successful freelancers</p>
          <div class="platform-logos">
            <div class="platform-item">
              <span>Upwork</span>
            </div>
            <div class="platform-item">
              <span>Fiverr</span>
            </div>
            <div class="platform-item">
              <span>Freelancer</span>
            </div>
            <div class="platform-item">
              <span>99designs</span>
            </div>
          </div>
        </div>
        
        <div class="cta-section">
          <a
            href="#"
            class="btn-primary"
          >
            <span>Start Your Free Trial</span>
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
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ReviewSection",
  data() {
    return {
      reviews: [
        {
          comment: "Managing my freelance projects across multiple platforms used to be a nightmare. Now, everything's in one place, and I have more time to focus on my clients.",
          author: "Sarah Johnson",
          title: "Freelance Designer"
        },
        {
          comment: "I was constantly struggling to estimate my taxes, but the built-in tax calculator makes it so easy to stay on top of my finances.",
          author: "Maria Lopez",
          title: "Freelance Photographer"
        },
        {
          comment: "This is the best tool for freelancers who work on multiple platforms. Managing projects from UpWork and Freelancer.com in one interface is a huge time-saver!",
          author: "Jenny Roberts",
          title: "Virtual Assistant"
        }
      ]
    };
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
    getInitials(name) {
      return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
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
.review {
  position: relative;
  background: linear-gradient(135deg, #0A8276 0%, #0c9085 50%, #0A8276 100%);
  padding: 6rem 0;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  margin: 4rem 0;
}

/* Background Elements */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.bg-wave {
  position: absolute;
  width: 200%;
  height: 100px;
  opacity: 0.1;
}

.wave-1 {
  top: 0;
  left: -50%;
  background: linear-gradient(90deg, transparent, white, transparent);
  transform: rotate(-2deg);
  animation: wave-float 8s ease-in-out infinite;
}

.wave-2 {
  bottom: 0;
  right: -50%;
  background: linear-gradient(90deg, transparent, white, transparent);
  transform: rotate(2deg);
  animation: wave-float 10s ease-in-out infinite reverse;
}

.floating-testimonials {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-quote {
  position: absolute;
  font-size: 120px;
  color: rgba(255, 255, 255, 0.05);
  font-family: serif;
  font-weight: bold;
  pointer-events: none;
}

.quote-1 {
  top: 10%;
  left: 5%;
  animation: float-quote 12s ease-in-out infinite;
}

.quote-2 {
  top: 60%;
  right: 10%;
  animation: float-quote 15s ease-in-out infinite reverse;
}

.quote-3 {
  bottom: 20%;
  left: 50%;
  animation: float-quote 10s ease-in-out infinite;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(10, 130, 118, 0.1) 100%);
}

@keyframes wave-float {
  0%, 100% { transform: translateX(0) rotate(-2deg); }
  50% { transform: translateX(20px) rotate(2deg); }
}

@keyframes float-quote {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
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

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.main-title {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(135deg, #7ED7C1 0%, #B8E6D8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.section-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 3rem;
}

/* Trust Stats */
.trust-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* Review Cards */
.review-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.review-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.review-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(10, 130, 118, 0.02) 0%, rgba(10, 130, 118, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.review-card:hover::before {
  opacity: 1;
}

.review-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 80px rgba(10, 130, 118, 0.15);
}

.quote-icon {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: #0A8276;
  opacity: 0.3;
}

.review-content {
  flex: 1;
  margin-bottom: 2rem;
}

.review-text {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #4a5568;
  margin: 0;
  font-style: italic;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #0A8276 0%, #0c9085 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.author-title {
  font-size: 0.875rem;
  color: #718096;
}

.rating-stars {
  display: flex;
  gap: 2px;
  color: #ffd700;
}

.card-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #0A8276 0%, #0c9085 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.review-card:hover .card-decoration {
  opacity: 1;
}

/* Bottom Section */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-proof p {
  color: white;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.platform-logos {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.platform-item {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(5px);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #0A8276;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
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
  background: linear-gradient(90deg, transparent, rgba(10, 130, 118, 0.1), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.3);
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
  .review {
    padding: 4rem 0;
    margin: 2rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .trust-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .review-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .review-card {
    padding: 2rem;
    min-height: 250px;
  }

  .bottom-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .platform-logos {
    justify-content: center;
  }

  .floating-quote {
    display: none;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .review-card {
    padding: 1.5rem;
  }

  .review-text {
    font-size: 1rem;
  }

  .bottom-section {
    padding: 2rem;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
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
.review-card:focus {
  outline: 2px solid white;
  outline-offset: 4px;
}

.btn-primary:focus {
  outline: 2px solid white;
  outline-offset: 2px;
}
</style>