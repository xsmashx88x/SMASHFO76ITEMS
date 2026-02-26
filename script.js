let currentData = [];

// 1. DATA LOADING
async function loadData(filename) {
    const list = document.getElementById('itemList');
    
    // Clear search input when switching categories
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = "";
    
    list.innerHTML = "<div class='item-row'>[ ACCESSING DATABASE... ]</div>";

    try {
        const cacheBuster = "?t=" + new Date().getTime();
        const response = await fetch(filename + cacheBuster);
        if (!response.ok) throw new Error("File not found");

        currentData = await response.json();
        renderList(currentData);
    } catch (error) {
        console.error("Load error:", error);
        list.innerHTML = `<div class='item-row' style="color:#ff4444">[ ERROR: ${filename.toUpperCase()} NOT FOUND ]</div>`;
    }
}

// 2. RENDERING THE MAIN LIST
function renderList(items) {
    const list = document.getElementById('itemList');
    
    if (!items || items.length === 0) {
        list.innerHTML = "<div class='item-row'>[ NO MATCHING DATA FOUND ]</div>";
        return;
    }

    list.innerHTML = items.map((item) => {
        // Find the index in the ORIGINAL currentData to keep modal accurate after searching
        const originalIndex = currentData.indexOf(item);
        
        return `
        <div class="item-row" onclick="openDetails(${originalIndex})">
            <div class="text-container">
                <div class="item-name">${item.name}</div>
                <div class="item-subtext">${item.desc || ''}</div>
            </div>
            <div class="price-container">
                <div class="currency-row caps-text">
                    ${item.caps ? item.caps.toLocaleString() : 0} 
                    <img src="fo76_caps.png" class="icon-red" alt="Caps">
                </div>
                <div class="currency-row bobble-text">
                    ${item.leaders || 0} 
                    <img src="mtg.png" class="icon-blue" alt="Leaders">
                </div>
            </div>
        </div>
    `}).join('');
}

// 3. IMAGE TOGGLE (Click to Grow/Shrink)
function toggleImageSize() {
    const img = document.getElementById('modalImg');
    const modalBox = document.querySelector('.modal-content');
    
    // Toggles between phosphor-clear preview and high-detail expansion
    if (img.classList.contains('img-small')) {
        img.classList.replace('img-small', 'img-large');
        modalBox.classList.add('wide'); // Widens terminal box for big view
    } else {
        img.classList.replace('img-large', 'img-small');
        modalBox.classList.remove('wide');
    }
}

// 4. MODAL LOGIC (Details View)
function openDetails(index) {
    const item = currentData[index];
    if (!item) return;

    document.getElementById('modalTitle').innerText = item.name;
    
    const cacheBuster = "?t=" + new Date().getTime();
    const itemImg = document.getElementById('modalImg');
    
    // Set image and reset size classes
    itemImg.src = (item.image || 'placeholder.png') + cacheBuster;
    itemImg.className = 'img-small'; 

    let modalHTML = `
        <div class="modal-pricing-block">
            <div class="currency-row" style="justify-content: flex-start; margin-bottom: 12px; gap: 12px;">
                <img src="fo76_caps.png" class="icon-red" style="width:28px; height:28px;"> 
                <span class="caps-text" style="font-size: 1.6rem;">CAPS: ${item.caps ? item.caps.toLocaleString() : 0}</span>
            </div>
            <div class="currency-row" style="justify-content: flex-start; gap: 12px;">
                <img src="mtg.png" class="icon-blue" style="width:28px; height:28px;"> 
                <span class="bobble-text" style="font-size: 1.6rem;">BOBBLEHEADS: ${item.leaders || 0}</span>
            </div>
    `;

    // Wiki/Alt View Button
    if (item.alt_view) {
        modalHTML += `
            <div class="alt-view-container">
                <a href="${item.alt_view}" target="_blank" class="alt-view-btn">
                    [ ACCESS EXTERNAL DATA ARCHIVE ]
                </a>
            </div>
        `;
    }

    modalHTML += `</div>`; 
    document.getElementById('modalPrices').innerHTML = modalHTML;
    
    document.getElementById('detailModal').style.display = 'flex';
}

// 5. MODAL CLOSING (Resets state)
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
    const img = document.getElementById('modalImg');
    const modalBox = document.querySelector('.modal-content');
    
    if (img) img.className = 'img-small';
    if (modalBox) modalBox.classList.remove('wide');
}

// 6. SEARCH LOGIC (Checks Name & Desc)
function filterItems() {
    const val = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (val === "") {
        renderList(currentData);
        return;
    }

    const filtered = currentData.filter(i => {
        const name = (i.name || "").toLowerCase();
        const description = (i.desc || "").toLowerCase();
        return name.includes(val) || description.includes(val);
    });

    renderList(filtered);
}

// 7. CLICK OUTSIDE TO CLOSE
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target == modal) {
        closeModal();
    }
}

// 8. AUTO-COUNT FUNCTION (Updates button labels)
async function updateAllCounts() {
    const buttonMap = [
        { id: 'btn-enclave', file: 'enclavemods.json', label: 'ENCLAVE MODS' },
        { id: 'btn-star',    file: 'starmods.json',    label: '★ MODS' },
        { id: 'btn-fas',     file: 'fasmask.json',     label: 'FAS MASK' },
        { id: 'btn-plans',   file: 'plans.json',       label: 'PLANS' },
        { id: 'btn-recipe',  file: 'recipe.json',      label: 'RECIPE' },
        { id: 'btn-weapons', file: 'weapons.json',     label: 'WEAPONS' },
        { id: 'btn-armor',   file: 'armor.json',       label: 'ARMOR' },
        { id: 'btn-mods',    file: 'mods.json',        label: 'MODS' },
        { id: 'btn-food',    file: 'fooddrink.json',   label: 'FOOD & DRINK' },
        { id: 'btn-aid',     file: 'aid.json',         label: 'AID' },
        { id: 'btn-misc',    file: 'miscjunk.json',    label: 'MISC + JUNK' },
        { id: 'btn-ammo',    file: 'ammo.json',        label: 'AMMO' },
        { id: 'btn-apparel', file: 'apparel.json',     label: 'APPAREL' }
    ];

    buttonMap.forEach(async (item) => {
        try {
            const cacheBuster = "?t=" + new Date().getTime();
            const response = await fetch(item.file + cacheBuster);
            if (response.ok) {
                const data = await response.json();
                const count = data.length;
                const btn = document.getElementById(item.id);
                if (btn) {
                    btn.innerText = `[${item.label}] (${count})`;
                }
            }
        } catch (e) {
            console.warn("Count failed for: " + item.file);
        }
    });
}

// 9. INITIAL BOOT SEQUENCE
window.onload = () => {
    updateAllCounts();    // Pull counts for all buttons
    loadData(' '); // Load Plans as the default screen
};
