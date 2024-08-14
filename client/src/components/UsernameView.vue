<!-- src/components/UsernamePage.vue -->
<template>
    <div id="username-page">
      <span class="sm-title">Link Created! Copy The Link Below</span>
      <br>
      <span class="sm-title">http://localhost:5173/chat/{{ roomCode }}</span>
      <Form class="form" @submit="onSubmit">
        <div>
          <Field id="username" name="username" placeholder="Enter username" :rules="validateUsername"/>
        </div>
        <ErrorMessage name="username" class="error-message"/>
        <button class="button">Join Room</button>
      </Form>
    </div>
  </template>
  
  <script>
  import { socket, state } from "@/socket";
  import { useMessageStore } from "@/stores/message"
  import { mapState } from "pinia";
  import { Form, Field, ErrorMessage } from 'vee-validate';

  export default {
    setup() {
      const messageStore = useMessageStore();

      return { messageStore };
    },
    data() {
      return {
        username: '',
      };
    },
    components: {
      Form,
      Field,
      ErrorMessage,
    },
    methods: {
      onSubmit(values) {
        // Handle username submission, e.g., save it or navigate to another page
        console.log('Username:', values);
        console.log("FUNC:goToChatRoom socket.connected: " + socket.connected);
        console.log("FUNC:goToChatRoom state.connected: " + state.connected);
        socket.emit('create user', values['username']);
      },
      validateUsername(value) {
        if(!value) {
          return 'Username is required to enter the room';
        }

        const maxLength = 50;
        if(value.length > maxLength) {
          return `Username is too long, please make it less than ${maxLength} characters`;
        }

        return true;
      },
    },
    computed: {
      ...mapState(useMessageStore, ['roomCode']),
    }
  };
  </script>

<style scoped>

@media (min-width: 1024px) {
    #username {
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        height: auto;
    }

    #username::placeholder {
        font-size: 1rem; /* Set the desired font size */
    }

  .button {
    padding: 1rem 2rem;
    border-radius: 1rem;
    font-weight: bold;
    font-size: 1rem;
    margin: 2rem;
  }

  .form {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
  }

  .error-message {
    position: absolute;
    top: 6rem; /* Adjust this value as needed to position below the input */
    left: 0;
  }
}
</style>