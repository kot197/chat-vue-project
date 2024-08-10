<!-- src/components/UsernamePage.vue -->
<template>
    <div id="input-wrapper">
      <input id="username" v-model="username" placeholder="Enter username" />
      <button class="button" @click="goToChatRoom">Join Room</button>
    </div>
  </template>
  
  <script>
  import { socket } from "@/socket";

  export default {
    data() {
      return {
        username: '',
      };
    },
    methods: {
      submitUsername() {
        // Handle username submission, e.g., save it or navigate to another page
        console.log('Username:', this.username);
      },
      goToChatRoom() {
        // Connect the socket to io server
        socket.connect();
        console.log("FUNC:goToChatRoom socket.connected: " + socket.connected);
        this.$router.push('/chat-room');
      },
    },
  };
  </script>

<style scoped>

@media (min-width: 1024px) {
    #username {
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        height: auto;
    }

    #username::placeholder {
        font-size: 1rem; /* Set the desired font size */
    }

  .button {
    padding: 1rem 2rem;
    border-radius: 1rem;
    font-weight: bold;
    font-size: 1rem;
    margin: 2rem;
  }

  #input-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}
</style>