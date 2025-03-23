<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Simple Chat</h2>
    </div>
      
    <div
      ref="messageContainer"
      class="messages"
    >
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        :class="['message', message.sender === 'user' ? 'user-message' : 'other-message']"
      >
        {{ message.text }}
      </div>
    </div>
      
    <div class="input-area">
      <input 
        v-model="newMessage" 
        type="text" 
        class="message-input" 
        placeholder="Type your message..." 
        @keyup.enter="sendMessage"
      >
      <button
        class="send-button"
        @click="sendMessage"
      >
        Send
      </button>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: 'ChatComponent',
    data() {
      return {
        messages: [
          { text: "Hello! How can I help you today?", sender: "other" }
        ],
        newMessage: ""
      };
    },
    mounted() {
      this.scrollToBottom();
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim() === "") return;
        
        // Add user message
        this.messages.push({
          text: this.newMessage,
          sender: "user"
        });
        
        // Store message and clear input
        const userMessage = this.newMessage;
        this.newMessage = "";
        
        // Simulate a reply after a short delay
        setTimeout(() => {
          this.messages.push({
            text: this.getAutoReply(userMessage),
            sender: "other"
          });
          this.scrollToBottom();
        }, 1000);
        
        this.scrollToBottom();
      },
      
      getAutoReply(message) {
        message = message.toLowerCase();
        
        if (message.includes("hello") || message.includes("hi")) {
          return "Hello there! How are you doing?";
        } else if (message.includes("how are you")) {
          return "I'm just a simple chat bot, but I'm working well. How about you?";
        } else if (message.includes("bye") || message.includes("goodbye")) {
          return "Goodbye! Have a great day!";
        } else if (message.includes("help")) {
          return "I'm a simple demo chat. Try saying hello or asking how I am.";
        } else if (message.includes("name")) {
          return "I'm just a simple Vue.js chat demo.";
        } else {
          return "I'm not sure how to respond to that. I'm just a simple demo.";
        }
      },
      
      scrollToBottom() {
        this.$nextTick(() => {
          if (this.$refs.messageContainer) {
            this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .chat-header {
    background-color: #27605a;
    color: white;
    padding: 15px;
    text-align: center;
  }
  
  .messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 15px;
    height: 350px;
  }
  
  .message {
    padding: 10px 15px;
    margin-bottom: 10px;
    border-radius: 18px;
    max-width: 70%;
    word-wrap: break-word;
  }
  
  .user-message {
    background-color: #e1f5fe;
    margin-left: auto;
    border-bottom-right-radius: 5px;
  }
  
  .other-message {
    background-color: #f1f1f1;
    margin-right: auto;
    border-bottom-left-radius: 5px;
  }
  
  .input-area {
    display: flex;
    padding: 15px;
    border-top: 1px solid #eee;
  }
  
  .message-input {
    flex-grow: 1;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 10px 15px;
    margin-right: 10px;
  }
  
  .send-button {
    background-color: #0C9C8D;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 0 20px;
    cursor: pointer;
  }
  
  .send-button:hover {
    background-color: #08554d;
  }
  </style>