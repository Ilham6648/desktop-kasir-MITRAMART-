const { ipcRenderer } = require('electron');

let currentUser = null;
let cart = [];
let currentCategoryId = 'all';
let currentProducts = []; 
let productIdToDelete = null; 

const formatRp = (angka) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
}).format(angka);

function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const msgEl = document.getElementById('toast-msg');

    msgEl.innerText = msg;
    
    if (isError) {
        toast.className = 'fixed top-8 right-8 bg-rose-500 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-x-0 opacity-100 z-[100]';
        icon.className = 'fa-solid fa-circle-exclamation text-xl';
    } else {
        toast.className = 'fixed top-8 right-8 bg-emerald-500 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-x-0 opacity-100 z-[100]';
        icon.className = 'fa-solid fa-check-circle text-xl';
    }

    setTimeout(() => {
        toast.className = 'fixed top-8 right-8 bg-emerald-500 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 transition-all duration-500 transform translate-x-[150%] opacity-0 z-[100] pointer-events-none';
    }, 3000);
}

async function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    const response = await ipcRenderer.invoke('login', { username: user, password: pass });
    if (response.success) {
        currentUser = response.user;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'flex';
        document.getElementById('kasir-name').innerText = `Kasir: ${currentUser.username}`;
        loadCategories();
        loadProducts('all');
    } else {
        showToast('Username atau Password salah!', true);
    }
}

async function loadCategories() {
    const categories = await ipcRenderer.invoke('get-categories');
    const list = document.getElementById('category-list');
    list.innerHTML = '';
    
    const allBtn = document.createElement('li');
    allBtn.className = `px-4 py-3 rounded-xl cursor-pointer font-bold flex items-center gap-3 transition-all transform hover:translate-x-2 ${currentCategoryId === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;
    allBtn.innerHTML = `<i class="fa-solid fa-border-all w-5"></i> Semua Produk`;
    allBtn.onclick = () => { 
        currentCategoryId = 'all'; 
        document.getElementById('search-input').value = ''; 
        loadCategories(); loadProducts('all'); 
    };
    list.appendChild(allBtn);
    
    const icons = { 1: 'fa-burger', 2: 'fa-mug-hot', 3: 'fa-box' };

    categories.forEach(c => {
        const li = document.createElement('li');
        const iconClass = icons[c.id] || 'fa-tag';
        const isActive = currentCategoryId === c.id;
        
        li.className = `px-4 py-3 mt-1 rounded-xl cursor-pointer font-bold flex items-center gap-3 transition-all transform hover:translate-x-2 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;
        li.innerHTML = `<i class="fa-solid ${iconClass} w-5"></i> ${c.name}`;
        li.onclick = () => { 
            currentCategoryId = c.id; 
            document.getElementById('search-input').value = ''; 
            loadCategories(); loadProducts(c.id); 
        };
        list.appendChild(li);
    });
}

function handleImageError(element) {
    element.outerHTML = '<div class="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400"><i class="fa-solid fa-image text-4xl mb-2 opacity-40"></i><span class="text-xs font-bold uppercase tracking-wider">Tanpa Foto</span></div>';
}

