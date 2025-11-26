/*************************************************
 *  UPGRADE.JS — МЕХАНИКА АПГРЕЙДА
 *************************************************/

let selectedItem = null; // предмет, выбранный в левую панель
let user = null;

/* ============================================
   ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ + ИНВЕНТАРЯ
============================================ */
function initUpgrade() {
    user = loadUser();
    if (!user) return;

    loadInventory(); // из profile.js (мы подключили его!)
    attachInventoryHandlers();
    attachSlotReturnHandler();
    attachMultiplierButtons();
}

window.addEventListener("load", initUpgrade);



/* ============================================
   ОБРАБОТКА КЛИКА ПО ПРЕДМЕТУ ИЗ ИНВЕНТАРЯ
============================================ */
function attachInventoryHandlers() {
    const grid = document.getElementById("inventory-grid");
    if (!grid) return;

    grid.addEventListener("click", function (e) {
        const itemDiv = e.target.closest(".inventory-item");
        if (!itemDiv) return;

        const index = itemDiv.dataset.index;
        const item = user.inventory[index];
        if (!item) return;

        moveToLeftSlot(item, index);
    });
}



/* ============================================
   ПЕРЕМЕЩЕНИЕ ПРЕДМЕТА В ЛЕВЫЙ СЛОТ
============================================ */
function moveToLeftSlot(item, index) {
    const leftSlot = document.getElementById("left-slot");

    // если уже есть предмет → вернуть его в инвентарь
    if (selectedItem !== null) {
        user.inventory.push(selectedItem);
    }

    // вытащить предмет из инвентаря
    user.inventory.splice(index, 1);
    saveUser(user);

    // показать предмет в слоте
    renderLeftSlot(item);

    selectedItem = item;

    // обновить инвентарь
    loadInventory();
    attachInventoryHandlers();

    updateChance();
}



/* ============================================
   ОТРИСОВКА ПРЕДМЕТА В ЛЕВОМ СЛОТЕ
============================================ */
function renderLeftSlot(item) {
    const leftSlot = document.getElementById("left-slot");

    leftSlot.innerHTML = `
        <img src="${item.img}" class="slot-image active" id="left-slot-item">
    `;
}



/* ============================================
   КЛИК ПО ЛЕВОМУ СЛОТУ — ВЕРНУТЬ ПРЕДМЕТ
============================================ */
function attachSlotReturnHandler() {
    const leftSlot = document.getElementById("left-slot");

    leftSlot.addEventListener("click", function () {
        if (!selectedItem) return;

        // вернуть предмет обратно
        user.inventory.push(selectedItem);
        saveUser(user);

        selectedItem = null;

        // очистить слот
        leftSlot.innerHTML = `
            <img src="/static/assets/icons/upgrade-placeholder.png" class="slot-image">
        `;

        loadInventory();
        attachInventoryHandlers();

        updateChance();
    });
}



/* ============================================
   МУЛЬТИПЛИКАТОР (x2 / x5 / 50% / 75%)
============================================ */
let currentMultiplier = 1;

function attachMultiplierButtons() {
    document.querySelectorAll(".mult-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".mult-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (btn.dataset.m) {
                currentMultiplier = Number(btn.dataset.m);
            } else if (btn.dataset.p) {
                // Конвертация процентов в относительный множитель
                currentMultiplier = 100 / Number(btn.dataset.p);
            }

            updateChance();
        });
    });
}



/* ============================================
   ОБНОВЛЕНИЕ ШАНСА В ЦЕНТРЕ
============================================ */
function updateChance() {
    const chanceDiv = document.getElementById("chance-number");

    if (!selectedItem) {
        chanceDiv.textContent = "0%";
        return;
    }

    // Формула временная:
    let chance = Math.round(100 / currentMultiplier);
    if (chance > 100) chance = 100;

    chanceDiv.textContent = chance + "%";
}
