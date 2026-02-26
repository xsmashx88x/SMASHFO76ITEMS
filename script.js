let currentData = [];

// 1. DATA LOADING
async function loadData(filename) {
    const list = document.getElementById('itemList');
    list.innerHTML = "<div class='item-row'>[ LOADING... ]</div>";

    try {
        const cacheBuster = "?t=" + new Date().getTime();
        const response = await fetch(filename + cacheBuster);
        if (!response.ok) throw new Error("File not found");

        currentData = await response.json();
        renderList(currentData);
    } catch (error) {
        console.error("Load error:", error);
        list.innerHTML = `<div class='item-row' style="color:red">[ ERROR: ARCHIVE NOT FOUND ]</div>`;
    }
}

// 2. RENDERING THE MAIN LIST
function renderList(items) {
    const list = document.getElementById('itemList');
    if (items.length === 0) {
        list.innerHTML = "<div class='item-row'>[ EMPTY ]</div>";
        return;
    }

    list.innerHTML = items.map((item, index) => `
        <div class="item-row" onclick="openDetails(${index})">
            <div class="text-container">
                <div class="item-name">${item.name}</div>
                <div class="item-subtext">${item.desc || ''}</div>
            </div>
            <div class="price-container">
                <div class="currency-row caps-text">
                    ${item.caps ? item.caps.toLocaleString() : 0} 
                    <img src="fo76_caps.png" class="icon-red">
                </div>
                <div class="currency-row bobble-text">
                    ${item.leaders || 0} 
                    <img src="mtg.png" class="icon-blue">
                </div>
            </div>
        </div>
    `).join('');
}

// 3. MODAL LOGIC (GREEN BOX)
function openDetails(index) {
    const item = currentData[index];
    document.getElementById('modalTitle').innerText = item.name;
    
    const cacheBuster = "?t=" + new Date().getTime();
    const itemImg = document.getElementById('modalImg');
    
    // Set image and zoom function
    itemImg.src = (item.image || 'placeholder.png') + cacheBuster;
    
    // Build the Modal Info content
    let modalHTML = `
        <div class="modal-pricing-block">
            <div class="currency-row" style="justify-content: flex-start; margin-bottom: 8px;">
                <img src="fo76_caps.png" class="icon-red" style="width:24px;height:24px;"> 
                <span class="caps-text" style="font-size: 1.4rem;">CAPS: ${item.caps ? item.caps.toLocaleString() : 0}</span>
            </div>
            <div class="currency-row" style="justify-content: flex-start; margin-bottom: 15px;">
                <img src="mtg.png" class="icon-blue" style="width:24px;height:24px;"> 
                <span class="bobble-text" style="font-size: 1.4rem;">BOBBLEHEADS: ${item.leaders || 0}</span>
            </div>
    `;

    // Support for alt_view (Wiki Link)
    if (item.alt_view) {
        modalHTML += `
            <div class="alt-view-container" style="margin-top: 20px; border-top: 1px dashed #008800; padding-top: 15px;">
                <a href="${item.alt_view}" target="_blank" class="alt-view-btn" style="text-decoration: none;">
                    [ ACCESS EXTERNAL DATA ARCHIVE ]
                </a>
            </div>
        `;
    }

    modalHTML += `</div>`; 
    
    document.getElementById('modalPrices').innerHTML = modalHTML;
    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 4. ZOOM LOGIC (FULLSCREEN)
function openZoom() {
    const modalImgSrc = document.getElementById('modalImg').src;
    const zoomedImg = document.getElementById('zoomedImg');
    const overlay = document.getElementById('zoomOverlay');

    zoomedImg.src = modalImgSrc; 
    overlay.style.display = 'flex'; 
}

function closeZoom() {
    document.getElementById('zoomOverlay').style.display = 'none';
}

// 5. SEARCH LOGIC
function filterItems() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    const filtered = currentData.filter(i => i.name.toLowerCase().includes(val));
    renderList(filtered);
}

// 6. CLICK OUTSIDE TO CLOSE FIX
// This handles both the Modal and the Zoom Overlay
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    const zoom = document.getElementById('zoomOverlay');

    // If clicking the dark background of the green modal box
    if (event.target == modal) {
        closeModal();
    }
    
    // If clicking anywhere on the full-screen zoom background
    if (event.target == zoom) {
        closeZoom();
    }
}

// 7. INITIAL LOAD
// Replace 'plans.json' with your actual main filename
loadData(' ');
