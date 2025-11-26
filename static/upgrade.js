/*************************************************
 * upgrade.js — логика апгрейда Gifts Battle
 *************************************************/

/* ==========================
   ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ
========================== */
function loadProfileUser() {
    const user = loadUser();
    if (!user) return;

    const topName = document.getElementById("profile-username");
    const topBalance = document.getElementById("profile-balance");

    if (topName) topName.textContent = user.username;
    if (topBalance) topBalance.textContent = user.balance;
}

/* ==========================
   ПОДГРУЗКА ИНВЕНТАРЯ
========================== */
function loadUpgradeInventory() {
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

        // Выбор предмета
        div.addEventListener("click", () => selectLeftItem(item, index, div));

        grid.appendChild(div);
    });
}

/* ==========================
   ВЫБОР ПРЕДМЕТА В ЛЕВЫЙ СЛОТ
========================== */

let selectedLeft = null;

function selectLeftItem(item, index, elementDiv) {
    selectedLeft = { item, index };

    // Удаляем подсветку у всех
    document.querySelectorAll(".inventory-item").forEach(el =>
        el.classList.remove("selected")
    );

    // Подсвечиваем выбранный
    elementDiv.classList.add("selected");

    // Вставляем иконку в левый слот
    const slot = document.getElementById("left-slot");
    slot.innerHTML = `<img src="${item.img}" class="slot-image selected-slot">`;
}


/* ==========================
   КНОПКИ X2/X5/X10/ПРОЦЕНТЫ
========================== */

document.querySelectorAll(".mult-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".mult-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});


/* ==========================
   ИНИЦИАЛИЗАЦИЯ
========================== */

window.onload = () => {
    loadProfileUser();
    loadUpgradeInventory();
};
