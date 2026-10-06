// =========================
// CLOUD E-LIBRARY JAVASCRIPT
// =========================


// LOGIN FORM
const loginForm = document.querySelector(".login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email === "" || password === "") {
            alert("Please fill all fields.");
            return;
        }

        alert("Login successful! Backend connection will be added later.");
    });
}


// REGISTER FORM
const registerForm = document.querySelector(".register-form");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const password =
            document.getElementById("register-password").value;

        const confirmPassword =
            document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        alert("Account created successfully! Database connection will be added later.");
    });
}


// UPLOAD FORM
const uploadForm = document.querySelector(".upload-form");

if (uploadForm) {
    uploadForm.addEventListener("submit", function(event) {
        event.preventDefault();

        alert("Material selected successfully. Cloud upload will be connected later.");
    });
}