<template>
  <v-app>
    <section class="faq">
      <h2>Frequently Asked Questions (FAQs)</h2>
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="faq-item"
        :class="{ expanded: faq.show }"
      >
        <div
          class="faq-question"
          @click="toggleAnswer(index)"
        >
          <span>{{ faq.question }}</span>
          <span class="faq-icon">
            <img
              :src="faq.show ? '/arrow-up.svg' : '/arrow-down-01.svg'"
              alt="Toggle FAQ"
              class="faq-toggle-icon"
            >

          </span>
        </div>
        <div
          v-if="faq.show"
          class="faq-answer"
        >
          {{ faq.answer }}
        </div>
      </div>
    </section>
  </v-app>
</template>

<script>
export default {
  name: "FAQSection",
  data() {
    return {
      faqs: [
        { question: "What is this product for?", answer: "Our SaaS product is designed specifically for freelancers. It’s an all-in-one platform that helps freelancers manage projects, clients, tasks, and finances across multiple freelancing platforms like UpWork, Fiverr, Toptal, and others. The goal is to simplify your freelance life by keeping everything in one place, allowing you to focus on doing what you love.", show: false },
        { question: "How do I get started?", answer: "Getting started is easy! Simply sign up with your email or use your Google/LinkedIn account for a quick registration. Once you’ve signed up, you can start linking your freelance accounts and customizing your dashboard.", show: false },
        { question: "What payment method?", answer: "We accept payments via major credit/debit cards, PayPal and Stripe. All transactions are securely processed, and you can choose a monthly or annual subscription plan that fits your needs.", show: false },
        { question: "Is there a free trial available?", answer: "Yes, we offer a 7-day free trial with full access to all features. You can try out the platform and see how it helps streamline your freelance work before committing to a subscription.", show: false},
        { question: "What happens if I encounter an issue?", answer: "If you experience any issues while using the platform, you can reach out to us at [support@yourproduct.com]. Our support team is here to help you resolve any problems quickly.", show: false},
        { question: "Can I customize the dashboard?", answer: "Absolutely! The dashboard is fully customizable. You can choose what information to display, rearrange sections, and set up notifications based on your preferences.", show: false},
        { question: "How secure is my data?", answer:"We take data security very seriously. All your information is encrypted and stored securely. We also provide options for two-factor authentication and regular data backups to ensure your data remains safe.", show: false},
        { question: "Can I cancel my subscription anytime?", answer:"Yes, you can cancel your subscription at any time. If you cancel during the free trial, you won’t be charged. For paid plans, you will continue to have access until the end of the current billing period.", show: false},
        { question: "What if I need help setting up?", answer: "If you need assistance getting started, we offer a quick walkthrough and setup guide during onboarding. You can also reach out to our support team for additional help.", show: false},
        { question: "Are there any discounts for long-term subscriptions?", answer: "Yes, we offer a discount for annual subscriptions, which allows you to save compared to the monthly plan.", show: false},
      ],
    };
  },
  methods: {
    toggleAnswer(index) {
      this.faqs[index].show = !this.faqs[index].show;
    },
  },
};
</script>


<style scoped>
.faq {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
}
.faq h2
{
  font-weight: 600; /* Semi-bold */
  font-size: 36px;
 text-align: center;
 margin-top: 200px;
 margin-bottom: 50px;
}

.faq-item {
  margin-bottom: 20px;
  padding-bottom: 8px;
  transition: all 0.3s ease;
}

.faq-item.expanded {
  border-bottom: 1px solid #00a67e; /* Match the green color */
  padding-bottom: 16px;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Aligns items at the top of the container */
  text-align: left; /* Aligns text to the left */
  font-weight: bold;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease;
  font-family: Poppins;
}

.faq-answer {
  padding: 8px 0;
  line-height: 1.6;
  color: #555;
  text-align: left; /* Ensure text is aligned to the left */
}

.faq-icon img {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.faq-item.expanded .faq-icon img {
  transform: rotate(180deg); /* Rotate when expanded */
}

/* Add margin to separate headerSection and heroSection */

</style>
