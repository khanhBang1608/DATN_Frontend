<script setup>
import axios from "axios";
import { ref, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router"; // thêm dòng này

const router = useRouter();

const isOpen = ref(false);
const userInput = ref("");
const isLoading = ref(false);
const messages = ref([
  {
    sender: "bot",
    text: "Xin chào! Tôi có thể giúp bạn tìm sản phẩm phù hợp. Bạn muốn hỏi gì?",
    timestamp: new Date(),
  },
]);
const messagesContainer = ref(null);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => scrollToBottom());
  }
};

// Định dạng thời gian
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

      // Lấy toàn bộ text
      const fullText = line.replace(/^\* /, "").trim();

      // Tách tên sản phẩm trước dấu ":" (hoặc format bạn định nghĩa)
      const productName = fullText.split(":")[0].replace(/\*\*/g, "").trim();

      // Hiển thị: thay **...** bằng <strong class="clickable-product">...</strong>
      const listContent = fullText.replace(
        /\*\*(.*?)\*\*/g,
        `<strong class="clickable-product" data-product="${productName.replace(
          /'/g,
          "\\'"
        )}">$1</strong>`
      );

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
  if (!userInput.value.trim() || isLoading.value) return;

  messages.value.push({ sender: "user", text: userInput.value, timestamp: new Date() });
  isLoading.value = true;

  try {
    const response = await axios.post("/api/public/chat", {
      message: userInput.value,
    });
    const botResponse = response.data;
    messages.value.push({
      sender: "bot",
      text: JSON.stringify(botResponse),
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Lỗi khi gọi API chatbot:", error);
    messages.value.push({
      sender: "bot",
      text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!",
      timestamp: new Date(),
    });
  }

  userInput.value = "";
  isLoading.value = false;
  await nextTick();
  scrollToBottom();
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
watch(
  messages,
  async (newVal) => {
    localStorage.setItem("chatMessages", JSON.stringify(newVal));

    // Đợi render xong rồi gắn sự kiện click
    await nextTick();
    document.querySelectorAll(".clickable-product").forEach((el) => {
      el.onclick = () => {
        const productName = el.getAttribute("data-product");
        router.push({ path: "/product", query: { keyword: productName } });
      };
    });
  },
  { deep: true }
);
// Khi load component thì khôi phục lại từ localStorage
onMounted(() => {
  const saved = localStorage.getItem("chatMessages");
  if (saved) {
    messages.value = JSON.parse(saved);
  }

  // Giữ hàm handleSearchFromChat
  window.handleSearchFromChat = (productName) => {
    router.push({ path: "/product", query: { keyword: productName } });
  };
});
</script>
<template>
  <div class="chatbox-container">
    <!-- Nút mở chat -->
    <div v-if="!isOpen" class="chatbox-toggle" @click="toggleChat">
      <i class="bi bi-chat-fill"></i>
    </div>

    <!-- Hộp chat -->
    <transition name="chatbox">
      <div v-if="isOpen" class="chatbox">
        <!-- Header -->
        <div class="chatbox-header">
          <div class="chatbox-header-left">
            <div class="chatbox-logo">
              <i class="bi bi-chat-fill"></i>
            </div>
            <div>
              <h6 class="chatbox-title">TƯ VẤN SẢN PHẨM</h6>
            </div>
          </div>
          <button class="chatbox-close" @click="toggleChat">×</button>
        </div>

        <!-- Nội dung tin nhắn -->
        <div class="chatbox-body" ref="messagesContainer">
          <transition-group name="message" tag="div">
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="message.sender === 'user' ? 'user-message' : 'bot-message'"
            >
              <div class="message-content" v-html="formatMessage(message.text)"></div>
              <small class="message-timestamp">{{
                formatTimestamp(message.timestamp)
              }}</small>
            </div>
          </transition-group>
          <div v-if="isLoading" class="loading-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>

        <!-- Ô nhập -->
        <div class="chatbox-input">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="Nhập tin nhắn..."
            :disabled="isLoading"
          />
          <button @click="sendMessage" :disabled="isLoading">
            <i class="bi bi-send"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Container */
.chatbox-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: "Inter", Arial, sans-serif;
}

/* Nút mở chat */
.chatbox-toggle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1a1a1a, #333);
  border-radius: 50% 50% 50% 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.chatbox-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
}
@media (max-width: 400px) {
  .chatbox {
    width: 90vw;
    height: 80vh;
  }
}

