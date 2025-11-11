<template>
  <footer class="footer-section">
    <div class="footer-content">
      <!-- PRODUCT Section -->
      <div class="footer-column">
        <h4 class="footer-heading">
          PRODUCT
        </h4>
        <ul class="footer-list">
          <li>Features</li>
          <li>Pricing</li>
          <li>Getting Started</li>
          <li>FAQs</li>
        </ul>
      </div>

      <!-- RESOURCES Section -->
      <div class="footer-column">
        <h4 class="footer-heading">
          RESOURCES
        </h4>
        <ul class="footer-list">
          <li>Help Center</li>
          <li>Blog</li>
        </ul>
      </div>

      <!-- COMPANY Section -->
      <div class="footer-column">
        <h4 class="footer-heading">
          COMPANY
        </h4>
        <ul class="footer-list">
          <li>About Us</li>
          <li>Careers</li>
          <li>Privacy Policy</li>
        </ul>
      </div>

      <!-- CONTACT US Section -->
      <div class="footer-column">
        <h4 class="footer-heading">
          CONTACT US
        </h4>
        <ul class="footer-list">
          <li> Support Email</li>
          <li>Social Media</li>
          <li>Contact Form</li>
        </ul>
      </div>
    </div>
    
    <!-- Copyright Section -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p>&copy; 2025 Freelance - Tasks. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterSection",
};
</script>

<style scoped>
.footer-section {
  background: linear-gradient(135deg, #065f46 0%, #047857 25%, #059669 75%, #10b981 100%);
  margin-top: 0;
  color: rgba(255, 255, 255, 0.9);
  font-family: system-ui, -apple-system, sans-serif;
  border-top: 1px solid rgba(5, 150, 105, 0.3);
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  padding: 60px 50px 40px;
  margin: 0 auto;
  max-width: 1200px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 40px;
}

.footer-column:last-child {
  margin-right: 0;
}

.footer-heading {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 20px;
  padding-left: 0;
  text-align: left;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.footer-list li {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
  padding: 4px 0;
}

.footer-list li:hover {
  color: white;
  transform: translateX(2px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.1);
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 50px;
  text-align: center;
}

.footer-bottom-content p {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    padding: 40px 30px;
  }
  
  .footer-column {
    margin-right: 0;
    margin-bottom: 30px;
  }
  
  .footer-bottom-content {
    padding: 20px 30px;
  }
  
  .footer-bottom-content p {
    font-size: 13px;
  }
}
</style>

