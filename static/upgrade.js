/*************************************************
 *  UPGRADE.JS — Gifts Battle
 *  Механика выбора предмета + загрузка инвентаря
 *************************************************/


/* ==========================
      ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ
========================== */

function loadUpgradeUser() {
    const user = loadUser();
    if (!user) return;

    // верхняя панель
    const name = document.getElementById("profile-username");
    const balance = document.getElementById("profile-balance");

    if (name) name.textContent = user.username;
    if (balance) balance.textContent = user.balance;
}



/* ==========================
      ГЛАВНЫЕ ПЕРЕМЕННЫЕ
========================== */

let selectedItem = null;      // предмет, который выбрали слева
let selectedItemIndex = null; // индекс предмета в инвентаре



/* ==========================
      ЗАГРУЖАЕМ ИНВЕНТАРЬ
========================== */

function loadUpgradeInventory() {
    const user = loadUser();
    if (!user) return;

    const inventory = user.inventory || [];
    const grid = document.getElementById("inventory-grid");

    if (!grid) return;

    grid.innerHTML = "";

    if (inventory.length === 0) {
        grid.innerHTML = `<p style="color:#ccc;">Инвентарь пуст</p>`;
        return;
    }

    inventory.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("inventory-item");

        // выделение выбранного
        if (selectedItemIndex === index) {
            div.style.transform = "scale(1.07)";
            div.style.boxShadow = "0 0 18px rgba(0,255,255,0.55)";
            div.style.border = "1px solid rgba(0,255,255,0.7)";
        }

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ⭐</div>
        `;

        // 👉 Выбор предмета в левую панель
        div.addEventListener("click", () => {
            selectedItem = item;
            selectedItemIndex = index;
            updateLeftSlot(item);
            loadUpgradeInventory(); // перерисовать инвентарь с выделением
        });

        grid.appendChild(div);
    });
}



/* ==========================
      ОБНОВЛЕНИЕ ЛЕВОГО СЛОТА
========================== */

function updateLeftSlot(item) {
    const slot = document.getElementById("left-slot");

    if (!slot) return;

    slot.innerHTML = `
        <img src="${item.img}" class="slot-image" style="opacity:1; width:160px;">
        <p style="margin-top:12px; font-size:18px;">${item.name}</p>
        <p style="font-size:20px; color:#00eaff; font-weight:700;">${item.price} ⭐</p>
    `;
}



/* ==========================
      ИНИЦИАЛИЗАЦИЯ
========================== */

window.onload = () => {
    loadUpgradeUser();
    loadUpgradeInventory();
};
