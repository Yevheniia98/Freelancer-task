<template>
  <div id="home">
    <!-- No need to add HeaderSection here again -->
    <HeaderSection /> <!-- Only here -->
    <HeroSection />
    <BenefitsSection />
    <ReviewSection />
    <PricingSection />
    <PaymentMethods />
    <FAQSection />
    <FooterSection />
  </div>
</template>

<script>
import HeaderSection from '../components/HeaderSection.vue'; // Import HeaderSection here
import HeroSection from '../components/HeroSection.vue'
import BenefitsSection from '../components/BenefitsSection.vue'
import ReviewSection from '../components/ReviewSection.vue'
import PricingSection from '../components/PricingSection.vue'
import PaymentMethods from '../components/PaymentMethods.vue'
import FAQSection from '../components/FAQSection.vue'
import FooterSection from '../components/FooterSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeaderSection,
    HeroSection,
    BenefitsSection,
    ReviewSection,
    PricingSection,
    PaymentMethods,
    FAQSection,
    FooterSection
  }
}
</script>

<style>
#home {
  font-family: Avenir, Helvetica, Poppins, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
