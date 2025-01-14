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

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const outputDiv = document.getElementById('output');
    const historyDiv = document.getElementById('history');
    
    const userMessage = userInput.value.trim();
    
    if (userMessage === '') return; // Keine leeren Nachrichten
    
    // Aktuelle Zeit für den Zeitstempel
    const timestamp = new Date().toLocaleTimeString();
    
    // Nachricht zum Output hinzufügen
    const outputMessage = document.createElement('div');
    outputMessage.innerHTML = `<p><strong>Du (${timestamp}):</strong> ${userMessage}</p>`;
    outputDiv.appendChild(outputMessage);
    
    // Nachricht zum Verlauf hinzufügen
    const historyMessage = document.createElement('div');
    historyMessage.innerHTML = `<p><small>${timestamp}: ${userMessage}</small></p>`;
    historyDiv.appendChild(historyMessage);
    
    // Nachricht im localStorage speichern
    saveToHistory({
        user: localStorage.getItem('currentUser') || 'Gast',
        message: userMessage,
        timestamp: timestamp
    });
    
    // Input-Feld leeren
    userInput.value = '';
    
    // Automatisches Scrollen zum neuesten Eintrag
    outputDiv.scrollTop = outputDiv.scrollHeight;
    historyDiv.scrollTop = historyDiv.scrollHeight;
    
    // Hier später API-Aufruf einfügen
    // apiCall(userMessage);
}

// Funktion für späteren API-Aufruf
async function apiCall(message) {
    // Hier kommt später der API-Code
    // const response = await fetch(...);
    // const data = await response.json();
    // handleBotResponse(data);
}

function handleBotResponse(response) {
    // Hier kommt später die Verarbeitung der Bot-Antwort
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
