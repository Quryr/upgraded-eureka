/*************************************************
 * PROFILE.JS — Gifts Battle
 * Загружаем пользователя, инвентарь, статистику
 *************************************************/


/* ==========================
   ЗАГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ
========================== */
function loadProfileUser() {
    const user = loadUser();
    if (!user) return;

    // Верхняя панель
    const topName = document.getElementById("profile-username");
    const topBalance = document.getElementById("profile-balance");

    if (topName) topName.textContent = user.username;
    if (topBalance) topBalance.textContent = user.balance;

    // Основной блок профиля
    const pageName = document.getElementById("profile-username-page");
    const pageBalance = document.getElementById("profile-balance-page");

    if (pageName) pageName.textContent = user.username;
    if (pageBalance) pageBalance.textContent = user.balance;
}


/* ==========================
   СТАТИСТИКА
========================== */
function loadProfileStats() {
    const user = loadUser();
    if (!user) return;

    if (!user.stats) {
        // создаём если нет
        user.stats = {
            casesOpened: 0,
            upgradesDone: 0,
            contractsDone: 0
        };
        saveUser(user);
    }

    document.getElementById("stat-cases").textContent = user.stats.casesOpened;
    document.getElementById("stat-upgrades").textContent = user.stats.upgradesDone;
    document.getElementById("stat-contracts").textContent = user.stats.contractsDone;
}


/* ==========================
   ИНВЕНТАРЬ
========================== */
function loadInventory() {
    const user = loadUser();
    if (!user) return;

    const inventory = user.inventory || [];
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";

    if (inventory.length === 0) {
        grid.innerHTML = `<p style="color:#ccc;">Инвентарь пуст</p>`;
        return;
    }

    inventory.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("inventory-item");

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ⭐</div>
        `;

        div.onclick = () => openItemModal(item, index);
        grid.appendChild(div);
    });
}


/* ==========================
   МОДАЛКА ПРЕДМЕТА
========================== */

let currentItemIndex = null;

function openItemModal(item, index) {
    currentItemIndex = index;

    document.getElementById("item-name").textContent = item.name;
    document.getElementById("item-image").src = item.img;

    document.getElementById("item-modal").classList.remove("hidden");
}

document.querySelectorAll(".modal-close").forEach(btn => {
    btn.onclick = () => {
        document.getElementById("item-modal").classList.add("hidden");
    };
});


/* ==========================
   ПРОДАТЬ
========================== */
document.getElementById("sell-item").onclick = () => {
    const user = loadUser();
    if (!user) return;

    const item = user.inventory[currentItemIndex];

    user.balance += Number(item.price);
    user.inventory.splice(currentItemIndex, 1);

    saveUser(user);

    loadProfileUser();
    loadInventory();

    document.getElementById("item-modal").classList.add("hidden");
};


/* ==========================
   ВЫВЕСТИ
========================== */
document.getElementById("withdraw-item").onclick = () => {
    const user = loadUser();
    if (!user) return;

    alert("Заявка на вывод отправлена администратору!");

    user.inventory.splice(currentItemIndex, 1);
    saveUser(user);

    loadInventory();
    document.getElementById("item-modal").classList.add("hidden");
};


/* ==========================
   ИНИЦИАЛИЗАЦИЯ
========================== */

window.onload = () => {
    loadProfileUser();
    loadProfileStats();
    loadInventory();
};
