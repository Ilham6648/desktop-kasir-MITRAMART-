const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql2/promise');

// Koneksi ke Database MySQL
const dbConfig = {
    host: '127.0.0.1', 
    user: 'root', 
    password: '', 
    database: 'minimarket_pos'
};

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false 
        }
    });
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// --- IPC Handlers (Menangani Permintaan dari UI) ---

// Fitur Login
ipcMain.handle('login', async (event, { username, password }) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    connection.end();
    return rows.length > 0 ? { success: true, user: rows[0] } : { success: false };
});

// Mengambil Kategori
ipcMain.handle('get-categories', async () => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM categories');
    connection.end();
    return rows;
});

// Mengambil Produk berdasarkan Kategori
ipcMain.handle('get-products', async (event, categoryId) => {
    const connection = await mysql.createConnection(dbConfig);
    let query = 'SELECT * FROM products';
    let params = [];
    if (categoryId && categoryId !== 'all') {
        query += ' WHERE category_id = ?';
        params.push(categoryId);
    }
    const [rows] = await connection.execute(query, params);
    connection.end();
    return rows;
});

// Fitur Transaksi & Penjualan
ipcMain.handle('process-transaction', async (event, { userId, cart, total }) => {
    const connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();
    try {
        const [result] = await connection.execute('INSERT INTO transactions (user_id, total_amount) VALUES (?, ?)', [userId, total]);
        const transactionId = result.insertId;

        for (let item of cart) {
            await connection.execute('INSERT INTO transaction_details (transaction_id, product_id, qty, subtotal) VALUES (?, ?, ?, ?)', 
            [transactionId, item.id, item.qty, item.qty * item.price]);
            
            await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.qty, item.id]);
        }
        await connection.commit();
        connection.end();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        connection.end();
        return { success: false, error: error.message };
    }
});

// Mengambil Laporan Total Penjualan
ipcMain.handle('get-sales-report', async () => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT COUNT(id) as total_transactions, SUM(total_amount) as total_revenue FROM transactions');
    connection.end();
    return rows[0]; 
});

// Tambah Produk Sendiri
ipcMain.handle('add-product', async (event, product) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        await connection.execute(
            'INSERT INTO products (category_id, name, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
            [product.categoryId, product.name, product.price, product.stock, product.imageUrl]
        );
        connection.end();
        return { success: true };
    } catch (error) {
        connection.end();
        return { success: false, error: error.message };
    }
});

// FITUR HAPUS PRODUK (DIPERBAIKI UNTUK MENGATASI FOREIGN KEY)
ipcMain.handle('delete-product', async (event, id) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Mulai transaksi untuk memastikan keduanya terhapus atau tidak sama sekali
        await connection.beginTransaction();

        // 1. Hapus dulu data di tabel transaction_details yang memakai produk ini
        await connection.execute('DELETE FROM transaction_details WHERE product_id = ?', [id]);
        
        // 2. Baru hapus produknya dari tabel products
        await connection.execute('DELETE FROM products WHERE id = ?', [id]);
        
        // Konfirmasi perubahan
        await connection.commit();
        connection.end();
        
        return { success: true };
    } catch (error) {
        // Jika gagal, kembalikan ke kondisi semula
        await connection.rollback();
        connection.end();
        return { success: false, error: error.message };
    }
});