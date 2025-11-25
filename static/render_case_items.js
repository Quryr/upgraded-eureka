function renderCaseItems(containerId, casePath, itemCount, caseName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const itemSizes = window.caseItemSizes?.[caseName] || {};
  const itemPrices = window.caseItemPrices?.[caseName] || {};

  // 📊 Создаём массив предметов
  const items = [];
  for (let i = 1; i <= itemCount; i++) {
    items.push({
      index: i,
      size: itemSizes[i] || 160,
      price: itemPrices[i] ?? null,
      imagePath: `${casePath}${i}.png`
    });
  }

  // 🔢 Сортировка по возрастанию цены
  items.sort((a, b) => {
    if (a.price == null && b.price == null) return 0;
    if (a.price == null) return 1;
    if (b.price == null) return -1;
    return a.price - b.price;
  });

  // 🎨 Отрисовка
  for (const item of items) {
    const card = document.createElement("div");
    card.className = "item-card";

    const itemName =
      window.caseItemNames?.[caseName]?.[item.index] ||
      ("Item " + item.index);

    card.innerHTML = `
      <div class="item-img">
        <img src="${item.imagePath}" alt="${itemName}" style="width:${item.size}px;height:${item.size}px;">
      </div>
      <div class="item-info">
        <p class="item-name">${itemName}</p>
        <p class="item-price">
          <span class="price-value">${item.price ?? "—"}</span>
          <img src="/static/assets/icons/star.png" class="currency-icon" alt="⭐">
        </p>
      </div>
    `;


    container.appendChild(card);
  }
}
