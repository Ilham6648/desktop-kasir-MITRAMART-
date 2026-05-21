-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 21 Bulan Mei 2026 pada 17.21
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minimarket_pos`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Makanan'),
(2, 'Minuman'),
(3, 'Kebutuhan Sehari-hari');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `image_url`, `stock`) VALUES
(16, 1, 'mie instan', 3000.00, 'file:///C:/Users/ASUS/OneDrive/Dokumen/MitraMart/indomie.png', 23),
(18, 2, 'teh pucuk', 3500.00, 'file:///C:/Users/ASUS/OneDrive/Dokumen/MitraMart/tehpucuk.png', 27),
(20, 2, 'susu', 7000.00, 'file:///C:/Users/ASUS/OneDrive/Dokumen/MitraMart/susu.png', 41),
(21, 1, 'Roma Kelapa', 10000.00, 'file:///C:/Users/ASUS/OneDrive/Dokumen/MitraMart/roma.png', 30),
(22, 1, 'Roti', 8000.00, 'file:///C:/Users/ASUS/OneDrive/Dokumen/MitraMart/sariroti.png', 28),
(23, 2, 'Aqua', 5000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/aqua_air-mineral-aqua-600-ml-botol_full02.webp', 30),
(24, 3, 'Pasta gigi ciptadent', 4000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/7ca30df44230e2dd872ac00d9c810cdc.jpg_720x720q80.jpg', 35),
(25, 3, 'sabun cuci tangan', 25000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/116518850.avif', 24),
(26, 3, 'sampo', 12000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/124597262.avif', 18),
(27, 3, 'sabun cuci muka', 28000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/sabun-wajah-pria-untuk-kulit-lebih-bersih-sehat-dan-bersinar-3-alodokter.avif', 30),
(28, 2, 'nescaffe ', 8000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/f679cf42-9b09-44e1-9756-2a21a86e0499.jpg~tplv-aphluv4xwc-resize-jpeg_700_0.jpg', 27),
(29, 3, 'sabun ', 6000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/lux-sabun-mandi-batang-white-velvet-jasmine-bar-7570g-99989.png', 13),
(30, 3, 'Sabun lantai', 15000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/images.jpeg', 15),
(35, 2, 'cocacola', 5000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/ProductCocacolabtl390ml.jpg', 26),
(36, 1, 'roti', 3000.00, 'file:///C:/Users/ASUS/OneDrive/Gambar/3041369.webp', 11);

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `total_amount`, `transaction_date`) VALUES
(1, 1, 8000.00, '2026-05-06 13:14:20'),
(2, 1, 21000.00, '2026-05-06 13:14:34'),
(3, 1, 21000.00, '2026-05-06 13:22:12'),
(4, 1, 13000.00, '2026-05-06 13:30:03'),
(5, 1, 13000.00, '2026-05-06 13:43:37'),
(6, 1, 11000.00, '2026-05-06 14:55:55'),
(7, 1, 8000.00, '2026-05-06 15:10:55'),
(8, 1, 16000.00, '2026-05-06 15:17:09'),
(9, 1, 48000.00, '2026-05-06 15:30:02'),
(10, 1, 13000.00, '2026-05-06 15:31:03'),
(11, 1, 8000.00, '2026-05-06 15:47:01'),
(12, 1, 8000.00, '2026-05-06 15:59:53'),
(13, 1, 11000.00, '2026-05-07 01:30:43'),
(14, 1, 23000.00, '2026-05-07 03:36:45'),
(15, 1, 17800.00, '2026-05-07 07:40:45'),
(16, 1, 25000.00, '2026-05-07 07:46:57'),
(17, 1, 20000.00, '2026-05-07 07:57:07'),
(18, 1, 10000.00, '2026-05-07 08:10:28'),
(19, 1, 23000.00, '2026-05-21 14:48:10'),
(20, 1, 5000.00, '2026-05-21 14:58:31'),
(21, 1, 5000.00, '2026-05-21 14:58:40'),
(22, 1, 3000.00, '2026-05-21 15:04:40');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaction_details`
--

CREATE TABLE `transaction_details` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaction_details`
--

INSERT INTO `transaction_details` (`id`, `transaction_id`, `product_id`, `qty`, `subtotal`) VALUES
(1, 1, 2, 1, 8000.00),
(2, 2, 2, 2, 16000.00),
(3, 2, 1, 1, 5000.00),
(4, 3, 2, 2, 16000.00),
(5, 3, 1, 1, 5000.00),
(6, 4, 2, 1, 8000.00),
(7, 4, 1, 1, 5000.00),
(8, 5, 2, 1, 8000.00),
(9, 5, 1, 1, 5000.00),
(10, 6, 2, 1, 8000.00),
(11, 6, 3, 1, 3000.00),
(12, 7, 1, 1, 5000.00),
(13, 7, 3, 1, 3000.00),
(14, 8, 1, 1, 5000.00),
(15, 8, 2, 1, 8000.00),
(16, 8, 3, 1, 3000.00),
(17, 9, 4, 1, 45000.00),
(18, 9, 3, 1, 3000.00),
(19, 10, 2, 1, 8000.00),
(20, 10, 1, 1, 5000.00),
(21, 11, 3, 1, 3000.00),
(22, 11, 1, 1, 5000.00),
(23, 12, 1, 1, 5000.00),
(24, 12, 3, 1, 3000.00),
(25, 13, 2, 1, 8000.00),
(26, 13, 3, 1, 3000.00),
(28, 14, 16, 1, 3000.00),
(29, 15, 33, 1, 17800.00),
(30, 16, 25, 1, 25000.00),
(32, 18, 35, 2, 10000.00),
(34, 19, 16, 1, 3000.00),
(35, 20, 35, 1, 5000.00),
(36, 21, 35, 1, 5000.00),
(37, 22, 36, 1, 3000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'kasir'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', 'admin12', 'kasir');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `transaction_details`
--
ALTER TABLE `transaction_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD CONSTRAINT `transaction_details_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`),
  ADD CONSTRAINT `transaction_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
