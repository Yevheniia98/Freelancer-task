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
      <div class="footer-copyright">
        &copy; 2025 Freelance - Tasks. All rights reserved.
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
  margin-top: 100px;
  min-height: 280px;
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
  position: relative;
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

.footer-copyright {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, rgba(4, 120, 87, 0.8) 0%, rgba(6, 95, 70, 0.8) 100%);
  backdrop-filter: blur(10px);
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
  
  .footer-copyright {
    position: relative;
    margin-top: 20px;
  }
}
</style>