async function loadProducts(categoryId) {
    currentProducts = await ipcRenderer.invoke('get-products', categoryId);
    renderProducts(currentProducts);
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if(products.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-16 text-slate-400 font-medium text-lg anim-pop-in"><i class="fa-solid fa-box-open text-4xl mb-3 opacity-50"></i><br>Tidak ada produk ditemukan.</div>`;
        return;
    }

    // ANIMASI KASKADE: Tambahkan index ke loop untuk membuat jeda waktu berurutan
    products.forEach((p, index) => {
        const imgHTML = p.image_url 
            ? `<img src="${p.image_url}" alt="${p.name}" onerror="handleImageError(this)" class="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500">`
            : `<div class="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400"><i class="fa-solid fa-image text-4xl mb-2 opacity-40"></i><span class="text-xs font-bold uppercase tracking-wider">Tanpa Foto</span></div>`;

        const div = document.createElement('div');
        // Tambahkan anim-slide-up agar produk muncul melayang
        div.className = 'anim-slide-up group bg-white rounded-3xl shadow-md hover:shadow-xl cursor-pointer border border-slate-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 relative flex flex-col h-full';
        
        // Atur jeda animasi agar muncul bergantian
        div.style.animationDelay = `${index * 0.05}s`;
        
        div.innerHTML = `
            <button onclick="confirmDeleteProduct(${p.id}, event)" class="absolute top-3 right-3 bg-white/90 backdrop-blur text-rose-500 hover:text-white hover:bg-rose-500 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all z-20 opacity-0 group-hover:opacity-100 transform hover:scale-110">
                <i class="fa-solid fa-trash text-sm"></i>
            </button>

            <div class="relative h-56 overflow-hidden bg-white flex-shrink-0 border-b border-slate-100">
                ${imgHTML}
                <div class="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition duration-300 flex items-center justify-center">
                    <div class="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl pointer-events-none">
                        <i class="fa-solid fa-plus mr-1"></i> Pilih
                    </div>
                </div>
            </div>
            <div class="p-6 flex flex-col flex-1 justify-between bg-white group-hover:bg-indigo-50/30 transition-colors">
                <h4 class="font-bold text-slate-800 text-xl mb-3 leading-tight line-clamp-2">${p.name}</h4>
                <div class="flex flex-col mt-auto gap-2">
                    <p class="text-indigo-600 font-black text-2xl tracking-tight">${formatRp(p.price)}</p>
                    <div class="flex justify-start">
                        <span class="bg-emerald-50 text-emerald-600 text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider border border-emerald-200 shadow-sm">
                            Sisa Stok: ${p.stock}
                        </span>
                    </div>
                </div>
            </div>
        `;
        div.onclick = () => addToCart(p.id, p.name, p.price);
        grid.appendChild(div);
    });
}

function confirmDeleteProduct(id, event) {
    event.stopPropagation();
    productIdToDelete = id;
    document.getElementById('delete-confirm-modal').style.display = 'flex';
}

function closeDeleteConfirm() {
    productIdToDelete = null;
    document.getElementById('delete-confirm-modal').style.display = 'none';
}

async function executeDeleteProduct() {
    if (!productIdToDelete) return;
    
    const response = await ipcRenderer.invoke('delete-product', productIdToDelete);
    if (response.success) {
        closeDeleteConfirm();
        showToast('Produk berhasil dihapus dari database!');
        loadProducts(currentCategoryId); 
    } else {
        closeDeleteConfirm();
        showToast('Gagal menghapus: ' + response.error, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-confirm-delete').addEventListener('click', executeDeleteProduct);
});

function searchProducts() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    const filtered = currentProducts.filter(p => p.name.toLowerCase().includes(keyword));
    renderProducts(filtered);
}

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, name, price, qty: 1 });
    
    // Memberikan efek denyut (pulse) sebentar ke badge keranjang
    const badge = document.getElementById('cart-badge');
    badge.classList.add('scale-125');
    setTimeout(() => badge.classList.remove('scale-125'), 200);
    
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    
    let totalItems = 0;
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="h-full flex flex-col justify-center items-center text-slate-400 space-y-3 anim-pop-in">
                <i class="fa-solid fa-basket-shopping text-4xl opacity-20 animate-bounce"></i>
                <p class="text-sm font-medium">Keranjang masih kosong</p>
            </div>`;
        badge.innerText = '0 Item';
        document.getElementById('total-price').innerText = 'Rp 0';
        calculateChange();
        return;
    }

    cartContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        totalItems += item.qty;
        
        const div = document.createElement('div');
        // ANIMASI SLIDE IN: Barang keranjang meluncur dari kanan
        div.className = 'anim-slide-right bg-white p-3.5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative flex justify-between items-center group hover:shadow-md transition-shadow';
        div.style.animationDelay = `${index * 0.05}s`;

        div.innerHTML = `
            <div class="w-3/4">
                <p class="font-bold text-slate-800 text-sm leading-tight mb-1 truncate group-hover:text-indigo-600 transition-colors">${item.name}</p>
                <span class="font-black text-indigo-600 text-sm">${formatRp(subtotal)}</span>
            </div>
            <div class="flex flex-col items-end gap-1">
                <button onclick="removeFromCart(${index}); event.stopPropagation();" class="text-slate-300 hover:text-rose-500 text-xs transition-transform transform hover:scale-125 p-1">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <div class="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-bold border border-slate-200">
                    ${item.qty}x
                </div>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    badge.innerText = `${totalItems} Item`;
    document.getElementById('total-price').innerText = formatRp(total);
    calculateChange();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function togglePaymentMethod() {
    const method = document.getElementById('payment-method').value;
    const cashArea = document.getElementById('cash-area');
    const qrisArea = document.getElementById('qris-area');

    if (method === 'qris') {
        cashArea.style.display = 'none';
        qrisArea.style.display = 'block';
    } else {
        cashArea.style.display = 'block';
        qrisArea.style.display = 'none';
    }
}

