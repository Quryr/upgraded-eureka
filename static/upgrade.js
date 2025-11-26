/* ==========================================================
   0. ПРОВЕРКА ЗАГРУЗКИ ВСЕХ ДАННЫХ
========================================================== */
if (!window.caseMap || !window.caseItemNames || !window.caseItemPrices) {
    console.error("ERROR: caseMap / caseItemNames / caseItemPrices not loaded!");
}



/* ==========================================================
   1. СОБИРАЕМ ВСЕ ПРЕДМЕТЫ ИЗ ВСЕХ КЕЙСОВ
========================================================== */

function buildAllItems() {
    const items = [];

    for (const caseName in caseMap) {
        const info = caseMap[caseName];
        const names = caseItemNames[caseName] || {};
        const prices = caseItemPrices[caseName] || {};

        for (let i = 1; i <= info.count; i++) {
            const price = prices[i];
            if (price == null) continue; // пропускаем мусор

            items.push({
                case: caseName,
                index: i,
                name: names[i] || ("Item " + i),
                price: price,
                img: `${info.path}${i}.png`
            });
        }
    }

    return items.sort((a, b) => a.price - b.price);
}

const ALL_ITEMS = buildAllItems();



/* ==========================================================
   2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
========================================================== */

let selectedSource = null;
let selectedTarget = null;
let currentChance = 0;



/* ==========================================================
   3. ОТРИСОВКА ИНВЕНТАРЯ ПОЛЬЗОВАТЕЛЯ
========================================================== */

function loadUpgradeInventory() {
    const user = loadUser();
    if (!user || !user.inventory) return;

    const inv = document.getElementById("upgrade-inventory");
    inv.innerHTML = "";

    user.inventory.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "upgrade-item";

        div.innerHTML = `
            <img src="${item.img}" class="upgrade-item-img">
            <div class="upgrade-item-name">${item.name}</div>
            <div class="upgrade-item-price">${item.price} ⭐</div>
        `;

        div.addEventListener("click", () => selectSourceItem(item));
        inv.appendChild(div);
    });
}



/* ==========================================================
   4. ВЫБОР ЛЕВОГО ПРЕДМЕТА (SOURCE)
========================================================== */

function selectSourceItem(item) {
    selectedSource = item;
    selectedTarget = null;

    document.getElementById("upgrade-source").innerHTML = `
        <img src="${item.img}" class="upgrade-selected-img">
        <div class="upgrade-selected-name">${item.name}</div>
        <div class="upgrade-selected-price">${item.price} ⭐</div>
    `;

    renderTargetList();
    updateChance(0);
    document.getElementById("upgrade-btn").disabled = true;
}



/* ==========================================================
   5. СТРОИМ СПИСОК ДОСТУПНЫХ ЦЕЛЕВЫХ ПРЕДМЕТОВ
========================================================== */

function renderTargetList() {
    if (!selectedSource) return;

    const list = document.getElementById("upgrade-target-list");
    list.innerHTML = "";

    const sourcePrice = selectedSource.price;

    ALL_ITEMS.filter(i => i.price > sourcePrice)
        .forEach(item => {
            const div = document.createElement("div");
            div.className = "target-item";

            div.innerHTML = `
                <img src="${item.img}" class="target-item-img">
                <div class="target-item-name">${item.name}</div>
                <div class="target-item-price">${item.price} ⭐</div>
            `;

            div.addEventListener("click", () => selectTargetItem(item));
            list.appendChild(div);
        });
}



/* ==========================================================
   6. ВЫБОР ПРАВОГО ПРЕДМЕТА (TARGET)
========================================================== */

function selectTargetItem(item) {
    selectedTarget = item;

    document.getElementById("upgrade-target").innerHTML = `
        <img src="${item.img}" class="upgrade-selected-img">
        <div class="upgrade-selected-name">${item.name}</div>
        <div class="upgrade-selected-price">${item.price} ⭐</div>
    `;

    const chance = (selectedSource.price / selectedTarget.price) * 100;
    updateChance(chance);

    document.getElementById("upgrade-btn").disabled = false;
}



/* ==========================================================
   7. ОБНОВЛЕНИЕ ШАНСА
========================================================== */

