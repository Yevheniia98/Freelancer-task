<template>
  <div class="about">
    <HeaderSection />
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="background-elements">
        <div class="bg-shape shape-1" />
        <div class="bg-shape shape-2" />
        <div class="floating-icons">
          <div class="floating-icon icon-1">
            💼
          </div>
          <div class="floating-icon icon-2">
            🚀
          </div>
          <div class="floating-icon icon-3">
            ✨
          </div>
        </div>
      </div>
      
      <div class="container">
        <div
          class="hero-content"
          data-aos="fade-up"
        >
          <div class="hero-badge">
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
              <path
                d="M12 2L15.member-info {
  padding: 2.5rem;
}

.member-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.member-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.role-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(12, 156, 141, 0.1);
  color: #0C9C8D;
  border: 1px solid rgba(12, 156, 141, 0.2);
}

.role-tag.primary {
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  color: white;
  border: none;
}

.member-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.member-skills {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #0C9C8D;
  font-size: 0.875rem;
  font-weight: 500;
}

.skill-item svg {
  width: 16px;
  height: 16px;
}

/* Mission Section */
.mission-section {
  padding: 6rem 0;
  background: white;
}

.mission-header {
  text-align: center;
  margin-bottom: 3rem;
}

.mission-header h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.mission-header p {
  font-size: 1.125rem;
  color: #666;
  margin: 0;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.mission-item {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(12, 156, 141, 0.05) 0%, rgba(12, 156, 141, 0.1) 100%);
  border-radius: 16px;
  border: 1px solid rgba(12, 156, 141, 0.1);
  transition: all 0.3s ease;
}

.mission-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(12, 156, 141, 0.1);
}

.mission-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1.5rem;
}

.mission-item h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.mission-item p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Next Steps Section */
.next-steps-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  position: relative;
  overflow: hidden;
}

.next-steps-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 11px
  );
  opacity: 0.3;
}

.next-steps-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  align-items: center;
  text-align: left;
}

.next-steps-text h3 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.next-steps-text p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
}

.features-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
}

