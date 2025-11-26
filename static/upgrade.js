/*************************************************
 *  UPGRADE.JS — ЛОГИКА АПГРЕЙДА
 *************************************************/

/* ===== ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ ===== */

function loadUser() {
    return JSON.parse(localStorage.getItem("gifts_user")) || null;
}

function saveUser(user) {
    localStorage.setItem("gifts_user", JSON.stringify(user));
}

/* ===== ЭЛЕМЕНТЫ СТРАНИЦЫ ===== */

const leftSlot = document.getElementById("left-slot");
const leftSlotImage = leftSlot.querySelector("img");

const rightSlot = document.getElementById("right-slot");
const rightSlotImage = rightSlot.querySelector("img");

const chanceNumber = document.querySelector(".chance-number");

const inventoryGrid = document.getElementById("inventory-grid");

/* ===== ПЕРЕМЕННЫЕ ===== */

let selectedItem = null;   // предмет из инвентаря
let targetItem = null;     // предмет цели (в будущем)
let currentChance = 42;    // шанс по умолчанию
let multiplierMode = null; // x2 x5 x10
let percentMode = null;    // 30% 50% 75%


/* ===========================================
   ЗАГРУЗКА ИНВЕНТАРЯ ПОЛЬЗОВАТЕЛЯ
=========================================== */

function loadInventoryUpgrade() {
    const user = loadUser();
    if (!user || !user.inventory) return;

    inventoryGrid.innerHTML = "";

    user.inventory.forEach((item, index) => {

        const div = document.createElement("div");
        div.classList.add("inventory-item");

        div.innerHTML = `
            <img src="${item.img}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ⭐</div>
        `;

        // обработка клика по предмету
        div.addEventListener("click", () => selectLeftItem(item, div));

        inventoryGrid.appendChild(div);
    });
}

/* ===========================================
   ВЫБОР ПРЕДМЕТА В ЛЕВЫЙ СЛОТ
=========================================== */

function selectLeftItem(item, cardElement) {

    // снять выделение со всех карточек
    document.querySelectorAll(".inventory-item").forEach(el => {
        el.classList.remove("selected");
    });

    // выделить выбранную
    cardElement.classList.add("selected");

    selectedItem = item;

    // обновляем изображение в слоте
    leftSlotImage.src = item.img;
    leftSlotImage.style.opacity = "1";

    updateChance();
}


/* ===========================================
   ПЕРЕСЧЕТ ШАНСА
=========================================== */

function updateChance() {
    if (!selectedItem) {
        chanceNumber.textContent = "0%";
        return;
    }

    let chance = currentChance;

    // МОД Х MULTIPLIER (x2 x5 x10)
    if (multiplierMode) {
        chance = currentChance * multiplierMode;
    }

    // МОД ПРОЦЕНТА (30% 50% 75%)
    if (percentMode) {
        chance = percentMode;
    }

    // ограничение
    if (chance > 95) chance = 95;
    if (chance < 1) chance = 1;

    chanceNumber.textContent = chance + "%";
}

/* ===========================================
   ЛОГИКА НАЖАТИЙ НА ХХ И ПРОЦЕНТЫ
=========================================== */

document.querySelectorAll(".mult-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        // снять активность
        document.querySelectorAll(".mult-btn").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");

        // сброс режимов
        multiplierMode = null;
        percentMode = null;

        if (btn.dataset.m) multiplierMode = Number(btn.dataset.m);
        if (btn.dataset.p) percentMode = Number(btn.dataset.p);

        updateChance();
    });
});


/* ===========================================
   КНОПКА АПГРЕЙДА — ПОКА БЕЗ АНИМАЦИЙ
=========================================== */

document.querySelector(".upgrade-btn").addEventListener("click", () => {

    if (!selectedItem) {
        alert("Сначала выбери предмет!");
        return;
    }

    alert("Пока что апгрейд не реализован — механика готова, осталось RNG 🎰🔥");
});


/* ===========================================
   ИНИЦИАЛИЗАЦИЯ
=========================================== */

window.onload = () => {
    loadInventoryUpgrade();
    updateChance();
};
