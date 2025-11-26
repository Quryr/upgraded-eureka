/*************************************************
 *          UPGRADE.JS — FINAL VERSION
 *************************************************/

/* ==========================
      ПОДГРУЗКА ИНВЕНТАРЯ
=========================== */

function loadUpgradeInventory() {
    const user = loadUser();
    if (!user || !user.inventory) return;

    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";

    user.inventory.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("inventory-item");

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">
                ${item.price}
                <img src="/static/assets/icons/star.png">
            </div>
        `;

        div.addEventListener("click", () => selectItemForUpgrade(item, index));
        grid.appendChild(div);
    });
}

/* =======================================
      ВЫБОР ПРЕДМЕТА В ЛЕВУЮ ПАНЕЛЬ
======================================= */

let selectedItem = null;
let selectedItemIndex = null;

function selectItemForUpgrade(item, index) {
    selectedItem = item;
    selectedItemIndex = index;

    const leftSlot = document.getElementById("left-slot");
    leftSlot.innerHTML = `
        <img src="${item.img}" class="slot-image" style="opacity:1; width:180px;">
    `;

    highlightSelectedInventory(index);
}

/* Подсветка выбранной карточки */
function highlightSelectedInventory(activeIndex) {
    const cards = document.querySelectorAll(".inventory-item");

    cards.forEach((card, idx) => {
        if (idx === activeIndex) {
            card.style.boxShadow = "0 0 25px rgba(0,255,255,0.7)";
            card.style.transform = "scale(1.03)";
        } else {
            card.style.boxShadow = "";
            card.style.transform = "";
        }
    });
}

/* ===============================
      MULT-КНОПКИ (x2, x5, %)
=============================== */

const multButtons = document.querySelectorAll(".mult-btn");

multButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        multButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

/* ==============================
      ОБРАБОТКА ДО КНОПКИ
============================== */

document.querySelector(".upgrade-btn").addEventListener("click", () => {
    if (!selectedItem) {
        alert("Выберите предмет для апгрейда!");
        return;
    }

    alert("Механика апгрейда позже — предмет выбран!");
});

/* ==============================
      ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ
============================== */

window.onload = () => {
    loadProfileUser();     // из auth.js
    loadUpgradeInventory(); // подгружаем предметы
};
