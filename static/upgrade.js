/*************************************************
 *  UPGRADE.JS — Gifts Battle
 *************************************************/

/* ==========================
   ГЕТТЕР ПОЛЬЗОВАТЕЛЯ
========================== */
function loadUser() {
    return JSON.parse(localStorage.getItem("giftsbattle_user"));
}

function saveUser(user) {
    localStorage.setItem("giftsbattle_user", JSON.stringify(user));
}



/* ==========================
   HTML-ЭЛЕМЕНТЫ
========================== */
const leftSlot = document.getElementById("left-slot");
const rightSlot = document.getElementById("right-slot");

const slotLeftIMG = leftSlot.querySelector("img");
const slotRightIMG = rightSlot.querySelector("img");

const chanceNumber = document.getElementById("chance-number");

const upgradeOptionsGrid = document.getElementById("upgrade-options-grid");

const multButtons = document.querySelectorAll(".mult-btn");

let selectedLeftItem = null;
let selectedRightItem = null;
let selectedMultiplier = null;



/* ============================================================
   1. ЗАГРУЗКА ИНВЕНТАРЯ ПОД ЛЕВОЙ ПАНЕЛЬЮ
============================================================ */
function loadUpgradeInventory() {
    const user = loadUser();
    if (!user) return;

    const inventory = user.inventory || [];
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";

    if (inventory.length === 0) {
        grid.innerHTML = `<p style="color:#ccc; text-align:center;">Инвентарь пуст</p>`;
        return;
    }

    inventory.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("inventory-item");

        div.innerHTML = `
            <img src="${item.img}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ⭐</div>
        `;

        div.addEventListener("click", () => handleSelectLeftItem(item, index));

        grid.appendChild(div);
    });
}



/* ============================================================
   2. ВЫБОР ПРЕДМЕТА В ЛЕВУЮ ПАНЕЛЬ
============================================================ */
function handleSelectLeftItem(item, index) {
    const user = loadUser();

    // 1. Если слот пуст → кладём туда
    if (!selectedLeftItem) {
        selectedLeftItem = item;

        slotLeftIMG.src = item.img;
        slotLeftIMG.classList.add("active");

        // убираем предмет из инвентаря
        user.inventory.splice(index, 1);
        saveUser(user);

        loadUpgradeInventory();
        renderAvailableOptions();
        return;
    }

    // 2. Если в слоте уже выбран предмет, и мы кликаем на другой:
    const oldItem = selectedLeftItem;

    // возвращаем старый обратно в инвентарь
    user.inventory.push(oldItem);

    // ставим новый предмет
    selectedLeftItem = item;
    slotLeftIMG.src = item.img;

    // убираем новый предмет из инвентаря
    user.inventory.splice(index, 1);

    saveUser(user);
    loadUpgradeInventory();
    renderAvailableOptions();
}



/* ============================================================
   3. КЛИК ПО ЛЕВОМУ СЛОТУ → УБРАТЬ ПРЕДМЕТ
============================================================ */
leftSlot.addEventListener("click", () => {
    if (!selectedLeftItem) return;

    const user = loadUser();

    // вернуть предмет в инвентарь
    user.inventory.push(selectedLeftItem);

    selectedLeftItem = null;
    slotLeftIMG.src = "/static/assets/icons/upgrade-placeholder.png";
    slotLeftIMG.classList.remove("active");

    saveUser(user);

    loadUpgradeInventory();
    renderAvailableOptions();
});



/* ============================================================
   4. МУЛЬТИПЛИКАТОРЫ (x2 / x5 / x10 / 30% / 50% / 75%)
============================================================ */
multButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // сброс активных кнопок
        multButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        selectedMultiplier = btn.dataset.m || btn.dataset.p;

        renderAvailableOptions();
    });
});



/* ============================================================
   5. СПИСОК ВСЕХ ПРЕДМЕТОВ (из casesData)
============================================================ */
function getAllSiteItems() {
    let list = [];

    for (const category in casesData) {
        casesData[category].forEach(item => {
            list.push(item);
        });
    }

    return list;
}



/* ============================================================
   6. РЕНДЕР ВОЗМОЖНЫХ НАГРАД СПРАВА
============================================================ */
function renderAvailableOptions() {
    upgradeOptionsGrid.innerHTML = "";

    if (!selectedLeftItem || !selectedMultiplier) return;

    const allItems = getAllSiteItems();
    let targetPrice = 0;

    // x2, x5, x10
    if (selectedMultiplier >= 2) {
        targetPrice = selectedLeftItem.price * Number(selectedMultiplier);
    }
    // 30 / 50 / 75%
    else {
        const pct = Number(selectedMultiplier);
        targetPrice = Math.floor((selectedLeftItem.price / (pct / 100)));
    }

    // фильтруем предметы по цене ±20%
    const min = targetPrice * 0.8;
    const max = targetPrice * 1.2;

    const filtered = allItems.filter(item => item.price >= min && item.price <= max);

    if (filtered.length === 0) {
        upgradeOptionsGrid.innerHTML = `<p style="text-align:center;color:#ccc;">Нет подходящих наград</p>`;
        return;
    }

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("inventory-item");  // стиль тот же, красиво смотрится

        div.innerHTML = `
            <img src="${item.img}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ⭐</div>
        `;

        div.addEventListener("click", () => selectRightItem(item));

        upgradeOptionsGrid.appendChild(div);
    });
}



/* ============================================================
   7. ВЫБРАТЬ ПРЕДМЕТ СПРАВА
============================================================ */
function selectRightItem(item) {
    selectedRightItem = item;
    slotRightIMG.src = item.img;
    slotRightIMG.classList.add("active");

    updateChance();
}



/* ============================================================
   8. ОБНОВЛЕНИЕ ШАНСА
============================================================ */
function updateChance() {
    if (!selectedLeftItem || !selectedRightItem) {
        chanceNumber.textContent = "0%";
        return;
    }

    const priceFrom = selectedLeftItem.price;
    const priceTo = selectedRightItem.price;

    let chance = Math.floor((priceFrom / priceTo) * 100);

    if (chance < 1) chance = 1;
    if (chance > 90) chance = 90;

    chanceNumber.textContent = chance + "%";
}



/* ============================================================
   9. ЗАГРУЗКА ПРИ СТАРТЕ
============================================================ */
window.onload = () => {
    loadProfileUser();
    loadUpgradeInventory();
};
