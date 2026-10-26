# Panduan Setup Database Google Sheets (v2)
## Dashboard Pembangunan Bakat Kokurikulum MRSM Kuching

Sistem ini menyokong **Google Sheets** sebagai pangkalan data awan (*Cloud Relational Database*) yang percuma, berkuasa, dan mudah diuruskan oleh pihak pentadbir MRSM tanpa kos pelayan (*zero server cost*).

---

## 👥 Hierarki Pengguna & Aliran Kuasa

| Peranan | Tanggungjawab & Tindakan Sistem |
| :--- | :--- |
| **1. Admin (Pentadbir)** | &bull; Daftar senarai nama guru.<br>&bull; Daftar senarai nama pelajar maktab.<br>&bull; Lantik Penyelaras bagi 4 kategori (Uniform, Sukan, Kelab, SKP). |
| **2. Penyelaras Badan Beruniform** | &bull; Cipta unit Badan Beruniform.<br>&bull; Lantik Guru Penasihat Badan Beruniform.<br>&bull; Semak laporan aktiviti uniform. |
| **3. Penyelaras Sukan & Permainan** | &bull; Cipta unit Sukan & Permainan.<br>&bull; Lantik Guru Penasihat Sukan & Permainan.<br>&bull; Semak laporan aktiviti sukan. |
| **4. Penyelaras Kelab & Persatuan** | &bull; Cipta unit Kelab & Persatuan.<br>&bull; Lantik Guru Penasihat Kelab & Persatuan.<br>&bull; Semak laporan aktiviti kelab. |
| **5. Penyelaras SKP** | &bull; Cipta unit Sekretariat Kepimpinan Pelajar (BWP, LDP, PRS, Asrama).<br>&bull; Lantik Guru Penasihat SKP.<br>&bull; Semak laporan SKP. |
| **6. Guru Penasihat** | &bull; Daftar ahli (pelajar) ke dalam unit bimbingan.<br>&bull; Key-in & simpan Rancangan Pengajaran Tahunan (RPT).<br>&bull; Hantar laporan perjumpaan mingguan / SKP. |
| **7. Pelajar Maktab** | &bull; **Wajib mempunyai 3 kokurikulum:** (1) Uniform, (2) Kelab, (3) Sukan.<br>&bull; Unit SKP hanya untuk pelajar terpilih sahaja. |
| **8. Pengesah Utama (TPPB)** | &bull; Timbalan Pengetua Pembangunan Bakat (**McManus Sing**) mengesahkan laporan akhir. |

---

## 🏗️ Struktur 7 Helaian Pangkalan Data Google Sheets

Sistem ini menggunakan **7 helaian (*sheets / tabs*)** yang dijana secara automatik oleh skrip:

| Nama Helaian | Kegunaan | Lajur-Lajur Utama (*Columns*) |
| :--- | :--- | :--- |
| **Users** | Direktori Guru, Pentadbir & Penyelaras | `id`, `no_gaji`, `nama`, `jawatan`, `roles`, `unit_ids`, `passcode` |
| **Students** | Direktori Induk Pelajar & Status Kokurikulum | `id`, `no_maktab`, `nama`, `tingkatan`, `kelas`, `jantina`, `rumah_sukan`, `uniform_id`, `kelab_id`, `sukan_id`, `skp_id`, `status_lengkap` |
| **Units** | Senarai Unit Kokurikulum (4 Kategori) | `id`, `nama`, `kategori`, `penyelaras_id`, `penasihat_ids`, `kuota`, `ahli_count` |
| **Pelaporan** | Rekod Laporan Mingguan, SKP & Program | `id`, `unit_id`, `unit_nama`, `kategori`, `jenis`, `bil_pertemuan`, `tarikh`, `masa_mula`, `masa_tamat`, `kehadiran_bil`, `kehadiran_jumlah`, `objektif`, `aktiviti`, `gambar_urls`, `disediakan_oleh_id`, `disediakan_oleh_nama`, `status`, `disemak_oleh_nama`, `ulasan_penyemak`, `disahkan_oleh_nama`, `ulasan_tppb`, `timestamp` |
| **RPT** | Rancangan Pengajaran Tahunan (Format Standard) | `id`, `unit_id`, `unit_nama`, `bil`, `minggu`, `aktiviti`, `objektif`, `tarikh`, `status` |
| **Takwim** | Jadual Aktiviti Tahunan Maktab | `id`, `tarikh`, `hari`, `masa`, `aktiviti`, `kategori`, `lokasi`, `status` |
| **Borang** | Repositori Borang Rasmi Maktab | `id`, `kod`, `tajuk`, `kategori`, `format`, `saiz`, `tarikh`, `muatnaik_oleh` |

> [!IMPORTANT]
> **Format Standard RPT:** Mengandungi 5 lajur utama seperti yang ditetapkan: **1. Bil.**, **2. Minggu**, **3. Aktiviti**, **4. Objektif**, dan **5. Tarikh**. Templat 12 minggu dibekalkan sedia ada dan cikgu hanya perlu isi serta klik **Simpan**.

---

## 📋 Langkah Demi Langkah Setup

### Langkah 1: Cipta Google Spreadsheet Baharu
1. Layari [Google Sheets](https://sheets.new) di pelayar web anda.
2. Namakan spreadsheet sebagai: **`Database Pembangunan Bakat MRSM Kuching`**.

---

### Langkah 2: Buka Apps Script Editor
1. Di menu Google Sheets, klik **Extensions** (Sambungan) > **Apps Script**.
2. Namakan projek sebagai **`MRSM_Kuching_Talent_API`**.

---

### Langkah 3: Masukkan Kod Backend API
1. Buka fail [`google-apps-script/Code.gs`](file:///c:/develop/pemb_bakat_mrsm/google-apps-script/Code.gs).
2. Salin keseluruhan kod fail tersebut.
3. Padam sebarang kod sedia ada dalam editor Apps Script, kemudian **Tampal (Paste)** kod tadi.
4. Klik ikon **Simpan (Save / Ctrl + S)** 💾.

---

### Langkah 4: Jalankan Fungsi `initDatabase` (Satu Klik Sahaja)
1. Di bar atas editor Apps Script, pilih fungsi: **`initDatabase`**.
2. Klik butang **Run** ▶️.
3. Berikan kebenaran (*Review Permissions* > pilih akaun Google > *Advanced* > *Go to MRSM_Kuching_Talent_API* > *Allow*).
4. Selepas selesai (*Execution completed*), buka semula Google Sheets anda:
   - Anda akan melihat **7 helaian (Users, Students, Units, Pelaporan, RPT, Takwim, Borang)** telah siap diwujudkan lengkap dengan pengepala lajur dan data awal MRSM Kuching!

---

### Langkah 5: *Deploy* Sebagai Web App API
1. Di penjuru atas kanan editor Apps Script, klik **Deploy** > **New deployment**.
2. Pilih jenis gear ⚙️: **Web app**.
3. Tetapkan:
   - **Description:** `MRSM Kuching Talent DB API v2`
   - **Execute as:** `Me (emel anda)`
   - **Who has access:** `Anyone` *(Penting bagi mengelakkan halangan CORS).*
4. Klik **Deploy** dan salin **Web app URL** (berakhir dengan `/exec`).

---

### Langkah 6: Sambungkan ke Dashboard
1. Buka dashboard anda di pelayar web.
2. Klik butang **`🔌 Setup DB`** di bar atas.
3. Tampal URL Web App tadi, tekan **🧪 Uji Sambungan**, dan klik **💾 Simpan Sambungan**.
