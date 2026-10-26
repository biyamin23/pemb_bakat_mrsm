/**
 * ==============================================================================
 * DASHBOARD PEMBANGUNAN BAKAT KOKURIKULUM MRSM KUCHING
 * GOOGLE APPS SCRIPT BACKEND DATABASE (API WEB APP v2)
 * ==============================================================================
 * 
 * Pengguna & Aliran Kuasa (Hierarki Akses):
 * 1. Admin:
 *    - Daftar senarai nama guru
 *    - Daftar senarai nama pelajar maktab
 *    - Tetapkan Penyelaras (Badan Beruniform, Sukan & Permainan, Kelab & Persatuan, SKP)
 * 2. Penyelaras Badan Beruniform:
 *    - Cipta Badan Beruniform
 *    - Lantik Guru Penasihat Badan Beruniform
 * 3. Penyelaras Sukan dan Permainan:
 *    - Cipta Sukan dan Permainan
 *    - Lantik Guru Penasihat Sukan dan Permainan
 * 4. Penyelaras Kelab dan Persatuan:
 *    - Cipta Kelab dan Persatuan
 *    - Lantik Guru Penasihat Kelab dan Persatuan
 * 5. Penyelaras Sekretariat Kepimpinan Pelajar (SKP):
 *    - Cipta Unit SKP (BWP, LDP, PRS, Biro Asrama)
 *    - Lantik Guru Penasihat SKP
 * 6. Guru Penasihat:
 *    - Daftar ahli (pelajar) ke unit masing-masing
 *    - Key-in dan simpan Rancangan Pengajaran Tahunan (RPT) dengan format standard:
 *      [Bil., Minggu, Aktiviti, Objektif, Tarikh]
 *    - Hantar laporan perjumpaan mingguan / SKP / program
 * 7. Syarat Pelajar:
 *    - MESTI ada 3 kokurikulum teras: (1) Badan Beruniform, (2) Kelab & Persatuan, (3) Sukan & Permainan
 *    - SKP hanya untuk pelajar terpilih sahaja
 * 8. Pengesah:
 *    - TPPB McManus Sing (Timbalan Pengetua Pembangunan Bakat)
 */

const SHEET_NAMES = {
  USERS: 'Users',
  STUDENTS: 'Students',
  UNITS: 'Units',
  PELAPORAN: 'Pelaporan',
  TAKWIM: 'Takwim',
  RPT: 'RPT',
  BORANG: 'Borang',
  CONFIG: 'Config'
};

