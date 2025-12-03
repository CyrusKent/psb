const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Toggle forms
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// --- STATIC LOGIN CREDENTIALS ---
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin123";

// LOGIN
document.querySelector('#login-form').addEventListener('submit', function(e){
    e.preventDefault();

    const username = document.querySelector('#login-username').value.trim();
    const password = document.querySelector('#login-password').value.trim();

    if(username === VALID_USERNAME && password === VALID_PASSWORD){
        // Redirect to CLIQQ page
        window.location.href = "dashboard.html";
    } else {
        alert("Incorrect username or password!");
    }
});
