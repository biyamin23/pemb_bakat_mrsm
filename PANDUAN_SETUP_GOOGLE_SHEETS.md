# Panduan Setup Database Google Sheets
## Dashboard Pembangunan Bakat Kokurikulum MRSM Kuching

Sistem ini menyokong **Google Sheets** sebagai pangkalan data awan (*Cloud Database*) yang percuma, berkuasa, dan mudah diuruskan oleh pihak pentadbir MRSM tanpa kos pelayan (*zero server cost*).

---

## 🏗️ Struktur Pangkalan Data Google Sheets

Sistem ini menggunakan 6 helaian (*sheets / tabs*) utama yang dijana secara automatik:

| Nama Helaian | Kegunaan | Lajur-Lajur Utama (*Columns*) |
| :--- | :--- | :--- |
| **Users** | Direktori Guru & Pentadbir | `id`, `no_gaji`, `nama`, `jawatan`, `roles`, `unit_ids`, `passcode` |
| **Units** | Senarai Unit Kokurikulum | `id`, `nama`, `kategori`, `ahli`, `penasihat_ids`, `kuota` |
| **Pelaporan** | Rekod Pelaporan Kokurikulum & SKP | `id`, `unit_id`, `unit_nama`, `kategori`, `jenis`, `bil_pertemuan`, `tarikh`, `masa_mula`, `masa_tamat`, `kehadiran_bil`, `kehadiran_jumlah`, `objektif`, `aktiviti`, `gambar_urls`, `disediakan_oleh_id`, `disediakan_oleh_nama`, `status`, `disemak_oleh_nama`, `ulasan_penyemak`, `disahkan_oleh_nama`, `ulasan_tppb`, `timestamp` |
| **Takwim** | Jadual Tahunan Maktab | `id`, `aktiviti`, `tarikh`, `tempat`, `kategori`, `status` |
| **RPT** | Rancangan Pengajaran Tahunan | `id`, `unit_id`, `unit_nama`, `minggu`, `topik`, `objektif`, `aktiviti`, `catatan` |
| **Borang** | Repositori Borang Rasmi Maktab | `id`, `kod`, `tajuk`, `format`, `saiz`, `kategori`, `tarikh`, `url` |

---

## 📋 Langkah Demi Langkah Setup (Mudah & Pantas)

### Langkah 1: Cipta Google Spreadsheet Baharu
1. Layari [Google Sheets](https://sheets.new) di pelayar web anda dengan akaun Google anda.
2. Namakan spreadsheet anda sebagai: **`Database Pembangunan Bakat MRSM Kuching`**.

---

### Langkah 2: Buka Google Apps Script Editor
1. Di bahagian menu atas Google Sheets, klik **Extensions** (Sambungan) > **Apps Script**.
2. Satu tetingkap editor kod Google Apps Script akan dibuka.
3. Namakan projek Apps Script sebagai **`MRSM_Kuching_Talent_API`**.

---

### Langkah 3: Masukkan Kod Backend API
1. Buka fail [`google-apps-script/Code.gs`](file:///c:/develop/pemb_bakat_mrsm/google-apps-script/Code.gs) yang disediakan dalam repositori ini.
2. Salin keseluruhan kod fail tersebut.
3. Padam sebarang kod sedia ada dalam fail `Code.gs` di editor Google Apps Script, kemudian **Tampal (Paste)** kod tadi.
4. Klik ikon **Simpan (Save / Ctrl + S)** 💾.

---

### Langkah 4: Jalankan Fungsi `initDatabase` (Satu Klik Sahaja)
1. Di bahagian atas editor Apps Script, cari menu *dropdown* fungsi (bersebelahan butang "Debug" & "Run").
2. Pilih fungsi: **`initDatabase`**.
3. Klik butang **Run** (Jalankan) ▶️.
4. **Memberi Kebenaran (*Authorization*):**
   - Google akan meminta kebenaran akaun: Klik *Review permissions*.
   - Pilih akaun Google anda.
   - Jika keluar paparan amaran *Google hasn't verified this app*, klik **Advanced** > klik **Go to MRSM_Kuching_Talent_API (unsafe)**.
   - Klik **Allow** (Benarkan).
5. Selepas fungsi selesai dijalankan (*Execution completed*), buka semula Google Sheets anda:
   - Anda akan melihat **6 helaian (Users, Units, Pelaporan, Takwim, RPT, Borang)** telah siap diwujudkan dengan kepala lajur berwarna dan data awal MRSM Kuching!

---

### Langkah 5: *Deploy* Sebagai Web App API
1. Di penjuru atas kanan editor Apps Script, klik butang biru **Deploy** > **New deployment**.
2. Klik ikon gear ⚙️ (*Select type*) di sebelah kiri dan pilih **Web app**.
3. Isikan tetapan berikut (**PENTING**):
   - **Description:** `MRSM Kuching Talent DB API v1`
   - **Execute as:** `Me (emel anda)`
   - **Who has access:** `Anyone` *(PENTING: Pilih "Anyone" supaya Dashboard web app boleh menghantar dan mengambil data tanpa isu kebenaran/CORS).*
4. Klik butang **Deploy**.
5. Salin URL yang tertera di bahagian **Web app URL** (URL ini berakhir dengan `/exec`):
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

### Langkah 6: Masukkan URL ke Dalam Dashboard
1. Buka aplikasi web **Dashboard Pembangunan Bakat MRSM Kuching**.
2. Klik butang **🔌 Setup Database** di bar atas atau di menu Pentadbiran.
3. Tampal URL Web App yang anda salin tadi ke dalam ruangan input.
4. Klik **🧪 Uji Sambungan**: Sistem akan mengesahkan status sambungan (`🟢 Sambungan Berjaya`).
5. Klik **🔄 Segerakkan Data Sekarang**: Semua rekod pengguna, unit, dan pelaporan terkini akan diselaraskan dengan Google Sheets!
6. Klik **💾 Simpan Tetapan**.

---

## 🛡️ Ciri Keselamatan & Mod Luar Talian (Offline Fallback)

- **Sentiasa Berfungsi:** Jika peranti anda tiada sambungan internet atau Google Sheets belum disetup, sistem secara automatik menggunakan *LocalStorage* tempatan sebagai sandaran selamat.
- **Tiada Kehilangan Data:** Sebarang pelaporan baru atau kemaskini akan disimpan secara tempatan terlebih dahulu, dan dihantar secara asinkronus ke Google Sheets sebaik sahaja disambungkan.
- **Semakan & Audit TPPB:** Timbalan Pengetua (McManus Sing) atau Penyelaras boleh membuka terus Google Spreadsheet untuk mencetak, mengeksport ke Excel, atau membuat audit data bila-bila masa.
