<template>
    <ul id="messages">
      <li v-for="message in this.messageStore.messages" :key="message.id"><span class="light">{{ message['time'] }}</span> <span class="bold">{{ message['username'] }}</span> {{ message['content'] }}</li>
    </ul>
    <form id="form" @submit="submitMessage" action="">
      <input id="input" v-model="inputValue" autocomplete="off" /><button>Send</button>
      <button id="toggle-btn" @click="toggleConnection">{{ connectionToggleText }}</button>
    </form>
</template>

<script>
import { socket, state } from "@/socket";
import { useMessageStore } from "@/stores/message"
import { getCurrentTime } from "@/utils"

export default {
  setup() {
    const messageStore = useMessageStore();

    return { messageStore };
  },
  data() {
    return {
      inputValue: '',
    };
  },
  methods: {
    toggleConnection(event) {
      event.preventDefault();
      if (socket.connected) {
        socket.disconnect();
        console.log("state.connected: " + state.connected);
      } else {
        socket.connect();
        console.log("state.connected: " + state.connected);
      }
    },
    submitMessage(event) {
      event.preventDefault();
      if(this.inputValue) {
        // compute a unique offset
        const clientOffset = `${socket.id}-${state.counter++}`;
        console.log("submitMessage: " + this.messageStore.user['userId'] + " " + this.messageStore.user['username']);
        socket.emit('chat message', this.inputValue, clientOffset, getCurrentTime(), this.messageStore.user['userId'], this.messageStore.user['username']);
        this.inputValue = '';
      }
    },
  },
  computed: {
    // a computed getter
    connectionToggleText() {
      // `this` points to the component instance
      return state.connected ? 'Disconnect' : 'Connect'
    },
  }
};
</script>

<style scoped>
    body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

    #form { background: #353434; padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
    #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
    #input:focus { outline: none; }
    #form > button { background: #8a8a8a; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; font-weight: bold; }

    #messages { list-style-type: none; margin: 0; padding: 0; width: 100%; height: 100%;}
    #messages > li { padding: 0.5rem 1rem; }
    .bold { font-weight: bold; }
    .light { font-weight: lighter; font-size: small; }
</style>