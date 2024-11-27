// Referenzen zu HTML-Elementen
const inputField = document.querySelector('.console-input');
const outputDiv = document.querySelector('.console-output');
const button = document.querySelector('button');
const historyList = document.querySelector('.history-list');

// Funktion zum Hinzufügen von Nachrichten zur Ausgabe
function addMessageToOutput(message, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = (isUser ? "Du: " : "Bot: ") + message;
    outputDiv.appendChild(messageDiv);
    outputDiv.scrollTop = outputDiv.scrollHeight; // Scrollt automatisch nach unten
}

// Funktion zum Hinzufügen von Nachrichten zum Verlauf
function addToHistory(message) {
    const historyItem = document.createElement('li');
    historyItem.textContent = message;
    historyList.appendChild(historyItem);
}

// Event Listener für den Button
button.addEventListener('click', () => {
    const userMessage = inputField.value.trim();
    if (userMessage) {
        // Nachricht des Nutzers hinzufügen
        addMessageToOutput(userMessage);
        addToHistory(userMessage);

        // Antwort generieren
        generateBotResponse(userMessage);

        // Eingabefeld leeren
        inputField.value = '';
    }
});

// Funktion zur Generierung einer Bot-Antwort
function generateBotResponse(userMessage) {
    let response;

    // Einfache Logik für Antworten
    if (userMessage.toLowerCase() === 'hallo') {
        response = 'Hallo! Wie kann ich dir helfen?';
    } else if (userMessage.toLowerCase() === 'hilfe') {
        response = 'Du kannst Fragen stellen oder Befehle eingeben!';
    } else {
        response = 'Ich habe das nicht verstanden. Versuche es nochmal!';
    }

    // Antwort des Bots hinzufügen
    addMessageToOutput(response, false);
}
