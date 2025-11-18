// =====================================================
// 🎡 CS:GO STYLE CASE OPENING — FINISHED VERSION
// =====================================================

window.startCaseSpin = function({ caseName, caseInfo, count }) {
    console.log("▶️ Запуск рулетки:", caseName);

    const header = document.querySelector(".case-header");
    const grid = document.getElementById("items-grid");
    const roulette = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    // скрываем всё
    header.style.display = "none";
    grid.style.display = "none";
    reward.style.display = "none";

    // показываем рулетку
    roulette.style.display = "block";

    strip.innerHTML = "";

    // данные
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

    // делаем длинную ленту (как в CS2 — длинная и плавная)
    const reel = [];
    for (let i = 0; i < 120; i++) {  // огромная лента
        reel.push(...items);
    }

    // рендерим
    reel.forEach(item => {
        const div = document.createElement("div");
        div.className = "roulette-cell";

        div.innerHTML = `
            <img src="${item.img}" class="roulette-img">
            <div class="roulette-name">${item.name}</div>
        `;

        strip.appendChild(div);
    });

    // выбираем победителя
    const winner = items[Math.floor(Math.random() * items.length)];

    const winnerIndex = reel.findIndex(r => r.id === winner.id);

    const cellWidth = 150;
    const centerOffset = 600; // центр для твоего макета

    const stopX = winnerIndex * cellWidth - centerOffset;

    // плавная длинная анимация
    strip.style.transition = "transform 6.2s cubic-bezier(.08,.6,0,1)";
    strip.style.transform = `translateX(-${stopX}px)`;

    setTimeout(() => {
        showReward(winner);
    }, 6300);
};


// =====================================================
// 🎁 ПОКАЗ ВЫПАДЕНИЯ
// =====================================================

function showReward(item) {
    const reward = document.getElementById("reward-block");

    document.getElementById("reward-img").src = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").innerHTML = `⭐ ${item.price}`;

    reward.style.display = "block";

    document.getElementById("btn-keep").onclick = () => {
        alert("Предмет оставлен!");
        location.reload();
    };

    document.getElementById("btn-sell").onclick = () => {
        alert("Предмет продан!");
        location.reload();
    };
}
