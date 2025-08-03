<template>
  <section class="payment-methods-section">
    <div class="payment-methods">
      <h3>Accepted Payment Methods</h3>
      <div class="payment-icons">
        <img 
          v-for="(method, index) in paymentMethods" 
          :key="index" 
          :src="method.src" 
          :alt="method.name" 
          class="payment-icon"
          @mouseenter="handleHover(index, true)"
          @mouseleave="handleHover(index, false)"
          @click="handleClick(method.name)"
        >
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PaymentMethods",
  data() {
    return {
      paymentMethods: [
        { name: "Stripe", src: "/stripe.png" },
        { name: "Visa", src: "/visa.png" },
        { name: "PayPal", src: "/paypal.png" },
      ],
    };
  },
  methods: {
    handleHover(index, isHovering) {
      const icons = document.querySelectorAll(".payment-icon");
      if (isHovering) {
        icons[index].style.transform = "scale(1.1)";
      } else {
        icons[index].style.transform = "scale(1)";
      }
    },
    handleClick(name) {
      console.log(`Clicked on: ${name}`);
      alert(`You selected ${name}`);
    },
  },
};
</script>

<style scoped>
.payment-methods-section {
  margin-top: 50px;
  text-align: center;
  margin-bottom: 50px;
}

.payment-methods h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  font-family: 'Poppins', sans-serif;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.payment-icons img {
  width: 80px;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.payment-icons img:hover {
  transform: scale(1.1); /* Slight zoom on hover */
}
</style>