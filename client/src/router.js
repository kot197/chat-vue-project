import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/HomeView.vue'
import UsernameView from './components/UsernameView.vue'
import ChatRoomView from './components/ChatRoomView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/username-view', component: UsernameView },
    { path: '/chat-room', component: ChatRoomView },
  ]
  
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  
  export default router