/**
 * Inisialisasi Database Google Sheets
 * Menjana 7 helaian automatik lengkap dengan headers & sampel data MRSM Kuching
 */
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet: Users (Master Guru & Pentadbiran)
  let sheetUsers = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  if (sheetUsers.getLastRow() === 0) {
    sheetUsers.appendRow([
      'id', 'no_gaji', 'nama', 'jawatan', 'roles', 'unit_ids', 'passcode'
    ]);
    sheetUsers.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#d1fae5');
    
    sheetUsers.appendRow(['usr_admin', 'ADMIN', 'Pentadbir Sistem Kokurikulum', 'Admin Pusat Kokurikulum', '["admin"]', '[]', 'admin123']);
    sheetUsers.appendRow(['usr_1002', 'G1002', 'McManus Sing', 'Timbalan Pengetua Pembangunan Bakat (TPPB)', '["tppb"]', '[]', '']);
    sheetUsers.appendRow(['usr_1021', 'G1021', 'Cikgu Azman bin Razak', 'Penyelaras Badan Beruniform', '["guru", "penyelaras_uniform"]', '["unit_krs", "unit_robotik", "unit_skp_bwp"]', '']);
    sheetUsers.appendRow(['usr_1078', 'G1078', 'Cikgu Mohd Farhan bin Zulkifli', 'Penyelaras Sukan & Permainan', '["guru", "penyelaras_sukan"]', '["unit_polis", "unit_bola_sepak"]', '']);
    sheetUsers.appendRow(['usr_1045', 'G1045', 'Ustazah Nurul Ain binti Hassan', 'Penyelaras Kelab & Persatuan', '["guru", "penyelaras_kelab"]', '["unit_pandu_puteri", "unit_debat"]', '']);
    sheetUsers.appendRow(['usr_1050', 'G1050', 'Cikgu Khairul Nizam bin Ahmad', 'Penyelaras SKP', '["guru", "penyelaras_skp"]', '["unit_bsmm", "unit_skp_ldp"]', '']);
    sheetUsers.appendRow(['usr_1005', 'G1005', 'Cikgu Kamaruddin bin Idris', 'Ketua Penyelaras Kokurikulum', '["guru", "ketua_penyelaras"]', '["unit_pkbm", "unit_memanah"]', '']);
    sheetUsers.appendRow(['usr_1099', 'G1099', 'Cikgu Siti Sarah binti Osman', 'Guru Penasihat Kokurikulum', '["guru"]', '["unit_pengakap", "unit_seni"]', '']);
    sheetUsers.appendRow(['usr_1112', 'G1112', 'Cikgu Daniel Wong Chee Keong', 'Guru Penasihat Kokurikulum', '["guru"]', '["unit_catur", "unit_badminton"]', '']);
  }

  // 2. Sheet: Students (Master Pelajar Maktab)
  // Wajib 3 koko (uniform, kelab, sukan) + SKP (terpilih sahaja)
  let sheetStudents = getOrCreateSheet(ss, SHEET_NAMES.STUDENTS);
  if (sheetStudents.getLastRow() === 0) {
    sheetStudents.appendRow([
      'id', 'no_maktab', 'nama', 'tingkatan', 'kelas', 'jantina', 'rumah_sukan',
      'uniform_id', 'kelab_id', 'sukan_id', 'skp_id', 'status_lengkap'
    ]);
    sheetStudents.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#fef08a');

    sheetStudents.appendRow(['std_1', 'MK24001', 'Muhammad Danish Hakimi bin Roslan', 'Tingkatan 4', '4 Al-Farabi', 'Lelaki', 'Bendahara', 'unit_krs', 'unit_robotik', 'unit_bola_sepak', 'unit_skp_bwp', 'Lengkap (3/3 + SKP)']);
    sheetStudents.appendRow(['std_2', 'MK24002', 'Dayang Nur Aina Syahirah binti Awang', 'Tingkatan 4', '4 Al-Biruni', 'Perempuan', 'Bendahara', 'unit_pandu_puteri', 'unit_debat', 'unit_bola_jaring', '', 'Lengkap (3/3)']);
    sheetStudents.appendRow(['std_3', 'MK24003', 'Ahmad Zharif bin Mohd Zaki', 'Tingkatan 3', '3 Ibnu Sina', 'Lelaki', 'Temenggung', 'unit_krs', 'unit_catur', 'unit_memanah', '', 'Lengkap (3/3)']);
    sheetStudents.appendRow(['std_4', 'MK24004', 'Puteri Nur Batrisya binti Azman', 'Tingkatan 3', '3 Ibnu Khaldun', 'Perempuan', 'Temenggung', 'unit_pengakap', 'unit_seni', 'unit_badminton', 'unit_skp_ldp', 'Lengkap (3/3 + SKP)']);
    sheetStudents.appendRow(['std_5', 'MK24005', 'Haris Iskandar bin Johari', 'Tingkatan 5', '5 Al-Khawarizmi', 'Lelaki', 'Laksamana', 'unit_polis', 'unit_robotik', 'unit_bola_sepak', 'unit_skp_bwp', 'Lengkap (3/3 + SKP)']);
    sheetStudents.appendRow(['std_6', 'MK24006', 'Siti Sarah binti Khairul Anuar', 'Tingkatan 5', '5 Al-Razi', 'Perempuan', 'Laksamana', 'unit_bsmm', 'unit_falak', 'unit_olahraga', '', 'Lengkap (3/3)']);
    sheetStudents.appendRow(['std_7', 'MK24007', 'Brandon Lee Ting Wei', 'Tingkatan 2', '2 Bestari', 'Lelaki', 'Syahbandar', 'unit_pkbm', 'unit_catur', 'unit_badminton', '', 'Lengkap (3/3)']);
    sheetStudents.appendRow(['std_8', 'MK24008', 'Farzana Yasmin binti Ridzuan', 'Tingkatan 2', '2 Cemerlang', 'Perempuan', 'Syahbandar', 'unit_pandu_puteri', 'unit_seni', 'unit_bola_jaring', '', 'Lengkap (3/3)']);
    sheetStudents.appendRow(['std_9', 'MK24009', 'Abang Adam Rayyan bin Abang Firdaus', 'Tingkatan 1', '1 Gigih', 'Lelaki', 'Bendahara', 'unit_krs', '', 'unit_bola_sepak', '', 'Belum Lengkap (2/3)']);
    sheetStudents.appendRow(['std_10', 'MK24010', 'Nur Damia Irdina binti Sufian', 'Tingkatan 1', '1 Iltizam', 'Perempuan', 'Temenggung', 'unit_pengakap', 'unit_debat', '', '', 'Belum Lengkap (2/3)']);
    sheetStudents.appendRow(['std_11', 'MK24011', 'Melvin anak Stephen', 'Tingkatan 4', '4 Al-Farabi', 'Lelaki', 'Laksamana', 'unit_polis', 'unit_robotik', 'unit_memanah', 'unit_skp_prs', 'Lengkap (3/3 + SKP)']);
    sheetStudents.appendRow(['std_12', 'MK24012', 'Patricia anak Clement', 'Tingkatan 3', '3 Ibnu Sina', 'Perempuan', 'Syahbandar', 'unit_bsmm', 'unit_falak', 'unit_badminton', '', 'Lengkap (3/3)']);
  }

  // 3. Sheet: Units (Badan Beruniform / Sukan & Permainan / Kelab & Persatuan / SKP)
  let sheetUnits = getOrCreateSheet(ss, SHEET_NAMES.UNITS);
  if (sheetUnits.getLastRow() === 0) {
    sheetUnits.appendRow(['id', 'nama', 'kategori', 'penyelaras_id', 'penasihat_ids', 'kuota', 'ahli_count']);
    sheetUnits.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#dbeafe');

    // Badan Beruniform
    sheetUnits.appendRow(['unit_krs', 'Kadet Remaja Sekolah (KRS)', 'Badan Beruniform', 'usr_1021', '["usr_1021"]', 50, 48]);
    sheetUnits.appendRow(['unit_pengakap', 'Persekutuan Pengakap Malaysia (MRSM Kuching)', 'Badan Beruniform', 'usr_1021', '["usr_1099"]', 50, 45]);
    sheetUnits.appendRow(['unit_bsmm', 'Bulan Sabit Merah Malaysia (BSMM)', 'Badan Beruniform', 'usr_1021', '["usr_1050"]', 50, 42]);
    sheetUnits.appendRow(['unit_pkbm', 'Kadet Bersatu Malaysia (PKBM Laut)', 'Badan Beruniform', 'usr_1021', '["usr_1005"]', 45, 40]);
    sheetUnits.appendRow(['unit_pandu_puteri', 'Persatuan Pandu Puteri Malaysia', 'Badan Beruniform', 'usr_1021', '["usr_1045"]', 45, 44]);
    sheetUnits.appendRow(['unit_polis', 'Kor Kadet Polis MRSM Kuching', 'Badan Beruniform', 'usr_1021', '["usr_1078"]', 45, 41]);

    // Kelab & Persatuan
    sheetUnits.appendRow(['unit_robotik', 'Kelab Robotik & Inovasi AI', 'Kelab & Persatuan', 'usr_1045', '["usr_1021"]', 40, 38]);
    sheetUnits.appendRow(['unit_debat', 'Kelab Debat & Orator Maktab', 'Kelab & Persatuan', 'usr_1045', '["usr_1045"]', 35, 32]);
    sheetUnits.appendRow(['unit_seni', 'Kelab Seni Visual & Warisan Sarawak', 'Kelab & Persatuan', 'usr_1045', '["usr_1099"]', 35, 30]);
    sheetUnits.appendRow(['unit_catur', 'Kelab Catur & Sukan Minda', 'Kelab & Persatuan', 'usr_1045', '["usr_1112"]', 40, 36]);
    sheetUnits.appendRow(['unit_falak', 'Kelab Astronomi & Sains Angkasa', 'Kelab & Persatuan', 'usr_1045', '["usr_1045"]', 35, 31]);

    // Sukan & Permainan
    sheetUnits.appendRow(['unit_bola_sepak', 'Kelab Bola Sepak & Futsal', 'Sukan & Permainan', 'usr_1078', '["usr_1078"]', 50, 46]);
    sheetUnits.appendRow(['unit_memanah', 'Kelab Memanah Tradisional & Recurve', 'Sukan & Permainan', 'usr_1078', '["usr_1005"]', 40, 37]);
    sheetUnits.appendRow(['unit_badminton', 'Kelab Badminton & Skuasy', 'Sukan & Permainan', 'usr_1078', '["usr_1112"]', 45, 43]);
    sheetUnits.appendRow(['unit_bola_jaring', 'Kelab Bola Jaring Maktab', 'Sukan & Permainan', 'usr_1078', '["usr_1045"]', 40, 35]);
    sheetUnits.appendRow(['unit_olahraga', 'Kelab Olahraga & Balapan', 'Sukan & Permainan', 'usr_1078', '["usr_1078"]', 45, 39]);

    // SKP (Sekretariat Kepimpinan Pelajar)
    sheetUnits.appendRow(['unit_skp_bwp', 'SKP Badan Wakil Pelajar (BWP)', 'SKP', 'usr_1050', '["usr_1021"]', 30, 24]);
    sheetUnits.appendRow(['unit_skp_ldp', 'SKP Lembaga Disiplin Pelajar (LDP)', 'SKP', 'usr_1050', '["usr_1050"]', 35, 30]);
    sheetUnits.appendRow(['unit_skp_prs', 'SKP Pembimbing Rakan Sebaya (PRS)', 'SKP', 'usr_1050', '["usr_1045"]', 25, 20]);
    sheetUnits.appendRow(['unit_skp_asrama', 'SKP Biro Asrama & Kepimpinan Homeroom', 'SKP', 'usr_1050', '["usr_1099"]', 40, 35]);
  }

  // 4. Sheet: Pelaporan (Workflow Pertemuan Mingguan, SKP, Program)
  let sheetPelaporan = getOrCreateSheet(ss, SHEET_NAMES.PELAPORAN);
  if (sheetPelaporan.getLastRow() === 0) {
    sheetPelaporan.appendRow([
      'id', 'unit_id', 'unit_nama', 'kategori', 'jenis', 'bil_pertemuan',
      'tarikh', 'masa_mula', 'masa_tamat', 'kehadiran_bil', 'kehadiran_jumlah',
      'objektif', 'aktiviti', 'gambar_urls', 'disediakan_oleh_id', 'disediakan_oleh_nama',
      'status', 'disemak_oleh_nama', 'ulasan_penyemak', 'disahkan_oleh_nama', 'ulasan_tppb', 'timestamp'
    ]);
    sheetPelaporan.getRange(1, 1, 1, 22).setFontWeight('bold').setBackground('#fef3c7');

    sheetPelaporan.appendRow([
      'lap_001', 'unit_krs', 'Kadet Remaja Sekolah (KRS)', 'Badan Beruniform', 'mingguan', '2',
      '2026-03-11', '15:00', '17:00', 46, 48,
      'Menerapkan disiplin kawad kaki asas formasi dan ikatan tali gajet kecemasan.',
      '1. Taklimat tatatertib uniform.\n2. Latihan kawad kaki statik.\n3. Ikatan buku sila dan bunga geti.',
      '["https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"]',
      'usr_1021', 'Cikgu Azman bin Razak (G1021)', 'disahkan',
      'Cikgu Azman bin Razak (Penyelaras Badan Beruniform)', 'Aktiviti mengikut standard silibus kawad peringkat 1.',
      'McManus Sing (TPPB MRSM Kuching)', 'Laporan lengkap, disahkan untuk rekod kokurikulum maktab.',
      new Date().toISOString()
    ]);
  }

  // 5. Sheet: RPT (Rancangan Pengajaran Tahunan Kokurikulum)
  // Format Standard Dibekalkan: [Bil., Minggu, Aktiviti, Objektif, Tarikh]
  let sheetRpt = getOrCreateSheet(ss, SHEET_NAMES.RPT);
  if (sheetRpt.getLastRow() === 0) {
    sheetRpt.appendRow([
      'id', 'unit_id', 'unit_nama', 'bil', 'minggu', 'aktiviti', 'objektif', 'tarikh', 'status'
    ]);
    sheetRpt.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#fee2e2');

    // Pre-populated standard template for KRS
    const defaultKrs = [
      ['rpt_krs_1', 'unit_krs', 'Kadet Remaja Sekolah (KRS)', 1, 'Minggu 1', 'Mesyuarat Agung & Pemilihan AJK Platun', 'Melantik kepimpinan dan taklimat etika perlembagaan KRS', '2026-03-04', 'Selesai'],
      ['rpt_krs_2', 'unit_krs', 'Kadet Remaja Sekolah (KRS)', 2, 'Latihan Kawad Kaki Asas Statik', 'Menguasai 8 arahan pergerakan kawad asas bertempat', '2026-03-11', 'Selesai'],
      ['rpt_krs_3', 'unit_krs', 'Kadet Remaja Sekolah (KRS)', 3, 'Asas Ikatan Tali & Simpulan Kecemasan', 'Mempelajari ikatan buku sila, bunga geti dan tindih kasih', '2026-03-25', 'Dalam Perancangan'],
      ['rpt_krs_4', 'unit_krs', 'Kadet Remaja Sekolah (KRS)', 4, 'Pandu Arah & Kompas Topografi', 'Membaca bearing kompas dan orientasi peta maktab', '2026-04-08', 'Dalam Perancangan'],
      ['rpt_krs_5', 'unit_krs', 'Kadet Remaja Sekolah (KRS)', 5, 'Ujian Kelayakan Lencana Kecekapan Tahap 1', 'Menilai kecekapan teori dan praktikal ahli', '2026-04-22', 'Dalam Perancangan'],
      ['rpt_krs_6', 'unit_krs', 'Kadet Remaja Sekolah (KRS)', 6, 'Khidmat Masyarakat & Gotong-Royong Alam Sekitar', 'Menerapkan nilai patriotisme dan keprihatinan komuniti', '2026-05-06', 'Dalam Perancangan']
    ];
    defaultKrs.forEach(row => sheetRpt.appendRow(row));

    // Pre-populated template for Robotik
    const defaultRobotik = [
      ['rpt_rob_1', 'unit_robotik', 'Kelab Robotik & Inovasi AI', 1, 'Minggu 1', 'Mesyuarat Agung & Taklimat Keselamatan Makmal', 'Melantik AJK dan pengenalan roadmap inovasi tahunan', '2026-03-04', 'Selesai'],
      ['rpt_rob_2', 'unit_robotik', 'Kelab Robotik & Inovasi AI', 2, 'Pengenalan Mikropengawal ESP32 & Arduino', 'Memahami pinout GPIO dan penyambungan sensor asas', '2026-03-11', 'Selesai'],
      ['rpt_rob_3', 'unit_robotik', 'Kelab Robotik & Inovasi AI', 3, 'Logik Pemprograman C++ Kawalan Motor', 'Memprogram motor driver L298N untuk pergerakan robot', '2026-03-25', 'Dalam Perancangan'],
      ['rpt_rob_4', 'unit_robotik', 'Kelab Robotik & Inovasi AI', 4, 'Pembinaan Autonomous Line Follower', 'Penyambungan sensor inframerah 5-channel', '2026-04-08', 'Dalam Perancangan']
    ];
    defaultRobotik.forEach(row => sheetRpt.appendRow(row));
  }

  // 6. Sheet: Takwim
  let sheetTakwim = getOrCreateSheet(ss, SHEET_NAMES.TAKWIM);
  if (sheetTakwim.getLastRow() === 0) {
    sheetTakwim.appendRow(['id', 'tarikh', 'hari', 'masa', 'aktiviti', 'kategori', 'lokasi', 'status']);
    sheetTakwim.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#ede9fe');

    sheetTakwim.appendRow(['t1', '2026-03-04', 'Rabu', '15:00 - 17:00', 'Perjumpaan Kokurikulum Mingguan Bil 1/2026 (Mesyuarat Agung)', 'Pertemuan Mingguan', 'Dewan Bestari & Blok Akademik', 'Selesai']);
    sheetTakwim.appendRow(['t2', '2026-03-11', 'Rabu', '15:00 - 17:00', 'Perjumpaan Kokurikulum Mingguan Bil 2/2026 (Latihan Kawad & Asas)', 'Pertemuan Mingguan', 'Padang Maktab / Astaka', 'Selesai']);
    sheetTakwim.appendRow(['t3', '2026-03-21', 'Sabtu', '07:30 - 12:30', 'Kejohanan Merentas Desa Antara Rumah Sukan MRSM Kuching', 'Program / Sukan', 'Laluan Rekreasi Luar Maktab', 'Selesai']);
    sheetTakwim.appendRow(['t4', '2026-04-08', 'Rabu', '15:00 - 17:30', 'Ujian Standard Kemahiran Pelajar (SKP 1)', 'SKP', 'Dataran Gemilang MRSM Kuching', 'Akan Datang']);
  }

  // 7. Sheet: Borang
  let sheetBorang = getOrCreateSheet(ss, SHEET_NAMES.BORANG);
  if (sheetBorang.getLastRow() === 0) {
    sheetBorang.appendRow(['id', 'kod', 'tajuk', 'kategori', 'format', 'saiz', 'tarikh', 'muatnaik_oleh']);
    sheetBorang.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#ffedd5');

    sheetBorang.appendRow(['b1', 'MRSM-KCH/KOKO/01', 'Borang Kebenaran Ibu Bapa / Penjaga Aktiviti Kokurikulum Luar', 'Kebenaran', 'PDF', '245 KB', '2026-01-15', 'Admin']);
    sheetBorang.appendRow(['b2', 'MRSM-KCH/KEW/04', 'Borang Permohonan Peruntukan & Tuntutan Perbelanjaan Kokurikulum', 'Kewangan', 'DOCX', '180 KB', '2026-01-20', 'Admin']);
    sheetBorang.appendRow(['b3', 'MRSM-KCH/PERT/07', 'Borang Pendaftaran Kontinjen Pertandingan Luar Maktab', 'Pertandingan', 'DOCX', '315 KB', '2026-02-05', 'Admin']);
    sheetBorang.appendRow(['b4', 'MRSM-KCH/SKP/02', 'Buku Log & Borang Perekodan Standard Kemahiran Pelajar (SKP)', 'SKP', 'PDF', '420 KB', '2026-02-12', 'Admin']);
  }

  return 'Database Pembangunan Bakat Kokurikulum MRSM Kuching (v2) berjaya diinisialisasi dengan 7 helaian!';
}

