/* ============================================================
      UPGRADE.JS — ЛОГИКА ВЫБОРА ПРЕДМЕТОВ И ФИЛЬТРОВ
============================================================ */


/* ============================
   ГЛОБАЛЬНЫЕ ДАННЫЕ
============================ */

let selectedLeft = null;      // предмет, который сейчас в левом слоте
let selectedRight = null;     // предмет в правом слоте
let currentMultiplier = null; // выбранный x2/x5/x10/30%/50%/75%

// СЮДА ты позже дашь список ВСЕХ предметов на сайте
let ALL_ITEMS = []; 


/* ============================
   ЗАГРУЗКА ИНВЕНТАРЯ
============================ */

function renderInventory() {
    const user = loadUser();
    if (!user || !user.inventory) return;

    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";

    user.inventory.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("inventory-item");
        div.dataset.index = index;

        div.innerHTML = `
            <img src="${item.img}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ⭐</div>
        `;

        div.onclick = () => selectLeftItem(item, index);
        grid.appendChild(div);
    });
}


/* ============================
   ВСТАВИТЬ ПРЕДМЕТ В ЛЕВЫЙ СЛОТ
============================ */

function selectLeftItem(item, index) {

    // если в левом слоте уже есть предмет → вернуть его обратно в инвентарь
    if (selectedLeft) {
        returnLeftToInventory();
    }

    selectedLeft = { ...item, invIndex: index };

    const slot = document.getElementById("left-slot");
    slot.innerHTML = `
        <img src="${item.img}" class="slot-image filled">
    `;

    // обновить награды справа
    renderPossibleRewards();
    updateChance();
}


/* ============================
   ВОЗВРАТ ПРЕДМЕТА В ИНВЕНТАРЬ
============================ */

function returnLeftToInventory() {
    if (!selectedLeft) return;

    const user = loadUser();
    if (!user) return;

    // возвращаем предмет
    user.inventory.push({
        name: selectedLeft.name,
        img: selectedLeft.img,
        price: selectedLeft.price
    });

    saveUser(user);

    selectedLeft = null;

    document.getElementById("left-slot").innerHTML =
        `<img src="/static/assets/icons/upgrade-placeholder.png" class="slot-image">`;

    renderInventory();
    renderPossibleRewards();
    updateChance();
}


/* ============================
   КЛИК ПО ЛЕВОМУ СЛОТУ → ОЧИСТКА
============================ */

document.getElementById("left-slot").onclick = () => {
    if (selectedLeft) {
        returnLeftToInventory();
    }
};



/* ============================
   ВЫБОР МУЛЬТИПЛИКАТОРА
============================ */

document.querySelectorAll(".mult-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".mult-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentMultiplier = btn.dataset.m ? Number(btn.dataset.m) : null;
        currentPercent = btn.dataset.p ? Number(btn.dataset.p) : null;

        renderPossibleRewards();
        updateChance();
    };
});



/* ============================
   ПОКАЗАТЬ ВОЗМОЖНЫЕ НАГРАДЫ
============================ */

function renderPossibleRewards() {
    const grid = document.getElementById("possible-grid");
    grid.innerHTML = "";

    if (!selectedLeft || !currentMultiplier) return;

    const targetPrice = selectedLeft.price * currentMultiplier;

    // фильтрация
    const list = ALL_ITEMS.filter(i =>
        Math.abs(i.price - targetPrice) <= targetPrice * 0.25 // ±25% допуск
    );

    list.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("inventory-item");

        div.innerHTML = `
            <img src="${item.img}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ⭐</div>
        `;

        div.onclick = () => selectRightItem(item);

        grid.appendChild(div);
    });
}



/* ============================
   КЛИК ПО НАГРАДЕ (ПРАВЫЙ СЛОТ)
============================ */

function selectRightItem(item) {
    selectedRight = item;

    const slot = document.getElementById("right-slot");

    slot.innerHTML = `
        <img src="${item.img}" class="slot-image filled">
    `;

    updateChance();
}


/* ============================
   КЛИК ПО ПРАВОМУ СЛОТУ — ОЧИСТКА
============================ */

document.getElementById("right-slot").onclick = () => {
    selectedRight = null;
    document.getElementById("right-slot").innerHTML =
        `<img src="/static/assets/icons/upgrade-placeholder.png" class="slot-image">`;
    updateChance();
};



/* ============================
      ОБНОВИТЬ ШАНСЫ
============================ */

function updateChance() {
    const chanceEl = document.getElementById("chance-number");

    if (!selectedLeft || !selectedRight) {
        chanceEl.textContent = "0%";
        return;
    }

    // формула шанса (примерная, можно заменить)
    const chance = Math.max(1, Math.min(95,
        Math.floor((selectedLeft.price / selectedRight.price) * 100)
    ));

    chanceEl.textContent = chance + "%";
}



/* ============================
      ПЕРВОНАЧАЛЬНЫЙ СТАРТ
============================ */

window.onload = () => {
    loadProfileUser();
    renderInventory();
    renderPossibleRewards();
    updateChance();
};
