/* ==========================================================
   1. СОБИРАЕМ ВСЕ ПРЕДМЕТЫ ИЗ ВСЕХ КЕЙСОВ
========================================================== */

function buildAllItems() {
    const items = [];

    for (const caseName in caseMap) {
        const caseInfo = caseMap[caseName];
        const path = caseInfo.path;
        const total = caseInfo.count;

        const names = caseItemNames[caseName] || {};
        const prices = caseItemPrices[caseName] || {};

        for (let i = 1; i <= total; i++) {
            items.push({
                case: caseName,
                index: i,
                name: names[i] || ("Item " + i),
                price: prices[i] ?? null,
                img: `${path}${i}.png`
            });
        }
    }

    return items.filter(it => it.price !== null);
}

const ALL_ITEMS = buildAllItems();



/* ==========================================================
   2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
========================================================== */

let selectedSource = null;
let selectedTarget = null;
let currentChance = 0;



/* ==========================================================
   3. ОТРИСОВКА ИНВЕНТАРЯ
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

        div.onclick = () => selectSourceItem(item);
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
}



/* ==========================================================
   5. ПОСТРОЕНИЕ СПИСКА ПРАВЫХ ПРЕДМЕТОВ
========================================================== */

function renderTargetList() {
    if (!selectedSource) return;

    const list = document.getElementById("upgrade-target-list");
    list.innerHTML = "";

    const sPrice = selectedSource.price;

    // выбираем все предметы дороже
    const possible = ALL_ITEMS.filter(it => it.price > sPrice)
        .sort((a, b) => a.price - b.price);

    possible.forEach(item => {
        const div = document.createElement("div");
        div.className = "target-item";

        div.innerHTML = `
            <img src="${item.img}" class="target-item-img">
            <div class="target-item-name">${item.name}</div>
            <div class="target-item-price">${item.price} ⭐</div>
        `;

        div.onclick = () => selectTargetItem(item);

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

    // обновляем шанс
    let chance = (selectedSource.price / selectedTarget.price) * 100;
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
   8. КНОПКИ ФИКСИРОВАННОГО ШАНСА (30/50/75)
========================================================== */

document.addEventListener("click", e => {
    if (!e.target.classList.contains("chance-btn")) return;
    if (!selectedSource) return;

    // множители
    if (e.target.dataset.mult) {
        const mult = Number(e.target.dataset.mult);
        const needPrice = selectedSource.price * mult;

        // ищем ближайший предмет дороже
        const sorted = ALL_ITEMS
            .filter(i => i.price >= needPrice)
            .sort((a, b) => a.price - b.price);

        if (sorted.length === 0) return;

        selectTargetItem(sorted[0]);
        return;
    }

    // фикс проценты
    if (e.target.dataset.set) {
        const chance = Number(e.target.dataset.set);

        // вычисляем требуемую цену target
        const tPrice = selectedSource.price / (chance / 100);

        const sorted = ALL_ITEMS
            .filter(i => i.price >= tPrice)
            .sort((a, b) => a.price - b.price);

        if (sorted.length === 0) return;

        selectTargetItem(sorted[0]);
    }
});



/* ==========================================================
   9. КОЛЕСО (CANVAS) — ЧЕСТНОЕ ВРАЩЕНИЕ
========================================================== */

const wheelCanvas = document.getElementById("upgrade-wheel");
const ctx = wheelCanvas.getContext("2d");
const center = 150;

function drawWheel(winSectorAngle) {
    ctx.clearRect(0, 0, 300, 300);

    // сектора: win / lose
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.fillStyle = "rgba(0,255,180,0.55)";
    ctx.arc(center, center, 140, 0, winSectorAngle);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.fillStyle = "rgba(255,40,60,0.55)";
    ctx.arc(center, center, 140, winSectorAngle, Math.PI * 2);
    ctx.fill();
}

function spinWheel() {
    const winFraction = currentChance / 100;
    const winAngle = Math.PI * 2 * winFraction;

    drawWheel(winAngle);

    return new Promise(resolve => {
        let angle = Math.random() * Math.PI * 2;
        const speed = 0.25;

        function animate() {
            ctx.save();
            ctx.clearRect(0, 0, 300, 300);
            ctx.translate(center, center);
            ctx.rotate(angle);
            ctx.translate(-center, -center);
            drawWheel(winAngle);
            ctx.restore();

            angle += speed;
            speed *= 0.991;

            if (speed < 0.003) {
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
   10. НАЖАТИЕ КНОПКИ UPGRADE
========================================================== */

document.getElementById("upgrade-btn").onclick = async () => {
    if (!selectedSource || !selectedTarget) return;

    const win = await spinWheel();

    const user = loadUser();

    // убираем источник
    const idx = user.inventory.findIndex(it =>
        it.name === selectedSource.name &&
        it.price === selectedSource.price
    );
    if (idx >= 0) user.inventory.splice(idx, 1);

    if (win) {
        user.inventory.push(selectedTarget);
        alert("Вы выиграли: " + selectedTarget.name);
    } else {
        alert("Проигрыш…");
    }

    saveUser(user);
    loadUpgradeInventory();

    // сброс UI
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
};



/* ==========================================================
   11. ИНИЦИАЛИЗАЦИЯ
========================================================== */

window.onload = () => {
    loadUpgradeInventory();
};

