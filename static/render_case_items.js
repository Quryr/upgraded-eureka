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
      price: itemPrices[i] ?? null, // может быть пустым
      imagePath: `${casePath}${i}.png`
    });
  }

  // 🔢 Сортировка по возрастанию цены, если цены указаны
  items.sort((a, b) => {
    if (a.price == null && b.price == null) return 0;
    if (a.price == null) return 1; // без цены — в конец
    if (b.price == null) return -1;
    return a.price - b.price;
  });

  // 🎨 Отрисовка
  for (const item of items) {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-img">
        <img src="${item.imagePath}" alt="Item ${item.index}" style="width:${item.size}px;height:${item.size}px;">
      </div>
      <div class="item-info">
        <p class="item-name">Item ${item.index}</p>
        <p class="item-price">
          <img src="/static/assets/icons/star.png" class="currency-icon" alt="⭐">
          <span class="price-value">${item.price ?? "—"}</span>
        </p>
      </div>
    `;
    container.appendChild(card);
  }
}
