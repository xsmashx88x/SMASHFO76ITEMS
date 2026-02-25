let currentData = [];

async function loadData(filename) {
    const list = document.getElementById('itemList');
    list.innerHTML = "<div class='item-row'>[ LOADING ARCHIVES... ]</div>";

    try {
        // CACHE BUSTER: Prevents users from seeing old prices/items
        const cacheBuster = "?t=" + new Date().getTime();
        const response = await fetch(filename + cacheBuster);
        
        if (!response.ok) throw new Error("File not found");

        currentData = await response.json();
        renderList(currentData);
    } catch (error) {
        console.error("Load error:", error);
        list.innerHTML = `<div style="color: #ff3333; padding: 20px;">[ ERROR: TERMINAL OFFLINE - CHECK FILENAME ]</div>`;
    }
}

function renderList(items) {
    const list = document.getElementById('itemList');
    
    if (items.length === 0) {
        list.innerHTML = "<div class='item-row'>[ NO DATA FOUND ]</div>";
        return;
    }

    list.innerHTML = items.map((item, index) => `
        <div class="item-row" onclick="openDetails(${index})">
            <div class="text-container">
                <div class="item-name">${item.name}</div>
                <div class="item-subtext">${item.desc || ''}</div>
            </div>
            
            <!-- Side Currency Display with Icons -->
            <div class="price-container">
                <div class="currency-row caps-text">
                    ${item.caps ? item.caps.toLocaleString() : 0} 
                    <img src="fo76_caps.png" class="icon-red" alt="Caps">
                </div>
                <div class="currency-row bobble-text">
                    ${item.leaders || 0} 
                    <img src="mtg.png" class="icon-blue" alt="Bobbleheads">
                </div>
            </div>
        </div>
    `).join('');
}

function openDetails(index) {
    const item = currentData[index];
    document.getElementById('modalTitle').innerText = item.name;
    
    // Cache bust the item image
    const cacheBuster = "?t=" + new Date().getTime();
    document.getElementById('modalImg').src = (item.image || 'placeholder.png') + cacheBuster;
    
    // Updated Modal Display with Icons (Removed LL3 as requested)
    document.getElementById('modalPrices').innerHTML = `
        <div style="margin-top:20px; border-top: 1px solid #0f0; padding-top:15px; text-align: left;">
            <div class="currency-row" style="justify-content: flex-start; margin-bottom: 12px; gap: 10px;">
                <img src="fo76_caps.png" class="icon-red" style="width:30px; height:30px;"> 
                <span class="caps-text" style="font-size: 1.5rem;">CAPS: ${item.caps.toLocaleString()}</span>
            </div>
            <div class="currency-row" style="justify-content: flex-start; gap: 10px;">
                <img src="mtg.png" class="icon-blue" style="width:30px; height:30px;"> 
                <span class="bobble-text" style="font-size: 1.5rem;">BOBBLEHEADS: ${item.leaders || 0}</span>
            </div>
            <p style="margin-top: 15px; font-size: 0.8rem; opacity: 0.6; color: #0f0;">
                [ DATA ARCHIVED FROM VAULT 76 DATABASE ]
            </p>
        </div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

function filterItems() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    const filtered = currentData.filter(i => 
        i.name.toLowerCase().includes(val) || 
        (i.desc && i.desc.toLowerCase().includes(val))
    );
    renderList(filtered);
}

// Initial load - Change 'plans.json' to your primary JSON file name
loadData(' ');
