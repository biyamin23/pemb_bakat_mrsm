// ==========================================================================
// DATA MOCK & INITIAL STORAGE - DASHBOARD PEMBANGUNAN BAKAT MRSM KUCHING
// ==========================================================================

const INITIAL_DATA = {
  maktab: {
    nama: "Maktab Rendah Sains MARA Kuching",
    singkatan: "MRSM Kuching",
    tppb: "McManus Sing",
    jawatan_tppb: "Timbalan Pengetua Pembangunan Bakat (TPPB)",
    tahun_sesi: "2026/2027"
  },

  // Senarai Guru & Pentadbir Maktab
  // Fleksibel: Seorang guru boleh memegang lebih daripada satu unit penasihat
  // Contoh: Uniform + Sukan, Uniform + Kelab, Uniform + Kelab + SKP, dsb.
  users: [
    {
      id: "usr_admin",
      no_gaji: "ADMIN",
      nama: "Pentadbir Kokurikulum MRSM Kuching",
      email: "admin.kuching@mrsm.edu.my",
      passcode: "admin123",
      roles: ["admin"],
      units: []
    },
    {
      id: "usr_1002",
      no_gaji: "G1002",
      nama: "McManus Sing",
      jawatan: "Timbalan Pengetua Pembangunan Bakat (TPPB)",
      email: "mcmanus.sing@mrsm.edu.my",
      roles: ["tppb"],
      units: []
    },
    {
      id: "usr_1021",
      no_gaji: "G1021",
      nama: "Cikgu Azman bin Razak",
      jawatan: "Penyelaras Badan Beruniform",
      email: "azman.kuching@mrsm.edu.my",
      roles: ["guru", "penyemak_uniform"],
      // Contoh (c): 1 Uniform + 1 Kelab + 1 SKP
      units: ["unit_uniform_krs", "unit_kelab_robotik", "unit_skp_uniform"]
    },
    {
      id: "usr_1045",
      no_gaji: "G1045",
      nama: "Ustazah Nurul Ain binti Hassan",
      jawatan: "Penyelaras Kelab & Persatuan",
      email: "nurulain.kuching@mrsm.edu.my",
      roles: ["guru", "penyemak_kelab"],
      // Contoh (b): 1 Uniform + 1 Kelab
      units: ["unit_uniform_pandu_puteri", "unit_kelab_debat"]
    },
    {
      id: "usr_1078",
      no_gaji: "G1078",
      nama: "Cikgu Mohd Farhan bin Zulkifli",
      jawatan: "Penyelaras Sukan & Permainan",
      email: "farhan.kuching@mrsm.edu.my",
      roles: ["guru", "penyemak_sukan"],
      // Contoh (a): 1 Uniform + 1 Sukan
      units: ["unit_uniform_polis", "unit_sukan_bola_sepak"]
    },
    {
      id: "usr_1005",
      no_gaji: "G1005",
      nama: "Cikgu Kamaruddin bin Idris",
      jawatan: "Ketua Penyelaras Kokurikulum",
      email: "kamaruddin.kuching@mrsm.edu.my",
      roles: ["guru", "ketua_penyelaras"],
      units: ["unit_uniform_pkbm", "unit_sukan_memanah"]
    },
    {
      id: "usr_1099",
      no_gaji: "G1099",
      nama: "Cikgu Siti Sarah binti Osman",
      jawatan: "Guru Penasihat Kokurikulum",
      email: "sitisarah.kuching@mrsm.edu.my",
      roles: ["guru"],
      units: ["unit_uniform_pengakap", "unit_kelab_seni", "unit_skp_pengakap"]
    },
    {
      id: "usr_1112",
      no_gaji: "G1112",
      nama: "Cikgu Daniel Wong Chee Keong",
      jawatan: "Guru Penasihat Kokurikulum",
      email: "danielwong.kuching@mrsm.edu.my",
      roles: ["guru"],
      units: ["unit_uniform_pbsm", "unit_sukan_badminton"]
    }
  ],

  // Senarai Unit Kokurikulum MRSM Kuching (4 Kategori Fleksibel)
  units: [
    // 1. Badan Beruniform
    { id: "unit_uniform_krs", nama: "Kadet Remaja Sekolah (KRS)", kategori: "Badan Beruniform", kuota: 50, ahli: 48, penasihat_ids: ["usr_1021"] },
    { id: "unit_uniform_pengakap", nama: "Persekutuan Pengakap Malaysia (MRSM Kuching)", kategori: "Badan Beruniform", kuota: 50, ahli: 45, penasihat_ids: ["usr_1099"] },
    { id: "unit_uniform_pbsm", nama: "Bulan Sabit Merah Malaysia (BSMM)", kategori: "Badan Beruniform", kuota: 50, ahli: 42, penasihat_ids: ["usr_1112"] },
    { id: "unit_uniform_pkbm", nama: "Kadet Bersatu Malaysia (PKBM Laut)", kategori: "Badan Beruniform", kuota: 45, ahli: 40, penasihat_ids: ["usr_1005"] },
    { id: "unit_uniform_pandu_puteri", nama: "Persatuan Pandu Puteri Malaysia", kategori: "Badan Beruniform", kuota: 45, ahli: 44, penasihat_ids: ["usr_1045"] },
    { id: "unit_uniform_polis", nama: "Kor Kadet Polis MRSM Kuching", kategori: "Badan Beruniform", kuota: 45, ahli: 41, penasihat_ids: ["usr_1078"] },

    // 2. Kelab & Persatuan
    { id: "unit_kelab_robotik", nama: "Kelab Robotik & Inovasi AI", kategori: "Kelab & Persatuan", kuota: 40, ahli: 38, penasihat_ids: ["usr_1021"] },
    { id: "unit_kelab_debat", nama: "Kelab Debat & Orator Maktab", kategori: "Kelab & Persatuan", kuota: 35, ahli: 32, penasihat_ids: ["usr_1045"] },
    { id: "unit_kelab_seni", nama: "Kelab Seni Visual & Warisan Sarawak", kategori: "Kelab & Persatuan", kuota: 35, ahli: 30, penasihat_ids: ["usr_1099"] },
    { id: "unit_kelab_catur", nama: "Kelab Catur & Sukan Minda", kategori: "Kelab & Persatuan", kuota: 40, ahli: 36, penasihat_ids: ["usr_1078"] },
    { id: "unit_kelab_falak", nama: "Kelab Astronomi & Sains Angkasa", kategori: "Kelab & Persatuan", kuota: 35, ahli: 31, penasihat_ids: ["usr_1045"] },

    // 3. Sukan & Permainan
    { id: "unit_sukan_bola_sepak", nama: "Kelab Bola Sepak & Futsal", kategori: "Sukan & Permainan", kuota: 50, ahli: 46, penasihat_ids: ["usr_1078"] },
    { id: "unit_sukan_memanah", nama: "Kelab Memanah Tradisional & Recurve", kategori: "Sukan & Permainan", kuota: 40, ahli: 37, penasihat_ids: ["usr_1005"] },
    { id: "unit_sukan_badminton", nama: "Kelab Badminton & Skuasy", kategori: "Sukan & Permainan", kuota: 45, ahli: 43, penasihat_ids: ["usr_1112"] },
    { id: "unit_sukan_bola_jaring", nama: "Kelab Bola Jaring Maktab", kategori: "Sukan & Permainan", kuota: 40, ahli: 35, penasihat_ids: ["usr_1045"] },
    { id: "unit_sukan_olahraga", nama: "Kelab Olahraga & Balapan", kategori: "Sukan & Permainan", kuota: 45, ahli: 39, penasihat_ids: ["usr_1078"] },

    // 4. Modul / Unit SKP (Standard Kemahiran Pelajar)
    { id: "unit_skp_uniform", nama: "SKP Modul Ikhtiar Hidup & Kawad KRS", kategori: "SKP", kuota: 48, ahli: 48, penasihat_ids: ["usr_1021"] },
    { id: "unit_skp_pengakap", nama: "SKP Lencana Kecekapan & Bivouac Pengakap", kategori: "SKP", kuota: 45, ahli: 45, penasihat_ids: ["usr_1099"] }
  ],

  // Senarai Ahli Rumah Sukan MRSM Kuching
  rumah_sukan: [
    { id: "s1", nama: "Muhammad Danish Hakimi bin Roslan", no_maktab: "MK24001", tingkatan: "Tingkatan 4", jantina: "Lelaki", rumah: "Bendahara", warna: "#f59e0b" },
    { id: "s2", nama: "Dayang Nur Aina Syahirah binti Awang", no_maktab: "MK24002", tingkatan: "Tingkatan 4", jantina: "Perempuan", rumah: "Bendahara", warna: "#f59e0b" },
    { id: "s3", nama: "Ahmad Zharif bin Mohd Zaki", no_maktab: "MK24003", tingkatan: "Tingkatan 3", jantina: "Lelaki", rumah: "Temenggung", warna: "#ef4444" },
    { id: "s4", nama: "Puteri Nur Batrisya binti Azman", no_maktab: "MK24004", tingkatan: "Tingkatan 3", jantina: "Perempuan", rumah: "Temenggung", warna: "#ef4444" },
    { id: "s5", nama: "Haris Iskandar bin Johari", no_maktab: "MK24005", tingkatan: "Tingkatan 5", jantina: "Lelaki", rumah: "Laksamana", warna: "#3b82f6" },
    { id: "s6", nama: "Siti Sarah binti Khairul Anuar", no_maktab: "MK24006", tingkatan: "Tingkatan 5", jantina: "Perempuan", rumah: "Laksamana", warna: "#3b82f6" },
    { id: "s7", nama: "Brandon Lee Ting Wei", no_maktab: "MK24007", tingkatan: "Tingkatan 2", jantina: "Lelaki", rumah: "Syahbandar", warna: "#10b981" },
    { id: "s8", nama: "Farzana Yasmin binti Ridzuan", no_maktab: "MK24008", tingkatan: "Tingkatan 2", jantina: "Perempuan", rumah: "Syahbandar", warna: "#10b981" },
    { id: "s9", nama: "Abang Adam Rayyan bin Abang Firdaus", no_maktab: "MK24009", tingkatan: "Tingkatan 1", jantina: "Lelaki", rumah: "Bendahara", warna: "#f59e0b" },
    { id: "s10", nama: "Nur Damia Irdina binti Sufian", no_maktab: "MK24010", tingkatan: "Tingkatan 1", jantina: "Perempuan", rumah: "Temenggung", warna: "#ef4444" },
    { id: "s11", nama: "Melvin anak Stephen", no_maktab: "MK24011", tingkatan: "Tingkatan 4", jantina: "Lelaki", rumah: "Laksamana", warna: "#3b82f6" },
    { id: "s12", nama: "Patricia anak Clement", no_maktab: "MK24012", tingkatan: "Tingkatan 3", jantina: "Perempuan", rumah: "Syahbandar", warna: "#10b981" }
  ],

  // Takwim Kokurikulum MRSM Kuching
  takwim: [
    { id: "t1", tarikh: "2026-03-04", hari: "Rabu", masa: "15:00 - 17:00", aktiviti: "Perjumpaan Mingguan Kokurikulum Bil 1/2026 (Mesyuarat Agung)", kategori: "Pertemuan Mingguan", lokasi: "Dewan Bestari & Blok Akademik", status: "Selesai" },
    { id: "t2", tarikh: "2026-03-11", hari: "Rabu", masa: "15:00 - 17:00", aktiviti: "Perjumpaan Mingguan Kokurikulum Bil 2/2026 (Latihan Kawad & Asas)", kategori: "Pertemuan Mingguan", lokasi: "Padang Maktab / Astaka", status: "Selesai" },
    { id: "t3", tarikh: "2026-03-21", hari: "Sabtu", masa: "07:30 - 12:30", aktiviti: "Kejohanan Merentas Desa MRSM Kuching Antara Rumah Sukan", kategori: "Program / Sukan", lokasi: "Laluan Rekreasi Luar Maktab", status: "Selesai" },
    { id: "t4", tarikh: "2026-04-08", hari: "Rabu", masa: "15:00 - 17:30", aktiviti: "Ujian Standard Kemahiran Pelajar (SKP 1) Badan Uniform", kategori: "SKP", lokasi: "Dataran Gemilang MRSM Kuching", status: "Sedang Berlangsung" },
    { id: "t5", tarikh: "2026-04-15", hari: "Rabu", masa: "15:00 - 17:00", aktiviti: "Perjumpaan Mingguan Kokurikulum Bil 3/2026", kategori: "Pertemuan Mingguan", lokasi: "Bilik Gerakan & Padang", status: "Akan Datang" },
    { id: "t6", tarikh: "2026-05-02", hari: "Sabtu", masa: "08:00 - 18:00", aktiviti: "Karnival Inovasi & Robotik Maktab Se-Borneo", kategori: "Pertandingan", lokasi: "Dewan Utama MRSM Kuching", status: "Akan Datang" },
    { id: "t7", tarikh: "2026-05-23", hari: "Sabtu", masa: "07:30 - 13:00", aktiviti: "Sukan Tara & Kejohanan Olahraga Tahunan MRSM Kuching", kategori: "Program / Sukan", lokasi: "Stadium Mini MRSM Kuching", status: "Akan Datang" }
  ],

  // Pelaporan Kokurikulum (Pertemuan Mingguan, SKP, Program/Pertandingan)
  pelaporan: [
    {
      id: "lap_001",
      jenis: "mingguan",
      unit_id: "unit_uniform_krs",
      unit_nama: "Kadet Remaja Sekolah (KRS)",
      kategori_unit: "Badan Beruniform",
      tarikh: "2026-03-11",
      hari: "Rabu",
      masa_mula: "15:00",
      masa_tamat: "17:00",
      bil_pertemuan: "2",
      kehadiran_hadir: 46,
      kehadiran_total: 48,
      objektif: "Menerapkan disiplin kawad kaki asas formasi dan ikatan tali gajet kecemasan.",
      aktiviti: "1. Taklimat keselamatan dan tatatertib uniform.\n2. Latihan kawad kaki statik dan dinamik.\n3. Demonstrasi ikatan tali buku sila, tindih kasih dan simpulan kerusi.\n4. Sesi rumusan oleh Ketua Platun.",
      gambar: [
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=80"
      ],
      disediakan_oleh: "Cikgu Azman bin Razak (G1021)",
      tarikh_disediakan: "2026-03-11 17:30",
      disemak_oleh: "Cikgu Azman bin Razak (Penyelaras Badan Beruniform)",
      tarikh_disemak: "2026-03-12 09:15",
      catatan_semakan: "Laporan kemas dan mematuhi silibus kawad KRS tahap 1.",
      disahkan_oleh: "McManus Sing (TPPB MRSM Kuching)",
      tarikh_disahkan: "2026-03-13 11:00",
      catatan_pengesahan: "Disahkan untuk rekod rasmi pembangunan bakat pelajar MRSM Kuching.",
      status: "disahkan"
    },
    {
      id: "lap_002",
      jenis: "skp",
      unit_id: "unit_skp_uniform",
      unit_nama: "SKP Modul Ikhtiar Hidup & Kawad KRS",
      kategori_unit: "SKP",
      tarikh: "2026-04-08",
      hari: "Rabu",
      masa_mula: "15:00",
      masa_tamat: "17:30",
      bil_pertemuan: "SKP 1",
      kehadiran_hadir: 44,
      kehadiran_total: 48,
      objektif: "Ujian Standard Kemahiran Pelajar (SKP) bagi modul masakan rimba dan pertolongan cemas anduh tiga segi.",
      aktiviti: "1. Taklimat prosedur pemarkahan SKP oleh Penguji Bertauliah.\n2. Pelajar dibahagikan kepada 6 seksyen untuk mendirikan bivouac dan memasak survival.\n3. Praktikal anduh kepala, balutan patah tulang dan rawatan luka.\n4. Penilaian lencana kecekapan oleh guru penasihat.",
      gambar: [
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&auto=format&fit=crop&q=80"
      ],
      disediakan_oleh: "Cikgu Azman bin Razak (G1021)",
      tarikh_disediakan: "2026-04-08 18:00",
      disemak_oleh: "Cikgu Azman bin Razak (Penyelaras Badan Beruniform)",
      tarikh_disemak: "2026-04-09 14:20",
      catatan_semakan: "Disemak. Markah SKP telah direkodkan dalam sistem arkib kokurikulum maktab.",
      disahkan_oleh: null,
      tarikh_disahkan: null,
      catatan_pengesahan: null,
      status: "disemak" // Menunggu Pengesahan TPPB (McManus Sing)
    },
    {
      id: "lap_003",
      jenis: "program",
      unit_id: "unit_kelab_robotik",
      unit_nama: "Kelab Robotik & Inovasi AI",
      kategori_unit: "Kelab & Persatuan",
      tarikh: "2026-04-12",
      hari: "Ahad",
      masa_mula: "08:30",
      masa_tamat: "16:30",
      bil_pertemuan: "Karnival",
      kehadiran_hadir: 12,
      kehadiran_total: 12,
      peringkat: "Kebangsaan / Borneo",
      pencapaian: "Tempat Pertama (Pingat Emas) Kategori Autonomous Line Follower & Anugerah Rekaan Inovasi Terbaik",
      objektif: "Mendedahkan ahli kepada kejohanan robotik kebangsaan berasaskan mikropengawal ESP32 & AI vision.",
      aktiviti: "1. Saringan awal litar halangan mikropengawal.\n2. Pertandingan pusingan suku akhir dan akhir.\n3. Pembentangan inovasi sensor di hadapan juri industri.\n4. Majlis penyampaian hadiah dan piala kejayaan.",
      gambar: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&auto=format&fit=crop&q=80"
      ],
      disediakan_oleh: "Cikgu Azman bin Razak (G1021)",
      tarikh_disediakan: "2026-04-13 10:00",
      disemak_oleh: null,
      tarikh_disemak: null,
      catatan_semakan: null,
      disahkan_oleh: null,
      tarikh_disahkan: null,
      catatan_pengesahan: null,
      status: "dihantar"
    }
  ],

  // Rancangan Pengajaran Tahunan Kokurikulum (RPT)
  rpt: [
    { id: "rpt_1", unit_id: "unit_uniform_krs", minggu: "Minggu 1", tajuk: "Mesyuarat Agung & Pelantikan AJK", aktiviti: "Pengenalan perlembagaan KRS, etika seragam dan pemilihan jawatankuasa platun.", bahan: "Buku Log, LCD", status: "Selesai" },
    { id: "rpt_2", unit_id: "unit_uniform_krs", minggu: "Minggu 2", tajuk: "Kawad Kaki Asas & Formasi", aktiviti: "Latihan pergerakan statik, berkawad dalam skuad dan hormat bendera.", bahan: "Kon latihan, Wisel", status: "Selesai" },
    { id: "rpt_3", unit_id: "unit_uniform_krs", minggu: "Minggu 3", tajuk: "Ikatan Tali & Asas Gajet", aktiviti: "Pembinaan gajet mini dapur menggunakan buluh dan ikatan seraya.", bahan: "Tali belati, Buluh", status: "Dalam Perancangan" },
    { id: "rpt_4", unit_id: "unit_uniform_krs", minggu: "Minggu 4", tajuk: "Ikhtiar Hidup & Pandu Arah", aktiviti: "Penggunaan kompas prismatik dan membaca peta topografi MRSM Kuching.", bahan: "Kompas, Peta Maktab", status: "Dalam Perancangan" },
    { id: "rpt_5", unit_id: "unit_kelab_robotik", minggu: "Minggu 1", tajuk: "Pengenalan Komponen Robotik & Sensor", aktiviti: "Mengenal pasti board Arduino Uno, sensor ultrasonik dan motor servo.", bahan: "Kit Robotik, Laptop", status: "Selesai" },
    { id: "rpt_6", unit_id: "unit_kelab_robotik", minggu: "Minggu 2", tajuk: "Asas Pengaturcaraan ESP32 / C++", aktiviti: "Menulis logik kawalan lampu LED dan penderia optik inframerah.", bahan: "Arduino IDE, Komputer", status: "Selesai" }
  ],

  // Pusat Muat Turun Borang Rasmi MRSM Kuching
  borang: [
    { id: "b1", tajuk: "Borang Kebenaran Ibu Bapa / Penjaga Aktiviti Kokurikulum Luar Maktab", kod: "MRSM-KCH/KOKO/01-2026", kategori: "Kebenaran & Surat", saiz: "245 KB", format: "PDF", tarikh: "2026-01-15", muatnaik_oleh: "Admin" },
    { id: "b2", tajuk: "Borang Permohonan Peruntukan & Tuntutan Perbelanjaan Kokurikulum Maktab", kod: "MRSM-KCH/KEW/KOKO-04", kategori: "Kewangan & Tuntutan", saiz: "180 KB", format: "DOCX", tarikh: "2026-01-20", muatnaik_oleh: "Admin" },
    { id: "b3", tajuk: "Borang Pendaftaran Kontinjen Pertandingan Kokurikulum Peringkat Negeri / Kebangsaan", kod: "MRSM-KCH/PERT/07-B", kategori: "Pertandingan", saiz: "315 KB", format: "DOCX", tarikh: "2026-02-05", muatnaik_oleh: "Admin" },
    { id: "b4", tajuk: "Buku Log & Borang Perekodan SKP (Standard Kemahiran Pelajar) Kokurikulum", kod: "MRSM-KCH/SKP/BU-02", kategori: "Penilaian SKP", saiz: "420 KB", format: "PDF", tarikh: "2026-02-12", muatnaik_oleh: "Admin" },
    { id: "b5", tajuk: "Templat Kertas Kerja Program / Bengkel Pembangunan Bakat MRSM Kuching", kod: "MRSM-KCH/KERTASKERJA-09", kategori: "Kertas Kerja", saiz: "560 KB", format: "DOCX", tarikh: "2026-02-18", muatnaik_oleh: "Admin" }
  ]
};

// Storage Key khas untuk MRSM Kuching
const STORAGE_KEY = "pemb_bakat_mrsm_kuching_v2";

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  }
}

function getAppData() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || INITIAL_DATA;
  } catch (e) {
    console.error("Gagal membaca LocalStorage:", e);
    return INITIAL_DATA;
  }
}

function saveAppData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Gagal menyimpan ke LocalStorage:", e);
  }
}
