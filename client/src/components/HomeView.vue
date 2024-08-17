<!-- src/components/HomePage.vue -->
<template>
    <div id="home">
      <div id="title-wrapper">
          <span class="app-title">ChatLynx</span>
          <br>
          <span class="subtitle">Your Links, Your Space</span>
      </div>
      <button class="button" @click="goToUsernamePage">Create New Room</button>
      <div class="light light1"></div>
      <div class="light light2"></div>
      <div class="light light3"></div>
  </div>
</template>
  
<script>
import { socket } from '@/socket';

export default {
methods: {
    goToUsernamePage() {
      console.log("FUNC goToUsernamePage: " + socket.connected);
      socket.emit('create room');
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
    border-radius: 1.5rem;
    font-weight: bold;
    font-size: 1rem;
    margin: 5rem;
    background-color: #1dce61;
    color: rgba(255, 255, 255, 0.925);
  }

  #home {
    display: flex;
    align-items: center;
  }
  
  .light {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.2;
    animation: pulse 10s infinite ease-in-out;
  }

  .light1 {
    background-color: #1dce61; /* Red light */
    top: 0%;
    left: 10%;
  }

  .light2 {
    background-color: #1dce61; /* Blue light */
    top: 20%;
    left: 80%;
  }

  .light3 {
    background-color: #1dce61; /* Green light */
    top: 60%;
    left: 30%;
  }
}
</style>