document.addEventListener("DOMContentLoaded", () => {
  // URL параметр id
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  const caseImage = document.getElementById("case-image");
  const caseTitle = document.getElementById("case-title");
  const casePrice = document.getElementById("case-price");
  const itemsGrid = document.getElementById("items-grid");

  // Проверяем, загружен ли объект с кейсами
  if (typeof window.casesData === "undefined") {
    console.error("❌ casesData не найден. Проверь подключение data.js");
    caseTitle.textContent = "DATA NOT LOADED";
    return;
  }

  // Функция поиска кейса — как в index.html
  function findCaseById(id) {
    for (const [category, cases] of Object.entries(window.casesData)) {
      const found = cases.find(
        (item) =>
          item.id === id ||
          item.name.toLowerCase().replace(/\s+/g, "_") === id
      );
      if (found) return found;
    }
    return null;
  }

  // Нормализуем ID (на случай пробелов и регистра)
  const normalizedId = caseId ? caseId.toLowerCase().replace(/\s+/g, "_") : null;
  const selectedCase = normalizedId ? findCaseById(normalizedId) : null;

  if (!selectedCase) {
    console.warn("⚠️ Кейс не найден по id:", normalizedId);
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // Отрисовка данных кейса
  caseImage.src = selectedCase.img;
  caseTitle.textContent = selectedCase.name;
  casePrice.innerHTML = `
    <span>${selectedCase.price || "FREE"}</span>
    <img src="/static/assets/icons/star.png" alt="⭐">
  `;

  // Если у кейса есть содержимое
  if (selectedCase.contains && selectedCase.contains.length > 0) {
    itemsGrid.innerHTML = "";
    selectedCase.contains.forEach((item) => {
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