function calculateChange() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const inputBayar = document.getElementById('input-bayar');
    const bayar = inputBayar ? (parseFloat(inputBayar.value) || 0) : 0;
    const kembalian = bayar - total;
    
    const kembalianEl = document.getElementById('kembalian-text');
    if (kembalianEl) {
        if (kembalian < 0 && bayar > 0) {
            kembalianEl.innerText = "Uang Kurang!";
            kembalianEl.className = 'text-lg font-extrabold text-rose-500 transition-colors duration-300';
        } else {
            kembalianEl.innerText = formatRp(kembalian);
            kembalianEl.className = 'text-lg font-extrabold text-slate-800 transition-colors duration-300';
        }
    }
}

async function checkout() {
    if (cart.length === 0) return showToast('Keranjang kosong!', true);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const method = document.getElementById('payment-method').value;
    
    let bayar = 0; let kembalian = 0;

    if (method === 'cash') {
        const inputBayar = document.getElementById('input-bayar');
        bayar = inputBayar ? (parseFloat(inputBayar.value) || 0) : 0;
        kembalian = bayar - total;

        if (bayar < total) return showToast('Uang pembayaran kurang dari total belanja!', true);
    } else if (method === 'qris') {
        bayar = total; kembalian = 0;
    }

    const response = await ipcRenderer.invoke('process-transaction', { userId: currentUser.id, cart, total });

    if (response.success) {
        printReceipt(total, bayar, kembalian, method);
        
        cart = []; 
        const inputBayar = document.getElementById('input-bayar');
        if (inputBayar) inputBayar.value = '';
        
        document.getElementById('payment-method').value = 'cash';
        togglePaymentMethod();
        
        updateCartUI();
        loadProducts(currentCategoryId); 
    } else {
        showToast('Terjadi kesalahan database: ' + response.error, true);
    }
}

