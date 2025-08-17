<template>
  <div class="chatbox-container">
    <div class="chatbox-header" @click="toggleChat">
      <i class="bi" :class="isOpen ? 'bi-chevron-down' : 'bi-chat-dots'"></i>
    </div>
    <div v-if="isOpen" class="chatbox-body">
      <div class="chatbox-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="message.sender === 'user' ? 'user-message' : 'bot-message'"
        >
          <div class="message-content" v-html="formatMessage(message.text, index)"></div>
          <div v-if="message.sender === 'bot' && message.loading" class="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div class="chatbox-input">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Hỏi về sản phẩm..."
          class="form-control"
        />
        <button @click="sendMessage" class="btn btn-send">
          <i class="bi bi-send"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";

const isOpen = ref(false);
const userInput = ref("");
const messages = ref([
  {
    sender: "bot",
    text: "Xin chào! Tôi có thể giúp bạn tìm sản phẩm phù hợp. Bạn muốn hỏi gì?",
  },
]);
const messagesContainer = ref(null);
const productIds = ref({}); // Lưu productId cho từng tin nhắn
const router = useRouter();

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    scrollToBottom();
  }
};

// Tìm productId dựa trên tên sản phẩm
const fetchProductIdByName = async (productName) => {
  try {
    const response = await axios.get("/api/public/products/search", {
      params: { keyword: productName },
    });
    const products = response.data.content || [];
    return products.length > 0 ? products[0].productId : null;
  } catch (error) {
    console.error(`Lỗi khi tìm sản phẩm "${productName}":`, error);
    return null;
  }
};

// Định dạng tin nhắn và thêm nút "Xem chi tiết"
const formatMessage = (text, messageIndex) => {
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
  const productNames = [];

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
      const productMatch = line.match(/\*\*(.*?)\*\*/);
      const productName = productMatch ? productMatch[1] : null;
      if (productName) {
        productNames.push({ name: productName, line });
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

  // Thêm nút "Xem chi tiết" cho các sản phẩm
  if (productNames.length > 0) {
    Promise.all(
      productNames.map(async ({ name, line }, index) => {
        const productId = await fetchProductIdByName(name);
        if (productId) {
          if (!productIds.value[messageIndex]) {
            productIds.value[messageIndex] = {};
          }
          productIds.value[messageIndex][index] = productId;
          html = html.replace(
            `<li>${line.replace(/^\* /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`,
            `<li>${line.replace(/^\* /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")} <button class="btn btn-detail" onclick="document.dispatchEvent(new CustomEvent('navigateToProduct', { detail: { productId: '${productId}' } }))">Xem chi tiết</button></li>`
          );
        }
      })
    ).then(() => {
      productIds.value = { ...productIds.value };
    });
  }

  return html;
};

// Điều hướng đến trang chi tiết sản phẩm
const navigateToProduct = (event) => {
  const productId = event.detail.productId;
  router.push(`/product-detail/${productId}`);
};

// Thêm và xóa event listener
onMounted(() => {
  document.addEventListener("navigateToProduct", navigateToProduct);
});

onBeforeUnmount(() => {
  document.removeEventListener("navigateToProduct", navigateToProduct);
});

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  messages.value.push({ sender: "user", text: userInput.value });

  const loadingMessage = { sender: "bot", text: "", loading: true };
  messages.value.push(loadingMessage);

  try {
    const response = await axios.post("/api/public/chat", {
      message: userInput.value,
    });
    const botResponse = response.data;
    const index = messages.value.indexOf(loadingMessage);
    if (index !== -1) {
      messages.value.splice(index, 1, { sender: "bot", text: JSON.stringify(botResponse) });
    }
  } catch (error) {
    console.error("Lỗi khi gọi API chatbot:", error);
    const index = messages.value.indexOf(loadingMessage);
    if (index !== -1) {
      messages.value.splice(index, 1, {
        sender: "bot",
        text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!",
      });
    }
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
.chatbox-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  z-index: 1000;
  font-family: 'Georgia', serif;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background-color: #f5f5f5;
}

.chatbox-header {
  background-color: #333;
  color: #fff;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  transition: background-color 0.3s ease;
}

.chatbox-header:hover {
  background-color: #444;
}

.chatbox-body {
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.chatbox-messages {
  flex: 1;
  max-height: 450px;
  overflow-y: auto;
  padding: 25px;
  background-color: #f9f9f9;
  scrollbar-width: thin;
  scrollbar-color: #888 #f9f9f9;
}

.chatbox-messages::-webkit-scrollbar {
  width: 8px;
}

.chatbox-messages::-webkit-scrollbar-track {
  background: #f9f9f9;
}

.chatbox-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.user-message,
.bot-message {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.bot-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 15px 20px;
  border-radius: 10px;
  line-height: 1.6;
  font-size: 15px;
  word-break: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
  background-color: #333;
  color: #fff;
  border-bottom-right-radius: 2px;
}

.bot-message .message-content {
  background-color: #e0e0e0;
  color: #333;
  border-bottom-left-radius: 2px;
}

.message-content p {
  margin: 0 0 10px 0;
}

.message-content h6.message-header {
  font-size: 16px;
  font-weight: 600;
  color: #555;
  margin: 0 0 12px 0;
}

.message-content ul.message-list {
  margin: 0 0 10px 0;
  padding-left: 30px;
}

.message-content ul.message-list li {
  list-style-type: disc;
  margin-bottom: 8px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-content strong {
  font-weight: 700;
  color: #222;
}

.btn-detail {
  background-color: #666;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-detail:hover {
  background-color: #555;
}

.chatbox-input {
  display: flex;
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #ccc;
}

.chatbox-input input {
  flex: 1;
  border: 1px solid #bbb;
  border-radius: 25px;
  padding: 12px 18px;
  margin-right: 12px;
  font-size: 15px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.chatbox-input input:focus {
  outline: none;
  border-color: #666;
  box-shadow: 0 0 6px rgba(102, 102, 102, 0.3);
}

.btn-send {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-send:hover {
  background-color: #444;
}

.loading-dots {
  display: flex;
  gap: 6px;
  margin-left: 15px;
  align-items: center;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background-color: #666;
  border-radius: 50%;
  display: inline-block;
  animation: dotPulse 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
