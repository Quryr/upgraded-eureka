window.startCaseSpin = function (selectedCase, selectedCount, caseInfo, caseName) {

    // элементы
    const container = document.querySelector(".case-container");
    const wrapper = document.getElementById("roulette-wrapper");
    const strip = document.getElementById("roulette-strip");
    const reward = document.getElementById("reward-block");

    // прячем кейс
    container.style.display = "none";

    // показываем рулетку
    wrapper.style.display = "block";

    // очищаем старый контент
    strip.style.transition = "none";
    strip.style.transform = "translateX(0)";
    strip.innerHTML = "";
    reward.style.display = "none";

    // получаем имена/цены
    const names = window.caseItemNames[caseName];
    const prices = window.caseItemPrices[caseName];

    // создаём список предметов кейса
    const items = [];
    for (let i = 1; i <= caseInfo.count; i++) {
        items.push({
            id: i,
            name: names[i],
            price: prices[i],
            img: `${caseInfo.path}${i}.png`
        });
    }

    // создаём длинную ленту (много повторов)
    const reel = [];
    for (let i = 0; i < 60; i++) reel.push(...items);

    // РАЗМЕР ячейки строго синхронизирован с CSS
    const CELL = 150; // ширина .roulette-cell

    // отрисовываем ленту
    reel.forEach(it => {
        const d = document.createElement("div");
        d.className = "roulette-cell";
        d.innerHTML = `
            <img src="${it.img}" class="roulette-img">
            <div class="roulette-name">${it.name}</div>
        `;
        strip.appendChild(d);
    });

    // выбираем победителя
    const winner = items[Math.floor(Math.random() * items.length)];

    // находим индекс первого совпадения
    const index = reel.findIndex(r => r.id === winner.id);

    // вычисление центра рулетки
    const frame = document.querySelector(".roulette-frame");
    const frameWidth = frame.offsetWidth;

    // центр = середина экрана минус половина ячейки
    const CENTER = frameWidth / 2 - CELL / 2;

    // конечная позиция
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


function showReward(item) {

    const reward = document.getElementById("reward-block");

    document.getElementById("reward-img").src = item.img;
    document.getElementById("reward-name").textContent = item.name;
    document.getElementById("reward-price").textContent = `⭐ ${item.price}`;

    reward.style.display = "block";

    // кнопка KEEP
    document.getElementById("btn-keep").onclick = () => {
        location.reload();
    };

    // кнопка SELL
    document.getElementById("btn-sell").onclick = () => {
        location.reload();
    };
}
