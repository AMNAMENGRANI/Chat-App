import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, update } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJPKLFhItBQJYtKAAaMxpdzoNmvfZv-dA",
  authDomain: "chat-bot-app-21a0f.firebaseapp.com",
  projectId: "chat-bot-app-21a0f",
  storageBucket: "chat-bot-app-21a0f.firebasestorage.app",
  messagingSenderId: "798617758356",
  appId: "1:798617758356:web:35cea544aca706b9b3a281",
  measurementId: "G-9P9ES64MZY"
};

// ✅ Firebase initialize
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const messagesRef = ref(db, "messages");

// 🟡 Send message to Firebase
window.sendMessage = function () {
  const message = document.getElementById("message").value.trim();
  if (username === "" || message === "") return;

  push(messagesRef, {
    name: username,
    text: message,
    time: new Date().toLocaleTimeString(),
  });

  document.getElementById("message").value = "";
};

// 🟠 Listen for new messages
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  const id = snapshot.key;
  const messageBox = document.getElementById("messages");

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.setAttribute("data-id", id);

  msgDiv.innerHTML = `
    <div class="meta"><strong>${data.name}</strong> <span>${data.time}</span></div>
    <div class="text">${data.text}</div>
    <div class="actions">
      <button onclick="editMessage('${id}')">✏️</button>
      <button onclick="deleteMessage('${id}')">🗑️</button>
    </div>
  `;

  messageBox.appendChild(msgDiv);
  messageBox.scrollTop = messageBox.scrollHeight;
});

// ✏️ Edit message
window.editMessage = function (id) {
  const msgDiv = document.querySelector(`[data-id='${id}']`);
  const textEl = msgDiv.querySelector(".text");
  const oldText = textEl.textContent;
  const newText = prompt("Edit your message:", oldText);
  if (newText && newText.trim() !== "") {
    update(ref(db, "messages/" + id), { text: newText.trim() });
    textEl.textContent = newText.trim();
  }
};

// 🗑️ Delete message
window.deleteMessage = function (id) {
  if (confirm("Delete this message?")) {
    remove(ref(db, "messages/" + id));
    const msgDiv = document.querySelector(`[data-id='${id}']`);
    msgDiv.remove();
  }
};

// 🚪 Logout
document.getElementById("logout")?.addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("Logout Successfully");
    window.location.href = "index.html";
  });
});
