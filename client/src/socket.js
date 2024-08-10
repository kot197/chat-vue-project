import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  counter: 0,
  connected: false,
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
console.log("process.env.NODE_ENV " + process.env.NODE_ENV);
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io(URL, {
    autoConnect: false,
    auth: {
        serverOffset: 0
    },
    // enable retries
    ackTimeout: 10000,
    retries: 3,
});

socket.on("connect", () => {
  state.connected = true;
  console.log("EVENT:CONNECT state.connected: " + state.connected);
});

socket.on("disconnect", () => {
  state.connected = false;
  console.log("EVENT:DISCONNECT state.connected: " + state.connected);
});

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});
  
  socket.on("bar", (...args) => {
  state.barEvents.push(args);
});

// Check if connected
if (socket.connected) {
  state.connected = true;
  console.log('Already connected');
}
