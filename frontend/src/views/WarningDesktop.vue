<template>
  <div
    v-if="isOpen"
    class="overlay"
  >
    <div class="overlay-content">
      <!-- Close button emits 'close' event -->
      <button
        class="close-btn"
        @click="$emit('close')"
      >
        ✖
      </button>
      <h2>Thank you for trying Freelancer - Task!</h2>
      <p>
        Your 7-day free trial has ended, but you can continue enjoying unlimited access
        by choosing one of our flexible subscription plans:
      </p>

      <div class="plans">
        <div class="plan">
          <h3 class="plan-title">
            Freelance Plan
          </h3>
          <p class="price">
            €15
          </p>
          <p class="per-month">
            Per month
          </p>
          <button class="subscribe-btn">
            €15 per month
          </button>
        </div>
        <div class="plan">
          <h3 class="plan-title">
            Business Plan
          </h3>
          <p class="price">
            €25
          </p>
          <p class="per-month">
            Per month
          </p>
          <button class="subscribe-btn">
            €25 per month
          </button>
        </div>
      </div>

      <p class="footer-text">
        All plans include full access to our features with no restrictions. Please choose a
        plan to continue using your account.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarningDesktop',
  emits: ['close'],
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
/* Overlay Background */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Overlay Content Box */
.overlay-content {
  background: white;
  padding: 50px;
  border-radius: 10px;
  width: 800px;
  margin-left: 100px;
  margin-right: 100px;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
  color: black; /* Ensure all text is visible */
}


.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  float: right;
  color: #333; /* Dark color to make it visible */
  margin-bottom: 50px;
}

/* Heading */
h2 {
  font-size: 26px;
  font-weight: bold;
  color: #000000; /* Change to a dark green */
  margin-bottom: 15px;
}

/* Paragraph */
p {
  font-size: 16px;
  color: gray; /* Dark grey for better readability */
  line-height: 1.5;
}

/* Plans Layout */
.plans {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  gap: 20px;
}

.plan {
  width: 300px;
  height: 300px;
  background: #F3FFFE;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Title */
.plan-title {
  font-size: 28px;
  font-weight: 500; /* Medium */
  color: black;
  margin-bottom: 20px;
  margin-top: 0;
}

/* Price */
.price {
  font-size: 50px;
  font-weight: bold;
  color: black;
  margin: 5px 0;
}

/* Per month text */
.per-month {
  font-size: 18px;
  font-weight: normal;
  color: black;
  margin: 0;
}

/* Subscribe Button */
.subscribe-btn {
  background: #0a7668;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  width: 80%;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.subscribe-btn:hover {
  background: #085b50;
}

/* Footer Text */
.footer-text {
  font-size: 14px;
  color: gray;
}

/* Fade-in Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