/**
 * Helper: Dapatkan helaian sedia ada atau cipta jika belum ada
 */
function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * ==============================================================================
 * HTTP GET HANDLER
 * ==============================================================================
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getAllData';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let responseData = {};

  try {
    if (action === 'ping') {
      responseData = {
        status: 'success',
        message: 'Google Sheets Backend MRSM Kuching aktif dan bersedia!',
        spreadsheet_name: ss.getName(),
        timestamp: new Date().toISOString()
      };
    } else if (action === 'init') {
      const initResult = initDatabase();
      responseData = {
        status: 'success',
        message: initResult
      };
    } else if (action === 'getAllData') {
      responseData = {
        status: 'success',
        data: {
          users: getSheetData(ss, SHEET_NAMES.USERS),
          students: getSheetData(ss, SHEET_NAMES.STUDENTS),
          units: getSheetData(ss, SHEET_NAMES.UNITS),
          pelaporan: getSheetData(ss, SHEET_NAMES.PELAPORAN),
          takwim: getSheetData(ss, SHEET_NAMES.TAKWIM),
          rpt: getSheetData(ss, SHEET_NAMES.RPT),
          borang: getSheetData(ss, SHEET_NAMES.BORANG)
        }
      };
    } else if (action === 'getStudents') {
      responseData = {
        status: 'success',
        students: getSheetData(ss, SHEET_NAMES.STUDENTS)
      };
    } else if (action === 'getRpt') {
      const unitId = e.parameter.unit_id;
      const allRpt = getSheetData(ss, SHEET_NAMES.RPT);
      const filtered = unitId ? allRpt.filter(r => r.unit_id === unitId) : allRpt;
      responseData = {
        status: 'success',
        rpt: filtered
      };
    } else {
      responseData = {
        status: 'error',
        message: 'Aksi GET tidak dikenali: ' + action
      };
    }
  } catch (error) {
    responseData = {
      status: 'error',
      message: error.toString()
    };
  }

  return ContentService
    .createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ==============================================================================
 * HTTP POST HANDLER
 * ==============================================================================
 */
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let responseData = {};

  try {
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      postData = e.parameter;
    }

    const action = postData.action;
    const payload = postData.payload || postData;

    switch (action) {
      case 'saveReport':
        responseData = handleSaveReport(ss, payload);
        break;

      case 'updateReportStatus':
        responseData = handleUpdateReportStatus(ss, payload);
        break;

      case 'saveUser':
        // Admin daftar guru baru
        responseData = handleSaveUser(ss, payload);
        break;

      case 'saveStudent':
        // Admin daftar pelajar baru
        responseData = handleSaveStudent(ss, payload);
        break;

      case 'saveUnit':
        // Penyelaras cipta unit kategori masing-masing
        responseData = handleSaveUnit(ss, payload);
        break;

      case 'assignAdvisor':
        // Penyelaras lantik guru penasihat ke unit
        responseData = handleAssignAdvisor(ss, payload);
        break;

      case 'assignStudentToUnit':
        // Guru penasihat daftar ahli pelajar ke unit
        responseData = handleAssignStudentToUnit(ss, payload);
        break;

      case 'saveRpt':
        // Cikgu key-in dan simpan RPT (Bil, Minggu, Aktiviti, Objektif, Tarikh)
        responseData = handleSaveRpt(ss, payload);
        break;

      case 'saveRptBatch':
        // Simpan keseluruhan jadual RPT unit
        responseData = handleSaveRptBatch(ss, payload);
        break;

      case 'saveTakwim':
        responseData = handleSaveTakwim(ss, payload);
        break;

      case 'saveBorang':
        responseData = handleSaveBorang(ss, payload);
        break;

      default:
        responseData = {
          status: 'error',
          message: 'Aksi POST tidak diketahui: ' + action
        };
    }
  } catch (error) {
    responseData = {
      status: 'error',
      message: error.toString(),
      stack: error.stack
    };
  }

  return ContentService
    .createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ==============================================================================
 * CRUD HANDLERS
 * ==============================================================================
 */

