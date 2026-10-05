# Lift Log

Aplikasi gym HTML, CSS, dan JavaScript. Catatan disimpan di localStorage.

## Jalankan lokal
Ekstrak ZIP, lalu jalankan dari folder project:

    python3 -m http.server 8080

Buka http://localhost:8080. Tidak perlu npm atau database.

## Deploy Vercel
Upload project ke repository GitHub, import ke Vercel, pilih Framework Preset: Other.
Build Command: kosong. Output Directory: . (root project).

## Deploy Netlify
Drag folder berisi index.html ke Netlify Deploy.

## File
- index.html: halaman aplikasi
- style.css: styling responsif
- app.js: plan dan pencatatan latihan
- favicon.svg: ikon

Data terikat pada browser dan domain. Riwayat situs sebelumnya tidak otomatis pindah ke domain baru. Menghapus data browser menghapus riwayat. Google Fonts memerlukan internet; font sistem menjadi fallback.
