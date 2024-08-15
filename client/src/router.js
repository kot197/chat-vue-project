import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/HomeView.vue'
import UsernameView from './components/UsernameView.vue'
import ChatRoomView from './components/ChatRoomView.vue'
import NotFound from './components/NotFound.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/username-view', component: UsernameView },
    { path: '/chat-room', component: ChatRoomView },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound
    }
  ]
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
  
  export default router