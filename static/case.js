document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  const caseImage = document.getElementById("case-image");
  const caseTitle = document.getElementById("case-title");
  const casePrice = document.getElementById("case-price");
  const itemsGrid = document.getElementById("items-grid");

  if (!caseId || !window.casesData) {
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // Ищем кейс по ID во всех категориях
  let selectedCase = null;
  for (const [category, cases] of Object.entries(casesData)) {
    const found = cases.find(c => c.id === caseId);
    if (found) {
      selectedCase = found;
      break;
    }
  }

  if (!selectedCase) {
    caseTitle.textContent = "CASE NOT FOUND";
    return;
  }

  // Обновляем данные на странице
  caseImage.src = selectedCase.img;
  caseTitle.textContent = selectedCase.name;
  casePrice.innerHTML = `
    <span>${selectedCase.price || "FREE"}</span> 
    <img src="/static/assets/icons/star.png" alt="⭐">
  `;

  // Если у кейса есть содержимое — выводим
  if (selectedCase.contains && selectedCase.contains.length > 0) {
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