function printReceipt(total, bayar, kembalian, method) {
    let receiptHTML = `
        <div id="receipt-content" class="anim-pop-in">
            <div style="text-align: center; margin-bottom: 16px;">
                <h2 style="margin:0; font-size: 20px; font-weight: 800; font-family: 'Poppins', sans-serif;">MITRAMART</h2>
                <p style="margin:2px 0 0 0; font-size: 11px; color: #64748b; font-family: 'Poppins', sans-serif;">Jl. Raya Banten No. 123</p>
                <div style="margin-top: 10px; font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; padding: 5px 0;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Kasir: ${currentUser.username}</span>
                        <span>${new Date().toLocaleDateString('id-ID')}</span>
                    </div>
                </div>
            </div>
    `;

    cart.forEach(item => {
        receiptHTML += `
            <div style="font-size: 13px; margin-bottom: 8px;">
                <div style="font-weight: bold; margin-bottom: 2px;">${item.name}</div>
                <div style="display: flex; justify-content: space-between; color: #475569;">
                    <span>${item.qty} x ${formatRp(item.price)}</span>
                    <span style="font-weight: bold; color: #0f172a;">${formatRp(item.price * item.qty)}</span>
                </div>
            </div>
        `;
    });

    const namaMetode = method === 'qris' ? 'QRIS / E-Wallet' : 'TUNAI';

    receiptHTML += `
            <hr style="border-top: 2px dashed #0f172a; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 900; margin-bottom: 10px;">
                <span>TOTAL</span>
                <span>${formatRp(total)}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 5px; color: #475569;">
                <span>Metode Bayar</span>
                <span style="font-weight: bold;">${namaMetode}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 5px; color: #475569;">
                <span>Bayar/Tunai</span>
                <span>${formatRp(bayar)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 5px; color: #475569;">
                <span>Kembali</span>
                <span>${formatRp(kembalian)}</span>
            </div>
            
            <hr style="border-top: 1px dashed #cbd5e1; margin: 15px 0;">
            <div style="text-align: center; font-size: 11px; color: #64748b; font-family: 'Poppins', sans-serif;">
                <p style="margin: 0; font-weight: bold; color: #0f172a;">Terima Kasih!</p>
                <p style="margin: 4px 0 0 0;">Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.</p>
            </div>
            
            <button onclick="closeReceipt()" style="width: 100%; margin-top: 20px; padding: 12px; background-color: #4f46e5; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.3s;" onmouseover="this.style.backgroundColor='#4338ca'" onmouseout="this.style.backgroundColor='#4f46e5'">Tutup Struk</button>
        </div>
    `;

    const receiptArea = document.getElementById('receipt-area');
    if(receiptArea) {
        receiptArea.innerHTML = receiptHTML;
        receiptArea.style.display = 'flex'; 
    }
}

function closeReceipt() { document.getElementById('receipt-area').style.display = 'none'; }

async function showSales() {
    const report = await ipcRenderer.invoke('get-sales-report');
    document.getElementById('sales-count').innerText = report.total_transactions || 0;
    document.getElementById('sales-revenue').innerText = formatRp(report.total_revenue || 0);
    document.getElementById('sales-modal').style.display = 'flex';
}

function closeSales() { document.getElementById('sales-modal').style.display = 'none'; }
function showAddProduct() { document.getElementById('add-product-modal').style.display = 'flex'; }
function closeAddProduct() { document.getElementById('add-product-modal').style.display = 'none'; }

async function saveProduct() {
    const name = document.getElementById('new-name').value;
    const price = document.getElementById('new-price').value;
    const stock = document.getElementById('new-stock').value;
    const categoryId = document.getElementById('new-category').value;
    const fileInput = document.getElementById('new-image');

    if(!name || !price || !stock) return showToast('Harap isi Nama, Harga, dan Stok!', true);

    let imageUrl = '';
    if (fileInput.files.length > 0) {
        imageUrl = 'file:///' + fileInput.files[0].path.replace(/\\/g, '/');
    }

    const product = { name, price, stock, categoryId, imageUrl };

    const response = await ipcRenderer.invoke('add-product', product);
    if(response.success) {
        closeAddProduct();
        
        document.getElementById('new-name').value = '';
        document.getElementById('new-price').value = '';
        document.getElementById('new-stock').value = '';
        fileInput.value = '';

        loadProducts(currentCategoryId);
        
        showToast('Produk berhasil ditambahkan!');
        document.getElementById('search-input').focus();
    } else {
        showToast('Gagal menyimpan produk: ' + response.error, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.handleLogin = handleLogin;
    window.loadCategories = loadCategories;
    window.loadProducts = loadProducts;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.checkout = checkout;
    window.calculateChange = calculateChange;
    window.closeReceipt = closeReceipt;
    window.togglePaymentMethod = togglePaymentMethod;
    window.showSales = showSales;
    window.closeSales = closeSales;
    window.showAddProduct = showAddProduct;
    window.closeAddProduct = closeAddProduct;
    window.saveProduct = saveProduct;
    window.searchProducts = searchProducts; 
    window.handleImageError = handleImageError; 
    window.confirmDeleteProduct = confirmDeleteProduct; 
    window.closeDeleteConfirm = closeDeleteConfirm; 
});