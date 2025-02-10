// Warten bis das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
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