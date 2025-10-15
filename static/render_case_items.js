/**
 * Отрисовывает карточки предметов под кейсом.
 * @param {string} containerId - ID контейнера, куда вставлять карточки.
 * @param {string} casePath - путь до папки кейса.
 * @param {number} itemCount - количество предметов в кейсе.
 * @param {string} caseName - имя кейса (для поиска в caseItemSizes).
 */
function renderCaseItems(containerId, casePath, itemCount, caseName) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  // Получаем таблицу размеров для данного кейса (если есть)
  const itemSizes = window.caseItemSizes?.[caseName] || {};

  console.log(`🎨 Рендер кейса: ${caseName} (${itemCount} предметов)`);
  console.log("Путь:", casePath);

  for (let i = 1; i <= itemCount; i++) {
    const imagePath = `${casePath}${i}.png`;
    const size = itemSizes[i] || 160; // если не задано — 120px

    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <div class="item-img">
        <img src="${imagePath}" alt="Item ${i}" style="width:${size}px;height:${size}px;">
      </div>
      <div class="item-info">
        <p class="item-name">Item ${i}</p>
        <p class="item-price">
          <img src="/static/assets/icons/star.png" class="currency-icon" alt="⭐">
          <span class="price-value">—</span>
        </p>
      </div>
    `;

    container.appendChild(card);
  }
}
