// =========================================
// CLOUD E-LIBRARY JAVASCRIPT
// =========================================

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    // 1. Check for URL search or category parameters on Library page
    initLibraryParams();

    // 2. Load any user-uploaded materials from localStorage
    loadUploadedMaterials();
});

// =========================================
// SEARCH & FILTER (LIBRARY PAGE)
// =========================================

function searchMaterials() {
    const searchInput = document.getElementById("librarySearch");
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".library-card");

    cards.forEach(card => {
        const titleEl = card.querySelector("h2, h3");
        const descEl = card.querySelector("p");
        const title = titleEl ? titleEl.textContent.toLowerCase() : "";
        const desc = descEl ? descEl.textContent.toLowerCase() : "";

        if (title.includes(query) || desc.includes(query)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });

    // Reset filter buttons active state when searching
    if (query !== "") {
        document.querySelectorAll(".library-categories button").forEach(btn => {
            btn.classList.remove("active");
        });
    }
}

function filterBooks(category, btnElement) {
    const cards = document.querySelectorAll(".library-card");

    // Update active button state
    if (btnElement) {
        document.querySelectorAll(".library-categories button").forEach(btn => {
            btn.classList.remove("active");
        });
        btnElement.classList.add("active");
    }

    // Clear search box if filtering by category
    const searchInput = document.getElementById("librarySearch");
    if (searchInput) {
        searchInput.value = "";
    }

    cards.forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// Check URL query parameters (e.g. library.html?category=ebook or library.html?search=python)
function initLibraryParams() {
    const searchInput = document.getElementById("librarySearch");
    if (!searchInput) return;

    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");

    if (searchParam) {
        searchInput.value = searchParam;
        searchMaterials();
    } else if (categoryParam) {
        const targetBtn = Array.from(document.querySelectorAll(".library-categories button")).find(btn => {
            const onclickAttr = btn.getAttribute("onclick") || "";
            return onclickAttr.includes(`'${categoryParam}'`);
        });
        filterBooks(categoryParam, targetBtn);
    }
}

// =========================================
// VIEW & DOWNLOAD ACTIONS
// =========================================

function viewMaterial(title) {
    alert("Opening material preview: " + title + "\n(Cloud Reader loading...)");
}

function downloadMaterial(title) {
    alert("Downloading: " + title + "\nYour cloud download will start shortly.");
}

// Bind view and download click handlers to cards
document.addEventListener("click", function (event) {
    const target = event.target;
    if (target.matches(".material-buttons button, .material-buttons a")) {
        const text = target.textContent.trim();
        const card = target.closest(".library-card, .book-card");
        const titleEl = card ? card.querySelector("h2, h3") : null;
        const title = titleEl ? titleEl.textContent.trim() : "Study Material";

        if (text.includes("View")) {
            viewMaterial(title);
        } else if (text.includes("Download")) {
            downloadMaterial(title);
        }
    }
});

// =========================================
// LOGIN FORM
// =========================================
const loginForm = document.querySelector(".login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");

        const email = emailEl ? emailEl.value.trim() : "";
        const password = passwordEl ? passwordEl.value : "";

        if (email === "" || password === "") {
            alert("Please fill all fields.");
            return;
        }

        // Save session simulation
        localStorage.setItem("cloud_elibrary_user", email);

        alert("Login successful! Welcome back to Cloud E-Library.");
        window.location.href = "library.html";
    });
}

// =========================================
// REGISTER FORM
// =========================================
const registerForm = document.querySelector(".register-form");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullnameEl = document.getElementById("fullname");
        const emailEl = document.getElementById("register-email");
        const passwordEl = document.getElementById("register-password");
        const confirmPasswordEl = document.getElementById("confirm-password");

        const fullname = fullnameEl ? fullnameEl.value.trim() : "";
        const email = emailEl ? emailEl.value.trim() : "";
        const password = passwordEl ? passwordEl.value : "";
        const confirmPassword = confirmPasswordEl ? confirmPasswordEl.value : "";

        if (fullname === "" || email === "" || password === "" || confirmPassword === "") {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        // Store user in localStorage
        const users = JSON.parse(localStorage.getItem("cloud_elibrary_users") || "[]");
        users.push({ fullname, email });
        localStorage.setItem("cloud_elibrary_users", JSON.stringify(users));

        alert("Account created successfully! Please login to continue.");
        window.location.href = "login.html";
    });
}

// =========================================
// UPLOAD FORM
// =========================================
const uploadForm = document.querySelector("#uploadForm, .upload-form");

if (uploadForm) {
    uploadForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const titleEl = document.getElementById("title");
        const categoryEl = document.getElementById("category");
        const authorEl = document.getElementById("author");
        const descEl = document.getElementById("description");
        const fileEl = document.getElementById("file");

        const title = titleEl ? titleEl.value.trim() : "";
        const category = categoryEl ? categoryEl.value : "ebook";
        const author = authorEl ? authorEl.value.trim() : "Anonymous";
        const description = descEl ? descEl.value.trim() : "";

        if (title === "") {
            alert("Please provide a title for the material.");
            return;
        }

        // Save material to localStorage
        const uploads = JSON.parse(localStorage.getItem("cloud_elibrary_uploads") || "[]");
        uploads.push({
            title,
            category,
            author,
            description,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem("cloud_elibrary_uploads", JSON.stringify(uploads));

        alert("Material '" + title + "' uploaded successfully to Cloud Storage!");
        window.location.href = "library.html";
    });
}

// Load dynamic uploaded materials into library
function loadUploadedMaterials() {
    const container = document.querySelector(".library-materials");
    if (!container) return;

    const uploads = JSON.parse(localStorage.getItem("cloud_elibrary_uploads") || "[]");
    if (uploads.length === 0) return;

    const categoryIcons = {
        "ebook": "📚",
        "notes": "📄",
        "question-paper": "📝",
        "programming": "💻",
        "cloud": "☁️",
        "ai": "🤖"
    };

    uploads.forEach(item => {
        const card = document.createElement("div");
        card.className = `library-card ${item.category}`;

        const icon = categoryIcons[item.category] || "📚";
        const catName = item.category.toUpperCase().replace("-", " ");

        card.innerHTML = `
            <div class="material-icon">${icon}</div>
            <div class="material-content">
                <span>${catName}</span>
                <h2>${escapeHtml(item.title)}</h2>
                <p>${escapeHtml(item.description || "Uploaded by " + item.author)}</p>
                <div class="material-buttons">
                    <button>👁 View</button>
                    <button>📥 Download</button>
                </div>
            </div>
        `;
        container.prepend(card);
    });
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}