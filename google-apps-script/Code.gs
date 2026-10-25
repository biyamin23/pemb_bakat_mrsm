/**
 * ==============================================================================
 * DASHBOARD PEMBANGUNAN BAKAT KOKURIKULUM MRSM KUCHING
 * GOOGLE APPS SCRIPT BACKEND DATABASE (API WEB APP)
 * ==============================================================================
 * 
 * Panduan Ringkas:
 * 1. Buka Google Sheets baru di Google Drive (contoh: "Database Pembangunan Bakat MRSM Kuching")
 * 2. Klik Extensions > Apps Script
 * 3. Padam kod asal dalam Code.gs dan tampal keseluruhan fail ini
 * 4. Di dropdown menu fungsi atas, pilih "initDatabase" dan tekan "Run" (beri kebenaran / authorization)
 * 5. Klik "Deploy" > "New deployment"
 *    - Select type: Web App
 *    - Description: "MRSM Kuching Talent DB API v1"
 *    - Execute as: "Me" (emel anda)
 *    - Who has access: "Anyone" (Penting supaya web app boleh capai API tanpa halangan CORS)
 * 6. Salin Web App URL (berakhir dengan /exec) dan masukkan ke dalam tetapan dashboard web app anda.
 */

const SHEET_NAMES = {
  USERS: 'Users',
  UNITS: 'Units',
  PELAPORAN: 'Pelaporan',
  TAKWIM: 'Takwim',
  RPT: 'RPT',
  BORANG: 'Borang',
  CONFIG: 'Config'
};

