<template>
  <section
    id="pricing"
    class="pricing-section"
  />
  <h2>Simple Pricing. No Surprises.</h2>
  <div class="pricing-cards">
    <!-- First Box -->
    <div class="pricing-card">
      <h4>7 days Free Trial</h4>
      <ul>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Full access for 7 days
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >No card needed
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Choose a monthly or 6-month plan after the trial
        </li>
      </ul>
      <button class="price-btn-outline">
        Try now
      </button>
    </div>

    <!-- Second Box -->
    <div class="pricing-card">
      <h4>Basic Plan</h4>
      <ul>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Project Management (Limited: Max 5 active projects at a time)
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Task Management (Basic: No subtasks, no automation)
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Client Management
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Limited Collaboration (Can invite only 1 freelancer)
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Income & Expense Tracking
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Tools
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Time tracking (Limited to 100-150 hours per month)
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Reminder/ Calendar for meeting
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Multiple Freelance Platform Integration (Limit to 2-3 platforms)
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Tax Estimation/ Calculator
        </li>
      </ul>
      <button
        class="price-btn"
        @click="goToPayment(15)"
      >
        $15 per month
      </button>
    </div>

    <!-- Third Box -->
    <div class="pricing-card">
      <h4>Business Plan</h4>
      <ul>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Unlimited Project Management
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Full Task Management
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Client Management
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Collaboration (Team members & guests) for 3 users, +€5 per extra user
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Income & Expense Tracking
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Tools
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Unlimited Time tracking
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Reminder/ Calendar for meeting
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Gantt Chart for Timeline Tracking
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Unlimited Multiple Freelance Platform Integration
        </li>
        <li>
          <img
            src="/Done.png"
            alt="done icon"
            class="done-icon"
          >Tax Estimation/ Calculator
        </li>
      </ul>
      <button
        class="price-btn"
        @click="goToPayment(25)"
      >
        $25 per month
      </button>
    </div>
  </div>
</template>



<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const goToPayment = () => {
      router.push('/card-payment'); // ✅ Redirects to the payment page
    };

    return { goToPayment };
  }
};
</script>

<style scoped>
/* Section Styles */
.pricing-section {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  padding: 50px 20px;
  background-color: #ffffff;
}

h2{
  text-align: center;
  margin-bottom:50px ;
  font-weight: 600; /* Semi-bold */
  font-size: 36px;
  background-color: #ffffff;
}

.pricing-section h3 {
  font-weight: 600; /* Semi-bold */
  font-size: 36px;
  color: black;
  margin-bottom: 50px; /* Space below title */
}

/* Pricing Cards Container */
.pricing-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap; /* Ensure responsive behavior */
}

/* Pricing Card */
.pricing-card {
  background-color: #F3FFFE;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 340px;
  height: 624px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Space between list and button */
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Hover effect transition */
}

/* Align icons and text in the list */
.pricing-card ul {
  list-style: none; /* Remove default bullet points */
  padding: 0;
  margin: 30px 0;
}

.pricing-card li {
  display: flex;
  align-items: center; /* Align icon and text vertically */
  margin-bottom: 10px; /* Spacing between list items */
  color: #666; /* Grey text color */
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
}

/* Icon styling */
.done-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px; /* Space between icon and text */
}


.pricing-card:hover {
  transform: scale(1.05); /* Slightly enlarge on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Stronger shadow on hover */
}

/* Card Title */
.pricing-card h4 {
  font-size: 1.5rem;
  font-weight: 500; /* Medium weight */
  color: black;
  text-align: center;
  margin-bottom: 20px;
}

/* List Styles */
.pricing-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.pricing-card ul li {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
}

/* Buttons */
.price-btn {
  background: #0C9C8D;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: auto; /* Ensure consistent button position */
  align-self: center; /* Center button horizontally */
  transition: all 0.3s ease;
}

.price-btn-outline {
  background: transparent; /* Transparent background */
  color: #0C9C8D;
  border: 1px solid #0C9C8D; /* Border */
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: auto; /* Ensure consistent button position */
  align-self: center; /* Center button horizontally */
  transition: all 0.3s ease;
}

.price-btn:hover {
  background: #097C6D;
}
</style>
