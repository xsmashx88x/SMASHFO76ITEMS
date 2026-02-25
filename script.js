let currentData = [];

async function loadData(filename) {
    const response = await fetch(filename);
    currentData = await response.json();
    renderList(currentData);
}

function renderList(items) {
    const list = document.getElementById('itemList');
    list.innerHTML = items.map((item, index) => `
        <div class="item-row" onclick="openDetails(${index})">
            <div>
                <div style="font-size: 1.4rem;">${item.name}</div>
                <div style="font-size: 0.9rem; opacity: 0.7;">${item.desc}</div>
            </div>
            <div class="price-tag">${item.caps.toLocaleString()}c</div>
        </div>
    `).join('');
}

function openDetails(index) {
    const item = currentData[index];
    document.getElementById('modalTitle').innerText = item.name;
    document.getElementById('modalImg').src = item.image;
    
    // Multi-currency display
    document.getElementById('modalPrices').innerHTML = `
        <p>CAPS: ${item.caps}</p>
        <p>LEADER BOBBLEHEADS: ${item.leaders}</p>
        <p>LIVE & LOVE 3: ${item.ll3}</p>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

function filterItems() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    const filtered = currentData.filter(i => i.name.toLowerCase().includes(val));
    renderList(filtered);
}

// Load plans by default
loadData('plans.json');