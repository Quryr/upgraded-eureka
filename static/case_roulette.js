// =========================================================
// 🎰 ИДЕАЛЬНАЯ РУЛЕТКА — ПЛАВНОЕ УСКОРЕНИЕ + ПЛАВНОЕ ТОРМОЖЕНИЕ
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

    const names = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];
    const drops = window.caseDropRates?.[caseName] || {};

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

    const weighted = [];
    items.forEach(it => {
        for (let c = 0; c < it.chance * 10; c++) weighted.push(it);
    });
    const winner = weighted[Math.floor(Math.random() * weighted.length)];

    // Лента
    const reel = [];
    for (let r = 0; r < 120; r++) reel.push(...items);

    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    const CELL = 150;
    const FRAME = 1100;
    const CENTER = FRAME / 2 - CELL / 2;

    const indexes = [];
    reel.forEach((it, i) => {
        if (it.id === winner.id) indexes.push(i);
    });

    // далёкий индекс → длинная прокрутка
    const index = indexes[indexes.length - 3];
    const realStopX = index * CELL - CENTER;

    // безопасный дальний старт
    const fastDistance = Math.max(realStopX - 3000, 500);

    // === 1. Ускорение (быстро, но плавно) ===
    setTimeout(() => {
        strip.style.transition = "transform 4.5s cubic-bezier(.25,.8,.5,1)";
        strip.style.transform = `translateX(-${fastDistance}px)`;
    }, 50);

    // === 2. Долгое красивое замедление ===
    setTimeout(() => {
        strip.style.transition = "transform 3.5s cubic-bezier(.1,.55,0,1)";
        strip.style.transform = `translateX(-${realStopX}px)`;
    }, 4600);

    // Показ награды
    setTimeout(() => {
        showReward(winner);
    }, 8200);
};


// =========================================================
// 🎁 БЛОК НАГРАДЫ
// =========================================================

function showReward(item) {

    const reward = document.getElementById("reward-block");

    document.getElementById("reward-img").src = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").textContent = `⭐ ${item.price}`;

    reward.style.display = "block";

    // оставить предмет
    document.getElementById("btn-keep").onclick = () => {
        alert("Вы оставили предмет!");
        location.reload();
    };

    // продать предмет
    document.getElementById("btn-sell").onclick = () => {
        alert("Предмет продан!");
        location.reload();
    };

    // 🔥 КРУТИТЬ ЕЩЁ
    document.getElementById("btn-again").onclick = () => {
        reward.style.display = "none";
        document.querySelector(".case-header").style.display = "block";
        document.getElementById("roulette-wrapper").style.display = "none";
        // itemsGrid не трогаем — он всегда виден
    };
}
