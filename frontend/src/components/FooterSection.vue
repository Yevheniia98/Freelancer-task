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
  background-color: #0A8276;
  margin-top: 100px;
  height: 250px;
  color: white;
  font-family: 'Poppins', sans-serif;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  padding: 50px;
  margin: 0;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-heading {
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 15px;
  padding-left: 0; /* Ensure no extra padding on the heading */
  text-align: left; /* Align text to the left */
}

.footer-list {
  list-style: none;
  padding: 0; /* Remove any default padding */
  margin: 0; /* Remove any default margin */
  text-align: left; /* Align list items to the left */
}


.footer-list li {
  font-size: 16px;
  font-weight: 400;
  margin-bottom:0px;
  cursor: pointer;
  transition: color 0.3s;
}

.footer-list li:hover {
  color: #ffd700; /* Highlight color on hover */
}

.footer-copyright {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3); /* Add a top border for separation */
}
</style>

