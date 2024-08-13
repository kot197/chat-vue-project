import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  counter: 0,
  connected: false,
});

// "undefined" means the URL will be computed from the `window.location` object
console.log("process.env.NODE_ENV " + process.env.NODE_ENV);
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL, {
    auth: {
        serverOffset: 0
    },
    // enable retries
    ackTimeout: 2000,
    retries: 3,
});

// Check if connected
if (socket.connected) {
  state.connected = true;
  console.log('Already connected');
} else {
  console.log('Not connected');
}
