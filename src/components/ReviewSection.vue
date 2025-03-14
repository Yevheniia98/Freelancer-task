<template>
  <section class="review">
    <!-- Heading Section -->
    <h3>We are Trusted by Freelancers Around the World</h3>

    <!-- Review Cards Section -->
    <div class="review-cards">
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="review-card"
      >
        <p>{{ review.comment }}</p>
        <p><em>– {{ review.author }}</em></p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ReviewSection",
  data() {
    return {
      // Review Data
      reviews: [
        {
          comment: "Managing my freelance projects across multiple platforms used to be a nightmare. Now, everything’s in one place, and I have more time to focus on my clients.",
          author: "Sarah, Freelance Designer"
        },
        {
          comment: "I was constantly struggling to estimate my taxes, but the built-in tax calculator makes it so easy to stay on top of my finances.",
          author: "Maria L., Freelance Photographer"
        },
        {
          comment: "This is the best tool for freelancers who work on multiple platforms. Managing projects from UpWork and Freelancer.com in one interface is a huge time-saver!",
          author: "Jenny R., Virtual Assistant"
        }
      ]
    };
  }
};
</script>

<style scoped>
.review {
  background-color: #0A8276;
  text-align: center;
  padding: 100px 100px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 50px; /* Ensures spacing below the review section */
  margin-top: 50px;
}

.review h3 {
  font-weight: 600; /* Semi-bold */
  font-size: 36px;
  color: white;
  margin-top: 0px; /* Adds margin above the heading */
  margin-bottom: 50px; /* Adds space between the heading and the comments */
}

.review-cards {
  display: flex;
  justify-content: center; /* Centers review cards horizontally */
  align-items: stretch; /* Ensures all cards have the same height */
  gap: 20px; /* Adds space between cards */
  flex-wrap: wrap;
  max-width: 1200px; /* Limits the width of the cards container */
  width: 100%;
  margin-left: 100px; /* Adds margin to the left */
  margin-right: 100px; /* Adds margin to the right */
}

.review-card {
  background-color: white;
  color: grey;
  padding: 20px;
  border-radius: 10px;
  width: 30%; /* Ensures consistent width */
  height: 220px; /* Sets a fixed height */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Evenly spaces content vertically */
}

.review-card p:first-child {
  margin-bottom: 15px;
  font-size: 1rem;
  color: grey; /* Grey color for the comment text */
}

.review-card p:last-child {
  font-style: normal; /* Removes italic */
  color: black; /* Black color for author */
  font-weight: bold; /* Bold font for author */
}

@media (max-width: 768px) {
  .review-card {
    width: 100%; /* Makes each card take full width on smaller screens */
    height: auto; /* Adjusts the height to fit content */
  }

  .review-cards {
    margin-left: 20px; /* Reduces margin for smaller screens */
    margin-right: 20px;
  }
}


</style>