function updateChance(val) {
    currentChance = Math.max(0, Math.min(100, val));
    document.getElementById("chance-value").textContent =
        currentChance.toFixed(2) + "%";
}



/* ==========================================================
   8. КНОПКИ ШАНСОВ (X2 X5 X10 + 30%/50%/75%)
========================================================== */

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("chance-btn")) return;
    if (!selectedSource) return;

    // множители
    if (e.target.dataset.mult) {
        const mult = Number(e.target.dataset.mult);
        const targetPriceNeed = selectedSource.price * mult;

        const best = ALL_ITEMS.filter(i => i.price >= targetPriceNeed)[0];
        if (best) selectTargetItem(best);
        return;
    }

    // фиксированный процент
    if (e.target.dataset.set) {
        const percent = Number(e.target.dataset.set);
        const needPrice = selectedSource.price / (percent / 100);

        const best = ALL_ITEMS.filter(i => i.price >= needPrice)[0];
        if (best) selectTargetItem(best);
    }
});



/* ==========================================================
   9. CANVAS-КОЛЕСО (отрисовка Win/Lose сектора)
========================================================== */

const canvas = document.getElementById("upgrade-wheel");
const ctx = canvas.getContext("2d");
const cx = canvas.width / 2;
const cy = canvas.height / 2;
const radius = 130;

function drawWheel(winAngle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // WIN-сектор
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.fillStyle = "rgba(0,255,150,0.55)";
    ctx.arc(cx, cy, radius, 0, winAngle, false);
    ctx.fill();

    // LOSE-сектор
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.fillStyle = "rgba(255,60,80,0.55)";
    ctx.arc(cx, cy, radius, winAngle, Math.PI * 2, false);
    ctx.fill();
}



/* ==========================================================
   10. АНИМАЦИЯ ВРАЩЕНИЯ КОЛЕСА
========================================================== */

function spinWheel() {
    return new Promise((resolve) => {
        const winAngle = (currentChance / 100) * Math.PI * 2;

        // начальная скорость
        let angle = 0;
        let speed = 0.35;

        function animate() {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.translate(-cx, -cy);

            drawWheel(winAngle);
            ctx.restore();

            angle += speed;
            speed *= 0.984; // медленное затухание

            if (speed < 0.004) {
                const final = angle % (Math.PI * 2);
                resolve(final <= winAngle);
                return;
            }

            requestAnimationFrame(animate);
        }

        animate();
    });
}



/* ==========================================================
   11. НАЖАТИЕ КНОПКИ "АПГРЕЙД"
========================================================== */

document.getElementById("upgrade-btn").addEventListener("click", async () => {
    if (!selectedSource || !selectedTarget) return;

    const win = await spinWheel();
    const user = loadUser();

    // удалить исходный предмет
    const idx = user.inventory.findIndex(
        it => it.name === selectedSource.name && it.price === selectedSource.price
    );
    if (idx >= 0) user.inventory.splice(idx, 1);

    if (win) {
        user.inventory.push(selectedTarget);
        alert("УСПЕХ! Вы получили: " + selectedTarget.name);
    } else {
        alert("Провал…");
    }

    saveUser(user);

    // обновить инвентарь
    loadUpgradeInventory();

    // сбросить UI
    resetUpgradeUI();
});



/* ==========================================================
   12. СБРОС UI
========================================================== */

function resetUpgradeUI() {
    document.getElementById("upgrade-source").innerHTML = `
        <div class="upgrade-placeholder">
            <img src="/static/assets/icons/upgrade-placeholder.png" class="placeholder-img">
        </div>
    `;
    document.getElementById("upgrade-target").innerHTML = `
        <div class="upgrade-placeholder">
            <img src="/static/assets/icons/upgrade-placeholder.png" class="placeholder-img">
        </div>
    `;

    document.getElementById("upgrade-target-list").innerHTML = "";
    updateChance(0);
    selectedSource = null;
    selectedTarget = null;
    document.getElementById("upgrade-btn").disabled = true;
}



/* ==========================================================
   13. INIT
========================================================== */

window.onload = () => {
    loadUpgradeInventory();
};
