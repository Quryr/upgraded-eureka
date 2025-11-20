// ====== LOCALSTORAGE HELPERS ======
function saveUser(data) {
    localStorage.setItem("user", JSON.stringify(data));
}
function loadUser() {
    return JSON.parse(localStorage.getItem("user"));
}
function logoutUser() {
    localStorage.removeItem("user");
}

// ====== BALANCE FUNCTIONS ======
function getBalance() {
    const u = loadUser();
    return u ? u.balance : 0;
}

function changeBalance(amount) {
    const user = loadUser();
    if (!user) return false;

    user.balance += amount;

    if (user.balance < 0) return false;

    saveUser(user);
    updateUIBalance();
    return true;
}

function updateUIBalance() {
    const user = loadUser();
    if (user) {
        const el = document.getElementById("profile-balance");
        if (el) el.textContent = user.balance;
    }
}

// ====== DOM ELEMENTS ======
const loginModal = document.getElementById("login-modal");
const signupModal = document.getElementById("signup-modal");

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

const loginSubmit = document.getElementById("login-submit");
const signupSubmit = document.getElementById("signup-submit");

const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");

const navAuth = document.getElementById("nav-auth");
const navProfile = document.getElementById("nav-profile");

const profileName = document.getElementById("profile-username");
const profileBalance = document.getElementById("profile-balance");
const logoutBtn = document.getElementById("logout-btn");

// ====== MODAL OPEN ======
loginBtn?.addEventListener("click", () => loginModal.classList.remove("hidden"));
signupBtn?.addEventListener("click", () => signupModal.classList.remove("hidden"));

document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.close;
        document.getElementById(id).classList.add("hidden");
    });
});

// ====== SIGN UP ======
signupSubmit?.addEventListener("click", () => {
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!username || !password) {
        signupError.textContent = "Fill all fields!";
        return;
    }

    const user = { username, password, balance: 1000 };
    saveUser(user);

    signupModal.classList.add("hidden");
    applyUser();
});

// ====== LOGIN ======
loginSubmit?.addEventListener("click", () => {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const saved = loadUser();

    if (!saved || saved.username !== username || saved.password !== password) {
        loginError.textContent = "Wrong username or password!";
        return;
    }

    loginModal.classList.add("hidden");
    applyUser();
});

// ====== APPLY USER ======
function applyUser() {
    const user = loadUser();

    if (user) {
        navAuth.classList.add("hidden");
        navProfile.classList.remove("hidden");

        profileName.textContent = user.username;
        profileBalance.textContent = user.balance;
    }
}

applyUser();

// ====== LOGOUT ======
logoutBtn?.addEventListener("click", () => {
    logoutUser();
    location.reload();
});
