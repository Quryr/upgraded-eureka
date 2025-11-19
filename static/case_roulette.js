// =========================================================
// 🎰 РУЛЕТКА v3.0 — ФИНАЛЬНАЯ, СТАБИЛЬНАЯ, ПРАВИЛЬНАЯ
// =========================================================

window.startCaseSpin = function (caseName, caseInfo) {

    // элементы
    const header = document.querySelector(".case-header");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    // скрываем верх и показываем рулетку
    header.style.display = "none";
    wrapper.style.display = "block";
    reward.style.display = "none";

    // чистим ленту
    strip.innerHTML = "";
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";

    // данные предметов
    const names = window.caseItemNames[caseName];
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

    // выбор победителя по шансам
    const weighted = [];
    items.forEach(it => {
        for (let c = 0; c < it.chance * 10; c++) weighted.push(it);
    });
    const winner = weighted[Math.floor(Math.random() * weighted.length)];

    // =========================================================
    // 🟦 СБОР ЛЕНТЫ — ГАРАНТИРУЕМ ПОЗИЦИЮ ПОБЕДИТЕЛЯ
    // =========================================================

    const reel = [];

    // 60 случайных предметов "до победителя"
    for (let i = 0; i < 60; i++) {
        const rand = items[Math.floor(Math.random() * items.length)];
        reel.push(rand);
    }

    // победитель ровно в позиции 60
    const WINNER_INDEX = 60; 
    reel.push(winner);

    // ещё 20 предметов после победителя
    for (let i = 0; i < 20; i++) {
        const rand = items[Math.floor(Math.random() * items.length)];
        reel.push(rand);
    }

    // =========================================================
    // 🟦 РЕНДЕР ПРЕДМЕТОВ В ЛЕНТЕ
    // =========================================================

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
    // 🟦 ДВИЖЕНИЕ РУЛЕТКИ — ПЛАВНОЕ 7.5сек ЗАМЕДЛЕНИЕ
    // =========================================================

    const CELL = 150;
    const stopX = WINNER_INDEX * CELL;

    setTimeout(() => {
        strip.style.transition = "transform 7.5s cubic-bezier(.08,.85,.2,1)";
        strip.style.transform = `translateX(-${stopX}px)`;
    }, 50);

    // показываем награду
    setTimeout(() => {
        showReward(winner);
    }, 7600);
};



// =========================================================
// 🎁 БЛОК НАГРАДЫ (KEEP / SELL / SPIN AGAIN)
// =========================================================

function showReward(item) {

    const reward = document.getElementById("reward-block");

    document.getElementById("reward-img").src  = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").textContent = `⭐ ${item.price}`;

    reward.style.display = "block";

    // KEEP
    document.getElementById("btn-keep").onclick = () => {
        alert("Вы оставили предмет!");
        location.reload();
    };

    // SELL
    document.getElementById("btn-sell").onclick = () => {
        alert("Предмет продан!");
        location.reload();
    };

    // SPIN AGAIN
    document.getElementById("btn-again").onclick = () => {
        reward.style.display = "none";
        document.querySelector(".case-header").style.display = "block";
        document.getElementById("roulette-wrapper").style.display = "none";
    };
}
