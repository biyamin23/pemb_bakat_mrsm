# Dashboard Pembangunan Bakat Kokurikulum MRSM Kuching (Claymorphism Edition)

Sistem Pengurusan Kokurikulum digital moden berteraskan reka bentuk **Claymorphism (3D Soft Clay Dashboard)** yang direka khas untuk **Maktab Rendah Sains MARA (MRSM) Kuching** di bawah kepimpinan Timbalan Pengetua Pembangunan Bakat (TPPB), **McManus Sing**.

---

## 🎨 Ciri-Ciri Utama & Penyesuaian Fleksibel

1. **Penugasan Penasihat Fleksibel (Boleh Pegang Lebih Daripada Satu Penasihat):**
   - Guru boleh memegang kombinasi penasihat kokurikulum tanpa had rigid:
     - **Contoh (a):** 1 Penasihat Badan Beruniform + 1 Penasihat Sukan (cth: Cikgu Mohd Farhan - Kadet Polis + Bola Sepak).
     - **Contoh (b):** 1 Penasihat Badan Beruniform + 1 Penasihat Kelab (cth: Ustazah Nurul Ain - Pandu Puteri + Kelab Debat).
     - **Contoh (c):** 1 Penasihat Badan Beruniform + 1 Penasihat Kelab + 1 Penasihat SKP (cth: Cikgu Azman - KRS + Robotik + SKP).
   
2. **Auto-Fill Pintar Semasa Cipta Pelaporan Baru:**
   - Apabila guru membuka borang laporan, sistem **menapis unit penasihat secara pintar** berdasarkan data guru tersebut.
   - Pilihan interaktif melalui clay pill buttons atau dropdown.
   - Apabila unit dipilih, sistem **auto-fill serta-merta**:
     - *Kategori Kokurikulum* (Badan Beruniform / Kelab / Sukan / SKP)
     - *Nama Unit*
     - *Jenis Pelaporan* (auto-padanan kepada SKP jika unit SKP)
     - *Jumlah Keseluruhan Ahli*
     - *Disediakan Oleh* (nama guru dan no gaji yang log masuk).

3. **Pengesahan & Kepimpinan TPPB (McManus Sing):**
   - Timbalan Pengetua Pembangunan Bakat MRSM Kuching: **McManus Sing**.
   - Setiap laporan mempunyai blok tandatangan 3-peringkat dengan cop kelulusan digital rasmi `[DISAHKAN (TPPB)]` untuk simpanan fail audit atau cetakan.

3. **Modul Pelaporan Kokurikulum (Workflow 3-Peringkat):**
   - **Pertemuan Mingguan Kokurikulum** (Tarikh, Masa, Bil. Pertemuan, Kehadiran, Objektif, Aktiviti Ringkas, Gambar Dokumentasi).
   - **Pelaporan SKP** (Standard Kemahiran Pelajar / Ujian Kecekapan & Sukan).
   - **Program & Pertandingan** (Peringkat Daerah/Negeri/Kebangsaan/Antarabangsa & Senarai Pencapaian).
   - **Disediakan Oleh:** Auto-fetch automatik daripada akaun guru yang log masuk.
   - **Muat Naik Gambar Dokumentasi:** Sokongan muat naik 2-4 keping gambar terus dari peranti dengan pratonton thumbnail segera dan butang gambar contoh demo.
   - **Aliran Kelulusan:** `Draf` ➡️ `Dihantar (Semakan Penyelaras)` ➡️ `Disemak (Pengesahan TPPB)` ➡️ `Disahkan (Selesai)`.

4. **Maklumat Umum Maktab:**
   - **Takwim Kokurikulum:** Kalendar jadual tahunan mengikut tarikh, aktiviti, dan status pelaksanaan.
   - **Senarai Ahli Rumah Sukan:** Direktori carian 4 Rumah Sukan MRSM (Bendahara, Temenggung, Laksamana, Syahbandar).

5. **Rancangan Tahunan Kokurikulum (RPT):**
   - Paparan silibus perancangan mengikut minggu bagi setiap unit kokurikulum.

6. **Analisis Dashboard (Clay Visual Analytics):**
   - Taburan keahlian 3 kategori induk (Badan Beruniform, Kelab & Persatuan, Sukan & Permainan).
   - Taburan ahli mengikut 4 Rumah Sukan.
   - **Pemantauan Penghantaran Laporan Mingguan:** Jadual masa nyata memaparkan unit yang telah hantar dan senarai unit yang belum menghantar beserta butang notifikasi peringatan.

7. **Pusat Muat Turun Borang & Cetakan Rasmi (Print Preview):**
   - Repositori borang rasmi (Borang Kebenaran Ibu Bapa, Tuntutan Kokurikulum, Pendaftaran Kontinjen, Rekod SKP).
   - **Print Preview Modal:** Format surat rasmi MRSM siap cetak lengkap dengan kepala surat rasmi, perincian aktiviti, susunan gambar dokumentasi, dan petak tandatangan 3-peringkat (Guru Penasihat, Penyelaras, TPPB).

8. **Portal Pentadbir (Admin):**
   - Pendaftaran guru dan penetapan Multi-Role melalui kotak semak (*checkboxes*).
   - Penyerahan 2 unit kokurikulum bagi setiap guru.
   - Pendaftaran unit kokurikulum baharu mengikut kategori.

---

## 📱 Reka Bentuk Responsif & Mobile First (Semua Peranti)

Sistem ini dibina berasaskan metodologi **Mobile-First Progressive Enhancement**, memastikan pengalaman pengguna yang pantas, ergonomik, dan menawan di semua saiz skrin:

