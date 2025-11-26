/*************************************************
 * UPGRADE.JS — ЛОГИКА ЛЕВОГО СЛОТА
 *************************************************/

// Текущий выбранный предмет для левой панели
let leftSelected = null;

// DOM элементы
const leftSlot = document.getElementById("left-slot");
const leftSlotImg = leftSlot.querySelector("img");

// Заглушка
const placeholder = "/static/assets/icons/upgrade-placeholder.png";


/* ============================
   ФУНКЦИЯ: ПОМЕСТИТЬ ПРЕДМЕТ В ЛЕВЫЙ СЛОТ
============================ */
function selectLeftItem(item, index) {
    const user = loadUser();

    // Если ранее выбран предмет — возвращаем его в инвентарь
    if (leftSelected !== null) {
        user.inventory.push(leftSelected);
    }

    // Устанавливаем новый предмет в слот
    leftSelected = item;
    leftSlotImg.src = item.img;
    leftSlotImg.classList.add("active");

    // Удаляем предмет из инвентаря пользователя
    user.inventory.splice(index, 1);

    saveUser(user);
    loadInventory(); // перерисовка
}


/* ============================
   ФУНКЦИЯ: УБРАТЬ ПРЕДМЕТ ИЗ СЛОТА
============================ */
function clearLeftSlot() {
    if (!leftSelected) return;

    const user = loadUser();
    user.inventory.push(leftSelected);

    saveUser(user);

    leftSelected = null;
    leftSlotImg.src = placeholder;
    leftSlotImg.classList.remove("active");

    loadInventory();
}


/* ============================
   ОБРАБОТЧИК КЛИКА НА ЛЕВЫЙ СЛОТ
============================ */
leftSlot.addEventListener("click", () => {
    clearLeftSlot();
});


/* ============================
   ПЕРЕОПРЕДЕЛЯЕМ loadInventory()
   (ПОДКЛЮЧАЕМ МЕХАНИКУ ВЫБОРА)
============================ */

function loadInventory() {
    const user = loadUser();
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
            <img src="${item.img}" alt="${item.name}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price} ⭐</div>
        `;

        // Выбор предмета в левую панель
        div.addEventListener("click", () => {
            selectLeftItem(item, index);
        });

        grid.appendChild(div);
    });
}


/* ============================
   ИНИЦИАЛИЗАЦИЯ
============================ */
window.addEventListener("load", () => {
    loadProfileUser();
    loadInventory();
});