.feature-preview svg {
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.next-steps-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-primary {
  background: white;
  color: #0C9C8D;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.3);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #0C9C8D;
  transform: translateY(-3px);
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
@media (max-width: 1024px) {
  .story-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .team-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
  }

  .next-steps-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 6rem 0 4rem;
  }

  .container {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .story-section,
  .team-section,
  .values-section,
  .cta-section {
    padding: 4rem 0;
  }

  .story-text h2,
  .section-title {
    font-size: 2rem;
  }

  .team-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .member-image {
    height: 250px;
  }

  .member-info {
    padding: 2rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .value-item {
    padding: 1.5rem;
  }

  .next-steps-text h3 {
    font-size: 2rem;
  }

  .next-steps-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
    max-width: 300px;
  }

  .floating-icon {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .story-text h2,
  .section-title {
    font-size: 1.75rem;
  }

  .story-text p,
  .hero-subtitle,
  .section-subtitle {
    font-size: 1rem;
  }

  .member-info {
    padding: 1.5rem;
  }

  .member-roles {
    flex-direction: column;
    align-items: flex-start;
  }

  .role-tag {
    align-self: flex-start;
  }

  .values-header h3,
  .next-steps-text h3 {
    font-size: 1.75rem;
  }

  .value-item {
    padding: 1.25rem;
  }

  .value-icon {
    width: 50px;
    height: 50px;
  }

  .card-icon {
    width: 50px;
    height: 50px;
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
.btn-primary:focus,
.btn-secondary:focus,
.social-link:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 2px;
}

.member-card:focus {
  outline: 2px solid #0C9C8D;
  outline-offset: 4px;
}

/* Print styles */
@media print {
  .hero-section,
  .cta-section {
    background: white !important;
    color: black !important;
  }
  
  .highlight {
    color: #0C9C8D !important;
    -webkit-text-fill-color: #0C9C8D !important;
  }
  
  .floating-icon,
  .bg-shape {
    display: none !important;
  }
}09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              />
            </svg>
            <span>Founded in August 2024</span>
          </div>
          
          <h1 class="hero-title">
            About <span class="highlight">"Freelancer - task"</span>
          </h1>
          
          <p class="hero-subtitle">
            Transforming the freelance industry through innovation, collaboration, and genuine passion for helping freelancers succeed.
          </p>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="story-section">
      <div class="container">
        <div
          class="story-content"
          data-aos="fade-up"
        >
          <div class="story-grid">
            <div class="story-text">
              <div class="section-badge">
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
                  <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                  <rect
                    x="2"
                    y="9"
                    width="20"
                    height="12"
                    rx="2"
                    ry="2"
                  />
                  <circle
                    cx="12"
                    cy="15"
                    r="1"
                  />
                </svg>
                <span>Our Story</span>
              </div>
              
              <h2>Building the Future of Freelancing</h2>
              
              <p>
                Founded in August 2024, <strong>Freelancer - task</strong> is on a mission to transform the freelance industry. 
                We are dedicated to streamlining project management and enhancing the freelancing experience through our all-in-one platform, 
                which connects freelancers with essential tools and resources.
              </p>
              
              <p>
                Our founding team consists of four passionate professionals, each bringing unique expertise from diverse backgrounds. 
                Together, we are committed to innovation and customer satisfaction, ensuring that our product not only meets but exceeds the needs of freelancers.
              </p>
              
              <p>
                At <strong>Freelancer - task</strong>, our core values include integrity, collaboration, and a genuine passion for helping freelancers succeed.
              </p>
            </div>
            
            <div class="story-visual">
              <div
                class="visual-card card-1"
                data-aos="fade-left"
                data-aos-delay="100"
              >
                <div class="card-icon">
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
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <h4>Innovation</h4>
                <p>Cutting-edge solutions for modern freelancers</p>
              </div>
              
              <div
                class="visual-card card-2"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                <div class="card-icon">
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                    />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4>Collaboration</h4>
                <p>Building stronger freelance communities</p>
              </div>
              
              <div
                class="visual-card card-3"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div class="card-icon">
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
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h4>Passion</h4>
                <p>Genuine care for freelancer success</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <div
          class="section-header"
          data-aos="fade-up"
        >
          <div class="team-badge">
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle
                cx="9"
                cy="7"
                r="4"
              />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Our Team</span>
          </div>
          
          <h2 class="section-title">
            Meet the <span class="highlight">Team</span>
          </h2>
          
          <p class="section-subtitle">
            Passionate professionals dedicated to revolutionizing the freelance experience
          </p>
        </div>

        <div class="team-grid">
          <div
            class="team-member"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div class="member-card">
              <div class="member-image">
                <img
                  src="/MyPhoto.png"
                  alt="Yevheniia Suprun"
                >
                <div class="image-overlay">
                  <div class="social-links">
                    <a
                      href="#"
                      class="social-link"
                    >
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
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect
                          x="2"
                          y="9"
                          width="4"
                          height="12"
                        />
                        <circle
                          cx="4"
                          cy="4"
                          r="2"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      class="social-link"
                    >
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
                        <path d="M4 4l11.733 16H20L8.267 4z" />
                        <path d="M6.5 4l11.733 16" />
                        <path d="M6.5 20l11.733-16" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="member-info">
                <h3>Yevheniia Suprun</h3>
                <div class="member-roles">
                  <span class="role-tag primary">Product Owner</span>
                  <span class="role-tag">UX Designer</span>
                  <span class="role-tag">Frontend</span>
                </div>
                <p class="member-description">
                  Leading product vision and user experience design to create intuitive solutions for freelancers worldwide.
                </p>
                
                <div class="member-skills">
                  <div class="skill-item">
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
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                    <span>UX/UI Design</span>
                  </div>
                  <div class="skill-item">
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
                        r="3"
                      />
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
                    </svg>
                    <span>Product Strategy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="team-member"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div class="member-card">
              <div class="member-image">
                <img
                  src="/PhotoDev.png"
                  alt="Brijesh Jha"
                >
                <div class="image-overlay">
                  <div class="social-links">
                    <a
                      href="#"
                      class="social-link"
                    >
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
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect
                          x="2"
                          y="9"
                          width="4"
                          height="12"
                        />
                        <circle
                          cx="4"
                          cy="4"
                          r="2"
                        />
                      </svg>
                    </a>
                    <a
                      href="#"
                      class="social-link"
                    >
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
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="member-info">
                <h3>Brijesh Jha</h3>
                <div class="member-roles">
                  <span class="role-tag primary">Fullstack Developer</span>
                  <span class="role-tag">Backend</span>
                  <span class="role-tag">DevOps</span>
                </div>
                <p class="member-description">
                  Building robust, scalable systems that power seamless freelance workflows and platform integrations.
                </p>
                
                <div class="member-skills">
                  <div class="skill-item">
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
                      <polyline points="16,18 22,12 16,6" />
                      <polyline points="8,6 2,12 8,18" />
                    </svg>
                    <span>Full Stack Development</span>
                  </div>
                  <div class="skill-item">
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
                      <rect
                        x="2"
                        y="3"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      />
                      <line
                        x1="8"
                        y1="21"
                        x2="16"
                        y2="21"
                      />
                      <line
                        x1="12"
                        y1="17"
                        x2="12"
                        y2="21"
                      />
                    </svg>
                    <span> Design System</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Impact Section -->
    <section class="mission-section">
      <div class="container">
        <div
          class="mission-content"
          data-aos="fade-up"
        >
          <div class="mission-header">
            <h3>Why We Built This Platform</h3>
            <p>The real problems we're solving for freelancers like you</p>
          </div>
          
          <div class="mission-grid">
            <div
              class="mission-item"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div class="mission-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle
                    cx="12"
                    cy="13"
                    r="3"
                  />
                </svg>
              </div>
              <h4>Multiple Platforms, One Dashboard</h4>
              <p>Stop juggling between UpWork, Fiverr, Freelancer.com, and spreadsheets. See everything in one place.</p>
            </div>
            
            <div
              class="mission-item"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div class="mission-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect
                    x="2"
                    y="3"
                    width="20"
                    height="14"
                    rx="2"
                    ry="2"
                  />
                  <line
                    x1="8"
                    y1="21"
                    x2="16"
                    y2="21"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12"
                    y2="21"
                  />
                </svg>
              </div>
              <h4>Real Tax Help for Freelancers</h4>
              <p>Know exactly what you'll owe in taxes with German tax calculations built-in. No more surprises.</p>
            </div>
            
            <div
              class="mission-item"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div class="mission-icon">
                <svg
                  width="24"
                  height="24"
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
                    r="3"
                  />
                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
                </svg>
              </div>
              <h4>Built by Freelancers, for Freelancers</h4>
              <p>We understand the hustle because we've been there. This platform solves our own daily problems.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Next Steps Section -->
    <section class="next-steps-section">
      <div class="container">
        <div
          class="next-steps-content"
          data-aos="fade-up"
        >
          <div class="next-steps-text">
            <h3>Try Our Platform</h3>
            <p>Join other freelancers who've simplified their workflow. Start with our Basic plan at €20/month and see the difference.</p>
            
            <div class="features-preview">
              <div class="feature-preview">
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
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                <span>Connect UpWork, Fiverr & Freelancer.com</span>
              </div>
              <div class="feature-preview">
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
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                <span>Track income & expenses automatically</span>
              </div>
              <div class="feature-preview">
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
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                <span>German tax calculations included</span>
              </div>
            </div>
          </div>
          <div class="next-steps-buttons">
            <a
              href="#pricing"
              class="btn-primary"
            >
              <span>See Pricing Plans</span>
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
            <a
              href="#demo"
              class="btn-secondary"
            >
              <span>Watch Demo</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
</template>

<script>
import FooterSection from '@/components/FooterSection.vue';
import HeaderSection from '@/components/HeaderSection.vue';

export default {
  name: 'AboutPage',
  components: {
    FooterSection,
    HeaderSection
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
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
.about {
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 8rem 0 6rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fffe 50%, #ffffff 100%);
  overflow: hidden;
}

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
  opacity: 0.03;
  border-radius: 50%;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -200px;
  animation: float 15s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -150px;
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
}

.icon-1 { top: 20%; left: 15%; animation: float 8s ease-in-out infinite; }
.icon-2 { top: 60%; right: 20%; animation: float 10s ease-in-out infinite reverse; }
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

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(12, 156, 141, 0.1);
  color: #0C9C8D;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(12, 156, 141, 0.2);
}

.hero-title {
  font-size: clamp(3rem, 5vw, 4rem);
  font-weight: 800;
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

.hero-subtitle {
  font-size: 1.25rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Story Section */
.story-section {
  padding: 6rem 0;
  background: white;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(12, 156, 141, 0.1);
  color: #0C9C8D;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.story-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
  line-height: 1.3;
}

.story-text p {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.story-text strong {
  color: #0C9C8D;
  font-weight: 600;
}

.story-visual {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.visual-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 156, 141, 0.1);
  transition: all 0.3s ease;
}

.visual-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(12, 156, 141, 0.15);
}

.card-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
}

.visual-card h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.visual-card p {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* Team Section */
.team-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fffe 0%, #ffffff 50%, #f8fffe 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.team-badge {
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
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
}

.team-member {
  position: relative;
}

.member-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(12, 156, 141, 0.1);
}

.member-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(12, 156, 141, 0.15);
}

.member-image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.member-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.member-card:hover .member-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(12, 156, 141, 0.8) 0%, rgba(16, 179, 163, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.member-card:hover .image-overlay {
  opacity: 1;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0C9C8D;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
}
.member-info {
  padding: 2rem;
}
.member-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}
.member-roles {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.member-roles .role-tag {
  background: rgba(12, 156, 141, 0.1);
  color: #0C9C8D;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
}
.member-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.skill-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(12, 156, 141, 0.1);
  color: #0C9C8D;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
}
.skill-item svg {
  width: 16px;
  height: 16px;
  color: #0C9C8D;
}
/* Mission Section */
.mission-section {
  padding: 6rem 0;
  background: white;
}
.mission-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}
.mission-header {
  margin-bottom: 3rem;
}
.mission-header h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}
.mission-header p {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
}
.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
.mission-item {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(12, 156, 141, 0.1);
  transition: all 0.3s ease;
}
.mission-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(12, 156, 141, 0.15);
}
.mission-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
}
.mission-item h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}
.mission-item p {
  color: #666;
  line-height: 1.5;
  margin: 0;
}
/* Next Steps Section */
.next-steps-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fffe 0%, #ffffff 50%, #f8fffe 100%);
}
.next-steps-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}
.next-steps-text {
  margin-bottom: 3rem;
}
.next-steps-text h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}
.next-steps-text p {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
}
.next-steps-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.next-steps-buttons .btn-primary,
.next-steps-buttons .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
}
.next-steps-buttons .btn-primary {
  background: linear-gradient(135deg, #0C9C8D 0%, #10b3a3 100%);
  color: white;
  border: none;
}
.next-steps-buttons .btn-primary:hover {
  background: linear-gradient(135deg, #0C9C8D 0%, #0a8f7d 100%);
}
.next-steps-buttons .btn-secondary {
  background: white;
  color: #0C9C8D;
  border: 1px solid rgba(12, 156, 141, 0.2);
}
.next-steps-buttons .btn-secondary:hover {
  background: rgba(12, 156, 141, 0.1);
}
.next-steps-text .features-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}
.next-steps-text .feature-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(12, 156, 141, 0.1);
  color: #0C9C8D;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
}
.next-steps-text .feature-preview svg {
  width: 16px;
  height: 16px;
  color: #0C9C8D;
}

</style>