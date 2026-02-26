let currentData = [];

// 1. DATA LOADING
async function loadData(filename) {
    const list = document.getElementById('itemList');
    // Clear search input when switching categories
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = "";
    
    list.innerHTML = "<div class='item-row'>[ LOADING ARCHIVES... ]</div>";

    try {
        const cacheBuster = "?t=" + new Date().getTime();
        const response = await fetch(filename + cacheBuster);
        if (!response.ok) throw new Error("File not found");

        currentData = await response.json();
        renderList(currentData);
    } catch (error) {
        console.error("Load error:", error);
        list.innerHTML = `<div class='item-row' style="color:#ff3333">[ ERROR: ${filename.toUpperCase()} NOT FOUND ]</div>`;
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
        // Find the index in the ORIGINAL currentData to keep the modal working after search
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

// TOGGLE IMAGE SIZE & MODAL WIDTH
function toggleImageSize() {
    const img = document.getElementById('modalImg');
    const modalBox = document.querySelector('.modal-content');
    
    if (img.classList.contains('img-small')) {
        img.classList.replace('img-small', 'img-large');
        modalBox.classList.add('wide'); // Makes the green box wider too
    } else {
        img.classList.replace('img-large', 'img-small');
        modalBox.classList.remove('wide'); // Shrinks the green box back
    }
}

// 4. MODAL LOGIC (OPEN DETAILS)
function openDetails(index) {
    const item = currentData[index];
    if (!item) return;

    document.getElementById('modalTitle').innerText = item.name;
    
    const cacheBuster = "?t=" + new Date().getTime();
    const itemImg = document.getElementById('modalImg');
    
    // Set image and reset it to small state
    itemImg.src = (item.image || 'placeholder.png') + cacheBuster;
    itemImg.className = 'img-small'; 

    let modalHTML = `
        <div class="modal-pricing-block">
            <div class="currency-row" style="justify-content: flex-start; margin-bottom: 10px; gap: 10px;">
                <img src="fo76_caps.png" class="icon-red" style="width:24px;height:24px;"> 
                <span class="caps-text" style="font-size: 1.5rem;">CAPS: ${item.caps ? item.caps.toLocaleString() : 0}</span>
            </div>
            <div class="currency-row" style="justify-content: flex-start; gap: 10px;">
                <img src="mtg.png" class="icon-blue" style="width:24px;height:24px;"> 
                <span class="bobble-text" style="font-size: 1.5rem;">BOBBLEHEADS: ${item.leaders || 0}</span>
            </div>
    `;

    // Support for alt_view (Wiki Link)
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
    
    // Display the modal
    document.getElementById('detailModal').style.display = 'flex';
}

// Ensure the box resets when closed
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
    const img = document.getElementById('modalImg');
    const modalBox = document.querySelector('.modal-content');
    
    img.className = 'img-small';
    modalBox.classList.remove('wide');
}

// 6. SEARCH LOGIC (Checks Name and Description)
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

// 7. GLOBAL CLICK HANDLER (Click Outside to Close)
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    // If clicking the semi-transparent background, close the modal
    if (event.target == modal) {
        closeModal();
    }
}

// 8. INITIAL LOAD
// Set 'plans.json' as default, or any other file you want loaded first
loadData(' ');
