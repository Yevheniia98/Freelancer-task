<template>
  <div class="about">
    <HeaderSection /> <!-- Use HeaderSection here -->
    <h1>About "Freelancer - task"</h1>
    <p>
      Founded in August 2024, <strong>Freelancer - task</strong> is on a mission to transform the freelance industry. 
      We are dedicated to streamlining project management and enhancing the freelancing experience through our all-in-one platform, 
      which connects freelancers with essential tools and resources.<br><br>

      Our founding team consists of four passionate professionals, each bringing unique expertise from diverse backgrounds. 
      Together, we are committed to innovation and customer satisfaction, ensuring that our product not only meets but exceeds the needs of freelancers.<br><br>

      At <strong>Freelancer - task</strong>, our core values include integrity, collaboration, and a genuine passion for helping freelancers succeed.
    </p>
    <h2>Meet the team</h2>
    <div class="image-container">
      <div class="image-item">
        <img
          src="/MyPhoto.png"
          alt="Freelancer Task Team"
        >
        <p>Product owner | UX designer,<br> Yevheniia Suprun</p>
      </div>
  
      <div class="image-item">
        <img
          src="/PhotoDev.png"
          alt="Developer Team"
        >
        <p>Fullstack Developer, Brijesh Jha</p>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script>
import FooterSection from '@/components/FooterSection.vue'; // Adjust the path to your component
import HeaderSection from '@/components/HeaderSection.vue';


export default {
  name: 'AboutPage', // Change name to match the component name (multi-word)
  components: {
    FooterSection,
    HeaderSection
  },
};
</script>

<style scoped>
.about {
  font-family: 'Helvetica', 'Poppins', sans-serif;
  background-color: #f4f7fb;
  color: #333;
  
}

.content {
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 100px;
  color: #2c3e50;
}
h2 {
  font-size: 1.5rem;
  text-align: center;
  margin-top: 50px;
  color: #2c3e50;
}

p {
  margin-left: 400px;
  margin-right: 400px;
  text-align: left;
  margin-bottom: 50px;
  line-height: 1.8; /* Adds space between lines for better readability */
  font-size: 1rem; /* Slightly larger font size for easy reading */
  color: #333; /* Dark text color for better contrast */
}

strong {
  font-weight: bold;
  color: #08080f;
}

.image-item img {
  width: 300px; /* Adjust the width as needed */
  height: auto; /* Keeps the aspect ratio */
  margin: 40px;
}

.image-container {
  display: flex;
  justify-content: center;
   
}

.image-item p {
  font-size: 14px;
  margin: -40px;
  color: #555;
  text-align: center;
  margin-bottom: 100px;
}


footer {
  background-color: #2c3e50;
  color: #fff;
  text-align: center;
  font-size: 0.9rem;
  position: relative;
  bottom: 0;
  width: 100%;
  margin-top: 40px;
}

@media (max-width: 768px) {
  

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 0.95rem;
  }
}
</style>
