import { defineStore } from "pinia";
import { socket } from "@/socket";
import router from '@/router'

export const useMessageStore = defineStore("message", {
    state: () => ({
        messages: [],
        roomCode: null,
        user: null,
    }),
    actions: {
        bindEvents() {
            socket.on("chat message", (msg, serverOffset, msgTime, username) => {
                this.messages.push({
                    content: msg,
                    time: msgTime,
                    username: username,
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
                router.push('/username-view');
            }),
            socket.on("user created", (username, userId) => {
                this.user = {
                    username: username,
                    userId: userId,
                };
                router.push('/chat-room');
            }) 
        },
        setUsername(newName) {
            this.username = newName;
        }
    },
});