/* Hiệu ứng mở/đóng chatbox */
.chatbox-enter-active,
.chatbox-leave-active {
  transition: all 0.3s ease;
}
.chatbox-enter-from,
.chatbox-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Header */
.chatbox-header {
  background: linear-gradient(90deg, #1a1a1a, #2c2c2c);
  color: #fff;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chatbox-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.chatbox-logo {
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chatbox-logo i {
  color: #1a1a1a;
  font-size: 16px;
}
.chatbox-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}
.chatbox-subtitle {
  font-size: 11px;
  color: #b0b0b0;
}
.chatbox-close {
  background: transparent;
  border: none;
  font-size: 22px;
  color: #fff;
  cursor: pointer;
  transition: color 0.2s ease;
}
.chatbox-close:hover {
  color: #ccc;
}

/* Nội dung */
/* Nội dung */
.chatbox-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f8f8f8;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f8f8f8;
}
.chatbox-body::-webkit-scrollbar {
  width: 6px;
}
.chatbox-body::-webkit-scrollbar-track {
  background: #f8f8f8;
}
.chatbox-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

/* Tin nhắn */
.bot-message,
.user-message {
  margin-bottom: 20px;
}
.bot-message .message-content {
  background: #e8e8e8;
  padding: 10px 12px;
  border-radius: 10px 10px 10px 2px;
  max-width: 75%;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  word-break: break-word; /* Thêm để tự động xuống dòng */
  overflow-wrap: break-word; /* Hỗ trợ xuống dòng cho văn bản dài */
}
.bot-message .message-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}
.user-message {
  display: flex;
  justify-content: flex-end;
}
.user-message .message-content {
  background: linear-gradient(135deg, #1a1a1a, #333);
  color: #fff;
  padding: 10px 12px;
  border-radius: 10px 10px 2px 10px;
  max-width: 75%;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  word-break: break-word; /* Thêm để tự động xuống dòng */
  overflow-wrap: break-word; /* Hỗ trợ xuống dòng cho văn bản dài */
}
.user-message .message-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
}
.message-content p {
  margin: 0 0 6px 0;
}
.message-content h6.message-header {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}
.message-content ul.message-list {
  margin: 0 0 6px 0;
  padding-left: 20px;
}
.message-content ul.message-list li {
  list-style-type: disc;
  margin-bottom: 5px;
  font-size: 13px;
}
.message-content strong {
  font-weight: 700;
  color: #1a1a1a;
}
.message-timestamp {
  display: block;
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}
.bot-message .message-timestamp {
  text-align: left;
}

/* Hiệu ứng tin nhắn */
.message-enter-active {
  transition: all 0.3s ease;
}
.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Loading indicator */
.loading-indicator {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 10px;
}
.dot {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}
.dot:nth-child(2) {
  animation-delay: -0.32s;
}
.dot:nth-child(3) {
  animation-delay: -0.16s;
}
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Input */
.chatbox-input {
  display: flex;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  background: #fff;
}
.chatbox-input input {
  flex: 1;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  background: #f1f1f1;
  outline: none;
  font-size: 14px;
  transition: background 0.2s ease;
}
.chatbox-input input:focus {
  background: #e8e8e8;
}
.chatbox-input input:disabled {
  background: #ddd;
  cursor: not-allowed;
}
.chatbox-input button {
  background: none;
  border: none;
  margin-left: 10px;
  font-size: 18px;
  color: #1a1a1a;
  cursor: pointer;
  transition: color 0.2s ease;
}
.chatbox-input button:hover {
  color: #555;
}
.chatbox-input button:disabled {
  color: #999;
  cursor: not-allowed;
}
</style>
