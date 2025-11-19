// =========================================================
// 🎰 ИДЕАЛЬНАЯ РУБЛЕЖНАЯ РУЛЕТКА — БЕЗ БАГОВ, ЧЁТКО ПО ЦЕНТРУ
// =========================================================

window.startCaseSpin = function (caseName, caseInfo, count = 1) {

    // --- элементы ---
    const header = document.querySelector(".case-header");
    const itemsGrid = document.getElementById("items-grid");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    // скрываем картинку и сетку
    header.style.display = "none";

    // показываем рулетку
    wrapper.style.display = "block";
    reward.style.display = "none";

    // очищаем и сбрасываем
    strip.innerHTML = "";
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";

    // --- данные ---
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

    // --- выбор победителя по шансам ---
    const weighted = [];
    items.forEach(it => {
        for (let c = 0; c < it.chance * 10; c++) weighted.push(it);
    });
    const winner = weighted[Math.floor(Math.random() * weighted.length)];

    // --- строим длинную ленту ---
    const reel = [];
    for (let r = 0; r < 60; r++) reel.push(...items);

    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    // === вычислить точное место выигрыша ===
    const CELL = 150;          // ширина ячейки
    const FRAME = 1100;        // ширина рулетки (адаптировал под твой дизайн)
    const CENTER = FRAME / 2 - CELL / 2;

    // берём НЕ первое совпадение, а далёкое:
    const indexes = [];
    reel.forEach((it, i) => {
        if (it.id === winner.id) indexes.push(i);
    });

    const index = indexes[indexes.length - 4]; // крутим далеко вперёд
    const stopX = index * CELL - CENTER;

    // запускаем анимацию
    setTimeout(() => {
        strip.style.transition = "transform 6s cubic-bezier(.08,.6,0,1)";
        strip.style.transform = `translateX(-${stopX}px)`;
    }, 50);

    // показываем награду
    setTimeout(() => {
        showReward(winner);
    }, 6200);
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

    // 🔥 кнопка «КРУТИТЬ ЕЩЁ»
    document.getElementById("btn-again").onclick = () => {
        reward.style.display = "none";
        document.querySelector(".case-header").style.display = "block";
        document.getElementById("items-grid").style.display = "grid";
        document.getElementById("roulette-wrapper").style.display = "none";
    };
}