function handleSaveReport(ss, report) {
  const sheet = ss.getSheetByName(SHEET_NAMES.PELAPORAN);
  if (!sheet) throw new Error('Helaian Pelaporan tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');
  
  if (!report.id) {
    report.id = 'rep_' + Utilities.getUuid().substring(0, 8);
  }
  if (!report.timestamp) {
    report.timestamp = new Date().toISOString();
  }

  const rowValues = headers.map(header => {
    let val = report[header] !== undefined ? report[header] : '';
    if (Array.isArray(val) || typeof val === 'object') {
      return JSON.stringify(val);
    }
    return val;
  });

  let foundRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === report.id) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { status: 'success', message: 'Laporan berjaya disimpan!', reportId: report.id };
}

function handleUpdateReportStatus(ss, payload) {
  const sheet = ss.getSheetByName(SHEET_NAMES.PELAPORAN);
  if (!sheet) throw new Error('Helaian Pelaporan tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');
  const statusIndex = headers.indexOf('status');
  const penyemakIndex = headers.indexOf('disemak_oleh_nama');
  const ulasanPenyemakIndex = headers.indexOf('ulasan_penyemak');
  const tppbIndex = headers.indexOf('disahkan_oleh_nama');
  const ulasanTppbIndex = headers.indexOf('ulasan_tppb');

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === payload.id) {
      const rowNum = i + 1;
      if (payload.status) sheet.getRange(rowNum, statusIndex + 1).setValue(payload.status);
      if (payload.disemak_oleh_nama) sheet.getRange(rowNum, penyemakIndex + 1).setValue(payload.disemak_oleh_nama);
      if (payload.ulasan_penyemak) sheet.getRange(rowNum, ulasanPenyemakIndex + 1).setValue(payload.ulasan_penyemak);
      if (payload.disahkan_oleh_nama) sheet.getRange(rowNum, tppbIndex + 1).setValue(payload.disahkan_oleh_nama);
      if (payload.ulasan_tppb) sheet.getRange(rowNum, ulasanTppbIndex + 1).setValue(payload.ulasan_tppb);

      return { status: 'success', message: 'Status laporan berjaya dikemaskini!' };
    }
  }

  return { status: 'error', message: 'Laporan tidak ditemui: ' + payload.id };
}

