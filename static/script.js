document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cases-container");
  const buttons = document.querySelectorAll(".filter-btn");

  const categoryNames = {
    "luxury-style": "LUXURY & STYLE",
    "mystic-energy": "MYSTIC & ENERGY",
    "memes-fun": "MEMES & FUN",
    "collectibles": "COLLECTIONS & UNIQUE"
  };

  function renderAllCategories() {
    container.innerHTML = "";
    for (const [key, items] of Object.entries(casesData)) {
      const block = document.createElement("div");
      block.classList.add("category-block");

      const title = document.createElement("div");
      title.classList.add("category-title");
      title.textContent = categoryNames[key];
      block.appendChild(title);

      const grid = document.createElement("div");
      grid.classList.add("case-grid");

      items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("case-card");
        card.innerHTML = `
          <img src="${item.img}" alt="${item.name}" />
          <div class="case-title">${item.name}</div>
          <div class="case-subtitle">
            ${item.price 
              ? `<span>${item.price}</span> <img src="/static/assets/icons/star.png" class="star-icon" alt="⭐">`
              : "БЕСПЛАТНО"}
          </div>
        `;
        grid.appendChild(card);
      });

      block.appendChild(grid);
      container.appendChild(block);
    }
  }

  function renderCases(filter) {
    container.innerHTML = "";
    if (filter === "all") {
      renderAllCategories();
      return;
    }

    const grid = document.createElement("div");
    grid.classList.add("case-grid");
    const cases = casesData[filter] || [];

    cases.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("case-card");
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" />
        <div class="case-title">${item.name}</div>
        <div class="case-subtitle">
          ${item.price 
            ? `<span>${item.price}</span> <img src="/static/assets/icons/star.png" class="star-icon" alt="⭐">`
            : "БЕСПЛАТНО"}
        </div>
      `;
      grid.appendChild(card);
    });

    const block = document.createElement("div");
    block.classList.add("category-block");

    const title = document.createElement("div");
    title.classList.add("category-title");
    title.textContent = categoryNames[filter];
    block.appendChild(title);
    block.appendChild(grid);
    container.appendChild(block);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCases(btn.dataset.filter);
    });
  });

  renderAllCategories();
});
