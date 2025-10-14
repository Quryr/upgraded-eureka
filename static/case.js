document.addEventListener("DOMContentLoaded", () => {
  // Получаем ID кейса из адресной строки
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  const caseImage = document.getElementById("case-image");
  const caseTitle = document.getElementById("case-title");
  const casePrice = document.getElementById("case-price");
  const itemsGrid = document.getElementById("items-grid");

  // Проверяем, что data.js загрузился
  if (!window.casesData) {
    console.error("❌ casesData не найден. Проверь подключение data.js");
    caseTitle.textContent = "DATA NOT LOADED";
    return;
  }

  // Ищем нужный кейс во всех категориях
  let selectedCase = null;
  for (const [category, cases] of Object.entries(window.casesData)) {
    const found = cases.find(c => c.id === caseId);
    if (found) {
      selectedCase = found;
      break;
    }
  }

  // Если кейс не найден — ошибка
  if (!selectedCase) {
    console.warn(`⚠️ Кейс с ID "${caseId}" не найден.`);
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // Отрисовка кейса
  caseImage.src = selectedCase.img;
  caseTitle.textContent = selectedCase.name;
  casePrice.innerHTML = `
    <span>${selectedCase.price}</span>
    <img src="/static/assets/icons/star.png" alt="⭐">
  `;

  // Если будут предметы — выводим их
  if (selectedCase.contains && selectedCase.contains.length > 0) {
    itemsGrid.innerHTML = "";
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
    itemsGrid.innerHTML = `<div style="grid-column: 1 / -1; opacity: 0.7;">No items found in this case</div>`;
  }
});
