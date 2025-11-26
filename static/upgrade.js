document.addEventListener("DOMContentLoaded", () => {
    const user = loadUser();
    if (!user || !user.inventory) return;

    const inv = document.getElementById("upgrade-inventory");
    inv.innerHTML = "";

    user.inventory.forEach((item, i) => {
        const div = document.createElement("div");
        div.className = "upgrade-item";

        div.innerHTML = `
            <img src="${item.img}" class="upgrade-item-img">
            <p class="upgrade-item-name">${item.name}</p>
            <p class="upgrade-item-price">${item.price} ⭐</p>
        `;

        div.onclick = () => {
            document.getElementById("upgrade-source").innerHTML = `
                <img src="${item.img}" class="upgrade-selected-img">
                <p class="upgrade-selected-name">${item.name}</p>
                <p class="upgrade-selected-price">${item.price} ⭐</p>
            `;
        };

        inv.appendChild(div);
    });
});