function handleSaveUser(ss, user) {
  const sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (!sheet) throw new Error('Helaian Users tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');

  if (!user.id) user.id = 'usr_' + Date.now();

  const rowValues = headers.map(header => {
    let val = user[header] !== undefined ? user[header] : '';
    if (header === 'unit_ids' && user.units) val = user.units;
    if (Array.isArray(val) || typeof val === 'object') return JSON.stringify(val);
    return val;
  });

  let foundRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === user.id) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { status: 'success', message: 'Data guru berjaya disimpan!', userId: user.id };
}

function handleSaveStudent(ss, student) {
  const sheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  if (!sheet) throw new Error('Helaian Students tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');

  if (!student.id) student.id = 'std_' + Date.now();

  // Semak status kelengkapan 3 koko
  const isComplete = student.uniform_id && student.kelab_id && student.sukan_id;
  student.status_lengkap = isComplete 
    ? (student.skp_id ? 'Lengkap (3/3 + SKP)' : 'Lengkap (3/3)')
    : 'Belum Lengkap';

  const rowValues = headers.map(header => {
    let val = student[header] !== undefined ? student[header] : '';
    return val;
  });

  let foundRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === student.id) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { status: 'success', message: 'Pelajar berjaya didaftarkan!', studentId: student.id };
}

