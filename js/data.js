// ==========================================================================
// DATA MOCK & INITIAL STORAGE - DASHBOARD PEMBANGUNAN BAKAT MRSM KUCHING (v2)
// ==========================================================================

const INITIAL_DATA = {
  maktab: {
    nama: "Maktab Rendah Sains MARA Kuching",
    singkatan: "MRSM Kuching",
    tppb: "McManus Sing",
    jawatan_tppb: "Timbalan Pengetua Pembangunan Bakat (TPPB)",
    tahun_sesi: "2026/2027"
  },

  // 1. Senarai Pengguna & Hierarki Peranan
  // Admin: Daftar guru, daftar pelajar, tetapkan Penyelaras (Uniform, Sukan, Kelab, SKP)
  // Penyelaras: Cipta unit & lantik Guru Penasihat bagi kategorinya
  // Guru Penasihat: Daftar ahli (pelajar) & isi RPT (Bil, Minggu, Aktiviti, Objektif, Tarikh)
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
      roles: ["guru", "penyelaras_uniform"],
      units: ["unit_krs", "unit_robotik", "unit_skp_bwp"]
    },
    {
      id: "usr_1078",
      no_gaji: "G1078",
      nama: "Cikgu Mohd Farhan bin Zulkifli",
      jawatan: "Penyelaras Sukan & Permainan",
      email: "farhan.kuching@mrsm.edu.my",
      roles: ["guru", "penyelaras_sukan"],
      units: ["unit_polis", "unit_bola_sepak"]
    },
    {
      id: "usr_1045",
      no_gaji: "G1045",
      nama: "Ustazah Nurul Ain binti Hassan",
      jawatan: "Penyelaras Kelab & Persatuan",
      email: "nurulain.kuching@mrsm.edu.my",
      roles: ["guru", "penyelaras_kelab"],
      units: ["unit_pandu_puteri", "unit_debat"]
    },
    {
      id: "usr_1050",
      no_gaji: "G1050",
      nama: "Cikgu Khairul Nizam bin Ahmad",
      jawatan: "Penyelaras Sekretariat Kepimpinan Pelajar (SKP)",
      email: "khairulnizam.kuching@mrsm.edu.my",
      roles: ["guru", "penyelaras_skp"],
      units: ["unit_bsmm", "unit_skp_ldp"]
    },
    {
      id: "usr_1005",
      no_gaji: "G1005",
      nama: "Cikgu Kamaruddin bin Idris",
      jawatan: "Ketua Penyelaras Kokurikulum",
      email: "kamaruddin.kuching@mrsm.edu.my",
      roles: ["guru", "ketua_penyelaras"],
      units: ["unit_pkbm", "unit_memanah"]
    },
    {
      id: "usr_1099",
      no_gaji: "G1099",
      nama: "Cikgu Siti Sarah binti Osman",
      jawatan: "Guru Penasihat Kokurikulum",
      email: "sitisarah.kuching@mrsm.edu.my",
      roles: ["guru"],
      units: ["unit_pengakap", "unit_seni"]
    },
    {
      id: "usr_1112",
      no_gaji: "G1112",
      nama: "Cikgu Daniel Wong Chee Keong",
      jawatan: "Guru Penasihat Kokurikulum",
      email: "danielwong.kuching@mrsm.edu.my",
      roles: ["guru"],
      units: ["unit_catur", "unit_badminton"]
    }
  ],

  // 2. Senarai Master Pelajar (Students)
  // Peraturan: Mesti ada 3 kokurikulum (Uniform, Kelab, Sukan)
  // SKP: Hanya untuk pelajar terpilih sahaja
  students: [
    { id: "std_1", no_maktab: "MK24001", nama: "Muhammad Danish Hakimi bin Roslan", tingkatan: "Tingkatan 4", kelas: "4 Al-Farabi", jantina: "Lelaki", rumah_sukan: "Bendahara", uniform_id: "unit_krs", kelab_id: "unit_robotik", sukan_id: "unit_bola_sepak", skp_id: "unit_skp_bwp" },
    { id: "std_2", no_maktab: "MK24002", nama: "Dayang Nur Aina Syahirah binti Awang", tingkatan: "Tingkatan 4", kelas: "4 Al-Biruni", jantina: "Perempuan", rumah_sukan: "Bendahara", uniform_id: "unit_pandu_puteri", kelab_id: "unit_debat", sukan_id: "unit_bola_jaring", skp_id: "" },
    { id: "std_3", no_maktab: "MK24003", nama: "Ahmad Zharif bin Mohd Zaki", tingkatan: "Tingkatan 3", kelas: "3 Ibnu Sina", jantina: "Lelaki", rumah_sukan: "Temenggung", uniform_id: "unit_krs", kelab_id: "unit_catur", sukan_id: "unit_memanah", skp_id: "" },
    { id: "std_4", no_maktab: "MK24004", nama: "Puteri Nur Batrisya binti Azman", tingkatan: "Tingkatan 3", kelas: "3 Ibnu Khaldun", jantina: "Perempuan", rumah_sukan: "Temenggung", uniform_id: "unit_pengakap", kelab_id: "unit_seni", sukan_id: "unit_badminton", skp_id: "unit_skp_ldp" },
    { id: "std_5", no_maktab: "MK24005", nama: "Haris Iskandar bin Johari", tingkatan: "Tingkatan 5", kelas: "5 Al-Khawarizmi", jantina: "Lelaki", rumah_sukan: "Laksamana", uniform_id: "unit_polis", kelab_id: "unit_robotik", sukan_id: "unit_bola_sepak", skp_id: "unit_skp_bwp" },
    { id: "std_6", no_maktab: "MK24006", nama: "Siti Sarah binti Khairul Anuar", tingkatan: "Tingkatan 5", kelas: "5 Al-Razi", jantina: "Perempuan", rumah_sukan: "Laksamana", uniform_id: "unit_bsmm", kelab_id: "unit_falak", sukan_id: "unit_olahraga", skp_id: "" },
    { id: "std_7", no_maktab: "MK24007", nama: "Brandon Lee Ting Wei", tingkatan: "Tingkatan 2", kelas: "2 Bestari", jantina: "Lelaki", rumah_sukan: "Syahbandar", uniform_id: "unit_pkbm", kelab_id: "unit_catur", sukan_id: "unit_badminton", skp_id: "" },
    { id: "std_8", no_maktab: "MK24008", nama: "Farzana Yasmin binti Ridzuan", tingkatan: "Tingkatan 2", kelas: "2 Cemerlang", jantina: "Perempuan", rumah_sukan: "Syahbandar", uniform_id: "unit_pandu_puteri", kelab_id: "unit_seni", sukan_id: "unit_bola_jaring", skp_id: "" },
    { id: "std_9", no_maktab: "MK24009", nama: "Abang Adam Rayyan bin Abang Firdaus", tingkatan: "Tingkatan 1", kelas: "1 Gigih", jantina: "Lelaki", rumah_sukan: "Bendahara", uniform_id: "unit_krs", kelab_id: "", sukan_id: "unit_bola_sepak", skp_id: "" },
    { id: "std_10", no_maktab: "MK24010", nama: "Nur Damia Irdina binti Sufian", tingkatan: "Tingkatan 1", kelas: "1 Iltizam", jantina: "Perempuan", rumah_sukan: "Temenggung", uniform_id: "unit_pengakap", kelab_id: "unit_debat", sukan_id: "", skp_id: "" },
    { id: "std_11", no_maktab: "MK24011", nama: "Melvin anak Stephen", tingkatan: "Tingkatan 4", kelas: "4 Al-Farabi", jantina: "Lelaki", rumah_sukan: "Laksamana", uniform_id: "unit_polis", kelab_id: "unit_robotik", sukan_id: "unit_memanah", skp_id: "unit_skp_prs" },
    { id: "std_12", no_maktab: "MK24012", nama: "Patricia anak Clement", tingkatan: "Tingkatan 3", kelas: "3 Ibnu Sina", jantina: "Perempuan", rumah_sukan: "Syahbandar", uniform_id: "unit_bsmm", kelab_id: "unit_falak", sukan_id: "unit_badminton", skp_id: "" }
  ],

  // 3. Senarai Unit Kokurikulum (4 Kategori)
  // Dicipta dan diurus oleh Penyelaras Kategori masing-masing
  units: [
    // Badan Beruniform
    { id: "unit_krs", nama: "Kadet Remaja Sekolah (KRS)", kategori: "Badan Beruniform", penyelaras_id: "usr_1021", penasihat_ids: ["usr_1021"], kuota: 50, ahli: 48 },
    { id: "unit_pengakap", nama: "Persekutuan Pengakap Malaysia (MRSM Kuching)", kategori: "Badan Beruniform", penyelaras_id: "usr_1021", penasihat_ids: ["usr_1099"], kuota: 50, ahli: 45 },
    { id: "unit_bsmm", nama: "Bulan Sabit Merah Malaysia (BSMM)", kategori: "Badan Beruniform", penyelaras_id: "usr_1021", penasihat_ids: ["usr_1050"], kuota: 50, ahli: 42 },
    { id: "unit_pkbm", nama: "Kadet Bersatu Malaysia (PKBM Laut)", kategori: "Badan Beruniform", penyelaras_id: "usr_1021", penasihat_ids: ["usr_1005"], kuota: 45, ahli: 40 },
    { id: "unit_pandu_puteri", nama: "Persatuan Pandu Puteri Malaysia", kategori: "Badan Beruniform", penyelaras_id: "usr_1021", penasihat_ids: ["usr_1045"], kuota: 45, ahli: 44 },
    { id: "unit_polis", nama: "Kor Kadet Polis MRSM Kuching", kategori: "Badan Beruniform", penyelaras_id: "usr_1021", penasihat_ids: ["usr_1078"], kuota: 45, ahli: 41 },

    // Kelab & Persatuan
    { id: "unit_robotik", nama: "Kelab Robotik & Inovasi AI", kategori: "Kelab & Persatuan", penyelaras_id: "usr_1045", penasihat_ids: ["usr_1021"], kuota: 40, ahli: 38 },
    { id: "unit_debat", nama: "Kelab Debat & Orator Maktab", kategori: "Kelab & Persatuan", penyelaras_id: "usr_1045", penasihat_ids: ["usr_1045"], kuota: 35, ahli: 32 },
    { id: "unit_seni", nama: "Kelab Seni Visual & Warisan Sarawak", kategori: "Kelab & Persatuan", penyelaras_id: "usr_1045", penasihat_ids: ["usr_1099"], kuota: 35, ahli: 30 },
    { id: "unit_catur", nama: "Kelab Catur & Sukan Minda", kategori: "Kelab & Persatuan", penyelaras_id: "usr_1045", penasihat_ids: ["usr_1112"], kuota: 40, ahli: 36 },
    { id: "unit_falak", nama: "Kelab Astronomi & Sains Angkasa", kategori: "Kelab & Persatuan", penyelaras_id: "usr_1045", penasihat_ids: ["usr_1045"], kuota: 35, ahli: 31 },

    // Sukan & Permainan
    { id: "unit_bola_sepak", nama: "Kelab Bola Sepak & Futsal", kategori: "Sukan & Permainan", penyelaras_id: "usr_1078", penasihat_ids: ["usr_1078"], kuota: 50, ahli: 46 },
    { id: "unit_memanah", nama: "Kelab Memanah Tradisional & Recurve", kategori: "Sukan & Permainan", penyelaras_id: "usr_1078", penasihat_ids: ["usr_1005"], kuota: 40, ahli: 37 },
    { id: "unit_badminton", nama: "Kelab Badminton & Skuasy", kategori: "Sukan & Permainan", penyelaras_id: "usr_1078", penasihat_ids: ["usr_1112"], kuota: 45, ahli: 43 },
    { id: "unit_bola_jaring", nama: "Kelab Bola Jaring Maktab", kategori: "Sukan & Permainan", penyelaras_id: "usr_1078", penasihat_ids: ["usr_1045"], kuota: 40, ahli: 35 },
    { id: "unit_olahraga", nama: "Kelab Olahraga & Balapan", kategori: "Sukan & Permainan", penyelaras_id: "usr_1078", penasihat_ids: ["usr_1078"], kuota: 45, ahli: 39 },

    // Sekretariat Kepimpinan Pelajar (SKP - Terpilih Sahaja)
    { id: "unit_skp_bwp", nama: "SKP Badan Wakil Pelajar (BWP)", kategori: "SKP", penyelaras_id: "usr_1050", penasihat_ids: ["usr_1021"], kuota: 30, ahli: 24 },
    { id: "unit_skp_ldp", nama: "SKP Lembaga Disiplin Pelajar (LDP)", kategori: "SKP", penyelaras_id: "usr_1050", penasihat_ids: ["usr_1050"], kuota: 35, ahli: 30 },
    { id: "unit_skp_prs", nama: "SKP Pembimbing Rakan Sebaya (PRS)", kategori: "SKP", penyelaras_id: "usr_1050", penasihat_ids: ["usr_1045"], kuota: 25, ahli: 20 },
    { id: "unit_skp_asrama", nama: "SKP Biro Asrama & Homeroom", kategori: "SKP", penyelaras_id: "usr_1050", penasihat_ids: ["usr_1099"], kuota: 40, ahli: 35 }
  ],

  // 4. Rancangan Pengajaran Tahunan Kokurikulum (RPT)
  // Format Standard: [Bil., Minggu, Aktiviti, Objektif, Tarikh]
  rpt: [
    { id: "rpt_krs_1", unit_id: "unit_krs", bil: 1, minggu: "Minggu 1", aktiviti: "Mesyuarat Agung & Pemilihan AJK Platun", objektif: "Melantik barisan kepimpinan dan pembentangan takwim KRS", tarikh: "2026-03-04", status: "Selesai" },
    { id: "rpt_krs_2", unit_id: "unit_krs", bil: 2, minggu: "Minggu 2", aktiviti: "Latihan Kawad Kaki Statik Asas", objektif: "Menguasai 8 arahan pergerakan kawad asas bertempat", tarikh: "2026-03-11", status: "Selesai" },
    { id: "rpt_krs_3", unit_id: "unit_krs", bil: 3, minggu: "Minggu 3", aktiviti: "Asas Ikatan Tali & Simpulan Gajet", objektif: "Mempelajari ikatan buku sila, bunga geti dan tindih kasih", tarikh: "2026-03-25", status: "Dalam Perancangan" },
    { id: "rpt_krs_4", unit_id: "unit_krs", bil: 4, minggu: "Minggu 4", aktiviti: "Pandu Arah & Kompas Topografi", objektif: "Membaca bearing kompas dan orientasi peta maktab", tarikh: "2026-04-08", status: "Dalam Perancangan" },
    { id: "rpt_krs_5", unit_id: "unit_krs", bil: 5, minggu: "Minggu 5", aktiviti: "Ujian Kelayakan Lencana Kecekapan Tahap 1", objektif: "Menilai kecekapan teori dan praktikal kawad ahli", tarikh: "2026-04-22", status: "Dalam Perancangan" },
    { id: "rpt_krs_6", unit_id: "unit_krs", bil: 6, minggu: "Minggu 6", aktiviti: "Khidmat Masyarakat & Gotong-Royong", objektif: "Menerapkan nilai patriotisme dan keprihatinan komuniti", tarikh: "2026-05-06", status: "Dalam Perancangan" },
    
    // Robotik
    { id: "rpt_rob_1", unit_id: "unit_robotik", bil: 1, minggu: "Minggu 1", aktiviti: "Mesyuarat Agung & Taklimat Keselamatan Makmal", objektif: "Melantik AJK dan pengenalan roadmap inovasi tahunan", tarikh: "2026-03-04", status: "Selesai" },
    { id: "rpt_rob_2", unit_id: "unit_robotik", bil: 2, minggu: "Minggu 2", aktiviti: "Pengenalan Mikropengawal ESP32 & Sensor Asas", objektif: "Memahami pinout GPIO dan litar breadboard", tarikh: "2026-03-11", status: "Selesai" },
    { id: "rpt_rob_3", unit_id: "unit_robotik", bil: 3, minggu: "Minggu 3", aktiviti: "Pengaturcaraan C++ Kawalan Motor Driver", objektif: "Memprogram motor driver L298N untuk pergerakan roda", tarikh: "2026-03-25", status: "Dalam Perancangan" },
    { id: "rpt_rob_4", unit_id: "unit_robotik", bil: 4, minggu: "Minggu 4", aktiviti: "Pembinaan Robot Line Follower Berautonomi", objektif: "Kalibrasi sensor IR 5-channel bagi menjejak garisan", tarikh: "2026-04-08", status: "Dalam Perancangan" }
  ],

  // 5. Takwim Kokurikulum
  takwim: [
    { id: "t1", tarikh: "2026-03-04", hari: "Rabu", masa: "15:00 - 17:00", aktiviti: "Perjumpaan Kokurikulum Mingguan Bil 1/2026 (Mesyuarat Agung)", kategori: "Pertemuan Mingguan", lokasi: "Dewan Bestari & Blok Akademik", status: "Selesai" },
    { id: "t2", tarikh: "2026-03-11", hari: "Rabu", masa: "15:00 - 17:00", aktiviti: "Perjumpaan Kokurikulum Mingguan Bil 2/2026 (Latihan Kawad & Asas)", kategori: "Pertemuan Mingguan", lokasi: "Padang Maktab / Astaka", status: "Selesai" },
    { id: "t3", tarikh: "2026-03-21", hari: "Sabtu", masa: "07:30 - 12:30", aktiviti: "Kejohanan Merentas Desa Antara Rumah Sukan MRSM Kuching", kategori: "Program / Sukan", lokasi: "Laluan Rekreasi Luar Maktab", status: "Selesai" },
    { id: "t4", tarikh: "2026-04-08", hari: "Rabu", masa: "15:00 - 17:30", aktiviti: "Ujian Standard Kemahiran Pelajar (SKP 1)", kategori: "SKP", lokasi: "Dataran Gemilang MRSM Kuching", status: "Akan Datang" }
  ],

  // 6. Pelaporan Kokurikulum
  pelaporan: [
    {
      id: "lap_001",
      jenis: "mingguan",
      unit_id: "unit_krs",
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
      aktiviti: "1. Taklimat tatatertib uniform.\n2. Latihan kawad kaki statik.\n3. Ikatan buku sila dan bunga geti.",
      gambar: ["https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"],
      disediakan_oleh: "Cikgu Azman bin Razak (G1021)",
      tarikh_disediakan: "2026-03-11 17:30",
      disemak_oleh: "Cikgu Azman bin Razak (Penyelaras Badan Beruniform)",
      tarikh_disemak: "2026-03-12 09:15",
      catatan_semakan: "Aktiviti mengikut standard silibus kawad peringkat 1.",
      disahkan_oleh: "McManus Sing (TPPB MRSM Kuching)",
      tarikh_disahkan: "2026-03-13 11:00",
      catatan_pengesahan: "Disahkan untuk rekod kokurikulum maktab.",
      status: "disahkan"
    }
  ],

  // 7. Borang Rasmi
  borang: [
    { id: "b1", tajuk: "Borang Kebenaran Ibu Bapa / Penjaga Aktiviti Kokurikulum Luar Maktab", kod: "MRSM-KCH/KOKO/01-2026", kategori: "Kebenaran & Surat", saiz: "245 KB", format: "PDF", tarikh: "2026-01-15", muatnaik_oleh: "Admin" },
    { id: "b2", tajuk: "Borang Permohonan Peruntukan & Tuntutan Perbelanjaan Kokurikulum Maktab", kod: "MRSM-KCH/KEW/KOKO-04", kategori: "Kewangan & Tuntutan", saiz: "180 KB", format: "DOCX", tarikh: "2026-01-20", muatnaik_oleh: "Admin" },
    { id: "b3", tajuk: "Borang Pendaftaran Kontinjen Pertandingan Kokurikulum", kod: "MRSM-KCH/PERT/07-B", kategori: "Pertandingan", saiz: "315 KB", format: "DOCX", tarikh: "2026-02-05", muatnaik_oleh: "Admin" },
    { id: "b4", tajuk: "Buku Log & Borang Perekodan SKP Kokurikulum", kod: "MRSM-KCH/SKP/BU-02", kategori: "Penilaian SKP", saiz: "420 KB", format: "PDF", tarikh: "2026-02-12", muatnaik_oleh: "Admin" }
  ]
};

