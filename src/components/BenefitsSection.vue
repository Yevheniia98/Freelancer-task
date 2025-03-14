<template>
  <section class="benefits">
    <h2>Managing Freelance Work is Complicated.<br> We Make it Simple.</h2>
    <div class="benefit-items">
      <div
        v-for="(item, index) in benefits"
        :key="index"
        class="benefit-item"
      >
        <div class="icon">
          <img
            :src="item.icon"
            alt="icon"
          >
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "BenefitsSection",
  data() {
    return {
      benefits: [
        {
          icon: "/iconProject.png",
          title: "Project Management",
          description:
            "Easily manage all your projects from a single dashboard. Organize, prioritize, and track progress to ensure timely delivery and improved productivity.",
        },
        {
          icon: "/iconTask.png",
          title: "Task Management",
          description:
            "Break down projects into manageable tasks. Assign deadlines, set reminders, and keep everything organized so you never miss a deadline.",
        },
        {
          icon: "/iconClient.png",
          title: "Client Management",
          description:
            "Maintain strong client relationships with our client management feature. Keep track of communication, project status, and important details all in one place.",
        },
        {
          icon: "/iconIncome.png",
          title: "Income Tracking",
          description:
            "Automatically track your income from multiple platforms like UpWork, Fiverr, and Freelancer.com. Gain insights into your earnings and streamline your financial planning.",
        },
        {
          icon: "/iconCost.png",
          title: "Expense Tracking",
          description:
            "Keep an eye on your expenses effortlessly. Record and categorize all your business expenses to have a clear understanding of your financial health.",
        },
        {
          icon: "/iconCalculator.png",
          title: "Tax Estimation/Calculator",
          description:
            "Easily estimate your taxes with our built-in tax calculator. Get insights on your tax obligations so you can plan ahead and avoid surprises at tax time.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.benefits {
  text-align: center;
  padding: 50px 20px;
  background-color: #ffffff;
}

.benefits h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 40px;
  font-weight: 600;
}

.benefit-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
}

.benefit-item {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.benefit-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.benefit-item .icon img {
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
}

.benefit-item h3 {
  font-size: 1.5rem;
  color: #0C9C8D;
  margin-bottom: 15px;
  font-weight: 500;
}

.benefit-item p {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .benefit-items {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .benefit-items {
    grid-template-columns: 1fr;
  }
}
</style>
