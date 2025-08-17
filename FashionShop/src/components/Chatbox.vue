<template>
  <div class="chatbox-container">
    <!-- Nút mở chat -->
    <div v-if="!isOpen" class="chatbox-toggle" @click="toggleChat">
      <i class="bi bi-chat-fill"></i>
    </div>

    <!-- Hộp chat -->
    <div v-if="isOpen" class="chatbox">
      <!-- Header -->
      <div class="chatbox-header">
        <div class="chatbox-header-left">
          <div class="chatbox-logo">
            <i class="bi bi-chat-fill"></i>
          </div>
          <div>
            <h6 class="chatbox-title">TƯ VẤN SẢN PHẨM</h6>
            <small class="chatbox-subtitle">
              We're currently away. Please leave us a message!
            </small>
          </div>
        </div>
        <button class="chatbox-close" @click="toggleChat">×</button>
      </div>

      <!-- Nội dung tin nhắn -->
      <div class="chatbox-body" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="message.sender === 'user' ? 'user-message' : 'bot-message'"
        >
          <div class="message-content" v-html="formatMessage(message.text)"></div>
        </div>
      </div>

      <!-- Ô nhập -->
      <div class="chatbox-input">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Reply here..."
        />
        <button @click="sendMessage">
          <i class="bi bi-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, nextTick } from "vue";

const isOpen = ref(false);
const userInput = ref("");
const messages = ref([
  {
    sender: "bot",
    text: "Xin chào! Tôi có thể giúp bạn tìm sản phẩm phù hợp. Bạn muốn hỏi gì?",
  },
]);
const messagesContainer = ref(null);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
  }
};

// Định dạng tin nhắn
const formatMessage = (text) => {
  if (!text) return "<p>Không có nội dung.</p>";

  let messageText = text;
  try {
    const json = JSON.parse(text);
    if (json.candidates && json.candidates[0]?.content?.parts?.[0]?.text) {
      messageText = json.candidates[0].content.parts[0].text;
    }
  } catch (e) {
    // Không phải JSON, xử lý như văn bản thường
  }

  const lines = messageText.split("\n").filter((line) => line.trim() !== "");
  let html = "";
  let inList = false;

  lines.forEach((line) => {
    if (line.match(/^[^\*].*?:$/)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h6 class="message-header">${line}</h6>`;
    } else if (line.startsWith("* ")) {
      if (!inList) {
        html += "<ul class='message-list'>";
        inList = true;
      }
      const listContent = line.replace(/^\* /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      html += `<li>${listContent}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<p>${line}</p>`;
    }
  });

  if (inList) {
    html += "</ul>";
  }

  return html;
};

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  messages.value.push({ sender: "user", text: userInput.value });

  try {
    const response = await axios.post("/api/public/chat", {
      message: userInput.value,
    });
    const botResponse = response.data;
    messages.value.push({ sender: "bot", text: JSON.stringify(botResponse) });
  } catch (error) {
    console.error("Lỗi khi gọi API chatbot:", error);
    messages.value.push({
      sender: "bot",
      text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!",
    });
  }

  userInput.value = "";
  await nextTick();
  scrollToBottom();
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
</script>

<style scoped>
/* Container */
.chatbox-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: Arial, sans-serif;
}

/* Nút mở chat */
.chatbox-toggle {
  width: 60px;
  height: 60px;
  background: #000;
  border-radius: 50% 50% 50% 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.chatbox-toggle i {
  color: #fff;
  font-size: 26px;
}

/* Chatbox */
.chatbox {
  width: 360px;
  height: 480px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

/* Header */
.chatbox-header {
  background: #000;
  color: #fff;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chatbox-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chatbox-logo {
  width: 30px;
  height: 30px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chatbox-logo i {
  color: #000;
  font-size: 16px;
}
.chatbox-title {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}
.chatbox-subtitle {
  font-size: 11px;
  color: #ccc;
}
.chatbox-close {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}

/* Nội dung */
.chatbox-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f5f5f5;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f5f5f5;
}
.chatbox-body::-webkit-scrollbar {
  width: 8px;
}
.chatbox-body::-webkit-scrollbar-track {
  background: #f5f5f5;
}
.chatbox-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
.bot-message .message-content {
  background: #eee;
  padding: 12px;
  border-radius: 12px;
  max-width: 80%;
  font-size: 14px;
  line-height: 1.5;
}
.user-message {
  display: flex;
  justify-content: flex-end;
}
.user-message .message-content {
  background: #000;
  color: #fff;
  padding: 12px;
  border-radius: 12px;
  max-width: 80%;
  font-size: 14px;
  line-height: 1.5;
}
.message-content p {
  margin: 0 0 8px 0;
}
.message-content h6.message-header {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 10px 0;
}
.message-content ul.message-list {
  margin: 0 0 8px 0;
  padding-left: 25px;
}
.message-content ul.message-list li {
  list-style-type: disc;
  margin-bottom: 6px;
  font-size: 14px;
}
.message-content strong {
  font-weight: 700;
  color: #1a1a1a;
}

/* Input */
.chatbox-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}
.chatbox-input input {
  flex: 1;
  border: none;
  padding: 10px;
  border-radius: 20px;
  background: #f1f1f1;
  outline: none;
}
.chatbox-input button {
  background: none;
  border: none;
  margin-left: 10px;
  font-size: 18px;
  color: #000;
  cursor: pointer;
}
</style>
