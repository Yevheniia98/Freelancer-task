<template>
  <div class="card-payment-container">
    <!-- Logo and Title -->
    <div class="logo-container">
      <img
        src="logo.png"
        alt="Freelancer Tasks Logo"
        class="logo"
      >
      <span class="company-name">Freelancer Tasks</span>
    </div>

    <!-- Main Box (White Background) -->
    <div class="main-box">
      <!-- Left Section (Payment and Plans) -->
      <div class="left-section">
        <div class="subscribe-section">
          <p class="subscribe-text">
            Subscribe to Freelancer Task
          </p>
          <div class="account">
            <div class="account-circle" />
            <span>test@example.com</span>
          </div>
        </div>

        <!-- Billing Plan -->
        <p class="choose-plan">
          Choose plan
        </p>
        <div class="plan-selection">
          <div
            class="plan-box"
            :class="{ 'selected': selectedPlan === 1, 'deselected': selectedPlan !== 1 }"
            @click="selectPlan(1)"
          >
            <div
              class="circle"
              :class="{ 'active': selectedPlan === 1 }"
            />
            <p class="plan-name">
              Billed Freelancer
            </p>
            <p class="plan-price">
              15€
            </p>
          </div>
          <div
            class="plan-box"
            :class="{ 'selected': selectedPlan === 2, 'deselected': selectedPlan !== 2 }"
            @click="selectPlan(2)"
          >
            <div
              class="circle"
              :class="{ 'active': selectedPlan === 2 }"
            />
            <p class="plan-name">
              Billed Business
            </p>
            <p class="plan-price">
              25€
            </p>
          </div>
        </div>

        <!-- Add Storage -->
        <p class="add-storage">
          Add Storage
        </p>
        <div class="storage-container">
          <span>Storage</span>
          <span>{{ storageSize }}GB - {{ storagePrice }}€</span>
          <input
            v-model="storageSize"
            type="range"
            min="0"
            max="100"
            @input="updateStoragePrice"
          >
        </div>

        <!-- Freelance Plan Section -->
        <p class="freelance-plan">
          Freelance Plan (Small Collabs)
        </p>
        <div class="plan-item">
          <span>{{ selectedPlan === 2 ? '3 Members' : '1 Member' }}</span>
          <span>{{ selectedPlan === 2 ? '€25/month' : '€15/month' }}</span>
        </div>

        <div
          v-if="storageSize > 0"
          class="plan-item"
        >
          <span>{{ storageSize }}GB Storage</span>
          <span>{{ storagePrice }}€</span>
        </div>


        <!-- Payment Details -->
        <p class="payment-details">
          Payment Details
        </p>
        <div class="payment-input-group">
          <input
            type="text"
            class="payment-input credit-card"
            placeholder="Enter your card number"
          >
          <div class="input-row">
            <input
              type="text"
              class="payment-input exp-date"
              placeholder="MM/YY"
            >
            <input
              type="text"
              class="payment-input cvv"
              placeholder="CVV"
            >
          </div>
        </div>

        <p class="or">
          or
        </p>

        <button class="stripe">
          Stripe
        </button>
        <button class="paypal">
          PayPal
        </button>


        
        <button
          class="upgrade-btn"
          @click="goToHome"
        >
          Upgrade
        </button>
      </div>

      <!-- Right Section (Freelancer Bill & Card Acceptance) -->
      <div class="right-section">
        <div class="inner-box">
          <p class="freelancer-bill-title">
            {{ selectedPlan === 1 ? 'Freelancer Bill' : 'Business Bill' }}
          </p>
          <ul class="features-list">
            <li
              v-for="(feature, index) in selectedPlan === 1 ? freelancerFeatures : businessFeatures"
              :key="index"
            >
              <img
                src="arrow-down-01.svg"
                class="feature-icon"
              > {{ feature }}
            </li>
          </ul>

          <!-- Divider Line -->
          <div class="divider-line" />

          <p class="accept-cards">
            We accept the following cards
          </p>
          <div class="card-logos">
            <img
              src="visa.png"
              alt="Visa"
            >
            <img
              src="stripe.png"
              alt="Stripe"
            >
            <img
              src="paypal.png"
              alt="PayPal"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter(); // ✅ Get router instance

    const goToHome = () => {
      router.push('/home-saas'); // ✅ Navigate correctly
    };

    return { goToHome };
  },
  
  data() {
    return {
      selectedPlan: 1,  // 1 for Freelancer, 2 for Business
      storageSize: 0,
      storagePrice: 0,
      freelancerFeatures: [
        'Project Management (Limited: Max 5 active projects)',
        'Task Management (Basic: No subtasks, no automation)',
        'Client Management',
        'Income & Expense Tracking',
        'Tools (Limited access)',
        'Time Tracking (Limited to 100-150 hours per month)',
        'Multiple Freelance Platform Integration (Limit to 2-3 platforms)',
        'Tax Estimation/ Calculator',
        'Reminder/ Calendar for meeting',
        'Limited Collaboration (Can invite only 1 freelancer)',
      ],
      businessFeatures: [
        'Unlimited Project Management',
        'Full Task Management (Subtasks, automation, dependencies)',
        'Client Management',
        'Income & Expense Tracking',
        'All Tools Available',
        'Unlimited Time Tracking',
        'Gantt Chart for Timeline Tracking',
        'Unlimited Freelance Platform Integration',
        'Tax Estimation/ Calculator',
        'Reminder/Calendar for meetings',
        'Unlimited Collaboration (Team members & guests) for 3 users, +€5 per extra user',
      ],
    };
  },

  methods: {
      updateStoragePrice() {
      this.storagePrice = (this.storageSize * 0.1).toFixed(2); 
    },

    selectPlan(planId) {
      this.selectedPlan = planId;
    },
  },
};
</script>



