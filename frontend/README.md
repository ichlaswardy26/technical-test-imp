# Frontend CRUD Post — Technical Test

Frontend ini dibangun menggunakan **Next.js** dan **React** untuk mengelola data postingan (Create, Read, Update, Delete) melalui integrasi dengan **API Backend**.

## 🚀 Fitur Utama

- Menampilkan daftar postingan dari API
- Membuat postingan baru
- Mengedit postingan
- Menghapus postingan
- Validasi form input
- Terintegrasi penuh dengan REST API
- Menggunakan **DaisyUI** untuk komponen antarmuka yang modern dan responsif

## 🧰 Teknologi yang Digunakan

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Axios](https://axios-http.com/)
- [ESLint](https://eslint.org/)
- [PostCSS](https://postcss.org/)

## 📦 Instalasi & Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/ichlaswardy26/technical-test-imp.git
cd technical-test-imp/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variable

Buat file `.env.local` di root folder dengan isi seperti berikut:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api-domain.com
```

> Ganti `https://api-domain.com` dengan URL backend API yang sesuai.

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka di browser: [http://localhost:3000](http://localhost:3000)

---

## 🧩 Struktur Folder

```
src/
├── app/               # Halaman utama Next.js (app router)
├── components/        # Komponen UI (menggunakan DaisyUI)
├── services/          # File konfigurasi axios / API calls
├── styles/            # File CSS / Tailwind config
└── utils/             # Helper / fungsi utilitas
```

---

## 🔗 Integrasi API

Aplikasi ini berkomunikasi dengan backend melalui endpoint RESTful API:

| Method | Endpoint | Deskripsi |
|:-------|:----------|:-----------|
| GET | `/posts` | Mengambil daftar postingan |
| GET | `/posts/:id` | Mengambil detail postingan |
| POST | `/posts` | Menambahkan postingan baru |
| PUT | `/posts/:id` | Memperbarui postingan |
| DELETE | `/posts/:id` | Menghapus postingan |

---

## 🧪 Perintah Tambahan

| Perintah | Fungsi |
|-----------|--------|
| `npm run lint` | Mengecek kesalahan kode |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan build hasil production |

---

## 👨‍💻 Kontributor

Dibuat oleh **Ichlas Wardy** untuk keperluan **Technical Test - IMP**.  
Project ini bersifat open-source dan dapat dikembangkan lebih lanjut.

---

## 📄 Lisensi

MIT License © 2025 Ichlas Wardy