1. **Pengalaman Telefon Pintar (Smartphones < 768px):**
   - **Off-Canvas Sidebar Drawer:** Menu sisi tersimpan rapi dan meluncur keluar dengan animasi lembut *spring easing* serta latar kabur (*backdrop blur*) apabila menekan butang hamburger `[☰]` di bar atas.
   - **Clay Bottom Navigation Bar:** Bar navigasi bawah ergonomik dengan 5 tab capaian ibu jari (*Dashboard, Laporan, Takwim, Borang, Menu*) lengkap dengan lencana bilangan (*badge count*) notifikasi tindakan yang menunggu.
   - **Mobile Floating Action Button (FAB):** Butang terapung 3D hijau `+` di bucu bawah kanan untuk penciptaan laporan pantas dengan satu sentuhan.
   - **Kad Statistik 2-Kolum:** Susun atur kad metrik padat 2-kolum dengan angka tebal yang mudah dibaca.
   - **Modul Borang & Modal Mesra Sentuhan:** Modal mengisi laporan dan cetakan bersaiz `95vw` dengan teks input `16px` (mengelakkan zoom automatik pada iOS Safari).
   - **Pemberitahuan Leret Jadual:** Tanda panduan `👉 Leret ke tepi untuk lihat maklumat & tindakan penuh` pada jadual responsif.

2. **Pengalaman Tablet (768px - 1023px):**
   - Paparan kad laporan 2-kolum automatik, grafik analisis taburan bersebelahan, dan ruang modal yang lebih luas.

3. **Pengalaman Desktop & Komputer Riba (≥ 1024px):**
   - Susun atur dwi-panel (*dual-pane layout*): Menu sisi kekal statik di sebelah kiri dengan skrol bebas, ruang kerja utama di sebelah kanan, bar tajuk 100% lebar, kad laporan 3-kolum, serta elemen mudah alih (hamburger, bottom nav, FAB) disembunyikan secara pintar.

---

## 🔑 Data Pengguna & Nombor Gaji Demo

| Nama Pengguna | Nombor Gaji / Passcode | Peranan (Roles) | Unit Dipegang |
| :--- | :--- | :--- | :--- |
| **Pentadbir (Admin)** | Passcode: `admin123` | Pentadbir Sistem | Semua Modul Pentadbiran |
| **McManus Sing** | `G1002` | Timbalan Pengetua (TPPB) - Pengesah Utama | MRSM Kuching |
| **Cikgu Kamaruddin bin Idris** | `G1005` | Guru Penasihat + Ketua Penyelaras | Memanah, PKBM Laut |
| **Cikgu Azman bin Razak** | `G1021` | Guru Penasihat + Penyelaras Uniform | Kadet Remaja Sekolah, Robotik, SKP |
| **Ustazah Nurul Ain binti Hassan** | `G1045` | Guru Penasihat + Penyelaras Kelab | Pandu Puteri, Kelab Debat |
| **Cikgu Mohd Farhan bin Zulkifli** | `G1078` | Guru Penasihat + Penyelaras Sukan | Bola Sepak, Kelab Catur |
| **Cikgu Siti Sarah binti Osman** | `G1099` | Guru Penasihat Biasa | Pengakap, Kelab Seni, SKP |

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini menggunakan teknologi web natif (HTML5, Vanilla CSS3, JavaScript ES6) dengan sokongan penyimpanan *LocalStorage*:

1. Buka fail [index.html](file:///c:/develop/pemb_bakat_mrsm/index.html) terus di mana-mana pelayar web moden (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) atau melalui pelayan web tempatan (cth: `http://localhost:8085/index.html`).
2. Gunakan bar **Tukar Pengguna (Demo)** di bahagian atas untuk beralih peranan (Guru, Penyelaras, TPPB McManus Sing, Admin).
3. Uji responsif dengan menukar saiz tetingkap pelayar (Mobile 390px, Tablet 768px, Desktop 1280px+) atau melalui *Mobile Device Toggle* di Developer Tools pelayar anda.
4. Untuk mencuba fungsi cetakan rasmi, klik pada mana-mana laporan dan pilih **🖨️ Cetak / Print Preview**.

---

## 📊 Integrasi Database Google Sheets (Cloud Backend)

Aplikasi ini menyokong integrasi terus dengan **Google Sheets** sebagai *Cloud Relational Database* tanpa kos pelayan (serverless):

- **Struktur Helaian Automatik:** Disediakan melalui skrip [google-apps-script/Code.gs](file:///c:/develop/pemb_bakat_mrsm/google-apps-script/Code.gs) yang menjana 6 helaian pangkalan data:
  1. `Users` (Data guru, no gaji, peranan, unit dipegang)
  2. `Units` (Senarai Badan Beruniform, Kelab, Sukan, SKP)
  3. `Pelaporan` (Rekod aktiviti mingguan, kehadiran, status kelulusan, pautan gambar)
  4. `Takwim` (Jadual aktiviti tahunan maktab)
  5. `RPT` (Rancangan Pengajaran Tahunan kokurikulum)
  6. `Borang` (Repositori fail dan borang rasmi)
- **Mod Dwi-Operasi (Hybrid Offline/Online):**
  - **Luar Talian (Offline):** Menggunakan `LocalStorage` pelayar secara automatik jika belum disambungkan ke Google Sheets.
  - **Dalam Talian (Cloud Connected):** Apabila URL Web App disimpan melalui modal **🔌 Setup DB**, sebarang kemaskini laporan, pendaftaran guru/unit, takwim, RPT, dan borang akan disegerakkan terus ke Google Sheets.
- **Panduan Langkah-demi-Langkah:** Sila rujuk [PANDUAN_SETUP_GOOGLE_SHEETS.md](file:///c:/develop/pemb_bakat_mrsm/PANDUAN_SETUP_GOOGLE_SHEETS.md) untuk arahan terperinci penempatan Google Apps Script Web App.