/**
 * Fungsi Pengesahan / Inisialisasi Database
 * Cipta semua helaian (sheets) dan masukkan baris tajuk (headers) serta data sampel awal MRSM Kuching.
 */
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet: Users
  let sheetUsers = getOrCreateSheet(ss, SHEET_NAMES.USERS);
  if (sheetUsers.getLastRow() === 0) {
    sheetUsers.appendRow([
      'id', 'no_gaji', 'nama', 'jawatan', 'roles', 'unit_ids', 'passcode'
    ]);
    sheetUsers.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#d1fae5');
    
    // Default initial users
    sheetUsers.appendRow(['usr_1021', 'G1021', 'Cikgu Azman bin Razak', 'Guru Kanan Kokurikulum', '["guru", "penyemak_uniform"]', '["unit_krs", "unit_robotik", "unit_skp_krs"]', '']);
    sheetUsers.appendRow(['usr_1045', 'G1045', 'Ustazah Nurul Ain binti Hassan', 'Guru Pendidikan Islam', '["guru", "penyemak_kelab"]', '["unit_pandu_puteri", "unit_debat"]', '']);
    sheetUsers.appendRow(['usr_1078', 'G1078', 'Cikgu Mohd Farhan bin Zulkifli', 'Guru Sains Sukan', '["guru", "penyemak_sukan"]', '["unit_polis", "unit_bola_sepak", "unit_catur"]', '']);
    sheetUsers.appendRow(['usr_1005', 'G1005', 'Cikgu Kamaruddin bin Idris', 'Ketua Penyelaras Kokurikulum', '["guru", "ketua_penyelaras"]', '["unit_pkbm", "unit_memanah"]', '']);
    sheetUsers.appendRow(['usr_1002', 'G1002', 'McManus Sing', 'Timbalan Pengetua Pembangunan Bakat', '["tppb"]', '[]', '']);
    sheetUsers.appendRow(['usr_1099', 'G1099', 'Cikgu Siti Sarah binti Osman', 'Guru Bahasa Melayu', '["guru"]', '["unit_pengakap", "unit_seni", "unit_skp_pengakap"]', '']);
    sheetUsers.appendRow(['usr_admin', 'ADMIN', 'Pentadbir Sistem MRSM', 'Admin Pusat Kokurikulum', '["admin"]', '[]', 'admin123']);
  }

  // 2. Sheet: Units
  let sheetUnits = getOrCreateSheet(ss, SHEET_NAMES.UNITS);
  if (sheetUnits.getLastRow() === 0) {
    sheetUnits.appendRow(['id', 'nama', 'kategori', 'ahli', 'penasihat_ids', 'kuota']);
    sheetUnits.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#dbeafe');

    // Default units
    sheetUnits.appendRow(['unit_krs', 'Kadet Remaja Sekolah (KRS)', 'Badan Beruniform', 48, '["usr_1021"]', 50]);
    sheetUnits.appendRow(['unit_pengakap', 'Persekutuan Pengakap Malaysia (MRSM Kuching)', 'Badan Beruniform', 42, '["usr_1099"]', 45]);
    sheetUnits.appendRow(['unit_bsmm', 'Bulan Sabit Merah Malaysia (BSMM)', 'Badan Beruniform', 45, '["usr_1112"]', 45]);
    sheetUnits.appendRow(['unit_pkbm', 'Kadet Bersatu Malaysia (PKBM Laut)', 'Badan Beruniform', 40, '["usr_1005"]', 40]);
    sheetUnits.appendRow(['unit_pandu_puteri', 'Persatuan Pandu Puteri Malaysia', 'Badan Beruniform', 43, '["usr_1045"]', 45]);
    sheetUnits.appendRow(['unit_polis', 'Kor Kadet Polis MRSM Kuching', 'Badan Beruniform', 40, '["usr_1078"]', 40]);
    sheetUnits.appendRow(['unit_robotik', 'Kelab Robotik & Inovasi AI', 'Kelab & Persatuan', 32, '["usr_1021"]', 35]);
    sheetUnits.appendRow(['unit_debat', 'Kelab Debat & Orator Maktab', 'Kelab & Persatuan', 28, '["usr_1045"]', 30]);
    sheetUnits.appendRow(['unit_seni', 'Kelab Seni Visual & Warisan Sarawak', 'Kelab & Persatuan', 30, '["usr_1099"]', 35]);
    sheetUnits.appendRow(['unit_catur', 'Kelab Catur & Sukan Minda', 'Kelab & Persatuan', 27, '["usr_1078"]', 30]);
    sheetUnits.appendRow(['unit_astronomi', 'Kelab Astronomi & Sains Angkasa', 'Kelab & Persatuan', 30, '["usr_1045"]', 30]);
    sheetUnits.appendRow(['unit_bola_sepak', 'Kelab Bola Sepak & Futsal', 'Sukan & Permainan', 36, '["usr_1078"]', 40]);
    sheetUnits.appendRow(['unit_memanah', 'Kelab Memanah Tradisional & Moden', 'Sukan & Permainan', 28, '["usr_1005"]', 30]);
    sheetUnits.appendRow(['unit_ragbi', 'Kelab Ragbi Sentuh Kuching', 'Sukan & Permainan', 30, '["usr_1021"]', 35]);
    sheetUnits.appendRow(['unit_badminton', 'Kelab Badminton & Skuasy', 'Sukan & Permainan', 32, '["usr_1045"]', 35]);
    sheetUnits.appendRow(['unit_bola_jaring', 'Kelab Bola Jaring', 'Sukan & Permainan', 28, '["usr_1099"]', 30]);
    sheetUnits.appendRow(['unit_skp_krs', 'SKP Modul Ikhtiar Hidup & Kawad KRS', 'SKP', 48, '["usr_1021"]', 50]);
    sheetUnits.appendRow(['unit_skp_pengakap', 'SKP Modul Ujian Lencana Usaha Pengakap', 'SKP', 42, '["usr_1099"]', 45]);
  }

  // 3. Sheet: Pelaporan
  let sheetPelaporan = getOrCreateSheet(ss, SHEET_NAMES.PELAPORAN);
  if (sheetPelaporan.getLastRow() === 0) {
    sheetPelaporan.appendRow([
      'id', 'unit_id', 'unit_nama', 'kategori', 'jenis', 'bil_pertemuan',
      'tarikh', 'masa_mula', 'masa_tamat', 'kehadiran_bil', 'kehadiran_jumlah',
      'objektif', 'aktiviti', 'gambar_urls', 'disediakan_oleh_id', 'disediakan_oleh_nama',
      'status', 'disemak_oleh_nama', 'ulasan_penyemak', 'disahkan_oleh_nama', 'ulasan_tppb', 'timestamp'
    ]);
    sheetPelaporan.getRange(1, 1, 1, 22).setFontWeight('bold').setBackground('#fef3c7');

    // Default sample report
    sheetPelaporan.appendRow([
      'rep_001', 'unit_krs', 'Kadet Remaja Sekolah (KRS)', 'Badan Beruniform', 'mingguan', '2',
      '2026-03-11', '15:00', '17:00', 46, 48,
      'Menerapkan disiplin kawad kaki asas formasi dan ikatan tali gajet kecemasan.',
      '1. Taklimat keselamatan dan tatatertib uniform.\n2. Latihan kawad kaki statik dan dinamik.\n3. Demonstrasi ikatan tali buku sila, tindih kasih dan simpulan kerusi.\n4. Sesi rumusan oleh Ketua Platun.',
      '["https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=80"]',
      'usr_1021', 'Cikgu Azman bin Razak (G1021)', 'disahkan',
      'Cikgu Azman bin Razak (Penyelaras Badan Beruniform)', 'Aktiviti dijalankan mengikut silibus kawad peringkat 1.',
      'McManus Sing (TPPB MRSM Kuching)', 'Laporan lengkap, disahkan untuk rekod pencapaian kokurikulum maktab.',
      new Date().toISOString()
    ]);
  }

  // 4. Sheet: Takwim
  let sheetTakwim = getOrCreateSheet(ss, SHEET_NAMES.TAKWIM);
  if (sheetTakwim.getLastRow() === 0) {
    sheetTakwim.appendRow(['id', 'aktiviti', 'tarikh', 'tempat', 'kategori', 'status']);
    sheetTakwim.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#ede9fe');

    sheetTakwim.appendRow(['takwim_1', 'Pendaftaran Unit Kokurikulum Tingkatan 1-5', '2026-03-04', 'Dewan Selera MRSM Kuching', 'Maktab', 'Selesai']);
    sheetTakwim.appendRow(['takwim_2', 'Perjumpaan Kokurikulum Mingguan Siri 1', '2026-03-11', 'Padang & Blok Kelas MRSM', 'Mingguan', 'Selesai']);
    sheetTakwim.appendRow(['takwim_3', 'Kursus Kepimpinan Manikayu & Sarjan Platun', '2026-03-25', 'Pusat Kokurikulum Kem Santubong', 'Kepimpinan', 'Selesai']);
    sheetTakwim.appendRow(['takwim_4', 'Ujian Standard Kemahiran Pelajar (SKP) Siri 1', '2026-04-08', 'Kompleks Sukan MRSM Kuching', 'SKP', 'Akan Datang']);
    sheetTakwim.appendRow(['takwim_5', 'Kejohanan Sukan Tara Antara Rumah Sukan', '2026-04-22', 'Stadium Mini MRSM Kuching', 'Sukan', 'Akan Datang']);
    sheetTakwim.appendRow(['takwim_6', 'Karnival Bakat Sains, Robotik & Debat Antara MRSM Se-Malaysia', '2026-05-13', 'MRSM Kuching (Tuan Rumah)', 'Karnival', 'Perancangan']);
  }

  // 5. Sheet: RPT
  let sheetRpt = getOrCreateSheet(ss, SHEET_NAMES.RPT);
  if (sheetRpt.getLastRow() === 0) {
    sheetRpt.appendRow(['id', 'unit_id', 'unit_nama', 'minggu', 'topik', 'objektif', 'aktiviti', 'catatan']);
    sheetRpt.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#fee2e2');

    sheetRpt.appendRow(['rpt_1', 'unit_krs', 'Kadet Remaja Sekolah', 'Minggu 1', 'Mesyuarat Agung & Pelantikan AJK', 'Memilih kepimpinan platun', 'Pencalonan & undian AJK tertinggi', 'Dilaksanakan']);
    sheetRpt.appendRow(['rpt_2', 'unit_krs', 'Kadet Remaja Sekolah', 'Minggu 2', 'Asas Kawad Kaki Statik & Lencana Kemahiran', 'Kuasai 8 arahan asas', 'Latihan kawad statik di dataran', 'Dilaksanakan']);
    sheetRpt.appendRow(['rpt_3', 'unit_robotik', 'Kelab Robotik & Inovasi AI', 'Minggu 1', 'Pengenalan Mikropengawal ESP32', 'Memahami pinout ESP32', 'Penyambungan sensor LED & Buzzer', 'Dilaksanakan']);
    sheetRpt.appendRow(['rpt_4', 'unit_robotik', 'Kelab Robotik & Inovasi AI', 'Minggu 2', 'Algoritma Navigasi Line Follower', 'Memprogramkan sensor IR', 'Ujian litar garisan hitam di makmal', 'Dilaksanakan']);
  }

  // 6. Sheet: Borang
  let sheetBorang = getOrCreateSheet(ss, SHEET_NAMES.BORANG);
  if (sheetBorang.getLastRow() === 0) {
    sheetBorang.appendRow(['id', 'kod', 'tajuk', 'format', 'saiz', 'kategori', 'tarikh', 'url']);
    sheetBorang.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#ffedd5');

    sheetBorang.appendRow(['b_1', 'B-KOKO-01', 'Borang Kebenaran Ibu Bapa / Penjaga Aktiviti Luar', 'PDF', '245 KB', 'Umum', '2026-03-01', '#']);
    sheetBorang.appendRow(['b_2', 'B-KOKO-02', 'Borang Tuntutan Perjalanan & Peruntukan Kokurikulum', 'DOCX', '310 KB', 'Kewangan', '2026-03-05', '#']);
    sheetBorang.appendRow(['b_3', 'B-KOKO-03', 'Borang Pendaftaran Kontinjen Pertandingan Luar', 'PDF', '180 KB', 'Pertandingan', '2026-03-10', '#']);
    sheetBorang.appendRow(['b_4', 'B-SKP-01', 'Buku Log Penilaian Standard Kemahiran Pelajar (SKP)', 'PDF', '420 KB', 'SKP', '2026-03-12', '#']);
  }

  return 'Database Pembangunan Bakat Kokurikulum MRSM Kuching berjaya diwujudkan dan diinisialisasi!';
}