<style scoped>
/* Container */
.card-payment-container {
  display: flex;
  justify-content: center;
  padding-top: 50px;
  width: 100%;
}

/* Main Box */
.main-box {
  display: flex;
  background-color: white;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 1000px;
  justify-content: space-between;
  margin-left: 100px;
}

/* Left Section */
.left-section {
  width: 60%;
  padding-right: 50px;
}

/* Right Section (Freelancer Bill and Cards) */
.right-section {
  width: 40%;
  
}

.inner-box {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;


}

.card-payment-container {
  display: flex;
  justify-content: center;
  padding-top: 100px; /* Move the container 100px down */
  width: 100%;
  position: relative;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute; /* Position it independently of the container */
  top: 0;
  left: 50%;
  transform: translateX(-10%); /* Center it horizontally */
  margin-top: 20px;

}

.logo {
  width: 40px;
  height: auto;
}

.company-name {
  margin-left: 5px;
  font-size: 20px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
}



.subscribe-section {
  margin-bottom: 20px;
}

.subscribe-text {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  text-align: left;
}

.account {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.account-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: gray;
  margin-right: 5px;
}


.choose-plan {
  margin-top: 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  text-align: left;
  margin-bottom: 10px;
}

.plan-selection {
  display: flex;
  gap: 20px;
}

.plan-box {
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.plan-box.selected {
  border: 2px solid #0c9c8d;
}

.plan-box.deselected {
  border: 2px solid #d9d9d9;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-bottom: 10px;
  background-color: #d9d9d9;
}

.circle.active {
  background-color: #0c9c8d;
}

.plan-name {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  margin-bottom: 10px;
}

.plan-price {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: medium;
}

.add-storage {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  margin-top: 30px;
  margin-bottom: 5px;
  text-align: left;
}

.storage-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  margin-top: 10px;
  background-color: white;
  border-radius: 5px;
  border: 0.1px solid grey;
  padding: 10px;
}

.payment-details {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  margin-top: 30px;
  text-align: left;
  font-weight: bold;
  
}

.payment-input-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
}

.input-field {
  width: 100%;
  font-size: 16px;
}

.input-row {
  display: flex;
  gap: 10px; /* Space between the two small inputs */
  margin-top: -10px; /* Moves the row 20px down */
}

.input-field2{
  width: 250px;
  font-size: 16px;
}

.or {
  margin-top: 20px;
  font-size: 16px;
}

.stripe{
  margin-top: 20px;
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-style: solid;
  border-color: hsl(281, 69%, 49%) ;
  color: hsl(281, 69%, 49%);
  background-color: white;
  border-radius: 5px;
  font-weight: bold;
  position: relative;
}

.paypal {
  margin-top: 5px;
  width: 100%;
  height: 50px;
  font-size: 16px;
  background-color: #FAC71F;
  color: rgb(54, 72, 238);
  border-radius: 5px;
  font-weight: bold;
  position: relative;
}


.input-field,
.input-field2 {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align label to the left */
  position: relative;
}

.payment-input {
  width: 100%;
  height: 50px;
  padding: 15px;
  border-radius: 5px;
  border: 0.1px solid grey;
  font-size: 16px;
   
}

.payment-input.credit-card {
  height: 50px; /* Larger input field for the credit card number */
}

.payment-input.exp-date,
.payment-input.cvv {
  height: 50px;
}

.payment-input:focus {
  outline: none;
  border: 1px solid #0c9c8d;
}

.upgrade-btn {
  background-color: #0c9c8d;
  color: white;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  margin-top: 50px;
  cursor: pointer;
  box-shadow: inset 0 4px 10px rgba(255, 255, 255, 0.50);
  
}


.divider {
  width: 550px;
  height: 1px;
  background-color: #d9d9d9;
  margin-top: 25px;
  margin-right: 100px;
}

.freelance-plan {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  margin-top: 50px;
  text-align: left;
}

.plan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  border: 0.1px solid grey;
  margin-top: 10px;
}

.upgrade-btn {
  background-color: #0c9c8d;
  color: white;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  margin-top: 50px;
  cursor: pointer;
}

.right-sidebar {
  margin-left: 50px;
  width: 300px;
}

.freelancer-bill {
  text-align: left;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  color: #0c9c8d;
  margin-top: 100px; /* Moves Freelancer Bill down */
}

.freelancer-bill-title {
  font-size: 18px;
  color: #0c9c8d;
  margin-bottom: 20px;
  font-weight: bold;
}

.features-list {
  list-style: none;
  padding-left: 0;
  text-align: left;
  font-size: 16px;
}

.features-list li {
  margin-bottom: 10px;
  display: flex;
  align-items: center; /* Centers icon with text */
  gap: 10px; /* Adds space between icon and text */
  margin-left: 20px;
}



.accept-cards {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: bold;
  margin-top: 50px;
  margin-left: -20px;
}

.card-logos {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  margin-left: 0px;
  margin-bottom: 50px;
}

.card-logos img {
  width: 100px !important;
  height: 50px !important;
  max-width: none;
  max-height: none;
  object-fit: contain;
  display: block;
}


.card-logos img {
  width: 40px;
  height: auto;
}

.vertical-divider {
  width: 1px;
  height: 100%;
  background-color: gray;
  margin-left: 20px;
}
</style>
