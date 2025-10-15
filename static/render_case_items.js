/**
 * Отрисовывает карточки предметов под кейсом.
 * @param {string} containerId - ID контейнера, куда вставлять карточки.
 * @param {string} casePath - путь до папки кейса (например, "Внутренности кейсов/LUXURY & STYLE/Silver Soul/").
 * @param {number} itemCount - количество предметов (png-файлов) в папке.
 */
function renderCaseItems(containerId, casePath, itemCount) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  // Генерация карточек по количеству предметов
  for (let i = 1; i <= itemCount; i++) {
    const imagePath = `${casePath}${i}.png`;

    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-img">
        <img src="${imagePath}" alt="Item ${i}">
      </div>
      <div class="item-info">
        <p class="item-name">Item ${i}</p>
        <p class="item-price">
          <img src="/static/assets/icons/star.png" class="currency-icon" alt="star">
          <span class="price-value">—</span>
        </p>
      </div>
    `;

    container.appendChild(card);
  }
}
