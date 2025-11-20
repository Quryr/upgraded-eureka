/* ============================================
   SIMPLE LOCALSTORAGE AUTH SYSTEM
   ============================================ */

/* ---- UI Elements ---- */
const loginModal = document.getElementById("login-modal");
const signupModal = document.getElementById("signup-modal");

const loginBtn = document.getElementById("login-btn-nav");
const signupBtn = document.getElementById("signup-btn-nav");

const loginSubmit = document.getElementById("login-submit");
const signupSubmit = document.getElementById("signup-submit");

const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");

const profileBlock = document.getElementById("profile-block");
const profileName = document.getElementById("profile-name");
const logoutBtn = document.getElementById("logout-btn");


/* ============================================
   OPEN / CLOSE MODALS
   ============================================ */

function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}

document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
        closeModal(btn.dataset.close);
    });
});

window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
        e.target.classList.add("hidden");
    }
});


/* ============================================
   AUTH LOGIC
   ============================================ */

// Save account
function saveUser(username, password) {
    localStorage.setItem("user", JSON.stringify({
        username,
        password,
        balance: 10000     // стартовый баланс
    }));
}

// Load account
function loadUser() {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
}

// Update navbar after login
function updateNavbar() {
    const user = loadUser();

    if (user) {
        // Hide login/signup
        document.getElementById("auth-buttons").style.display = "none";

        // Show profile
        profileBlock.style.display = "flex";
        profileName.textContent = user.username;
    }
}

/* ============================================
   SIGNUP
   ============================================ */

signupSubmit.addEventListener("click", () => {
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (username.length < 3) {
        signupError.textContent = "Username must be at least 3 characters";
        return;
    }
    if (password.length < 3) {
        signupError.textContent = "Password must be at least 3 characters";
        return;
    }

    saveUser(username, password);
    signupError.textContent = "";
    closeModal("signup-modal");

    updateNavbar();
});


/* ============================================
   LOGIN
   ============================================ */

loginSubmit.addEventListener("click", () => {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const user = loadUser();

    if (!user || user.username !== username || user.password !== password) {
        loginError.textContent = "Incorrect username or password";
        return;
    }

    loginError.textContent = "";
    closeModal("login-modal");

    updateNavbar();
});


/* ============================================
   LOGOUT
   ============================================ */

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
});


/* ============================================
   AUTO LOGIN ON PAGE LOAD
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});