function handleAssignStudentToUnit(ss, payload) {
  // payload: { studentId, unitId, kategori }
  const sheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  if (!sheet) throw new Error('Helaian Students tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');
  const uniformIdx = headers.indexOf('uniform_id');
  const kelabIdx = headers.indexOf('kelab_id');
  const sukanIdx = headers.indexOf('sukan_id');
  const skpIdx = headers.indexOf('skp_id');
  const statusIdx = headers.indexOf('status_lengkap');

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === payload.studentId) {
      const rowNum = i + 1;
      let targetCol = -1;
      if (payload.kategori === 'Badan Beruniform') targetCol = uniformIdx;
      else if (payload.kategori === 'Kelab & Persatuan') targetCol = kelabIdx;
      else if (payload.kategori === 'Sukan & Permainan') targetCol = sukanIdx;
      else if (payload.kategori === 'SKP') targetCol = skpIdx;

      if (targetCol !== -1) {
        sheet.getRange(rowNum, targetCol + 1).setValue(payload.unitId);
        
        // Kemaskini status
        const curU = (targetCol === uniformIdx) ? payload.unitId : rows[i][uniformIdx];
        const curK = (targetCol === kelabIdx) ? payload.unitId : rows[i][kelabIdx];
        const curS = (targetCol === sukanIdx) ? payload.unitId : rows[i][sukanIdx];
        const curSkp = (targetCol === skpIdx) ? payload.unitId : rows[i][skpIdx];
        
        const isComplete = curU && curK && curS;
        const newStatus = isComplete 
          ? (curSkp ? 'Lengkap (3/3 + SKP)' : 'Lengkap (3/3)')
          : 'Belum Lengkap';
        sheet.getRange(rowNum, statusIdx + 1).setValue(newStatus);
      }

      return { status: 'success', message: 'Pelajar berjaya didaftarkan ke dalam unit!' };
    }
  }

  return { status: 'error', message: 'Pelajar tidak ditemui: ' + payload.studentId };
}

