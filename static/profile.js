/*************************************************
 * PROFILE.JS — Gifts Battle
 * Готовая логика профиля без модалок
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

            <div class="inventory-actions">
               <button class="inv-btn sell-btn" data-index="${index}">Продать</button>
               <button class="inv-btn withdraw-btn" data-index="${index}">Вывести</button>
            </div>
        `;

        grid.appendChild(div);
    });
}


/* ==========================
   SELL / WITHDRAW
========================== */
document.addEventListener("click", function(e) {

    // ——— SELL ———
    if (e.target.classList.contains("sell-btn")) {
        const index = e.target.dataset.index;
        const user = loadUser();
        const item = user.inventory[index];

        user.balance += Number(item.price);
        user.inventory.splice(index, 1);
        saveUser(user);

        loadProfileUser();
        loadInventory();
        return;
    }

    // ——— WITHDRAW ———
    if (e.target.classList.contains("withdraw-btn")) {
        const index = e.target.dataset.index;
        const user = loadUser();

        alert("Withdrawal request sent!");

        user.inventory.splice(index, 1);
        saveUser(user);

        loadInventory();
        return;
    }
});


/* ==========================
   ИНИЦИАЛИЗАЦИЯ
========================== */

window.onload = () => {
    loadProfileUser();
    loadProfileStats();
    loadInventory();
};
