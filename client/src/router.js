import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/HomeView.vue'
import UsernameView from './components/UsernameView.vue'
import ChatRoomView from './components/ChatRoomView.vue'
import NotFound from './components/NotFound.vue'
import axios from 'axios';
import { useMessageStore } from './stores/message'

const routes = [
    { path: '/', component: HomeView },
    { path: '/username-view', component: UsernameView },
    { path: '/chat-room/:roomCode',
      component: ChatRoomView,
      beforeEnter: async (to, from) => {
        const messageStore = useMessageStore();
        let roomCode;

        console.log('to.params: ' + to.params.roomCode);
        if(to.params.roomCode) {
          roomCode = to.params.roomCode;
        } else if(messageStore.roomCode) {
          roomCode = messageStore.roomCode;
        }

        console.log('Axios roomCode: ' + roomCode);
        const response = await axios.get('http://localhost:3000/room/' + roomCode);
        console.log('Response: ' + response.data);
        if(!response.data) {
          return {
            name: 'NotFound',
            params: { pathMatch: to.path.split('/').slice(1) },
            query: to.query,
            hash: to.hash,
          }
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    }
  ]
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
  
  export default router