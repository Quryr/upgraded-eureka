// =========================================================
// 🎰 РУЛЕТКА v4.0 — СТАБИЛЬНАЯ, ТОЧНАЯ, НЕ РАНДОМНАЯ
// =========================================================

window.startCaseSpin = function (caseName, caseInfo) {

    const header = document.querySelector(".case-header");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    header.style.display = "none";
    wrapper.style.display = "block";
    reward.style.display = "none";

    strip.innerHTML = "";
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";

    // данные
    const names  = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];
    const drops  = window.caseDropRates?.[caseName] || {};

    const items = [];
    for (let i = 1; i <= caseInfo.count; i++) {
        items.push({
            id: i,
            name: names[i],
            price: prices[i],
            img: `${caseInfo.path}${i}.png`,
            chance: drops[i] || 1
        });
    }

    // выбор победителя
    const weighted = [];
    items.forEach(it => {
        for (let c = 0; c < it.chance * 10; c++) weighted.push(it);
    });
    const winner = weighted[Math.floor(Math.random() * weighted.length)];

    // =========================================================
    // 🔵 ЛЕНТА — много предметов + победитель на фикс. позиции
    // =========================================================

    const BEFORE = 150;
    const AFTER  = 80;
    const WINNER_INDEX = BEFORE;

    const reel = [];

    for (let i = 0; i < BEFORE; i++) {
        reel.push(items[Math.floor(Math.random() * items.length)]);
    }

    reel.push(winner);

    for (let i = 0; i < AFTER; i++) {
        reel.push(items[Math.floor(Math.random() * items.length)]);
    }

    // рендер
    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    // =========================================================
    // 🔵 ТОЧНЫЙ РАСЧЁТ ОСТАНОВКИ ПОД ЦЕНТР ЛИНИИ
    // =========================================================

    const CELL = 150;

    const FRAME_WIDTH = document.querySelector(".roulette-frame").offsetWidth;
    const CENTER_OFFSET = FRAME_WIDTH / 2 - CELL / 2;

    const stopX = WINNER_INDEX * CELL - CENTER_OFFSET;

    // =========================================================
    // 🔵 ПЛАВНОЕ ЗАМЕДЛЕНИЕ — ИДЕАЛЬНОЕ 7.5 сек
    // =========================================================

    setTimeout(() => {
        strip.style.transition = "transform 7.5s cubic-bezier(.08,.85,.2,1)";
        strip.style.transform = `translateX(-${stopX}px)`;
    }, 50);

    setTimeout(() => {
        showReward(winner);
    }, 7700);
};



// =========================================================
// 🎁 БЛОК НАГРАДЫ
// =========================================================

function showReward(item) {

    const reward = document.getElementById("reward-block");

    document.getElementById("reward-img").src  = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").textContent = `⭐ ${item.price}`;

    reward.style.display = "block";

    document.getElementById("btn-keep").onclick = () => {
        alert("Вы оставили предмет!");
        location.reload();
    };

    document.getElementById("btn-sell").onclick = () => {
        alert("Предмет продан!");
        location.reload();
    };

    document.getElementById("btn-again").onclick = () => {
        reward.style.display = "none";
        document.querySelector(".case-header").style.display = "block";
        document.getElementById("roulette-wrapper").style.display = "none";
    };
}
