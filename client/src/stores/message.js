import { defineStore } from "pinia";
import { socket } from "@/socket";

export const useMessageStore = defineStore("message", {
    state: () => ({
        messages: [],
    }),
    actions: {
        bindEvents() {
            socket.on("chat message", (msg, serverOffset) => {
                this.messages.push(msg);
                window.scrollTo(0, document.body.scrollHeight);
                socket.auth.serverOffset = serverOffset;
            }),
            socket.on("user connect", (data) => {
                var notificationString = "User-" + data + " connected";
                this.messages.push(notificationString);
                window.scrollTo(0, document.body.scrollHeight);
            })
        },
    },
});