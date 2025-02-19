// Warten bis das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Elemente aus dem DOM holen
    const outputDiv = document.getElementById('output');
    const historyDiv = document.getElementById('history');
    const userInput = document.getElementById('userInput');

    outputDiv.textContent = '';
    historyDiv.textContent = '';

    // Event Listener für Enter-Taste
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    loadHistory();
});

function handleLogin(username) {
    currentUser = username;
    const modal = document.getElementById('loginModal');
    const signinBtn = document.getElementById('signinBtn');
    
    // UI aktualisieren
    modal.style.display = "none";
    signinBtn.textContent = username;
    signinBtn.classList.add('logged-in');
    
    // Login im localStorage speichern
    localStorage.setItem('currentUser', username);
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const outputDiv = document.getElementById('output');
    const historyDiv = document.getElementById('history');
    
    const userMessage = userInput.value.trim();
    
    if (userMessage === '') return;
    
    const timestamp = new Date().toLocaleTimeString();
    
    // Benutzernachricht anzeigen
    const outputMessage = document.createElement('div');
    outputMessage.innerHTML = `<p><strong>Du (${timestamp}):</strong> ${userMessage}</p>`;
    outputDiv.appendChild(outputMessage);
    
    // Nachricht zum Verlauf hinzufügen
    const historyMessage = document.createElement('div');
    historyMessage.innerHTML = `<p><small>${timestamp}: ${userMessage}</small></p>`;
    historyDiv.appendChild(historyMessage);
    
    saveToHistory({
        user: localStorage.getItem('currentUser') || 'Gast',
        message: userMessage,
        timestamp: timestamp
    });
    
    userInput.value = '';
    
    // Automatisches Scrollen
    outputDiv.scrollTop = outputDiv.scrollHeight;
    historyDiv.scrollTop = historyDiv.scrollHeight;

    // API-Anruf und Bot-Antwort
    try {
        const response = await apiCall(userMessage);
        handleBotResponse(response, timestamp);
    } catch (error) {
        console.error('API Error:', error);
        handleBotResponse('Entschuldigung, ein Fehler ist aufgetreten.', timestamp);
    }
}

async function apiCall(message) {
    try {
        const response = await fetch('http://10.115.1.219:7860/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error(`HTTP Fehler: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API Call fehlgeschlagen:', error);
        return 'Server nicht erreichbar.';
    }
}

function handleBotResponse(response, timestamp) {
    addMessageToChat('Bot', response, timestamp);
}

// Nachricht in die Chatbox einfügen
function addMessageToChat(user, message, timestamp) {
    const outputDiv = document.getElementById('output');
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<p><strong>${user} (${timestamp}):</strong> ${message}</p>`;
    outputDiv.appendChild(messageDiv);
    outputDiv.scrollTop = outputDiv.scrollHeight; // Automatisches Scrollen
}

// Verlauf speichern
function saveToHistory(messageData) {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push(messageData);
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

// Verlauf laden und in Chatbox anzeigen
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = ''; // Verlauf leeren

    history.forEach(({ timestamp, user, message }) => {
        const historyMessage = createHistoryMessage(timestamp, user, message);
        historyDiv.appendChild(historyMessage);
    });
}

// Funktion zum Erstellen eines Verlaufseintrags
function createHistoryMessage(timestamp, user, message) {
    const historyMessage = document.createElement('div');
    historyMessage.innerHTML = `<p><small>${timestamp} - ${user}: ${message}</small></p>`;
    historyMessage.classList.add('history-item');
    historyMessage.onclick = () => loadMessageToChat(message, timestamp);
    return historyMessage;
}

// Funktion zum Laden einer Nachricht in die Chatbox
function loadMessageToChat(message, timestamp) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Chatbox leeren

    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<p><strong>Gast (${timestamp}):</strong> ${message}</p>`;
    outputDiv.appendChild(messageDiv);
    outputDiv.scrollTop = outputDiv.scrollHeight; // Automatisches Scrollen
}

// Chatverlauf leeren
function clearChat() {
    document.getElementById('output').innerHTML = '';
    document.getElementById('history').innerHTML = '';
    localStorage.removeItem('chatHistory');
}