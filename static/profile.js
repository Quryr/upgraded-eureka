/*************************************************
 * PROFILE.JS — логика страницы профиля Gifts Battle
 *************************************************/

/* ====== ЗАГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ ====== */

// Заглушка — берём ник и баланс из auth.js / localStorage
function loadUserData() {
    const username = localStorage.getItem("username") || "USER";
    const balance = localStorage.getItem("balance") || 0;

    // Верхняя панель
    const topUsername = document.getElementById("profile-username");
    const topBalance = document.getElementById("profile-balance");

    // На странице профиля
    const pageUsername = document.getElementById("profile-username-page");
    const pageBalance = document.getElementById("profile-balance-page");

    if (topUsername) topUsername.textContent = username;
    if (pageUsername) pageUsername.textContent = username;

    if (topBalance) topBalance.textContent = balance;
    if (pageBalance) pageBalance.textContent = balance;
}


/* ====== СТАТИСТИКА ПОЛЬЗОВАТЕЛЯ ====== */

function loadStats() {
    const cases = localStorage.getItem("stat_cases") || 0;
    const upgrades = localStorage.getItem("stat_upgrades") || 0;
    const contracts = localStorage.getItem("stat_contracts") || 0;

    document.getElementById("stat-cases").textContent = cases;
    document.getElementById("stat-upgrades").textContent = upgrades;
    document.getElementById("stat-contracts").textContent = contracts;
}


/* ====== ИНВЕНТАРЬ ====== */

// Предметы лежат в localStorage как массив
function loadInventory() {
    let inventory = JSON.parse(localStorage.getItem("inventory") || "[]");

    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";

    if (inventory.length === 0) {
        grid.innerHTML = `<p style="color:#ccc;">Инвентарь пуст.</p>`;
        return;
    }

    inventory.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("inventory-item");

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ★</div>
        `;

        // Открываем модалку при клике
        div.onclick = () => openItemModal(item, index);

        grid.appendChild(div);
    });
}


/* ====== МОДАЛКА ПРЕДМЕТА ====== */

const itemModal = document.getElementById("item-modal");
let selectedItemIndex = null;

function openItemModal(item, index) {
    selectedItemIndex = index;

    document.getElementById("item-name").textContent = item.name;
    document.getElementById("item-image").src = item.image;

    itemModal.classList.remove("hidden");
}

document.querySelectorAll(".modal-close").forEach(btn => {
    btn.onclick = () => itemModal.classList.add("hidden");
});


/* ====== ПРОДАТЬ ПРЕДМЕТ ====== */

document.getElementById("sell-item").onclick = () => {
    let inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
    const item = inventory[selectedItemIndex];

    let balance = Number(localStorage.getItem("balance") || 0);
    balance += Number(item.price);

    localStorage.setItem("balance", balance);
    inventory.splice(selectedItemIndex, 1);

    localStorage.setItem("inventory", JSON.stringify(inventory));

    itemModal.classList.add("hidden");
    loadUserData();
    loadInventory();
};


/* ====== ВЫВЕСТИ ПРЕДМЕТ ====== */

document.getElementById("withdraw-item").onclick = () => {
    let inventory = JSON.parse(localStorage.getItem("inventory") || "[]");

    // Здесь будет логика вывода
    alert("Заявка на вывод предмета отправлена!");

    inventory.splice(selectedItemIndex, 1);
    localStorage.setItem("inventory", JSON.stringify(inventory));

    itemModal.classList.add("hidden");
    loadInventory();
};


/* ====== ИНИЦИАЛИЗАЦИЯ ====== */

window.onload = () => {
    loadUserData();
    loadStats();
    loadInventory();
};