/**
 * Helper: Dapatkan helaian sedia ada atau cipta helaian baharu jika belum wujud
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
 * HTTP GET HANDLER: Pengambilan Data (Fetch API)
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
        message: 'Google Sheets API MRSM Kuching aktif',
        maktab: 'MRSM Kuching',
        tppb: 'McManus Sing',
        timestamp: new Date().toISOString()
      };
    } else if (action === 'init') {
      const msg = initDatabase();
      responseData = { status: 'success', message: msg };
    } else if (action === 'getAllData') {
      responseData = {
        status: 'success',
        maktab: 'MRSM Kuching',
        tppb: 'McManus Sing',
        data: {
          users: readSheetAsObjects(ss, SHEET_NAMES.USERS),
          units: readSheetAsObjects(ss, SHEET_NAMES.UNITS),
          pelaporan: readSheetAsObjects(ss, SHEET_NAMES.PELAPORAN),
          takwim: readSheetAsObjects(ss, SHEET_NAMES.TAKWIM),
          rpt: readSheetAsObjects(ss, SHEET_NAMES.RPT),
          borang: readSheetAsObjects(ss, SHEET_NAMES.BORANG)
        },
        timestamp: new Date().toISOString()
      };
    } else if (action === 'getPelaporan') {
      responseData = {
        status: 'success',
        data: readSheetAsObjects(ss, SHEET_NAMES.PELAPORAN)
      };
    } else {
      responseData = {
        status: 'error',
        message: 'Aksi GET tidak sah: ' + action
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
 * HTTP POST HANDLER: Penulisan & Kemaskini Data (Write API)
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

    if (action === 'saveReport') {
      // Cipta laporan baru atau kemaskini laporan sedia ada
      responseData = handleSaveReport(ss, payload);
    } else if (action === 'updateReportStatus') {
      // Semak / Lulus laporan (Penyelaras atau TPPB McManus Sing)
      responseData = handleUpdateReportStatus(ss, payload);
    } else if (action === 'saveUser') {
      // Daftar guru baru oleh Admin
      responseData = handleSaveUser(ss, payload);
    } else if (action === 'saveUnit') {
      // Daftar unit baru oleh Admin
      responseData = handleSaveUnit(ss, payload);
    } else if (action === 'saveTakwim') {
      // Tambah takwim baru
      responseData = handleSaveTakwim(ss, payload);
    } else if (action === 'saveRpt') {
      // Tambah RPT baru
      responseData = handleSaveRpt(ss, payload);
    } else if (action === 'saveBorang') {
      // Tambah borang baru
      responseData = handleSaveBorang(ss, payload);
    } else {
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

  // Cari jika ID laporan sudah ada (Kemaskini)
  let foundRowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(report.id)) {
      foundRowIndex = i + 1; // 1-indexed
      break;
    }
  }

  const rowData = [
    report.id || '',
    report.unit_id || '',
    report.unit_nama || '',
    report.kategori || '',
    report.jenis || 'mingguan',
    report.bil_pertemuan || '1',
    report.tarikh || '',
    report.masa_mula || '',
    report.masa_tamat || '',
    Number(report.kehadiran_bil) || 0,
    Number(report.kehadiran_jumlah) || 0,
    report.objektif || '',
    report.aktiviti || '',
    typeof report.gambar_urls === 'string' ? report.gambar_urls : JSON.stringify(report.gambar_urls || []),
    report.disediakan_oleh_id || '',
    report.disediakan_oleh_nama || '',
    report.status || 'dihantar',
    report.disemak_oleh_nama || '',
    report.ulasan_penyemak || '',
    report.disahkan_oleh_nama || '',
    report.ulasan_tppb || '',
    report.timestamp || new Date().toISOString()
  ];

  if (foundRowIndex > 0) {
    sheet.getRange(foundRowIndex, 1, 1, rowData.length).setValues([rowData]);
    return { status: 'success', message: 'Laporan berjaya dikemaskini', reportId: report.id };
  } else {
    sheet.appendRow(rowData);
    return { status: 'success', message: 'Laporan baru berjaya disimpan', reportId: report.id };
  }
}

function handleUpdateReportStatus(ss, data) {
  const sheet = ss.getSheetByName(SHEET_NAMES.PELAPORAN);
  if (!sheet) throw new Error('Helaian Pelaporan tidak dijumpai');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const idIndex = headers.indexOf('id');
  const statusIndex = headers.indexOf('status');
  const disemakIndex = headers.indexOf('disemak_oleh_nama');
  const ulasanPenyemakIndex = headers.indexOf('ulasan_penyemak');
  const disahkanIndex = headers.indexOf('disahkan_oleh_nama');
  const ulasanTppbIndex = headers.indexOf('ulasan_tppb');

  let targetRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(data.reportId)) {
      targetRow = i + 1;
      break;
    }
  }

  if (targetRow === -1) {
    return { status: 'error', message: 'Laporan tidak dijumpai: ' + data.reportId };
  }

  if (data.status) {
    sheet.getRange(targetRow, statusIndex + 1).setValue(data.status);
  }
  if (data.disemak_oleh_nama && disemakIndex !== -1) {
    sheet.getRange(targetRow, disemakIndex + 1).setValue(data.disemak_oleh_nama);
  }
  if (data.ulasan_penyemak && ulasanPenyemakIndex !== -1) {
    sheet.getRange(targetRow, ulasanPenyemakIndex + 1).setValue(data.ulasan_penyemak);
  }
  if (data.disahkan_oleh_nama && disahkanIndex !== -1) {
    sheet.getRange(targetRow, disahkanIndex + 1).setValue(data.disahkan_oleh_nama);
  }
  if (data.ulasan_tppb && ulasanTppbIndex !== -1) {
    sheet.getRange(targetRow, ulasanTppbIndex + 1).setValue(data.ulasan_tppb);
  }

  return {
    status: 'success',
    message: 'Status laporan berjaya dikemaskini kepada: ' + data.status,
    reportId: data.reportId
  };
}

function handleSaveUser(ss, user) {
  const sheet = ss.getSheetByName(SHEET_NAMES.USERS);
  if (!sheet) throw new Error('Helaian Users tidak dijumpai');

  if (!user.id) {
    user.id = 'usr_' + (user.no_gaji ? user.no_gaji.replace(/\D/g, '') : Utilities.getUuid().substring(0, 4));
  }

  const rowData = [
    user.id,
    user.no_gaji || '',
    user.nama || '',
    user.jawatan || 'Guru Penasihat Kokurikulum',
    typeof user.roles === 'string' ? user.roles : JSON.stringify(user.roles || ['guru']),
    typeof user.unit_ids === 'string' ? user.unit_ids : JSON.stringify(user.unit_ids || []),
    user.passcode || ''
  ];

  sheet.appendRow(rowData);
  return { status: 'success', message: 'Guru berjaya didaftarkan', userId: user.id };
}

function handleSaveUnit(ss, unit) {
  const sheet = ss.getSheetByName(SHEET_NAMES.UNITS);
  if (!sheet) throw new Error('Helaian Units tidak dijumpai');

  if (!unit.id) {
    unit.id = 'unit_' + Utilities.getUuid().substring(0, 6);
  }

  const rowData = [
    unit.id,
    unit.nama || '',
    unit.kategori || 'Kelab & Persatuan',
    Number(unit.ahli) || 0,
    typeof unit.penasihat_ids === 'string' ? unit.penasihat_ids : JSON.stringify(unit.penasihat_ids || []),
    Number(unit.kuota) || 40
  ];

  sheet.appendRow(rowData);
  return { status: 'success', message: 'Unit kokurikulum berjaya didaftarkan', unitId: unit.id };
}

function handleSaveTakwim(ss, takwim) {
  const sheet = ss.getSheetByName(SHEET_NAMES.TAKWIM);
  if (!sheet) throw new Error('Helaian Takwim tidak dijumpai');

  if (!takwim.id) {
    takwim.id = 'takwim_' + Utilities.getUuid().substring(0, 6);
  }

  const rowData = [
    takwim.id,
    takwim.aktiviti || '',
    takwim.tarikh || '',
    takwim.tempat || 'MRSM Kuching',
    takwim.kategori || 'Umum',
    takwim.status || 'Perancangan'
  ];

  sheet.appendRow(rowData);
  return { status: 'success', message: 'Takwim berjaya ditambah', takwimId: takwim.id };
}

function handleSaveRpt(ss, rpt) {
  const sheet = ss.getSheetByName(SHEET_NAMES.RPT);
  if (!sheet) throw new Error('Helaian RPT tidak dijumpai');

  if (!rpt.id) {
    rpt.id = 'rpt_' + Utilities.getUuid().substring(0, 6);
  }

  const rowData = [
    rpt.id,
    rpt.unit_id || '',
    rpt.unit_nama || '',
    rpt.minggu || 'Minggu 1',
    rpt.topik || '',
    rpt.objektif || '',
    rpt.aktiviti || '',
    rpt.catatan || 'Perancangan'
  ];

  sheet.appendRow(rowData);
  return { status: 'success', message: 'RPT berjaya ditambah', rptId: rpt.id };
}

function handleSaveBorang(ss, borang) {
  const sheet = ss.getSheetByName(SHEET_NAMES.BORANG);
  if (!sheet) throw new Error('Helaian Borang tidak dijumpai');

  if (!borang.id) {
    borang.id = 'b_' + Utilities.getUuid().substring(0, 6);
  }

  const rowData = [
    borang.id,
    borang.kod || 'B-KOKO',
    borang.tajuk || '',
    borang.format || 'PDF',
    borang.saiz || '250 KB',
    borang.kategori || 'Umum',
    borang.tarikh || Utilities.formatDate(new Date(), 'GMT+8', 'yyyy-MM-dd'),
    borang.url || '#'
  ];

  sheet.appendRow(rowData);
  return { status: 'success', message: 'Borang berjaya dimuat naik', borangId: borang.id };
}

/**
 * ==============================================================================
 * HELPER: Baca Helaian sebagai Array of Objects JSON
 * ==============================================================================
 */
function readSheetAsObjects(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const list = [];

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      let val = row[c];
      
      // Auto parse JSON strings for arrays (e.g. roles, unit_ids, gambar_urls)
      if (typeof val === 'string' && (val.startsWith('[') && val.endsWith(']'))) {
        try {
          val = JSON.parse(val);
        } catch (e) {
          // kekalkan sebagai string jika bukan JSON sah
        }
      }
      
      // Auto format date
      if (val instanceof Date) {
        val = Utilities.formatDate(val, 'GMT+8', 'yyyy-MM-dd');
      }

      obj[headers[c]] = val;
    }
    list.push(obj);
  }

  return list;
}
