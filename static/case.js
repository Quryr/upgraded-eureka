document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  let caseId = params.get("id");

  const caseImage = document.getElementById("case-image");
  const caseTitle = document.getElementById("case-title");
  const casePrice = document.getElementById("case-price");
  const itemsGrid = document.getElementById("items-grid");

  // Проверяем, загружены ли данные кейсов
  if (!window.casesData) {
    caseTitle.textContent = "DATA NOT LOADED";
    return;
  }

  // Если caseId есть — нормализуем (в нижний регистр, подчёркивания вместо пробелов)
  if (caseId) {
    caseId = caseId.toLowerCase().replace(/\s+/g, "_");
  }

  let selectedCase = null;

  // --- Поиск по id или по имени ---
  for (const [category, cases] of Object.entries(casesData)) {
    const found = cases.find(c => {
      // если есть поле id, проверяем его
      if (c.id && c.id.toLowerCase() === caseId) return true;
      // проверяем совпадение по имени
      return c.name.toLowerCase().replace(/\s+/g, "_") === caseId;
    });
    if (found) {
      selectedCase = found;
      break;
    }
  }

  // --- Если кейс не найден ---
  if (!selectedCase) {
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // --- Отрисовка кейса ---
  caseImage.src = selectedCase.img;
  caseTitle.textContent = selectedCase.name;
  casePrice.innerHTML = `
    <span>${selectedCase.price || "FREE"}</span>
    <img src="/static/assets/icons/star.png" alt="⭐">
  `;

  // --- Отрисовка предметов внутри кейса ---
  if (selectedCase.contains && selectedCase.contains.length > 0) {
    itemsGrid.innerHTML = ""; // очищаем перед вставкой
    selectedCase.contains.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("item-card");
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="item-name">${item.name}</div>
        <div class="item-price">
          <span>${item.price}</span>
          <img src="/static/assets/icons/star.png" alt="⭐">
        </div>
      `;
      itemsGrid.appendChild(card);
    });
  } else {
    itemsGrid.innerHTML = `<div style="grid-column: 1/-1; opacity: 0.7;">No items found in this case</div>`;
  }
});
