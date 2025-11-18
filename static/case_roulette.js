// ======================================================
//   CS2 ROULETTE — FULL WORKING EDITION (your HTML ready)
// ======================================================

window.startCaseSpin = function({ caseName, caseInfo, count }) {

    console.log("🎰 START:", caseName);

    const header = document.querySelector(".case-header");
    const roulette = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    // скрываем ТОЛЬКО кейс
    header.style.display = "none";

    // показываем рулетку
    roulette.style.display = "block";
    strip.innerHTML = "";
    reward.style.display = "none";

    // ==== Загружаем предметы ====
    const names = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];

    const items = [];
    for (let i = 1; i <= caseInfo.count; i++) {
        items.push({
            id: i,
            name: names[i] || `Item ${i}`,
            price: prices[i] || 0,
            img: `${caseInfo.path}${i}.png`
        });
    }

    // ==== Генерируем длинную ленту ====
    const TAPE_REPEAT = 50;
    const tape = [];
    for (let i = 0; i < TAPE_REPEAT; i++) tape.push(...items);

    tape.forEach(it => {
        const div = document.createElement("div");
        div.className = "strip-item";
        div.innerHTML = `
            <img src="${it.img}">
            <div class="strip-name">${it.name}</div>
        `;
        strip.appendChild(div);
    });

    // ==== Победитель ====
    const winner = items[Math.floor(Math.random() * items.length)];
    console.log("🏆 WIN:", winner);

    const index = tape.findIndex(it => it.id === winner.id);

    const ITEM_WIDTH = 180;
    const frame = document.querySelector(".roulette-frame").offsetWidth;
    const center = frame / 2 - ITEM_WIDTH / 2;

    const stopX = index * ITEM_WIDTH - center;

    // ==== Запуск анимации в стиле CS2 ====
    strip.style.transition = "transform 5.0s cubic-bezier(.06,.76,.17,1)";
    strip.style.transform = `translateX(-${stopX}px)`;

    // ==== После остановки ====
    setTimeout(() => showReward(winner), 5200);
};


// ======================================================
//   ПОКАЗ ВЫИГРЫША (увеличение + кнопки CS2)
// ======================================================

function showReward(item) {
    const reward = document.getElementById("reward-block");

    reward.style.display = "block";
    reward.style.opacity = "0";
    reward.style.transform = "scale(0.5)";

    document.getElementById("reward-img").src = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").textContent = `⭐ ${item.price}`;

    // красивое увеличение
    setTimeout(() => {
        reward.style.transition = "0.35s cubic-bezier(.2,1.4,.3,1)";
        reward.style.opacity = "1";
        reward.style.transform = "scale(1)";
    }, 20);

    // кнопки
    document.getElementById("btn-keep").onclick = () => {
        reward.style.display = "none";
        alert("Предмет оставлен.");
    };

    document.getElementById("btn-sell").onclick = () => {
        reward.style.display = "none";
        alert("Продано!");
    };
}
