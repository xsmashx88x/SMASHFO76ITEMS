let currentData = [];

async function loadData(filename) {
    const response = await fetch(filename);
    currentData = await response.json();
    renderList(currentData);
}

function renderList(items) {
    const list = document.getElementById('itemList');
    
    if (items.length === 0) {
        list.innerHTML = "<div class='item-row'>[ NO ARCHIVES FOUND ]</div>";
        return;
    }

    list.innerHTML = items.map((item, index) => `
        <div class="item-row" onclick="openDetails(${index})">
            <div class="text-container">
                <div class="item-name">${item.name}</div>
                <!-- This shows the description immediately -->
                <div class="item-subtext">${item.desc || 'No additional data'}</div>
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
// loadData('plans.json');
