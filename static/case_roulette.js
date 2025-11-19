// =========================================================
// 🎰 ИДЕАЛЬНАЯ РУЛЕТКА — ПЛАВНАЯ, ДОЛГАЯ, С БОУНСОМ
// =========================================================

window.startCaseSpin = function (caseName, caseInfo, count = 1) {

    // элементы
    const header = document.querySelector(".case-header");
    const itemsGrid = document.getElementById("items-grid");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    // скрываем только верх кейса, но НЕ сетку предметов
    header.style.display = "none";

    // показываем рулетку
    wrapper.style.display = "block";
    reward.style.display = "none";

    // ресет
    strip.innerHTML = "";
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";

    // данные
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

    // выбор победителя по шансам
    const weighted = [];
    items.forEach(it => {
        for (let c = 0; c < it.chance * 10; c++) weighted.push(it);
    });
    const winner = weighted[Math.floor(Math.random() * weighted.length)];

    // строим длинную ленту
    const reel = [];
    for (let r = 0; r < 80; r++) reel.push(...items);

    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    // вычисляем остановку
    const CELL = 150;
    const FRAME = 1100;
    const CENTER = FRAME / 2 - CELL / 2;

    const indexes = [];
    reel.forEach((it, i) => {
        if (it.id === winner.id) indexes.push(i);
    });

    // дальний индекс → длинное вращение
    const index = indexes[indexes.length - 6];
    const realStopX = index * CELL - CENTER;

    // overshoot
    const overshootX = realStopX + 50;

    // старт анимации — длинная, плавная
    setTimeout(() => {
        strip.style.transition = "transform 7.4s cubic-bezier(.1,.6,0,1)";
        strip.style.transform = `translateX(-${overshootX}px)`;
    }, 50);

    // bounce назад
    setTimeout(() => {
        strip.style.transition = "transform 0.35s ease-out";
        strip.style.transform = `translateX(-${realStopX}px)`;
    }, 7500);

    // показать награду
    setTimeout(() => {
        showReward(winner);
    }, 8000);
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
