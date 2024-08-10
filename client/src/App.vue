<script setup>
import { socket } from "@/socket";
import { useMessageStore } from "@/stores/message"

const messageStore = useMessageStore();

socket.off();

messageStore.bindEvents();
</script>


<template>
  <main>
    <router-view></router-view>
  </main>
</template>

<style scoped>

@media (min-width: 1024px) {
  .app-title {
    font-weight: bold;
    font-size: 5rem;
  }

  .subtitle {
    font-size: 3rem;
  }

  .button {
    padding: 1.5rem 2.5rem;
    border-radius: 1rem;
    font-weight: bold;
    font-size: 1rem;
  }

  main {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
  }
}
</style>
