# 🛒 MITRAMART - Aplikasi Kasir Desktop

Aplikasi kasir (Point of Sales) modern berbasis Desktop yang dibangun menggunakan **Electron.js**, **Tailwind CSS**, dan **MySQL**. Proyek ini dibuat sebagai pemenuhan tugas Project Based Learning (PjBL).

## ✨ Fitur Utama
* Tampilan antarmuka (UI) modern dengan animasi interaktif.
* Sistem manajemen keranjang belanja dan perhitungan otomatis.
* Checkout dengan pilihan metode pembayaran Tunai (Cash) dan E-Wallet (QRIS).
* Pop-up cetak struk belanja.
* Fitur kelola produk (Tambah & Hapus barang).

## 🚀 Cara Menjalankan Aplikasi

Pastikan kamu sudah menginstal **Node.js** dan **XAMPP** di laptopmu.

1. **Clone Repository ini**
   Download atau clone repository ini ke laptopmu.
2. **Install Dependencies**
   Buka terminal di dalam folder proyek, lalu jalankan perintah:
   `npm install`
3. **Siapkan Database MySQL**
   * Nyalakan **Apache** dan **MySQL** di XAMPP.
   * Buka browser dan masuk ke `localhost/phpmyadmin`.
   * Buat database baru dengan nama: `minimarket_pos`.
   * Import file `minimarket_pos.sql` yang ada di folder proyek ini ke dalam database tersebut.
4. **Jalankan Aplikasi**
   Setelah database siap, kembali ke terminal proyek dan jalankan:
   `npm start`

---
*Terimakasih sudah membaca.*
