let currentData = [];

// 1. DATA LOADING
async function loadData(filename) {
    const list = document.getElementById('itemList');
    // Clear search input when switching categories
    document.getElementById('searchInput').value = "";
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
    
    if (!items || items.length === 0) {
        list.innerHTML = "<div class='item-row'>[ NO MATCHING DATA FOUND ]</div>";
        return;
    }

    list.innerHTML = items.map((item, index) => {
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
                    <img src="fo76_caps.png" class="icon-red">
                </div>
                <div class="currency-row bobble-text">
                    ${item.leaders || 0} 
                    <img src="mtg.png" class="icon-blue">
                </div>
            </div>
        </div>
    `}).join('');
}

// 1. TOGGLE IMAGE SIZE (NO FULLSCREEN)
function toggleImageSize() {
    const img = document.getElementById('modalImg');
    // If it has standard size, change to expanded. If not, go back to standard.
    if (img.classList.contains('standard-size')) {
        img.classList.remove('standard-size');
        img.classList.add('expanded-size');
    } else {
        img.classList.remove('expanded-size');
        img.classList.add('standard-size');
    }
}

// 2. UPDATED OPENDETAILS
function openDetails(index) {
    const item = currentData[index];
    if (!item) return;

    document.getElementById('modalTitle').innerText = item.name;
    
    const cacheBuster = "?t=" + new Date().getTime();
    const itemImg = document.getElementById('modalImg');
    
    // Always reset image to small size when opening a new item
    itemImg.src = (item.image || 'placeholder.png') + cacheBuster;
    itemImg.className = 'standard-size'; 

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

    if (item.alt_view) {
        modalHTML += `
            <div class="alt-view-container" style="margin-top: 20px; border-top: 1px dashed #008800; padding-top: 15px;">
                <a href="${item.alt_view}" target="_blank" class="alt-view-btn">
                    [ ACCESS EXTERNAL DATA ARCHIVE ]
                </a>
            </div>
        `;
    }

    modalHTML += `</div>`; 
    document.getElementById('modalPrices').innerHTML = modalHTML;
    
    // Show the green modal
    document.getElementById('detailModal').style.display = 'flex';
}

// 3. UPDATED CLOSE (Ensures image resets for next time)
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
    document.getElementById('modalImg').className = 'standard-size';
}

// 4. CLICK OUTSIDE TO CLOSE
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    // If you click the dark area, the modal closes
    if (event.target == modal) {
        closeModal();
    }
}

// 5. SEARCH LOGIC - "CHECK EVERYTHING"
function filterItems() {
    const val = document.getElementById('searchInput').value.toLowerCase().trim();
    
    // If search is empty, show everything
    if (val === "") {
        renderList(currentData);
        return;
    }

    const filtered = currentData.filter(i => {
        const name = (i.name || "").toLowerCase();
        const description = (i.desc || "").toLowerCase();
        
        // Returns true if the search value is found in EITHER the name or description
        return name.includes(val) || description.includes(val);
    });

    renderList(filtered);
}

// 6. CLICK OUTSIDE TO CLOSE FIX
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    const zoom = document.getElementById('zoomOverlay');

    if (event.target == modal) {
        closeModal();
    }
    if (event.target == zoom) {
        closeZoom();
    }
}
// 7. INITIAL LOAD
// Replace 'plans.json' with your actual main filename
loadData(' ');