// Storage Key
const STORAGE_KEY = "pemb_bakat_mrsm_kuching_v3";

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  }
}

function getAppData() {
  initStorage();
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Semak jika students wujud (jika upgrade dari versi lama)
    if (!data.students) {
      data.students = INITIAL_DATA.students;
      saveAppData(data);
    }
    return data || INITIAL_DATA;
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

/**
 * Helper: Semak status kelengkapan 3 kokurikulum bagi pelajar
 */
function getStudentKokurikulumStatus(student) {
  const hasUniform = Boolean(student.uniform_id);
  const hasKelab = Boolean(student.kelab_id);
  const hasSukan = Boolean(student.sukan_id);
  const hasSkp = Boolean(student.skp_id);

  const count = (hasUniform ? 1 : 0) + (hasKelab ? 1 : 0) + (hasSukan ? 1 : 0);

  return {
    isComplete: count === 3,
    count: count,
    hasUniform: hasUniform,
    hasKelab: hasKelab,
    hasSukan: hasSukan,
    hasSkp: hasSkp,
    statusText: (count === 3) 
      ? (hasSkp ? "Lengkap (3/3 + SKP)" : "Lengkap (3/3)") 
      : `Belum Lengkap (${count}/3)`
  };
}

/**
 * Helper: Jana templat 12 minggu standard untuk mana-mana unit kokurikulum
 */
function generateDefaultRptRows(unitId, unitNama) {
  return [
    { bil: 1, minggu: "Minggu 1", aktiviti: "Mesyuarat Agung & Pemilihan AJK", objektif: "Melantik jawatankuasa dan taklimat perlembagaan", tarikh: "2026-03-04", status: "Selesai" },
    { bil: 2, minggu: "Minggu 2", aktiviti: "Kemahiran Asas / Teori Pengenalan", objektif: "Mempelajari modul teori dan peraturan asas", tarikh: "2026-03-11", status: "Selesai" },
    { bil: 3, minggu: "Minggu 3", aktiviti: "Latihan Praktikal & Pengukuhan 1", objektif: "Melaksanakan praktikal berpandu dalam kumpulan", tarikh: "2026-03-25", status: "Dalam Perancangan" },
    { bil: 4, minggu: "Minggu 4", aktiviti: "Latihan Praktikal & Pengukuhan 2", objektif: "Meningkatkan kecekapan aplikasi kemahiran", tarikh: "2026-04-08", status: "Dalam Perancangan" },
    { bil: 5, minggu: "Minggu 5", aktiviti: "Ujian Kecekapan & Penilaian Formatif", objektif: "Menilai tahap penguasaan individu ahli", tarikh: "2026-04-22", status: "Dalam Perancangan" },
    { bil: 6, minggu: "Minggu 6", aktiviti: "Simulasi / Perlawanan Persahabatan / Projek", objektif: "Menguji daya saing dan kreativiti ahli", tarikh: "2026-05-06", status: "Dalam Perancangan" },
    { bil: 7, minggu: "Minggu 7", aktiviti: "Bengkel Peningkatan Kemahiran", objektif: "Meneroka teknik lanjutan dan inovasi", tarikh: "2026-05-20", status: "Dalam Perancangan" },
    { bil: 8, minggu: "Minggu 8", aktiviti: "Aktiviti Khidmat Komuniti Maktab", objektif: "Menerapkan nilai kesukarelawanan dan bakti", tarikh: "2026-06-10", status: "Dalam Perancangan" },
    { bil: 9, minggu: "Minggu 9", aktiviti: "Persediaan Karnival / Pertandingan", objektif: "Menyiapkan kontinjen dan peralatan pertandingan", tarikh: "2026-06-24", status: "Dalam Perancangan" },
    { bil: 10, minggu: "Minggu 10", aktiviti: "Kejohanan / Pameran / Hari Bakat", objektif: "Mempamerkan hasil pembelajaran sepanjang sesi", tarikh: "2026-07-08", status: "Dalam Perancangan" },
    { bil: 11, minggu: "Minggu 11", aktiviti: "Refleksi & Penarafan Bintang", objektif: "Menilai pencapaian KPI dan kehadiran ahli", tarikh: "2026-07-22", status: "Dalam Perancangan" },
    { bil: 12, minggu: "Minggu 12", aktiviti: "Majlis Penutupan & Jamuan Akhir", objektif: "Penyampaian sijil penghargaan dan rumusan", tarikh: "2026-08-05", status: "Dalam Perancangan" }
  ];
}
