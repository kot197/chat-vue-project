import { defineStore } from "pinia";
import { socket } from "@/socket";
import router from '@/router'

export const useMessageStore = defineStore("message", {
    state: () => ({
        messages: [],
        roomCode: null,
        username: null,
    }),
    actions: {
        bindEvents() {
            socket.on("chat message", (msg, serverOffset, msgTime) => {
                this.messages.push({
                    content: msg,
                    time: msgTime,
                });
                window.scrollTo(0, document.body.scrollHeight);
                socket.auth.serverOffset = serverOffset;
            }),
            socket.on("user connect", (data) => {
                var notificationString = "User-" + data + " connected";
                this.messages.push({
                    content: notificationString
                });
                window.scrollTo(0, document.body.scrollHeight);
            }),
            socket.on("room created", (roomCode) => {
                this.roomCode = roomCode;
                router.push('/username-view')
            })
        },
        setUsername(newName) {
            this.username = newName;
        }
    },
});