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

    // Verlauf laden
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
    
    // Bot-Antwort zum Output hinzufügen
    const botMessage = document.createElement('div');
    botMessage.innerHTML = `<p><strong>Bot (${timestamp}):</strong> ${response}</p>`;
    outputDiv.appendChild(botMessage);
    
    // Verlauf speichern (nicht mehr notwendig, da wir keine Bot-Antworten speichern wollen)
//     saveToHistory({
//         user: 'Bot',
//         message: response,
//         timestamp: timestamp
//     });
    
    // Automatisches Scrollen
    outputDiv.scrollTop = outputDiv.scrollHeight;
    // historyDiv.scrollTop = historyDiv.scrollHeight; // Diese Zeile kann entfernt werden, da wir den Verlauf nicht mehr aktualisieren
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
    
    historyDiv.innerHTML = ''; // Vorherigen Verlauf leeren

    history.forEach(item => {
        const historyMessage = document.createElement('div');
        historyMessage.innerHTML = `<p><small>${item.timestamp} - ${item.user}: ${item.message}</small></p>`;
        historyMessage.classList.add('history-item'); // Klasse hinzufügen für Styling
        historyMessage.onclick = function() {
            loadMessageToChat(item.message); // Funktion aufrufen, um die Nachricht zu laden
        };
        historyDiv.appendChild(historyMessage);
    });
}

// Funktion zum Laden einer Nachricht in die Chatbox
function loadMessageToChat(message) {
    const userInput = document.getElementById('userInput');
    userInput.value = message; // Nachricht in das Eingabefeld laden
}

function clearChat() {
    const outputDiv = document.getElementById('output');
    const historyDiv = document.getElementById('history');
    
    // Chatbox und Verlauf leeren
    outputDiv.innerHTML = '';
    historyDiv.innerHTML = '';
    
    // Verlauf im localStorage löschen
    localStorage.removeItem('chatHistory');
}
