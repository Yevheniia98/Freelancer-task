<template>
  <div class="search-container">
    <v-row>
      <div class="bar">
        <v-text-field
          v-model="searchQuery"
          label="Search..."
          variant="outlined"
          dense
          hide-details
          class="search-input"
          prepend-inner-icon="mdi-magnify"
        />
      </div> 
      <div class="icon">
        <div class="language-icon">
          <!-- Circle wrapper -->
          <v-icon size="30">
            mdi-web
          </v-icon>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
};
</script>

<style scoped>
/* Search input container */
.search-container {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* Align search input to the right */
  padding: 15px;
  margin-left: 120px;
  height: 50px;
}

/* Search input field */
.search-input {
  width: 250px; /* Limits width */
}

.bar {
  margin-right: 20px;
  margin-left: 900px;
}

/* Language Icon Styling */
.language-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EEBFFF; /* Circle background */
  color: #871F8D; /* Icon color */
  border-radius: 50%; /* Make it circular */
  width: 50px; /* 2x size of icon */
  height: 50px; /* 2x size of icon */
  cursor: pointer;
  margin-top: 2px;
}

/* Ensure the icon inside stays centered */
.language-icon v-icon {
  color: #871F8D; /* Icon color */
}
</style>
