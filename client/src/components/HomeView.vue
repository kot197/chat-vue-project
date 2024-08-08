<!-- src/components/HomePage.vue -->
<template>
    <div id="title-wrapper">
        <span class="app-title">ChatLynx</span>
        <br>
        <span class="subtitle">Your Links, Your Space</span>
    </div>
    <button class="button" @click="goToUsernamePage">Create New Room</button>
</template>
  
<script>
export default {
methods: {
    goToUsernamePage() {
    this.$router.push('/username-view');
    },
},
};
</script>

<style scoped>

@media (min-width: 1024px) {
  .app-title {
    font-weight: bold;
    font-size: 5rem;
  }

  .subtitle {
    font-size: 3rem;
  }

  .button {
    padding: 1.5rem 2.5rem;
    border-radius: 1rem;
    font-weight: bold;
    font-size: 1rem;
  }
}
</style>