// ==========================================
//     CS2 / KEYDROP STYLE CASE ROULETTE
// ==========================================

window.startCaseSpin = function({ caseName, caseInfo, count }) {

    console.log("▶️ START SPIN:", caseName);

    const strip = document.getElementById("roulette-strip");
    const rewardBlock = document.getElementById("reward-block");
    const wrapper = document.getElementById("roulette-wrapper");

    strip.innerHTML = "";
    rewardBlock.style.display = "none";

    // ----------------------------
    // Загружаем предметы кейса
    // ----------------------------
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

    // ----------------------------
    // Генерируем длинную ленту
    // ----------------------------
    const tape = [];
    for (let i = 0; i < 35; i++) tape.push(...items);

    tape.forEach(it => {
        const d = document.createElement("div");
        d.className = "strip-item";
        d.innerHTML = `
            <img src="${it.img}">
            <div class="strip-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    // ----------------------------
    // Выбираем победителя
    // ----------------------------
    const winner = items[Math.floor(Math.random() * items.length)];
    console.log("🏆 WINNER:", winner);

    const indexInTape = tape.findIndex(it => it.id === winner.id);

    const itemWidth = 180;
    const centerOffset = (wrapper.clientWidth / 2) - (itemWidth / 2);

    const stopPosition = indexInTape * itemWidth - centerOffset;

    // ----------------------------
    // Запуск анимации CS2-style
    // ----------------------------
    strip.style.transition = "transform 4.5s cubic-bezier(.08,.6,0,1)";
    strip.style.transform = `translateX(-${stopPosition}px)`;

    setTimeout(() => {
        showReward(winner);
    }, 4700);
};


// ==========================================
//     Показываем выигрыш (красивое увеличение)
// ==========================================

function showReward(item) {

    const rewardBlock = document.getElementById("reward-block");
    const rewardImg = document.getElementById("reward-img");
    const rewardName = document.getElementById("reward-name");
    const rewardPrice = document.getElementById("reward-price");

    rewardImg.src = item.img;
    rewardName.textContent = item.name;
    rewardPrice.textContent = `⭐ ${item.price}`;

    rewardBlock.style.display = "block";
    rewardBlock.style.opacity = "0";
    rewardBlock.style.transform = "scale(0.6)";

    setTimeout(() => {
        rewardBlock.style.transition = "0.4s";
        rewardBlock.style.opacity = "1";
        rewardBlock.style.transform = "scale(1)";
    }, 40);

    // ----------------------------
    // Кнопки
    // ----------------------------
    document.getElementById("btn-keep").onclick = () => {
        rewardBlock.style.display = "none";
        alert("✔ Предмет сохранён (пока что просто скрываем)");
    };

    document.getElementById("btn-sell").onclick = () => {
        rewardBlock.style.display = "none";
        alert("💰 Продано!");
    };
}
