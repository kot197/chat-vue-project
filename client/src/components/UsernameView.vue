<!-- src/components/UsernamePage.vue -->
<template>
    <div id="username-page">
      <span class="sm-title">Link Created! Copy The Link Below</span>
      <br>
      <span class="sm-title">http://localhost:5173/chat/{{ roomCode }}</span>
      <div id="input-wrapper">
        <input id="username" v-model="username" placeholder="Enter username" />
        <button class="button" @click="goToChatRoom">Join Room</button>
      </div>
    </div>
  </template>
  
  <script>
  import { socket, state } from "@/socket";
  import { useMessageStore } from "@/stores/message"
  import { mapState } from "pinia";

  export default {
    setup() {
      const messageStore = useMessageStore();

      return { messageStore };
    },
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
        console.log("FUNC:goToChatRoom socket.connected: " + socket.connected);
        console.log("FUNC:goToChatRoom state.connected: " + state.connected);
        socket.emit('create user', this.username);
        this.messageStore.username = this.username;
        this.$router.push('/chat-room');
      },
    },
    computed: {
      ...mapState(useMessageStore, ['roomCode']),
    }
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