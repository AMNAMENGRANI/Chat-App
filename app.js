import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getDatabase, ref, push, onChildAdded, remove, update } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC6g0R3rtaY4vy1iP_RWc6kYIBVfQ5LYLE",
    authDomain: "github-auth-32352.firebaseapp.com",
    projectId: "github-auth-32352",
    storageBucket: "github-auth-32352.firebasestorage.app",
    messagingSenderId: "128672157812",
    appId: "1:128672157812:web:bcd786bc278fe79a2e8121",
    measurementId: "G-C1P2468N25"
  };


// ✅ Firebase initialize
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const messagesRef = ref(db, "messages");

// ------------------- AUTH: SIGNUP -------------------
document.getElementById('signup')?.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('SignUp success:', userCredential.user);
      alert('SignUp Successful!');
      window.location.href = 'welcom.html';
    })
    .catch((error) => {
      console.error('SignUp error:', error.code, error.message);
      alert(error.message);
    });
});

// ------------------- AUTH: LOGIN -------------------
document.getElementById('login')?.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('Login success:', userCredential.user);
      alert('Login Successful!');
      window.location.href = 'welcom.html';
    })
    .catch((error) => {
      console.error('Login error:', error.code, error.message);
      alert(error.message);
    });
});

// ------------------- AUTH: GOOGLE LOGIN -------------------
document.getElementById('google-btn')?.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log('Google login success:', result.user);
      alert('Login Successfully');
      window.location.href = 'welcom.html';
    })
    .catch((error) => {
      console.error('Google login error:', error.code, error.message);
      alert(error.message);
    });
});


// ------------------- CHAT: SEND MESSAGE -------------------
window.sendMessage = function () {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first!");
    return;
  }

  const username = user.email || "Unknown User";
  const messageInput = document.getElementById("message");
  if (!messageInput) return;

  const message = messageInput.value.trim();
  if (message === "") return;

  push(messagesRef, {
    name: username,
    text: message,
    time: new Date().toLocaleTimeString(),
  });

  messageInput.value = "";
};

// ------------------- CHAT: LISTEN FOR NEW MESSAGES -------------------
const messageBox = document.getElementById("messages");
if (messageBox) {
  onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const id = snapshot.key;

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
}

// ------------------- CHAT: EDIT MESSAGE -------------------
window.editMessage = function (id) {
  const msgDiv = document.querySelector(`[data-id='${id}']`);
  if (!msgDiv) return;

  const textEl = msgDiv.querySelector(".text");
  const oldText = textEl.textContent;
  const newText = prompt("Edit your message:", oldText);

  if (newText && newText.trim() !== "") {
    update(ref(db, "messages/" + id), { text: newText.trim() });
    textEl.textContent = newText.trim();
  }
};

// ------------------- CHAT: DELETE MESSAGE -------------------
window.deleteMessage = function (id) {
  if (confirm("Delete this message?")) {
    remove(ref(db, "messages/" + id));
    const msgDiv = document.querySelector(`[data-id='${id}']`);
    if (msgDiv) msgDiv.remove();
  }
};

// ------------------- AUTH: LOGOUT -------------------
document.getElementById("logout")?.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logout Successfully");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});
