feather.replace();

// DOM
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const statusIndicator = document.getElementById("statusIndicator");

// Voice Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition, isListening = false;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "hi-IN"; // 🎤 Start with Hindi (auto-switch later if needed)
  recognition.onstart = () => {
    isListening = true;
    voiceBtn.innerHTML = '<i data-feather="mic-off"></i>';
    feather.replace();
    statusIndicator.textContent = "Listening...";
    statusIndicator.className = "text-yellow-600";
  };
  recognition.onend = () => {
    isListening = false;
    voiceBtn.innerHTML = '<i data-feather="mic"></i>';
    feather.replace();
    statusIndicator.textContent = "Connected";
    statusIndicator.className = "text-indigo-600";
  };
  recognition.onresult = (e) => {
    userInput.value = e.results[0][0].transcript;
    sendMessage();
  };
} else {
  voiceBtn.disabled = true;
  voiceBtn.title = "Speech recognition not supported";
}

// Voice Output
function speak(text, lang = "hi-IN") {
  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.lang = lang; // 🌐 Speak in correct language
    speechSynthesis.speak(u);
  }
}

// Add message
function addMessage(sender, text, typing = false) {
  const div = document.createElement("div");
  div.className = `flex mb-4 ${sender === 'user' ? 'justify-end' : ''}`;
  if (sender === 'user') {
    div.innerHTML = `
      <div class="ml-3 text-right">
        <div class="bg-indigo-600 text-white rounded-lg py-2 px-4 inline-block">
          <p>${text}</p>
        </div>
      </div>
      <div class="flex-shrink-0">
        <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
          <i data-feather="user" class="text-white"></i>
        </div>
      </div>`;
  } else if (typing) {
    div.innerHTML = `
      <div class="flex-shrink-0">
        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <i data-feather="cpu" class="text-indigo-600"></i>
        </div>
      </div>
      <div class="ml-3">
        <div class="bg-indigo-100 rounded-lg py-2 px-4 inline-block">
          <p class="text-gray-800 typing-indicator">Typing</p>
        </div>
      </div>`;
  } else {
    div.innerHTML = `
      <div class="flex-shrink-0">
        <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <i data-feather="cpu" class="text-indigo-600"></i>
        </div>
      </div>
      <div class="ml-3">
        <div class="bg-indigo-100 rounded-lg py-2 px-4 inline-block">
          <p class="text-gray-800">${text}</p>
        </div>
      </div>`;
  }
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  feather.replace();
}

// Simulate typing delay
function simulateTyping() {
  addMessage('ai', '', true);
  return new Promise(res => setTimeout(res, 1000 + Math.random() * 1000));
}

