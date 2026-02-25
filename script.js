let currentData = [];

async function loadData(filename) {
    const list = document.getElementById('itemList');
    list.innerHTML = "<div>LOADING...</div>";

    try {
        // CACHE BUSTER: Adding a unique timestamp forces the browser to get the latest file
        const cacheBuster = "?t=" + new Date().getTime();
        const response = await fetch(filename + cacheBuster);
        
        if (!response.ok) throw new Error("File not found");

        currentData = await response.json();
        renderList(currentData);
    } catch (error) {
        console.error("Load error:", error);
        list.innerHTML = `<div style="color: red;">[ ERROR: REBOOT TERMINAL ]</div>`;
    }
}

function renderList(items) {
    const list = document.getElementById('itemList');
    list.innerHTML = items.map((item, index) => `
        <div class="item-row" onclick="openDetails(${index})">
            <div>
                <div class="item-name">${item.name}</div>
                <div class="item-subtext">${item.desc || ''}</div>
            </div>
            <div class="price-tag">${item.caps.toLocaleString()}c</div>
        </div>
    `).join('');
}

function openDetails(index) {
    const item = currentData[index];
    document.getElementById('modalTitle').innerText = item.name;
    
    // Cache bust the image too, just in case you updated the picture
    const cacheBuster = "?t=" + new Date().getTime();
    document.getElementById('modalImg').src = item.image + cacheBuster;
    
    document.getElementById('modalPrices').innerHTML = `
        <div style="margin-top:15px; border-top: 1px solid #0f0; padding-top:10px;">
            <p>CAPS: ${item.caps.toLocaleString()}</p>
            <p>LEADERS: ${item.leaders || 0}</p>
            <p>LL3: ${item.ll3 || 0}</p>
        </div>
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
