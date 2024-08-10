<template>
    <ul id="messages">
      <li v-for="message in messages" :key="message.id">{{ message }}</li>
    </ul>
    <form id="form" @submit="submitMessage" action="">
      <input id="input" v-model="inputValue" autocomplete="off" /><button>Send</button>
      <button id="toggle-btn" @click="toggleConnection">{{ connectionToggleText }}</button>
    </form>
</template>

<script>
import { socket, state } from "@/socket";
import { useMessageStore } from "@/stores/message"
import { mapState } from "pinia";

export default {
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
        socket.emit('chat message', this.inputValue, clientOffset);
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
    ...mapState(useMessageStore, ['messages']),
  }
};
</script>

<style scoped>
    body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

    #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
    #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
    #input:focus { outline: none; }
    #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

    #messages { list-style-type: none; margin: 0; padding: 0; width: 100%; }
    #messages > li { padding: 0.5rem 1rem; }
    #messages > li:nth-child(odd) { background: #443f3f; }
</style>