// 🌐 Multilingual FAQ knowledge base
const faqMap = [
  // English
  { q: ["admission", "apply"], a: "📌 Admissions to engineering colleges in Rajasthan are handled via DTE Rajasthan (REAP). Visit: https://dte.rajasthan.gov.in/", lang: "en-US" },
  { q: ["scholarship"], a: "🎓 Scholarships are available under Post-Matric & CM schemes. See the official site.", lang: "en-US" },
  { q: ["contact", "office"], a: "☎️ Directorate of Technical Education – Govind Marg, Jaipur, Rajasthan. Website: https://dte.rajasthan.gov.in/", phone: " 0291-2434395, Fax : 0291-2430398", lang: "en-US" },
  { q: ["polytechnic", "diploma"], a: "🏫 Polytechnic (Diploma) admissions in Rajasthan are under DTE’s Diploma programs. Apply online via official DTE portal.", lang: "en-US" },
  { q: ["about"], a: "ℹ️ The Department of Technical Education, Rajasthan oversees engineering colleges, polytechnics, ITIs, and promotes technical education in the state.", lang: "en-US" },
  { q: ["hello", "hi", "hey"], a: "👋 Hello! How can I assist you today?", lang: "en-US" },


  
  // Hindi
  { q: ["प्रवेश", "दाखिला"], a: "📌 राजस्थान में बी.टेक प्रवेश REAP प्रक्रिया द्वारा होता है। अधिक जानकारी के लिए DTE वेबसाइट देखें: https://dte.rajasthan.gov.in/",  lang: "hi-IN" },
  { q: ["छात्रवृत्ति"], a: "🎓 राजस्थान में तकनीकी छात्रों के लिए छात्रवृत्ति उपलब्ध है।", lang: "hi-IN" },
  { q: ["संपर्क", "कार्यालय"], a: "☎️ तकनीकी शिक्षा निदेशालय – गोविंद मार्ग, जयपुर, राजस्थान। वेबसाइट: https://dte.rajasthan.gov.in/", phone: " 0291-2434395, Fax : 0291-2430398", lang: "hi-IN" },
  { q: ["पॉलिटेक्निक", "डिप्लोमा"], a: "🏫 राजस्थान में पॉलिटेक्निक (डिप्लोमा) प्रवेश DTE के डिप्लोमा कार्यक्रमों के तहत होता है। आधिकारिक DTE पोर्टल के माध्यम से ऑनलाइन आवेदन करें।", lang: "hi-IN" },
  { q: ["के बारे में"], a: "ℹ️ तकनीकी शिक्षा विभाग, राजस्थान इंजीनियरिंग कॉलेज, पॉलिटेक्निक, ITI का संचालन करता है और राज्य में तकनीकी शिक्षा को बढ़ावा देता है।", lang: "hi-IN" },
  { q: ["नमस्ते", "हैलो", "हाय"], a: "👋 नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?", lang: "hi-IN" },

  
  // Rajasthani
  { q: ["भणाई", "दाखलो"], a: "📌 राजस्थान मं इंजीनियरिंग दाखलो REAP थारी प्रक्रिया सूं होवेला। https://dte.rajasthan.gov.in/", lang: "hi-IN" },
  { q: ["वजीफा"], a: "🎓 वजीफा राजस्थान सरकार री योजना सूं मिलेला।", lang: "hi-IN" },
  { q: ["संपर्क", "कार्यालय"], a: "☎️ तकनीकी शिक्षा निदेशालय – गोविंद मार्ग, जयपुर, राजस्थान। वेबसाइट: https://dte.rajasthan.gov.in/", phone: " 0291-2434395, Fax : 0291-2430398", lang: "hi-IN" },
  { q: ["पॉलिटेक्निक", "डिप्लोमा"], a: "🏫 राजस्थान मं पॉलिटेक्निक दाखलो DTE री डिप्लोमा प्रोग्राम थारी होवेला।", lang: "hi-IN" },
  { q: ["के बारे में"], a: "ℹ️ तकनीकी शिक्षा विभाग, राजस्थान इंजीनियरिंग कॉलेज, पॉलिटेक्निक, ITI को संचालित करेला।", lang: "hi-IN" },
  { q: ["राम राम", "हैलो", "हाय"], a: "👋 राम राम सा! थारी के मदद कर सकूं?", lang: "hi-IN" },

];

// Detect language & get response
function getDTEResponse(msg) {
  msg = msg.toLowerCase();
  for (let item of faqMap) {
    if (item.q.some(keyword => msg.includes(keyword))) {
      return item;
    }
  }
  return null;
}

// Send message
async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  addMessage('user', msg);
  userInput.value = "";
  await simulateTyping();
  
  const match = getDTEResponse(msg);
  let finalReply, lang;
  
  if (match) {
    finalReply = match.a;
    lang = match.lang;
  } else {
    finalReply = `🤔 माफ करना, "${msg}" बारे में जानकारी उपलब्ध नाहीं। कृपया DTE वेबसाइट देखें: https://dte.rajasthan.gov.in/`;
    lang = "hi-IN";
  }
  
  addMessage('ai', finalReply);
  speak(finalReply, lang);
}

// Events
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
voiceBtn.addEventListener("click", () => { if (isListening) { recognition.stop(); } else { recognition.start(); } });

// Greet with voice
setTimeout(() => speak("नमस्ते, मैं आपका सहायक हूं। आप मुझसे DTE राजस्थान के बारे में पूछ सकते हो - प्रवेश, REAP, पॉलिटेक्निक या छात्रवृत्ति।", "hi-IN"), 1500);
// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered', reg);
    } catch (err) {
      console.warn('Service Worker registration failed:', err);
    }
  });
}

// Handle beforeinstallprompt to show custom install button
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.classList.remove('hidden');
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log('User choice', choice);
    deferredPrompt = null;
    installBtn.classList.add('hidden');
  });
}