function handleSaveUnit(ss, unit) {
  const sheet = ss.getSheetByName(SHEET_NAMES.UNITS);
  if (!sheet) throw new Error('Helaian Units tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');

  if (!unit.id) unit.id = 'unit_' + Date.now();

  const rowValues = headers.map(header => {
    let val = unit[header] !== undefined ? unit[header] : '';
    if (Array.isArray(val) || typeof val === 'object') return JSON.stringify(val);
    return val;
  });

  let foundRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === unit.id) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { status: 'success', message: 'Unit berjaya disimpan!', unitId: unit.id };
}

function handleAssignAdvisor(ss, payload) {
  // payload: { unitId, advisorIds }
  const sheet = ss.getSheetByName(SHEET_NAMES.UNITS);
  if (!sheet) throw new Error('Helaian Units tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');
  const penasihatIndex = headers.indexOf('penasihat_ids');

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === payload.unitId) {
      sheet.getRange(i + 1, penasihatIndex + 1).setValue(JSON.stringify(payload.advisorIds));
      return { status: 'success', message: 'Guru Penasihat berjaya dilantik bagi unit ini!' };
    }
  }
  return { status: 'error', message: 'Unit tidak ditemui: ' + payload.unitId };
}

function handleSaveRpt(ss, rpt) {
  // Format: [id, unit_id, unit_nama, bil, minggu, aktiviti, objektif, tarikh, status]
  const sheet = ss.getSheetByName(SHEET_NAMES.RPT);
  if (!sheet) throw new Error('Helaian RPT tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');

  if (!rpt.id) rpt.id = 'rpt_' + Date.now();

  const rowValues = headers.map(header => {
    return rpt[header] !== undefined ? rpt[header] : '';
  });

  let foundRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === rpt.id) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return { status: 'success', message: 'Perancangan RPT berjaya disimpan!', rptId: rpt.id };
}

