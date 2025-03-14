<template>
  <section class="hero">
    <h1>Freelancing Simplified: Integrate Projects, Invoices, Income Tracking, and More.</h1>
    <p>Manage your freelance work, projects, and income across UpWork, Fiverr, and more—all in one platform.</p>
    <a
      href="#"
      class="btn-primary"
    >Start Your Free Trial</a>

    <!-- SaaS Product Slider -->
    <div
      class="slider"
      style="width: 100%;"
    >
      <!-- Top Buttons -->
      <div class="slider-buttons">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-button', { active: activeTab === index }]"
          @click="switchTab(index)"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Slider Content -->
      <div
        ref="sliderWrapper"
        class="slider-wrapper"
      >
        <div
          v-for="(product, index) in tabs[activeTab].content"
          :key="index"
          class="slider-item"
        >
          <img
            :src="product.image"
            :alt="product.name"
          >
          <div class="slider-content">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
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
          content: [
            { image: "/ProjectList.png" },
            { image: "/ProjectList.png" }
          ]
        },
        {
          name: "Clients",
          content: [
            { image: "/Clients.png" },
            { image: "/Clients.png" }
          ]
        },
        {
          name: "Tasks",
          content: [
            { image: "/Tasks.png" },
            { image: "/Tasks.png" }
          ]
        }
      ],
      activeTab: 0
    };
  },
  methods: {
    switchTab(index) {
      this.activeTab = index;
    }
  }
};
</script>

<style scoped>
.hero {
  text-align: center;
  background-color: #e6f8f7;
  font-family: 'Poppins', sans-serif;
  padding: 50px 20px;
}

.hero h1 {
  font-size: 2.5rem;
  color: black;
  text-align: center;
  word-wrap: break-word;
  padding: 0 20px;
}

.hero p {
  font-size: 1.2rem;
  margin: 40px 0;
  font-family: 'Poppins', sans-serif;
}

.btn-primary {
  margin-top: 40px;
  font-size: 1rem;
  color: white;
  padding: 10px 30px;
  background-color: #0A7668;
  border-radius: 10px;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  box-shadow: 
    inset 2px 2px 5px rgba(255, 255, 255, 0.3),
    4px 4px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.3),
    6px 6px 12px rgba(0, 0, 0, 0.3);
}

.slider {
  margin: 100px auto;
  max-width: 90%;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 10px;
  position: relative;
  height: 600px;
}

/* Top Buttons */
.slider-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 10px;
  cursor: pointer;
  color: #7d7d7d;
  padding: 5px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: white;
  background-color: #393939;
}

.tab-button:hover {
  background-color: #000000;
  color: white;
}

/* Slider Wrapper */
.slider-wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

/* Slider Item */
.slider-item {
  min-width: 100%;
  text-align: center;
  margin-right: 20px;
  
}

.slider-item img {
  max-width: 100%;
  max-height: 450px;
  margin-top: 30px;
  margin-bottom: 0;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Add this line */
}

.slider-content {
  margin-top: 20px;
}

.slider-item h3 {
  font-size: 1.5rem;
  color: #333;
}

.slider-item p {
  font-size: 1rem;
  color: #666;
}
</style>
