import { defineStore } from "pinia";
import { socket, state } from "@/socket";

export const useConnectionStore = defineStore("connection", {
  state: () => ({
    isConnected: false,
  }),

  actions: {
    bindEvents() {
        socket.on("connect", () => {
        state.connected = true;
        console.log("EVENT:CONNECT state.connected: " + state.connected);
        });
        
        socket.on("disconnect", () => {
        state.connected = false;
        console.log("EVENT:DISCONNECT state.connected: " + state.connected);
        });
    },

    connect() {
      socket.connect();
    }
  },
});