function handleSaveRptBatch(ss, payload) {
  // payload: { unitId, unitNama, rows: [{bil, minggu, aktiviti, objektif, tarikh, status}] }
  const sheet = ss.getSheetByName(SHEET_NAMES.RPT);
  if (!sheet) throw new Error('Helaian RPT tidak dijumpai');

  const currentRows = sheet.getDataRange().getValues();
  const headers = currentRows[0];
  const unitIdIndex = headers.indexOf('unit_id');

  // Padam baris sedia ada bagi unit ini (dari bawah ke atas)
  for (let i = currentRows.length - 1; i >= 1; i--) {
    if (currentRows[i][unitIdIndex] === payload.unitId) {
      sheet.deleteRow(i + 1);
    }
  }

  // Masukkan baris baru
  const newRows = payload.rows.map((r, index) => [
    'rpt_' + payload.unitId + '_' + (index + 1),
    payload.unitId,
    payload.unitNama || '',
    r.bil || (index + 1),
    r.minggu || ('Minggu ' + (index + 1)),
    r.aktiviti || '',
    r.objektif || '',
    r.tarikh || '',
    r.status || 'Dalam Perancangan'
  ]);

  newRows.forEach(row => sheet.appendRow(row));

  return { status: 'success', message: 'Jadual RPT berjaya disimpan sepenuhnya!', count: newRows.length };
}

function handleSaveTakwim(ss, takwim) {
  const sheet = ss.getSheetByName(SHEET_NAMES.TAKWIM);
  if (!sheet) throw new Error('Helaian Takwim tidak dijumpai');

  const headers = sheet.getDataRange().getValues()[0];
  if (!takwim.id) takwim.id = 't_' + Date.now();

  const rowValues = headers.map(h => takwim[h] !== undefined ? takwim[h] : '');
  sheet.appendRow(rowValues);
  return { status: 'success', message: 'Takwim berjaya ditambah!' };
}

function handleSaveBorang(ss, borang) {
  const sheet = ss.getSheetByName(SHEET_NAMES.BORANG);
  if (!sheet) throw new Error('Helaian Borang tidak dijumpai');

  const headers = sheet.getDataRange().getValues()[0];
  if (!borang.id) borang.id = 'b_' + Date.now();

  const rowValues = headers.map(h => borang[h] !== undefined ? borang[h] : '');
  sheet.appendRow(rowValues);
  return { status: 'success', message: 'Borang berjaya dimuat naik!' };
}

/**
 * Helper: Ambil data helaian dan tukar ke format Array of Objects
 */
function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const data = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      let val = row[j];
      // Cuba parse JSON jika rentetan bermula dengan [ atau {
      if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
        try {
          val = JSON.parse(val);
        } catch (e) {
          // Kekalkan rentetan asal
        }
      }
      item[headers[j]] = val;
    }
    data.push(item);
  }

  return data;
}
