// =====================================================
// 📦 ОТРИСОВКА СТРАНИЦЫ + ЗАПУСК РУЛЕТКИ
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("id");

    const caseImage = document.getElementById("case-image");
    const caseTitle = document.getElementById("case-title");
    const casePrice = document.getElementById("case-price");
    const itemsGrid = document.getElementById("items-grid");
    const openCaseBtn = document.querySelector(".case-btn-main");

    if (!window.allCases) {
        caseTitle.textContent = "DATA NOT LOADED";
        return;
    }

    const selectedCase = allCases.find(c => c.id === caseId);
    if (!selectedCase) {
        caseTitle.textContent = "CASE NOT FOUND";
        return;
    }

    // ----------------------------------
    // 🖼️ ОТРИСОВКА КАРТОЧКИ КЕЙСА
    // ----------------------------------

    caseImage.src = selectedCase.img;
    caseTitle.textContent = selectedCase.name;

    if (selectedCase.price) {
        casePrice.innerHTML = `
            <div class="case-subtitle">
                <span>${selectedCase.price}</span>
                <img src="/static/assets/icons/star.png" class="star-icon" alt="⭐">
            </div>
        `;
    } else {
        casePrice.innerHTML = `<div class="case-subtitle">БЕСПЛАТНО</div>`;
    }

    // ----------------------------------
    // 🧱 ОТРИСОВКА ПРЕДМЕТОВ
    // ----------------------------------

    const caseName = selectedCase.name.trim();
    const caseInfo = caseMap[caseName];

    if (caseInfo) {
        renderCaseItems("items-grid", caseInfo.path, caseInfo.count, caseName);
    } else {
        itemsGrid.innerHTML = `<p style="color:#aaa;">Items not found for this case</p>`;
    }

    // ----------------------------------
    // 🔢 КОЛИЧЕСТВО КЕЙСОВ
    // ----------------------------------

    const buttons = document.querySelectorAll(".multi-btn");
    let selectedCount = 1;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            selectedCount = parseInt(button.dataset.count);
        });
    });

    // ----------------------------------
    // 🎡 ЗАПУСК РУЛЕТКИ
    // ----------------------------------

    if (openCaseBtn) {
        openCaseBtn.addEventListener("click", () => {
            startCaseSpin({
                caseName: caseName,
                caseInfo: caseInfo,
                count: selectedCount
            });
        });
    }
});


// =====================================================
// 🎡 РУЛЕТКА — ПОЛНОСТЬЮ РАБОЧАЯ
// =====================================================

window.startCaseSpin = function({ caseName, caseInfo }) {

    const header = document.querySelector(".case-header");
    const grid = document.getElementById("items-grid");
    const roulette = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    // ⭕ ПОКАЗЫВАЕМ ВСЮ СТРАНИЦУ до клика
    header.style.display = "block";
    grid.style.display = "grid";

    // ⭕ ПОДГОТАВЛИВАЕМ РУЛЕТКУ
    roulette.style.display = "block";
    reward.style.display = "none";
    strip.innerHTML = "";

    // Данные
    const names = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];

    const items = [];
    for (let i = 1; i <= caseInfo.count; i++) {
        items.push({
            id: i,
            name: names[i] || "Item",
            price: prices[i] || 0,
            img: `${caseInfo.path}${i}.png`
        });
    }

    // Длинная лента
    const reel = [];
    for (let i = 0; i < 90; i++) reel.push(...items);

    // Рендер
    reel.forEach(item => {
        const div = document.createElement("div");
        div.className = "roulette-cell";
        div.innerHTML = `
            <img src="${item.img}" class="roulette-img">
            <div class="roulette-name">${item.name}</div>
        `;
        strip.appendChild(div);
    });

    // Случайный победитель
    const winner = items[Math.floor(Math.random() * items.length)];

    const index = reel.findIndex(x => x.id === winner.id);
    const cellWidth = 140;
    const center = 600;

    const stopX = index * cellWidth - center;

    strip.style.transition = "transform 5.5s cubic-bezier(.08,.6,0,1)";
    strip.style.transform = `translateX(-${stopX}px)`;

    // Показ результата
    setTimeout(() => showReward(winner), 5600);
};


// =====================================================
// 🎁 ПОКАЗ ВЫПАВШЕГО ПРЕДМЕТА
// =====================================================

function showReward(item) {

    const reward = document.getElementById("reward-block");

    document.getElementById("reward-img").src = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").innerHTML = `⭐ ${item.price}`;

    reward.style.display = "block";

    document.getElementById("btn-keep").onclick = () => {
        alert("Вы оставили предмет!");
        location.reload();
    };

    document.getElementById("btn-sell").onclick = () => {
        alert("Предмет продан!");
        location.reload();
    };
}
