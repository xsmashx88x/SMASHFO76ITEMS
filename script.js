let currentData = [];

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
        list.innerHTML = `<div class='item-row' style="color:red">[ ERROR: ARCHIVE NOT FOUND ]</div>`;
    }
}

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

// --- NEW ZOOM FUNCTIONS ---

function openZoom() {
    const modalImgSrc = document.getElementById('modalImg').src;
    const zoomedImg = document.getElementById('zoomedImg');
    const overlay = document.getElementById('zoomOverlay');

    zoomedImg.src = modalImgSrc; // Take the source from the modal
    overlay.style.display = 'flex'; // Show the zoom screen
}

function closeZoom() {
    document.getElementById('zoomOverlay').style.display = 'none';
}

// --- UPDATED OPENDETAILS ---
// (Find your existing openDetails function and make sure the onclick is added to the image)

function openDetails(index) {
    const item = currentData[index];
    document.getElementById('modalTitle').innerText = item.name;
    
    const cacheBuster = "?t=" + new Date().getTime();
    const itemImg = document.getElementById('modalImg');
    
    // Set image and zoom function
    itemImg.src = (item.image || 'placeholder.png') + cacheBuster;
    itemImg.onclick = openZoom;

    // Build the Modal Info content
    let modalHTML = `
        <div class="modal-pricing-block">
            <div class="currency-row" style="justify-content: flex-start; margin-bottom: 8px;">
                <img src="fo76_caps.png" class="icon-red" style="width:24px;height:24px;"> 
                <span class="caps-text" style="font-size: 1.4rem;">CAPS: ${item.caps.toLocaleString()}</span>
            </div>
            <div class="currency-row" style="justify-content: flex-start; margin-bottom: 15px;">
                <img src="mtg.png" class="icon-blue" style="width:24px;height:24px;"> 
                <span class="bobble-text" style="font-size: 1.4rem;">BOBBLEHEADS: ${item.leaders || 0}</span>
            </div>
    `;

    // --- NEW: CHECK FOR ALT_VIEW ---
    if (item.alt_view) {
        modalHTML += `
            <div class="alt-view-container">
                <a href="${item.alt_view}" target="_blank" class="alt-view-btn">
                    [ ACCESS EXTERNAL DATA ARCHIVE ]
                </a>
            </div>
        `;
    }

    modalHTML += `</div>`; // Close the block
    
    document.getElementById('modalPrices').innerHTML = modalHTML;
    document.getElementById('detailModal').style.display = 'flex';
}

function filterItems() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    const filtered = currentData.filter(i => i.name.toLowerCase().includes(val));
    renderList(filtered);
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
}

// BACKUP: This listens for clicks anywhere on the screen
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    const zoom = document.getElementById('zoomOverlay');

    // If the user clicks the background of the modal, close it
    if (event.target == modal) {
        closeModal();
    }
    
    // If the user clicks the background of the zoom overlay, close it
    if (event.target == zoom) {
        closeZoom();
    }
}

// Start with plans
loadData(' ');
