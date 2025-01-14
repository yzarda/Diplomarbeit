// Warten bis das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Elemente aus dem DOM holen
    const outputDiv = document.getElementById('output');
    const historyDiv = document.getElementById('history');
    const userInput = document.getElementById('userInput');

    // Initial-Text löschen
    outputDiv.textContent = '';
    historyDiv.textContent = '';

    // Event Listener für Enter-Taste
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Modal Elemente
    const modal = document.getElementById('loginModal');
    const signinBtn = document.getElementById('signinBtn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const loginForm = document.getElementById('loginForm');
    
    // Benutzerstatus
    let currentUser = null;
    
    // Modal öffnen
    signinBtn.onclick = function() {
        if (!currentUser) {
            modal.style.display = "block";
        }
    }
    
    // Modal schließen
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
    
    // Außerhalb des Modals klicken
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    // Login Form Handler
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Hier später echte Authentifizierung einbauen
        handleLogin(username);
    }
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
    
    // Nachricht speichern
    saveToHistory({
        user: localStorage.getItem('currentUser') || 'Gast',
        message: userMessage,
        timestamp: timestamp
    });
    
    // Input-Feld leeren
    userInput.value = '';
    
    // Automatisches Scrollen
    outputDiv.scrollTop = outputDiv.scrollHeight;
    historyDiv.scrollTop = historyDiv.scrollHeight;
    
    // API-Aufruf
    try {
        const response = await apiCall(userMessage);
        handleBotResponse(response, timestamp);
    } catch (error) {
        console.error('API Error:', error);
        handleBotResponse('Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage.', timestamp);
    }
}

async function apiCall(message) {
    try {
        const response = await fetch('http://10.115.1.219:7860/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Call failed:', error);
        throw error;
    }
}

function handleBotResponse(response, timestamp) {
    const outputDiv = document.getElementById('output');
    const historyDiv = document.getElementById('history');
    
    // Bot-Antwort zum Output hinzufügen
    const botMessage = document.createElement('div');
    botMessage.innerHTML = `<p><strong>Bot (${timestamp}):</strong> ${response}</p>`;
    outputDiv.appendChild(botMessage);
    
    // Bot-Antwort zum Verlauf hinzufügen
    const historyMessage = document.createElement('div');
    historyMessage.innerHTML = `<p><small>${timestamp} - Bot: ${response}</small></p>`;
    historyDiv.appendChild(historyMessage);
    
    // Verlauf speichern
    saveToHistory({
        user: 'Bot',
        message: response,
        timestamp: timestamp
    });
    
    // Automatisches Scrollen
    outputDiv.scrollTop = outputDiv.scrollHeight;
    historyDiv.scrollTop = historyDiv.scrollHeight;
}

// Verlauf speichern
function saveToHistory(messageData) {
    let history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push(messageData);
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

// Verlauf laden
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const outputDiv = document.getElementById('output');
    const historyDiv = document.getElementById('history');
    
    history.forEach(item => {
        const outputMessage = document.createElement('div');
        outputMessage.innerHTML = `<p><strong>${item.user} (${item.timestamp}):</strong> ${item.message}</p>`;
        outputDiv.appendChild(outputMessage);
        
        const historyMessage = document.createElement('div');
        historyMessage.innerHTML = `<p><small>${item.timestamp} - ${item.user}: ${item.message}</small></p>`;
        historyDiv.appendChild(historyMessage);
    });
}
