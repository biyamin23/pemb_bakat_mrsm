// ==========================================================================
// APP LOGIC & STATE CONTROLLER - DASHBOARD PEMBANGUNAN BAKAT MRSM
// ==========================================================================

let appState = {
  currentUser: null,
  activeTab: "dashboard", // dashboard | pelaporan | maklumat | rpt | borang | admin
  pelaporanSubTab: "semua", // semua | mingguan | skp | program
  pelaporanFilterStatus: "semua",
  maklumatSubTab: "takwim", // takwim | rumah_sukan
  rumahSukanFilter: "semua",
  selectedReportForPrint: null,
  uploadedImages: []
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  
  // Set default user: Cikgu Azman (Guru Penasihat + Penyelaras Badan Beruniform)
  const data = getAppData();
  const defaultUser = data.users.find(u => u.no_gaji === "G1021") || data.users[0];
  setCurrentUser(defaultUser);

  setupEventListeners();
  updateDbStatusBadge();
  renderApp();

  // Background Google Sheets cloud sync jika URL telah dikonfigurasi
  if (window.DatabaseService && DatabaseService.isConnected()) {
    DatabaseService.syncFromGoogleSheets().then(res => {
      if (res.success) {
        renderApp();
      }
    });
  }
});

// Set Current User & Update UI
function setCurrentUser(user) {
  appState.currentUser = user;
  
  // Update Top Quick Switcher Select
  const select = document.getElementById("quickUserSelect");
  if (select) {
    select.value = user.id;
  }

  // Update Top Banner Info
  const userDisplay = document.getElementById("activeUserDisplay");
  if (userDisplay) {
    const roleLabels = user.roles.map(r => formatRoleName(r)).join(", ");
    userDisplay.innerHTML = `<strong>${user.nama}</strong> (${user.no_gaji}) &bull; <span class="badge-role-tag">${roleLabels}</span>`;
  }

  // Update Sidebar User Card
  renderSidebarUserCard();

  // Show/Hide Admin Navigation Link
  const adminNav = document.getElementById("navAdminBtn");
  if (adminNav) {
    if (user.roles.includes("admin")) {
      adminNav.style.display = "flex";
    } else {
      adminNav.style.display = "none";
      if (appState.activeTab === "admin") {
        appState.activeTab = "dashboard";
      }
    }
  }

  renderApp();
}

function formatRoleName(role) {
  switch (role) {
    case "admin": return "Pentadbir";
    case "tppb": return "TPPB (Pengesah)";
    case "ketua_penyelaras": return "Ketua Penyelaras";
    case "penyemak_uniform": return "Penyelaras Uniform";
    case "penyemak_kelab": return "Penyelaras Kelab";
    case "penyemak_sukan": return "Penyelaras Sukan";
    case "guru": return "Guru Penasihat";
    default: return role;
  }
}

function renderSidebarUserCard() {
  const container = document.getElementById("sidebarUserCard");
  if (!container || !appState.currentUser) return;

  const u = appState.currentUser;
  const initials = u.nama.split(" ").slice(0, 2).map(n => n[0]).join("");
  const rolesHtml = u.roles.map(r => {
    let cls = "role-pill";
    if (r === "admin") cls += " admin";
    else if (r === "tppb") cls += " tppb";
    else if (r.startsWith("penyemak") || r === "ketua_penyelaras") cls += " penyemak";
    return `<span class="${cls}">${formatRoleName(r)}</span>`;
  }).join("");

  container.innerHTML = `
    <div class="user-card-header">
      <div class="avatar-clay">${initials}</div>
      <div class="user-meta">
        <h4>${u.nama}</h4>
        <p>${u.no_gaji} &bull; ${u.jawatan || "Staf MRSM"}</p>
      </div>
    </div>
    <div class="user-roles-list">
      ${rolesHtml}
    </div>
  `;
}

// Event Listeners
function setupEventListeners() {
  // Navigation Links (Sidebar)
  document.querySelectorAll(".clay-nav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = e.currentTarget.getAttribute("data-tab");
      if (tab) {
        appState.activeTab = tab;
        renderApp();
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Mobile Bottom Navigation Links
  document.querySelectorAll(".bottom-nav-item[data-tab]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = e.currentTarget.getAttribute("data-tab");
      if (tab) {
        appState.activeTab = tab;
        renderApp();
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Quick Role Switcher Change
  const quickSelect = document.getElementById("quickUserSelect");
  if (quickSelect) {
    quickSelect.addEventListener("change", (e) => {
      const data = getAppData();
      const user = data.users.find(u => u.id === e.target.value);
      if (user) {
        setCurrentUser(user);
        showToast(`Beralih peranan: ${user.nama} (${user.no_gaji})`);
      }
    });
  }

  // Auth Switch / Login Modal Button
  const btnAuth = document.getElementById("btnAuthSwitch");
  if (btnAuth) {
    btnAuth.addEventListener("click", () => openLoginModal());
  }

  // Image Upload Handling in Report Modal
  const dropzone = document.getElementById("reportImageDropzone");
  const fileInput = document.getElementById("reportFileInput");
  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handleImageUpload);
  }

  // Preset Sample Images Button
  const btnSampleImages = document.getElementById("btnSampleImages");
  if (btnSampleImages) {
    btnSampleImages.addEventListener("click", () => {
      appState.uploadedImages = [
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=80"
      ];
      renderImageThumbnails();
      showToast("Gambar sampel kokurikulum berjaya dimuatkan!");
    });
  }

  // Close any modal when clicking on the dark backdrop overlay
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });
}

// Mobile Sidebar Drawer Helpers
function toggleMobileSidebar() {
  const sidebar = document.getElementById("claySidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (sidebar) sidebar.classList.toggle("sidebar-open");
  if (backdrop) backdrop.classList.toggle("active");
}

function openMobileSidebar() {
  const sidebar = document.getElementById("claySidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (sidebar) sidebar.classList.add("sidebar-open");
  if (backdrop) backdrop.classList.add("active");
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("claySidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (sidebar) sidebar.classList.remove("sidebar-open");
  if (backdrop) backdrop.classList.remove("active");
}

// Master Render Function
function renderApp() {
  const container = document.getElementById("mainContentBody");
  if (!container) return;

  // Sync Sidebar Active Classes
  document.querySelectorAll(".clay-nav-btn").forEach(btn => {
    if (btn.getAttribute("data-tab") === appState.activeTab) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Sync Bottom Nav Active Classes
  document.querySelectorAll(".bottom-nav-item[data-tab]").forEach(btn => {
    if (btn.getAttribute("data-tab") === appState.activeTab) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update Pending Badges on Sidebar & Bottom Nav
  updatePendingBadges();

  switch (appState.activeTab) {
    case "dashboard":
      container.innerHTML = renderDashboardView();
      initDashboardCharts();
      break;
    case "pelaporan":
      container.innerHTML = renderPelaporanView();
      break;
    case "maklumat":
      container.innerHTML = renderMaklumatView();
      break;
    case "rpt":
      container.innerHTML = renderRptView();
      break;
    case "borang":
      container.innerHTML = renderBorangView();
      break;
    case "admin":
      container.innerHTML = renderAdminView();
      break;
    default:
      container.innerHTML = renderDashboardView();
  }
}

// Update badges on sidebar & bottom nav (Laporan menunggu tindakan)
function updatePendingBadges() {
  const data = getAppData();
  const user = appState.currentUser;
  let count = 0;

  if (user) {
    if (user.roles.includes("tppb")) {
      count = data.pelaporan.filter(l => l.status === "disemak").length;
    } else if (user.roles.some(r => r.startsWith("penyemak") || r === "ketua_penyelaras")) {
      count = data.pelaporan.filter(l => l.status === "dihantar").length;
    }
  }

  // Update Sidebar Badge
  const badge = document.getElementById("pelaporanBadgeCount");
  if (badge) {
    if (count > 0) {
      badge.style.display = "inline-block";
      badge.textContent = count;
    } else {
      badge.style.display = "none";
    }
  }

  // Update Mobile Bottom Nav Badge
  const bottomBadge = document.getElementById("bottomNavBadgeCount");
  if (bottomBadge) {
    if (count > 0) {
      bottomBadge.style.display = "inline-block";
      bottomBadge.textContent = count;
    } else {
      bottomBadge.style.display = "none";
    }
  }
}

// ==========================================================================
// 1. DASHBOARD & ANALISIS VIEW
// ==========================================================================
function renderDashboardView() {
  const data = getAppData();
  const totalAhli = data.units.reduce((sum, u) => sum + (u.ahli || 0), 0);
  const totalUnits = data.units.length;
  const totalLaporan = data.pelaporan.length;
  const laporanSelesai = data.pelaporan.filter(l => l.status === "disahkan").length;
  const laporanMenunggu = data.pelaporan.filter(l => l.status === "dihantar" || l.status === "disemak").length;

  // Weekly submission analysis (Minggu 2 / Pertemuan terkini)
  const unitsHantar = data.pelaporan.filter(l => l.jenis === "mingguan" && l.bil_pertemuan === "2").map(l => l.unit_id);
  const unitBelumHantar = data.units.filter(u => !unitsHantar.includes(u.id));

  let belumHantarRows = unitBelumHantar.map(u => {
    // Cari nama guru penasihat
    const guru = data.users.find(g => u.penasihat_ids && u.penasihat_ids.includes(g.id)) || { nama: "Belum Ditetapkan", no_gaji: "-" };
    return `
      <tr>
        <td><strong>${u.nama}</strong></td>
        <td><span class="role-pill">${u.kategori}</span></td>
        <td>${guru.nama} <span style="font-size: 0.75rem; color: var(--text-muted);">(${guru.no_gaji})</span></td>
        <td><span class="badge-status rejected">Belum Hantar</span></td>
        <td>
          <button class="btn-clay btn-clay-sm btn-clay-orange" onclick="hantarPeringatan('${u.nama}', '${guru.nama}')">
            🔔 Peringatan
          </button>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <div class="content-header">
      <div class="header-title-box">
        <h1>Dashboard Pembangunan Bakat MRSM Kuching</h1>
        <p>Pemantauan Penglibatan Kokurikulum, Penghantaran Pelaporan & Analisis Bakat Maktab</p>
      </div>
      <div class="header-actions">
        <button class="btn-clay btn-clay-primary" onclick="openCreateReportModal()">
          <span>+</span> Cipta Pelaporan Baru
        </button>
      </div>
    </div>

    <!-- Clay Stat Cards Grid (Inspired by Clay Reference Card) -->
    <div class="stat-cards-grid">
      <div class="clay-stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="background: #e0f2fe; color: #0284c7;">👥</div>
          <span class="stat-pill blue">+18% Aktif</span>
        </div>
        <div class="stat-body">
          <h3>${totalAhli}</h3>
          <p>Jumlah Pelajar Berdaftar Kokurikulum</p>
        </div>
      </div>

      <div class="clay-stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="background: #dcfce7; color: #16a34a;">🏅</div>
          <span class="stat-pill green">+24% Lengkap</span>
        </div>
        <div class="stat-body">
          <h3>${totalUnits} Unit</h3>
          <p>Badan Uniform, Kelab & Sukan</p>
        </div>
      </div>

      <div class="clay-stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="background: #fef3c7; color: #d97706;">📝</div>
          <span class="stat-pill orange">${laporanMenunggu} Menunggu</span>
        </div>
        <div class="stat-body">
          <h3>${totalLaporan} Rekod</h3>
          <p>Jumlah Laporan Aktiviti & SKP</p>
        </div>
      </div>

      <div class="clay-stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="background: #ede9fe; color: #7c3aed;">✅</div>
          <span class="stat-pill purple">+32% Sah TPPB</span>
        </div>
        <div class="stat-body">
          <h3>${laporanSelesai} Disahkan</h3>
          <p>Laporan Lengkap Bersijil & Cop</p>
        </div>
      </div>
    </div>

    <!-- Analytics & Charts Grid -->
    <div class="clay-dashboard-charts-grid">
      <div class="clay-card">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          📊 Taburan Ahli Mengikut Kategori Kokurikulum
        </h3>
        <div id="chartKategoriKokurikulum" style="display: flex; flex-direction: column; gap: 14px; margin-top: 10px;">
          <!-- Custom Clay Bar Visuals -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.825rem; font-weight: 700; margin-bottom: 4px;">
              <span>🛡️ Badan Beruniform</span>
              <span>258 Pelajar (42%)</span>
            </div>
            <div style="background: var(--bg-sidebar); height: 18px; border-radius: var(--radius-full); box-shadow: var(--clay-shadow-input); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #10b981, #34d399); width: 42%; height: 100%; border-radius: var(--radius-full); box-shadow: var(--clay-shadow-pill);"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.825rem; font-weight: 700; margin-bottom: 4px;">
              <span>💡 Kelab & Persatuan</span>
              <span>177 Pelajar (29%)</span>
            </div>
            <div style="background: var(--bg-sidebar); height: 18px; border-radius: var(--radius-full); box-shadow: var(--clay-shadow-input); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #3b82f6, #60a5fa); width: 29%; height: 100%; border-radius: var(--radius-full); box-shadow: var(--clay-shadow-pill);"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.825rem; font-weight: 700; margin-bottom: 4px;">
              <span>⚽ Sukan & Permainan</span>
              <span>180 Pelajar (29%)</span>
            </div>
            <div style="background: var(--bg-sidebar); height: 18px; border-radius: var(--radius-full); box-shadow: var(--clay-shadow-input); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #f97316, #fb923c); width: 29%; height: 100%; border-radius: var(--radius-full); box-shadow: var(--clay-shadow-pill);"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="clay-card">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          🏠 Taburan Mengikut Rumah Sukan MRSM
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 10px;">
          <div style="background: #fef3c7; padding: 14px; border-radius: var(--radius-md); box-shadow: var(--clay-shadow-pill); text-align: center;">
            <div style="font-size: 1.2rem; font-weight: 800; color: #b45309;">Bendahara</div>
            <p style="font-size: 0.775rem; color: #78350f; font-weight: 700;">Warna Kuning &bull; 155 Ahli</p>
          </div>
          <div style="background: #fee2e2; padding: 14px; border-radius: var(--radius-md); box-shadow: var(--clay-shadow-pill); text-align: center;">
            <div style="font-size: 1.2rem; font-weight: 800; color: #b91c1c;">Temenggung</div>
            <p style="font-size: 0.775rem; color: #7f1d1d; font-weight: 700;">Warna Merah &bull; 152 Ahli</p>
          </div>
          <div style="background: #dbeafe; padding: 14px; border-radius: var(--radius-md); box-shadow: var(--clay-shadow-pill); text-align: center;">
            <div style="font-size: 1.2rem; font-weight: 800; color: #1d4ed8;">Laksamana</div>
            <p style="font-size: 0.775rem; color: #1e3a8a; font-weight: 700;">Warna Biru &bull; 154 Ahli</p>
          </div>
          <div style="background: #d1fae5; padding: 14px; border-radius: var(--radius-md); box-shadow: var(--clay-shadow-pill); text-align: center;">
            <div style="font-size: 1.2rem; font-weight: 800; color: #047857;">Syahbandar</div>
            <p style="font-size: 0.775rem; color: #064e3b; font-weight: 700;">Warna Hijau &bull; 154 Ahli</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pemantauan Penghantaran Laporan Mingguan Kokurikulum -->
    <div class="clay-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 800;">Pemantauan Penghantaran Laporan Mingguan</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Status penghantaran laporan aktiviti minggu semasa bagi tujuan tindakan Penyelaras & TPPB</p>
        </div>
        <div>
          <span class="badge-status pending">${unitBelumHantar.length} Unit Belum Hantar</span>
        </div>
      </div>

      <div class="mobile-table-hint">👉 Leret ke tepi untuk lihat maklumat & tindakan penuh</div>
      <div class="clay-table-responsive">
        <table class="clay-table">
          <thead>
            <tr>
              <th>Unit Kokurikulum</th>
              <th>Kategori</th>
              <th>Guru Penasihat (No. Gaji)</th>
              <th>Status Pertemuan Semasa</th>
              <th>Tindakan Peringatan</th>
            </tr>
          </thead>
          <tbody>
            ${belumHantarRows || `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Semua unit telah menghantar laporan mingguan!</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function initDashboardCharts() {
  // Can be expanded with dynamic chart libraries if needed
}

function hantarPeringatan(unitNama, guruNama) {
  showToast(`Notifikasi peringatan berjaya dihantar kepada ${guruNama} bagi unit ${unitNama}!`);
}

// ==========================================================================
// 2. PELAPORAN KOKURIKULUM VIEW (Mingguan, SKP, Program/Pertandingan)
// ==========================================================================
function renderPelaporanView() {
  const data = getAppData();
  const user = appState.currentUser;

  // Filter based on subtab and status
  let filtered = data.pelaporan;
  if (appState.pelaporanSubTab !== "semua") {
    filtered = filtered.filter(l => l.jenis === appState.pelaporanSubTab);
  }
  if (appState.pelaporanFilterStatus !== "semua") {
    filtered = filtered.filter(l => l.status === appState.pelaporanFilterStatus);
  }

  // Generate cards
  const cardsHtml = filtered.map(item => {
    let statusBadge = "";
    if (item.status === "disahkan") {
      statusBadge = `<span class="badge-status approved">✅ Disahkan TPPB</span>`;
    } else if (item.status === "disemak") {
      statusBadge = `<span class="badge-status reviewed">🔍 Disemak (Menunggu TPPB)</span>`;
    } else if (item.status === "dihantar") {
      statusBadge = `<span class="badge-status pending">⏳ Dihantar (Menunggu Semakan)</span>`;
    } else {
      statusBadge = `<span class="badge-status draft">📝 Draf</span>`;
    }

    // Role-based action buttons
    let actionButtons = `
      <button class="btn-clay btn-clay-sm btn-clay-secondary" onclick="openPrintPreviewModal('${item.id}')">
        🖨️ Cetak / Print Preview
      </button>
    `;

    // Penyemak / Ketua Penyelaras Action
    if (user && (user.roles.some(r => r.startsWith("penyemak")) || user.roles.includes("ketua_penyelaras") || user.roles.includes("admin"))) {
      if (item.status === "dihantar") {
        actionButtons += `
          <button class="btn-clay btn-clay-sm btn-clay-blue" onclick="prosesSemakan('${item.id}')">
            ✔️ Semak & Luluskan
          </button>
          <button class="btn-clay btn-clay-sm btn-clay-orange" onclick="pintaPindaan('${item.id}')">
            ✏️ Pinda
          </button>
        `;
      }
    }

    // TPPB Action (Pengesah)
    if (user && (user.roles.includes("tppb") || user.roles.includes("admin"))) {
      if (item.status === "disemak") {
        actionButtons += `
          <button class="btn-clay btn-clay-sm btn-clay-primary" onclick="prosesPengesahanTPPB('${item.id}')">
            ✍️ Sahkan Laporan
          </button>
        `;
      }
    }

    // Gambar thumbnails
    let imagesHtml = "";
    if (item.gambar && item.gambar.length > 0) {
      imagesHtml = `
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          ${item.gambar.map(g => `<img src="${g}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover; box-shadow: var(--clay-shadow-pill); border: 2px solid #fff;" alt="Dokumentasi">`).join("")}
        </div>
      `;
    }

    let jenisLabel = item.jenis === "skp" ? "Standard Kemahiran (SKP)" : (item.jenis === "program" ? "Program / Pertandingan" : "Pertemuan Mingguan");

    return `
      <div class="clay-card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span class="role-pill" style="background: var(--bg-surface); color: var(--text-muted); font-size: 0.725rem;">
              ${jenisLabel} &bull; Sesi ${item.bil_pertemuan}
            </span>
            ${statusBadge}
          </div>

          <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">
            ${item.unit_nama}
          </h3>

          <div style="display: flex; gap: 14px; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
            <span>📅 ${item.tarikh} (${item.hari})</span>
            <span>⏰ ${item.masa_mula} - ${item.masa_tamat}</span>
            <span>👥 Kehadiran: ${item.kehadiran_hadir}/${item.kehadiran_total}</span>
          </div>

          <div style="background: var(--bg-surface); padding: 10px 12px; border-radius: var(--radius-md); box-shadow: var(--clay-shadow-input); font-size: 0.825rem; margin-bottom: 10px;">
            <strong>Objektif:</strong> ${item.objektif || "Tiada objektif khusus direkodkan."}
          </div>

          ${imagesHtml}

          <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 12px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 8px;">
            <div><strong>Disediakan Oleh:</strong> ${item.disediakan_oleh}</div>
            ${item.disemak_oleh ? `<div><strong>Disemak Oleh:</strong> ${item.disemak_oleh}</div>` : ""}
            ${item.disahkan_oleh ? `<div><strong>Disahkan Oleh:</strong> ${item.disahkan_oleh}</div>` : ""}
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 10px;">
          ${actionButtons}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="content-header">
      <div class="header-title-box">
        <h1>Modul Pelaporan Kokurikulum</h1>
        <p>Pengurusan Pertemuan Mingguan, Standard Kemahiran Pelajar (SKP), dan Program/Pertandingan</p>
      </div>
      <div class="header-actions">
        <button class="btn-clay btn-clay-primary" onclick="openCreateReportModal()">
          <span>+</span> Cipta Pelaporan Baru
        </button>
      </div>
    </div>

    <!-- Sub-tab filters -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 20px;">
      <div class="clay-tabs">
        <button class="clay-tab-item ${appState.pelaporanSubTab === 'semua' ? 'active' : ''}" onclick="setPelaporanSubTab('semua')">Semua Laporan</button>
        <button class="clay-tab-item ${appState.pelaporanSubTab === 'mingguan' ? 'active' : ''}" onclick="setPelaporanSubTab('mingguan')">Pertemuan Mingguan</button>
        <button class="clay-tab-item ${appState.pelaporanSubTab === 'skp' ? 'active' : ''}" onclick="setPelaporanSubTab('skp')">Pelaporan SKP</button>
        <button class="clay-tab-item ${appState.pelaporanSubTab === 'program' ? 'active' : ''}" onclick="setPelaporanSubTab('program')">Program & Pertandingan</button>
      </div>

      <div style="display: flex; gap: 10px; align-items: center;">
        <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">Status:</label>
        <select class="clay-select" style="width: auto; padding: 6px 14px;" onchange="setPelaporanStatusFilter(this.value)">
          <option value="semua" ${appState.pelaporanFilterStatus === 'semua' ? 'selected' : ''}>Semua Status</option>
          <option value="dihantar" ${appState.pelaporanFilterStatus === 'dihantar' ? 'selected' : ''}>Menunggu Semakan</option>
          <option value="disemak" ${appState.pelaporanFilterStatus === 'disemak' ? 'selected' : ''}>Menunggu Pengesahan TPPB</option>
          <option value="disahkan" ${appState.pelaporanFilterStatus === 'disahkan' ? 'selected' : ''}>Telah Disahkan</option>
        </select>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="reports-card-grid">
      ${cardsHtml || `<div class="clay-card" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Tiada rekod pelaporan dijumpai bagi kategori ini.</div>`}
    </div>
  `;
}

function setPelaporanSubTab(tab) {
  appState.pelaporanSubTab = tab;
  renderApp();
}

function setPelaporanStatusFilter(status) {
  appState.pelaporanFilterStatus = status;
  renderApp();
}

// Tindakan Semak oleh Penyelaras
function prosesSemakan(id) {
  const data = getAppData();
  const laporan = data.pelaporan.find(l => l.id === id);
  if (!laporan) return;

  const user = appState.currentUser;
  laporan.status = "disemak";
  laporan.disemak_oleh = `${user.nama} (${formatRoleName(user.roles[0])})`;
  laporan.tarikh_disemak = new Date().toISOString().replace("T", " ").substring(0, 16);
  laporan.catatan_semakan = "Disemak dan disahkan mematuhi kehendak kokurikulum maktab.";

  saveAppData(data);
  if (window.DatabaseService) {
    DatabaseService.postAction("updateReportStatus", {
      reportId: laporan.id,
      status: "disemak",
      disemak_oleh_nama: laporan.disemak_oleh,
      ulasan_penyemak: laporan.catatan_semakan
    });
  }

  showToast(`Laporan ${laporan.unit_nama} berjaya disemak & diserahkan kepada TPPB untuk pengesahan!`);
  renderApp();
}

function pintaPindaan(id) {
  const catatan = prompt("Sila nyatakan bahagian yang perlu dipinda oleh Guru Penasihat:");
  if (catatan) {
    const data = getAppData();
    const laporan = data.pelaporan.find(l => l.id === id);
    if (!laporan) return;

    laporan.status = "draf";
    laporan.catatan_semakan = `Pindaan diperlukan: ${catatan}`;
    saveAppData(data);
    if (window.DatabaseService) {
      DatabaseService.postAction("updateReportStatus", {
        reportId: laporan.id,
        status: "draf",
        ulasan_penyemak: laporan.catatan_semakan
      });
    }

    showToast("Permintaan pindaan telah dihantar semula kepada Guru Penasihat.");
    renderApp();
  }
}

// Tindakan Pengesahan oleh TPPB
function prosesPengesahanTPPB(id) {
  const data = getAppData();
  const laporan = data.pelaporan.find(l => l.id === id);
  if (!laporan) return;

  const user = appState.currentUser;
  laporan.status = "disahkan";
  laporan.disahkan_oleh = `McManus Sing (Timbalan Pengetua Pembangunan Bakat MRSM Kuching)`;
  laporan.tarikh_disahkan = new Date().toISOString().replace("T", " ").substring(0, 16);
  laporan.catatan_pengesahan = "Disahkan secara rasmi untuk rekod aktiviti dan pemarkahan kokurikulum pelajar MRSM Kuching.";

  saveAppData(data);
  if (window.DatabaseService) {
    DatabaseService.postAction("updateReportStatus", {
      reportId: laporan.id,
      status: "disahkan",
      disahkan_oleh_nama: laporan.disahkan_oleh,
      ulasan_tppb: laporan.catatan_pengesahan
    });
  }

  showToast(`Laporan ${laporan.unit_nama} telah DISAHKAN secara rasmi oleh McManus Sing (TPPB)!`);
  renderApp();
}

// ==========================================================================
// 3. MAKLUMAT UMUM VIEW (Takwim & Senarai Ahli Rumah Sukan)
// ==========================================================================
function renderMaklumatView() {
  const data = getAppData();

  if (appState.maklumatSubTab === "takwim") {
    const takwimRows = data.takwim.map((t, idx) => `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td>
          <strong>${t.tarikh}</strong>
          <div style="font-size: 0.775rem; color: var(--text-muted);">${t.hari} &bull; ${t.masa}</div>
        </td>
        <td>
          <div style="font-weight: 700;">${t.aktiviti}</div>
          <div style="font-size: 0.775rem; color: var(--text-muted);">📍 ${t.lokasi}</div>
        </td>
        <td><span class="role-pill">${t.kategori}</span></td>
        <td>
          <span class="badge-status ${t.status === 'Selesai' ? 'approved' : 'pending'}">
            ${t.status}
          </span>
        </td>
      </tr>
    `).join("");

    return `
      <div class="content-header">
        <div class="header-title-box">
          <h1>Maklumat Umum: Takwim Kokurikulum</h1>
          <p>Kalendar Perancangan Perjumpaan Mingguan & Acara Pembangunan Bakat MRSM</p>
        </div>
        <div class="header-actions">
          <button class="btn-clay btn-clay-secondary" onclick="openAddTakwimModal()">
            <span>+</span> Tambah Takwim
          </button>
        </div>
      </div>

      <div class="clay-tabs">
        <button class="clay-tab-item active" onclick="setMaklumatSubTab('takwim')">📅 Takwim Kokurikulum</button>
        <button class="clay-tab-item" onclick="setMaklumatSubTab('rumah_sukan')">🏠 Senarai Ahli Rumah Sukan</button>
      </div>

      <div class="clay-card">
        <div class="clay-table-responsive">
          <table class="clay-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tarikh & Masa</th>
                <th>Aktiviti & Lokasi</th>
                <th>Kategori</th>
                <th>Status Pelaksanaan</th>
              </tr>
            </thead>
            <tbody>
              ${takwimRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    // Rumah Sukan View
    let filteredStudents = data.rumah_sukan;
    if (appState.rumahSukanFilter !== "semua") {
      filteredStudents = filteredStudents.filter(s => s.rumah.toLowerCase() === appState.rumahSukanFilter.toLowerCase());
    }

    const studentRows = filteredStudents.map((s, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${s.nama}</strong></td>
        <td><code>${s.no_maktab}</code></td>
        <td>${s.tingkatan}</td>
        <td>${s.jantina}</td>
        <td>
          <span class="role-pill" style="background: ${s.warna}22; color: ${s.warna}; font-weight: 800;">
            ${s.rumah}
          </span>
        </td>
      </tr>
    `).join("");

    return `
      <div class="content-header">
        <div class="header-title-box">
          <h1>Maklumat Umum: Senarai Ahli Rumah Sukan</h1>
          <p>Penyelarasan Keahlian 4 Rumah Sukan Maktab: Bendahara, Temenggung, Laksamana, Syahbandar</p>
        </div>
      </div>

      <div class="clay-tabs">
        <button class="clay-tab-item" onclick="setMaklumatSubTab('takwim')">📅 Takwim Kokurikulum</button>
        <button class="clay-tab-item active" onclick="setMaklumatSubTab('rumah_sukan')">🏠 Senarai Ahli Rumah Sukan</button>
      </div>

      <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
        <button class="btn-clay btn-clay-sm ${appState.rumahSukanFilter === 'semua' ? 'btn-clay-primary' : 'btn-clay-secondary'}" onclick="setRumahFilter('semua')">Semua Rumah</button>
        <button class="btn-clay btn-clay-sm ${appState.rumahSukanFilter === 'bendahara' ? 'btn-clay-orange' : 'btn-clay-secondary'}" onclick="setRumahFilter('bendahara')">🟡 Bendahara</button>
        <button class="btn-clay btn-clay-sm ${appState.rumahSukanFilter === 'temenggung' ? 'btn-clay-danger' : 'btn-clay-secondary'}" onclick="setRumahFilter('temenggung')">🔴 Temenggung</button>
        <button class="btn-clay btn-clay-sm ${appState.rumahSukanFilter === 'laksamana' ? 'btn-clay-blue' : 'btn-clay-secondary'}" onclick="setRumahFilter('laksamana')">🔵 Laksamana</button>
        <button class="btn-clay btn-clay-sm ${appState.rumahSukanFilter === 'syahbandar' ? 'btn-clay-primary' : 'btn-clay-secondary'}" onclick="setRumahFilter('syahbandar')">🟢 Syahbandar</button>
      </div>

      <div class="clay-card">
        <div class="clay-table-responsive">
          <table class="clay-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pelajar</th>
                <th>No. Maktab</th>
                <th>Tingkatan</th>
                <th>Jantina</th>
                <th>Rumah Sukan</th>
              </tr>
            </thead>
            <tbody>
              ${studentRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

function setMaklumatSubTab(tab) {
  appState.maklumatSubTab = tab;
  renderApp();
}

function setRumahFilter(filter) {
  appState.rumahSukanFilter = filter;
  renderApp();
}

// ==========================================================================
// 4. RANCANGAN TAHUNAN KOKURIKULUM (RPT)
// ==========================================================================
function renderRptView() {
  const data = getAppData();

  const rptCards = data.rpt.map(item => {
    const unit = data.units.find(u => u.id === item.unit_id) || { nama: "Unit Koko" };
    return `
      <div class="clay-card" style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="role-pill" style="font-size: 0.75rem;">${item.minggu}</span>
          <span class="badge-status ${item.status === 'Selesai' ? 'approved' : 'pending'}">${item.status}</span>
        </div>
        <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">${item.tajuk}</h4>
        <p style="font-size: 0.8rem; color: var(--primary); font-weight: 700; margin-bottom: 8px;">${unit.nama}</p>
        <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 10px;">${item.aktiviti}</p>
        <div style="font-size: 0.775rem; color: var(--text-light); border-top: 1px dashed rgba(0,0,0,0.08); padding-top: 6px;">
          📦 <strong>Keperluan Bahan:</strong> ${item.bahan}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="content-header">
      <div class="header-title-box">
        <h1>Rancangan Tahunan Kokurikulum (RPT)</h1>
        <p>Silabus dan Perancangan Aktiviti Mingguan Badan Beruniform, Kelab & Sukan</p>
      </div>
      <div class="header-actions">
        <button class="btn-clay btn-clay-primary" onclick="openAddRptModal()">
          <span>+</span> Tambah Perancangan RPT
        </button>
      </div>
    </div>

    <div class="reports-card-grid">
      ${rptCards}
    </div>
  `;
}

// ==========================================================================
// 5. MUAT TURUN BORANG & TEMPLAT RASMI
// ==========================================================================
function renderBorangView() {
  const data = getAppData();
  const user = appState.currentUser;

  const borangItems = data.borang.map(b => `
    <div class="clay-card" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 240px;">
        <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: ${b.format === 'PDF' ? '#fee2e2' : '#dbeafe'}; color: ${b.format === 'PDF' ? '#ef4444' : '#2563eb'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.825rem; box-shadow: var(--clay-shadow-pill); flex-shrink: 0;">
          ${b.format}
        </div>
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main);">${b.tajuk}</h4>
          <div style="display: flex; gap: 10px; font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; flex-wrap: wrap;">
            <span>Kod: <strong>${b.kod}</strong></span>
            <span>Saiz: ${b.saiz}</span>
            <span>Kategori: ${b.kategori}</span>
            <span>Kemaskini: ${b.tarikh}</span>
          </div>
        </div>
      </div>
      <div>
        <button class="btn-clay btn-clay-primary btn-clay-sm" onclick="simulasiMuatTurun('${b.tajuk}', '${b.format}')">
          ⬇️ Muat Turun
        </button>
      </div>
    </div>
  `).join("");

  return `
    <div class="content-header">
      <div class="header-title-box">
        <h1>Pusat Muat Turun Borang Rasmi</h1>
        <p>Muat turun borang kebenaran, tuntutan kewangan, pendaftaran dan buku log penilaian SKP</p>
      </div>
      <div class="header-actions">
        ${user && user.roles.includes("admin") ? `
          <button class="btn-clay btn-clay-primary" onclick="openAddBorangModal()">
            <span>+</span> Muat Naik Borang Baru
          </button>
        ` : ""}
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${borangItems}
    </div>
  `;
}

function simulasiMuatTurun(tajuk, format) {
  showToast(`Memuat turun '${tajuk}' (.${format.toLowerCase()})...`);
}

// ==========================================================================
// 6. ADMIN PORTAL (Daftar Pengguna, Tetapan Multi-Role, Daftar Kokurikulum)
// ==========================================================================
function renderAdminView() {
  const data = getAppData();

  const guruRows = data.users.filter(u => u.roles[0] !== "admin").map(u => {
    const rolesPills = u.roles.map(r => `<span class="role-pill">${formatRoleName(r)}</span>`).join(" ");
    
    // Units assigned
    const unitNames = (u.units || []).map(uid => {
      const unit = data.units.find(un => un.id === uid);
      return unit ? unit.nama : uid;
    }).join(", ") || "Tiada Unit";

    return `
      <tr>
        <td><strong>${u.nama}</strong></td>
        <td><code>${u.no_gaji}</code></td>
        <td>${rolesPills}</td>
        <td style="font-size: 0.825rem;">${unitNames}</td>
        <td>
          <button class="btn-clay btn-clay-sm btn-clay-secondary" onclick="editUserRoles('${u.id}')">
            ⚙️ Tetapan Role
          </button>
        </td>
      </tr>
    `;
  }).join("");

  const unitRows = data.units.map(un => `
    <tr>
      <td><strong>${un.nama}</strong></td>
      <td><span class="role-pill">${un.kategori}</span></td>
      <td>${un.ahli} / ${un.kuota} Pelajar</td>
      <td>
        <span class="badge-status approved">Aktif</span>
      </td>
    </tr>
  `).join("");

  return `
    <div class="content-header">
      <div class="header-title-box">
        <h1>Portal Pentadbir: Pengurusan Pengguna & Kokurikulum</h1>
        <p>Pendaftaran guru, penetapan Multi-Role, pembahagian 2 unit penasihat & pendaftaran kokurikulum</p>
      </div>
      <div class="header-actions">
        <button class="btn-clay btn-clay-primary" onclick="openRegisterUserModal()">
          <span>+</span> Daftar Guru Baru
        </button>
        <button class="btn-clay btn-clay-blue" onclick="openRegisterUnitModal()">
          <span>+</span> Tambah Unit Koko
        </button>
      </div>
    </div>

    <div class="admin-layout-grid">
      <!-- Senarai Guru & Multi-Role -->
      <div class="clay-card">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px;">Direktori Guru & Penyerahan Role</h3>
        <div class="mobile-table-hint">👉 Leret ke tepi untuk lihat maklumat guru penuh</div>
        <div class="clay-table-responsive">
          <table class="clay-table">
            <thead>
              <tr>
                <th>Nama Guru</th>
                <th>No. Gaji</th>
                <th>Peranan (Roles)</th>
                <th>Unit Penasihat Bimbingan</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${guruRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Senarai Unit Kokurikulum -->
      <div class="clay-card">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px;">Senarai Unit Kokurikulum Berdaftar</h3>
        <div class="clay-table-responsive">
          <table class="clay-table">
            <thead>
              <tr>
                <th>Nama Unit</th>
                <th>Kategori</th>
                <th>Keahlian</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${unitRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 7. PRINT PREVIEW MODAL (Official MRSM Letterhead)
// ==========================================================================
function openPrintPreviewModal(reportId) {
  const data = getAppData();
  const report = data.pelaporan.find(r => r.id === reportId);
  if (!report) return;

  appState.selectedReportForPrint = report;

  const content = document.getElementById("printPreviewContent");
  if (!content) return;

  let photoHtml = "";
  if (report.gambar && report.gambar.length > 0) {
    photoHtml = `
      <div class="print-section-title">Dokumentasi Gambar Aktiviti</div>
      <div class="print-photo-grid">
        ${report.gambar.map((g, i) => `
          <div class="print-photo-item">
            <img src="${g}" alt="Gambar Aktiviti ${i+1}">
            <div style="font-size: 0.75rem; text-align: center; margin-top: 4px; color: #475569;">Gambar Aktiviti ${i+1}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  content.innerHTML = `
    <div class="print-paper">
      <div class="print-letterhead">
        <h2>MAKTAB RENDAH SAINS MARA KUCHING</h2>
        <h3>BAHAGIAN PEMBANGUNAN BAKAT (KOKURIKULUM)</h3>
        <p>LAPORAN RASMI AKTIVITI & PENILAIAN STANDARD KEMAHIRAN PELAJAR (SKP)</p>
      </div>

      <div class="print-meta-grid">
        <div><strong>Unit Kokurikulum:</strong> ${report.unit_nama}</div>
        <div><strong>Kategori:</strong> ${report.kategori_unit}</div>
        <div><strong>Jenis Laporan:</strong> ${report.jenis === 'skp' ? 'Pelaporan SKP' : (report.jenis === 'program' ? 'Program / Pertandingan' : 'Pertemuan Mingguan')}</div>
        <div><strong>Bil. Sesi / Pertemuan:</strong> Sesi ${report.bil_pertemuan}</div>
        <div><strong>Tarikh & Hari:</strong> ${report.tarikh} (${report.hari})</div>
        <div><strong>Masa:</strong> ${report.masa_mula} - ${report.masa_tamat}</div>
        <div><strong>Jumlah Kehadiran:</strong> ${report.kehadiran_hadir} / ${report.kehadiran_total} Orang</div>
        <div><strong>Status Laporan:</strong> ${report.status.toUpperCase()}</div>
      </div>

      <div class="print-section-title">Objektif Aktiviti / Kemahiran</div>
      <p style="font-size: 0.9rem; margin-bottom: 12px;">${report.objektif || "-"}</p>

      <div class="print-section-title">Ringkasan Aktiviti / Pengisian</div>
      <p style="font-size: 0.9rem; white-space: pre-line; margin-bottom: 14px;">${report.aktiviti || "-"}</p>

      ${report.pencapaian ? `
        <div class="print-section-title">Pencapaian / Keputusan</div>
        <p style="font-size: 0.9rem; font-weight: 700; color: #166534; margin-bottom: 12px;">${report.pencapaian}</p>
      ` : ""}

      ${photoHtml}

      <!-- 3-Tier Verification / Signatures -->
      <div class="print-sign-grid">
        <div class="sign-box">
          <div><strong>DISEDIAKAN OLEH:</strong></div>
          <div style="margin: 8px 0; font-weight: bold; color: #1e293b;">${report.disediakan_oleh}</div>
          <div style="font-size: 0.75rem; color: #64748b;">Guru Penasihat<br>${report.tarikh_disediakan || "-"}</div>
        </div>

        <div class="sign-box">
          <div><strong>DISEMAK OLEH:</strong></div>
          ${report.disemak_oleh ? `
            <div class="sign-stamp">DISEMAK</div>
            <div style="font-weight: bold;">${report.disemak_oleh}</div>
            <div style="font-size: 0.75rem; color: #64748b;">${report.tarikh_disemak || "-"}</div>
          ` : `<div style="color: #94a3b8; font-style: italic;">[Menunggu Semakan]</div>`}
        </div>

        <div class="sign-box">
          <div><strong>DISAHKAN OLEH:</strong></div>
          ${report.disahkan_oleh ? `
            <div class="sign-stamp" style="border-color: #047857; color: #047857;">DISAHKAN (TPPB)</div>
            <div style="font-weight: bold;">${report.disahkan_oleh}</div>
            <div style="font-size: 0.75rem; color: #64748b;">Timbalan Pengetua Pembangunan Bakat<br>MRSM Kuching<br>${report.tarikh_disahkan || "-"}</div>
          ` : `<div style="color: #94a3b8; font-style: italic;">[Menunggu Pengesahan TPPB - McManus Sing]</div>`}
        </div>
      </div>
    </div>
  `;

  document.getElementById("modalPrintPreview").classList.add("active");
}

function closePrintPreviewModal() {
  document.getElementById("modalPrintPreview").classList.remove("active");
}

function triggerPrint() {
  window.print();
}

// Helper Ikon Kategori Kokurikulum
function getCategoryIcon(kategori) {
  switch (kategori) {
    case "Badan Beruniform": return "🛡️";
    case "Kelab & Persatuan": return "💡";
    case "Sukan & Permainan": return "⚽";
    case "SKP": return "🎯";
    default: return "📌";
  }
}

// ==========================================================================
// 8. MODAL CIPTA PELAPORAN BARU (BERDASARKAN DATA UNIT GURU)
// ==========================================================================
function openCreateReportModal() {
  const user = appState.currentUser;
  const data = getAppData();
  appState.uploadedImages = [];

  // Reset image thumbnails
  renderImageThumbnails();

  // 1. Tentukan unit yang dipegang oleh guru yang sedang log masuk
  let teacherUnits = [];
  if (user && user.units && user.units.length > 0) {
    teacherUnits = data.units.filter(u => user.units.includes(u.id));
  }

  // Jika guru tiada unit ditetapkan atau akaun admin/tppb, beri pilihan semua unit
  const isFullAccess = teacherUnits.length === 0;
  if (isFullAccess) {
    teacherUnits = data.units;
  }

  // 2. Paparkan interactive clay pills untuk setiap unit guru
  const pillsContainer = document.getElementById("teacherAdvisoryPills");
  if (pillsContainer) {
    pillsContainer.innerHTML = teacherUnits.map((u, idx) => `
      <button type="button" 
              class="btn-clay btn-clay-sm ${idx === 0 ? 'btn-clay-primary' : 'btn-clay-secondary'}"
              style="font-size: 0.775rem; display: inline-flex; align-items: center; gap: 6px;"
              id="pill_unit_${u.id}"
              onclick="handleTeacherUnitSelectChange('${u.id}')">
        <span>${getCategoryIcon(u.kategori)}</span>
        <span><strong>${u.kategori}:</strong> ${u.nama}</span>
      </button>
    `).join("");
  }

  // 3. Populate dropdown select
  const selectUnit = document.getElementById("formUnitSelect");
  if (selectUnit) {
    selectUnit.innerHTML = teacherUnits.map(u => `
      <option value="${u.id}">[${u.kategori}] ${u.nama}</option>
    `).join("");
  }

  // 4. Set tarikh semasa lalai
  const inputTarikh = document.getElementById("formTarikh");
  if (inputTarikh) {
    inputTarikh.value = new Date().toISOString().substring(0, 10);
  }

  // 5. Auto-fill serta-merta dengan unit pertama guru!
  if (teacherUnits.length > 0) {
    handleTeacherUnitSelectChange(teacherUnits[0].id);
  }

  document.getElementById("modalCreateReport").classList.add("active");
}

// Fungsi Auto-Fill Pintar Berdasarkan Unit Dipilih
function handleTeacherUnitSelectChange(unitId) {
  const data = getAppData();
  const user = appState.currentUser;
  const unit = data.units.find(u => u.id === unitId);
  if (!unit) return;

  // 1. Kemaskini select dropdown
  const selectUnit = document.getElementById("formUnitSelect");
  if (selectUnit) selectUnit.value = unitId;

  // 2. Kemaskini highlight pada clay pills
  document.querySelectorAll("#teacherAdvisoryPills button").forEach(btn => {
    btn.classList.remove("btn-clay-primary");
    btn.classList.add("btn-clay-secondary");
  });
  const activePill = document.getElementById(`pill_unit_${unitId}`);
  if (activePill) {
    activePill.classList.remove("btn-clay-secondary");
    activePill.classList.add("btn-clay-primary");
  }

  // 3. Auto-fill Kategori Unit
  const inputKategori = document.getElementById("formKategoriUnit");
  if (inputKategori) {
    inputKategori.value = unit.kategori;
  }

  // 4. Auto-padanan Jenis Pelaporan mengikut Kategori
  const selectJenis = document.getElementById("formJenisLaporan");
  if (selectJenis) {
    if (unit.kategori === "SKP") {
      selectJenis.value = "skp";
    } else if (selectJenis.value === "skp") {
      selectJenis.value = "mingguan";
    }
  }

  // 5. Auto-fill Bilangan Keseluruhan Ahli daripada rekod unit
  const inputTotal = document.getElementById("formKehadiranTotal");
  if (inputTotal) {
    inputTotal.value = unit.ahli || unit.kuota || 45;
  }

  // 6. Cadangan Kehadiran Hadir
  const inputHadir = document.getElementById("formKehadiranHadir");
  if (inputHadir) {
    const total = unit.ahli || unit.kuota || 45;
    inputHadir.value = Math.max(1, total - 2);
  }

  // 7. Auto-fill Disediakan Oleh (Auto-fetch profil guru yang sedang aktif)
  const inputDisediakan = document.getElementById("formDisediakanOleh");
  if (inputDisediakan && user) {
    inputDisediakan.value = `${user.nama} (${user.no_gaji})`;
  }

  // 8. Kemaskini badge status auto-fill
  const badgeNotice = document.getElementById("badgeAutoFillStatus");
  if (badgeNotice) {
    badgeNotice.textContent = `✨ Auto-Fill: ${unit.kategori}`;
  }
}

function closeCreateReportModal() {
  document.getElementById("modalCreateReport").classList.remove("active");
}

function handleImageUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const maxPhotos = 4;
  Array.from(files).forEach(file => {
    if (appState.uploadedImages.length >= maxPhotos) {
      showToast("Maksimum 4 keping gambar sahaja dibenarkan.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      appState.uploadedImages.push(event.target.result);
      renderImageThumbnails();
    };
    reader.readAsDataURL(file);
  });
}

function renderImageThumbnails() {
  const container = document.getElementById("previewGrid");
  if (!container) return;

  container.innerHTML = appState.uploadedImages.map((src, idx) => `
    <div class="preview-item">
      <img src="${src}" alt="Preview ${idx + 1}">
      <button type="button" class="btn-remove-img" onclick="removeUploadedImage(${idx})">&times;</button>
    </div>
  `).join("");
}

function removeUploadedImage(idx) {
  appState.uploadedImages.splice(idx, 1);
  renderImageThumbnails();
}

// Simpan Laporan Baru
function saveNewReport(e) {
  e.preventDefault();
  const data = getAppData();
  const user = appState.currentUser;

  const unitId = document.getElementById("formUnitSelect").value;
  const unit = data.units.find(u => u.id === unitId) || { nama: "Unit", kategori: "Kategori" };
  const jenis = document.getElementById("formJenisLaporan").value;
  const tarikh = document.getElementById("formTarikh").value;
  const masaMula = document.getElementById("formMasaMula").value;
  const masaTamat = document.getElementById("formMasaTamat").value;
  const bilPertemuan = document.getElementById("formBilPertemuan").value;
  const kehadiranHadir = parseInt(document.getElementById("formKehadiranHadir").value) || 0;
  const kehadiranTotal = parseInt(document.getElementById("formKehadiranTotal").value) || 45;
  const objektif = document.getElementById("formObjektif").value;
  const aktiviti = document.getElementById("formAktiviti").value;

  // Kira hari
  const dateObj = new Date(tarikh);
  const hariArr = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const hari = hariArr[dateObj.getDay()] || "Rabu";

  const newReport = {
    id: "lap_" + Date.now(),
    jenis: jenis,
    unit_id: unitId,
    unit_nama: unit.nama,
    kategori_unit: unit.kategori,
    tarikh: tarikh,
    hari: hari,
    masa_mula: masaMula,
    masa_tamat: masaTamat,
    bil_pertemuan: bilPertemuan,
    kehadiran_hadir: kehadiranHadir,
    kehadiran_total: kehadiranTotal,
    objektif: objektif,
    aktiviti: aktiviti,
    gambar: [...appState.uploadedImages],
    disediakan_oleh: `${user.nama} (${user.no_gaji})`,
    tarikh_disediakan: new Date().toISOString().replace("T", " ").substring(0, 16),
    disemak_oleh: null,
    tarikh_disemak: null,
    catatan_semakan: null,
    disahkan_oleh: null,
    tarikh_disahkan: null,
    catatan_pengesahan: null,
    status: "dihantar" // Dihantar terus kepada Penyelaras
  };

  data.pelaporan.unshift(newReport);
  saveAppData(data);

  if (window.DatabaseService) {
    DatabaseService.postAction("saveReport", {
      id: newReport.id,
      unit_id: newReport.unit_id,
      unit_nama: newReport.unit_nama,
      kategori: newReport.kategori_unit,
      jenis: newReport.jenis,
      bil_pertemuan: newReport.bil_pertemuan,
      tarikh: newReport.tarikh,
      masa_mula: newReport.masa_mula,
      masa_tamat: newReport.masa_tamat,
      kehadiran_bil: newReport.kehadiran_hadir,
      kehadiran_jumlah: newReport.kehadiran_total,
      objektif: newReport.objektif,
      aktiviti: newReport.aktiviti,
      gambar_urls: newReport.gambar,
      disediakan_oleh_id: user.id,
      disediakan_oleh_nama: newReport.disediakan_oleh,
      status: newReport.status
    }).then(res => {
      if (!res.offline) {
        showToast("Laporan berjaya disegerakkan ke Google Sheets!");
      }
    });
  }

  closeCreateReportModal();
  showToast(`Laporan ${unit.nama} berjaya dihantar untuk semakan Penyelaras!`);
  appState.activeTab = "pelaporan";
  renderApp();
}

// ==========================================================================
// 9. MODAL LOGIN (GURU: NO GAJI / ADMIN: PASSCODE)
// ==========================================================================
function openLoginModal() {
  document.getElementById("modalAuth").classList.add("active");
}

function closeLoginModal() {
  document.getElementById("modalAuth").classList.remove("active");
}

function submitGuruLogin(e) {
  e.preventDefault();
  const noGaji = document.getElementById("loginNoGaji").value.trim().toUpperCase();
  const data = getAppData();
  const user = data.users.find(u => u.no_gaji.toUpperCase() === noGaji);

  if (user) {
    setCurrentUser(user);
    closeLoginModal();
    showToast(`Selamat kembali, ${user.nama}!`);
  } else {
    alert("Nombor gaji tidak ditemui dalam rekod guru maktab. Sila cuba G1021, G1002, G1005, dsb.");
  }
}

function submitAdminLogin(e) {
  e.preventDefault();
  const passcode = document.getElementById("loginPasscode").value.trim();
  const data = getAppData();
  const admin = data.users.find(u => u.roles.includes("admin"));

  if (admin && (passcode === admin.passcode || passcode === "admin123")) {
    setCurrentUser(admin);
    closeLoginModal();
    showToast("Log masuk Pentadbir Berjaya!");
  } else {
    alert("Kod passcode pentadbir salah! (Sila gunakan: admin123)");
  }
}

// ==========================================================================
// 10. ADMIN MODAL ACTIONS (Daftar Guru, Unit, Role Assignment Fleksibel)
// ==========================================================================
function openRegisterUserModal() {
  const data = getAppData();
  const container = document.getElementById("adminUnitCheckboxesList");
  if (container) {
    const categories = ["Badan Beruniform", "Kelab & Persatuan", "Sukan & Permainan", "SKP"];
    container.innerHTML = categories.map(cat => {
      const unitsInCat = data.units.filter(u => u.kategori === cat);
      if (unitsInCat.length === 0) return "";
      const checkboxes = unitsInCat.map(u => `
        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; padding: 3px 0; cursor: pointer;">
          <input type="checkbox" name="adminUnitCheckbox" value="${u.id}">
          <span>${u.nama}</span>
        </label>
      `).join("");

      return `
        <div style="margin-bottom: 10px;">
          <div style="font-size: 0.75rem; font-weight: 800; color: #4338ca; text-transform: uppercase; margin-bottom: 3px;">
            ${getCategoryIcon(cat)} ${cat}
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 4px; padding-left: 6px;">
            ${checkboxes}
          </div>
        </div>
      `;
    }).join("");
  }
  document.getElementById("modalRegisterUser").classList.add("active");
}

function closeRegisterUserModal() {
  document.getElementById("modalRegisterUser").classList.remove("active");
}

function saveNewUser(e) {
  e.preventDefault();
  const data = getAppData();

  const nama = document.getElementById("newGuruNama").value.trim();
  const noGaji = document.getElementById("newGuruNoGaji").value.trim().toUpperCase();
  const email = document.getElementById("newGuruEmail").value.trim();

  // Dapatkan semua unit penasihat yang dipilih (Fleksibel: boleh mana-mana gabungan!)
  const selectedUnits = Array.from(document.querySelectorAll("input[name='adminUnitCheckbox']:checked")).map(cb => cb.value);

  // Selected Roles from Checkboxes
  const roles = [];
  if (document.getElementById("roleGuru").checked) roles.push("guru");
  if (document.getElementById("rolePenyemakUniform").checked) roles.push("penyemak_uniform");
  if (document.getElementById("rolePenyemakKelab").checked) roles.push("penyemak_kelab");
  if (document.getElementById("rolePenyemakSukan").checked) roles.push("penyemak_sukan");
  if (document.getElementById("roleKetuaPenyelaras").checked) roles.push("ketua_penyelaras");
  if (document.getElementById("roleTPPB").checked) roles.push("tppb");

  if (roles.length === 0) roles.push("guru");

  const newUser = {
    id: "usr_" + Date.now(),
    no_gaji: noGaji,
    nama: nama,
    jawatan: "Guru Penasihat Kokurikulum",
    email: email,
    roles: roles,
    units: selectedUnits
  };

  data.users.push(newUser);
  saveAppData(data);

  if (window.DatabaseService) {
    DatabaseService.postAction("saveUser", {
      id: newUser.id,
      no_gaji: newUser.no_gaji,
      nama: newUser.nama,
      jawatan: newUser.jawatan,
      email: newUser.email,
      roles: newUser.roles,
      units: newUser.units
    });
  }

  closeRegisterUserModal();
  showToast(`Guru ${nama} (${noGaji}) berjaya didaftarkan dengan ${selectedUnits.length} unit penasihat!`);
  renderApp();
}

function editUserRoles(userId) {
  const data = getAppData();
  const user = data.users.find(u => u.id === userId);
  if (!user) return;

  const current = user.roles.join(", ");
  const newRolesStr = prompt(`Kemaskini Roles untuk ${user.nama} (asingkan dengan koma):\nPilihan: guru, penyemak_uniform, penyemak_kelab, penyemak_sukan, ketua_penyelaras, tppb`, current);

  if (newRolesStr !== null) {
    const rolesArr = newRolesStr.split(",").map(r => r.trim()).filter(Boolean);
    if (rolesArr.length > 0) {
      user.roles = rolesArr;
      saveAppData(data);
      if (window.DatabaseService) {
        DatabaseService.postAction("saveUser", {
          id: user.id,
          no_gaji: user.no_gaji,
          nama: user.nama,
          jawatan: user.jawatan,
          email: user.email,
          roles: user.roles,
          units: user.units
        });
      }
      showToast(`Peranan bagi ${user.nama} berjaya dikemaskini!`);
      renderApp();
    }
  }
}

function openRegisterUnitModal() {
  document.getElementById("modalRegisterUnit").classList.add("active");
}

function closeRegisterUnitModal() {
  document.getElementById("modalRegisterUnit").classList.remove("active");
}

function saveNewUnit(e) {
  e.preventDefault();
  const data = getAppData();

  const nama = document.getElementById("newUnitNama").value.trim();
  const kategori = document.getElementById("newUnitKategori").value;
  const kuota = parseInt(document.getElementById("newUnitKuota").value) || 45;

  const newUnit = {
    id: "unit_" + Date.now(),
    nama: nama,
    kategori: kategori,
    kuota: kuota,
    ahli: 0,
    penasihat_ids: []
  };

  data.units.push(newUnit);
  saveAppData(data);

  if (window.DatabaseService) {
    DatabaseService.postAction("saveUnit", newUnit);
  }

  closeRegisterUnitModal();
  showToast(`Unit kokurikulum '${nama}' (${kategori}) berjaya didaftarkan!`);
  renderApp();
}

// ==========================================================================
// 11. TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(message) {
  let toast = document.getElementById("clayToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "clayToast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.backgroundColor = "var(--text-main)";
    toast.style.color = "#ffffff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "var(--radius-md)";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2), var(--clay-shadow-pill)";
    toast.style.fontSize = "0.875rem";
    toast.style.fontWeight = "700";
    toast.style.zIndex = "9999";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "8px";
    toast.style.transition = "all 0.3s ease";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✨</span> ${message}`;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 3500);
}

// ==========================================================================
// 12. HANDLER MODAL TAKWIM, RPT & BORANG
// ==========================================================================
function openAddTakwimModal() {
  const inputTarikh = document.getElementById("newTakwimTarikh");
  if (inputTarikh) inputTarikh.value = new Date().toISOString().substring(0, 10);
  document.getElementById("modalAddTakwim").classList.add("active");
}

function closeAddTakwimModal() {
  document.getElementById("modalAddTakwim").classList.remove("active");
}

function saveNewTakwim(e) {
  e.preventDefault();
  const data = getAppData();

  const aktiviti = document.getElementById("newTakwimAktiviti").value.trim();
  const tarikh = document.getElementById("newTakwimTarikh").value;
  const masa = document.getElementById("newTakwimMasa").value.trim();
  const kategori = document.getElementById("newTakwimKategori").value;
  const lokasi = document.getElementById("newTakwimLokasi").value.trim();

  const dateObj = new Date(tarikh);
  const hariArr = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];
  const hari = hariArr[dateObj.getDay()] || "Rabu";

  const newTakwim = {
    id: "t_" + Date.now(),
    tarikh: tarikh,
    hari: hari,
    masa: masa,
    aktiviti: aktiviti,
    kategori: kategori,
    lokasi: lokasi,
    status: "Akan Datang"
  };

  data.takwim.unshift(newTakwim);
  saveAppData(data);

  if (window.DatabaseService) {
    DatabaseService.postAction("saveTakwim", newTakwim);
  }

  closeAddTakwimModal();
  showToast(`Aktiviti '${aktiviti}' berjaya ditambah ke dalam Takwim Kokurikulum!`);
  renderApp();
}

function openAddRptModal() {
  const data = getAppData();
  const select = document.getElementById("newRptUnitSelect");
  if (select) {
    select.innerHTML = data.units.map(u => `<option value="${u.id}">${u.nama} (${u.kategori})</option>`).join("");
  }
  document.getElementById("modalAddRpt").classList.add("active");
}

function closeAddRptModal() {
  document.getElementById("modalAddRpt").classList.remove("active");
}

function saveNewRpt(e) {
  e.preventDefault();
  const data = getAppData();

  const unitId = document.getElementById("newRptUnitSelect").value;
  const minggu = document.getElementById("newRptMinggu").value.trim();
  const tajuk = document.getElementById("newRptTajuk").value.trim();
  const aktiviti = document.getElementById("newRptAktiviti").value.trim();
  const bahan = document.getElementById("newRptBahan").value.trim();

  const newRpt = {
    id: "rpt_" + Date.now(),
    unit_id: unitId,
    minggu: minggu,
    tajuk: tajuk,
    aktiviti: aktiviti,
    bahan: bahan,
    status: "Dalam Perancangan"
  };

  data.rpt.push(newRpt);
  saveAppData(data);

  if (window.DatabaseService) {
    DatabaseService.postAction("saveRpt", newRpt);
  }

  closeAddRptModal();
  showToast(`Perancangan '${tajuk}' (${minggu}) berjaya direkodkan dalam RPT!`);
  renderApp();
}

function openAddBorangModal() {
  document.getElementById("modalAddBorang").classList.add("active");
}

function closeAddBorangModal() {
  document.getElementById("modalAddBorang").classList.remove("active");
}

function saveNewBorang(e) {
  e.preventDefault();
  const data = getAppData();

  const tajuk = document.getElementById("newBorangTajuk").value.trim();
  const kod = document.getElementById("newBorangKod").value.trim();
  const kategori = document.getElementById("newBorangKategori").value;
  const format = document.getElementById("newBorangFormat").value;
  const saiz = document.getElementById("newBorangSaiz").value.trim();

  const newBorang = {
    id: "b_" + Date.now(),
    tajuk: tajuk,
    kod: kod,
    kategori: kategori,
    saiz: saiz,
    format: format,
    tarikh: new Date().toISOString().substring(0, 10),
    muatnaik_oleh: "Admin"
  };

  data.borang.unshift(newBorang);
  saveAppData(data);

  if (window.DatabaseService) {
    DatabaseService.postAction("saveBorang", newBorang);
  }

  closeAddBorangModal();
  showToast(`Borang rasmi '${tajuk}' berjaya dimuat naik ke dalam repositori!`);
  renderApp();
}

// ==========================================================================
// 13. MODAL CONTROLLER: SAMBUNGAN DATABASE GOOGLE SHEETS
// ==========================================================================
function updateDbStatusBadge() {
  const btn = document.getElementById("btnDbStatus");
  if (!btn) return;
  if (window.DatabaseService && DatabaseService.isConnected()) {
    btn.className = "btn-db-status";
    btn.innerHTML = "🟢 Google Sheets";
    btn.title = "Tersambung ke Google Sheets Cloud Database MRSM Kuching";
  } else {
    btn.className = "btn-db-status disconnected";
    btn.innerHTML = "🔌 Setup DB";
    btn.title = "Klik untuk setup sambungan Google Sheets";
  }
}

function openDatabaseSetupModal() {
  const input = document.getElementById("inputGasUrl");
  const alertBox = document.getElementById("dbStatusAlertBox");
  if (input && window.DatabaseService) {
    input.value = DatabaseService.getUrl();
  }
  if (alertBox) {
    if (window.DatabaseService && DatabaseService.isConnected()) {
      alertBox.style.display = "block";
      alertBox.style.background = "#f0fdf4";
      alertBox.style.color = "#166534";
      alertBox.style.border = "1px solid #86efac";
      alertBox.innerHTML = "✅ <strong>Status:</strong> Tersambung ke Google Sheets Web App.";
    } else {
      alertBox.style.display = "none";
    }
  }
  document.getElementById("modalDatabaseSetup").classList.add("active");
}

function closeDatabaseSetupModal() {
  document.getElementById("modalDatabaseSetup").classList.remove("active");
}

async function handleTestDbConnection() {
  const input = document.getElementById("inputGasUrl");
  const alertBox = document.getElementById("dbStatusAlertBox");
  const url = input ? input.value.trim() : "";
  if (!url) {
    alert("Sila masukkan URL Google Apps Script terlebih dahulu.");
    return;
  }
  if (alertBox) {
    alertBox.style.display = "block";
    alertBox.style.background = "#eff6ff";
    alertBox.style.color = "#1e40af";
    alertBox.style.border = "1px solid #93c5fd";
    alertBox.innerHTML = "⏳ Menguji sambungan ke Google Sheets...";
  }

  try {
    const res = await DatabaseService.testConnection(url);
    if (alertBox) {
      alertBox.style.background = "#f0fdf4";
      alertBox.style.color = "#166534";
      alertBox.style.border = "1px solid #86efac";
      alertBox.innerHTML = `✅ <strong>Berjaya:</strong> ${res.message || "Sambungan berfungsi sepenuhnya!"} (${res.spreadsheet_name || "MRSM Kuching Database"})`;
    }
    showToast("Ujian sambungan berjaya!");
  } catch (err) {
    if (alertBox) {
      alertBox.style.background = "#fef2f2";
      alertBox.style.color = "#991b1b";
      alertBox.style.border = "1px solid #fca5a5";
      alertBox.innerHTML = `❌ <strong>Ralat:</strong> ${err.message}`;
    }
    showToast("Ujian sambungan gagal.");
  }
}

async function handleSyncFromSheets() {
  if (!window.DatabaseService || !DatabaseService.isConnected()) {
    alert("Sila simpan URL sambungan Google Sheets yang sah terlebih dahulu.");
    return;
  }
  showToast("Menyegerakkan data dari Google Sheets...");
  try {
    const res = await DatabaseService.syncFromGoogleSheets();
    if (res.success) {
      showToast("Data terkini berjaya dimuat turun!");
      renderApp();
    } else {
      alert("Gagal menarik data: " + res.message);
    }
  } catch (err) {
    alert("Ralat semasa muat turun: " + err.message);
  }
}

function handleDisconnectDb() {
  if (confirm("Adakah anda pasti mahu memutuskan sambungan Google Sheets? Aplikasi akan kembali ke mod storan luar talian (LocalStorage).")) {
    if (window.DatabaseService) {
      DatabaseService.setUrl("");
    }
    const input = document.getElementById("inputGasUrl");
    if (input) input.value = "";
    const alertBox = document.getElementById("dbStatusAlertBox");
    if (alertBox) {
      alertBox.style.display = "block";
      alertBox.style.background = "#fef2f2";
      alertBox.style.color = "#991b1b";
      alertBox.style.border = "1px solid #fca5a5";
      alertBox.innerHTML = "🔌 Sambungan Google Sheets telah diputuskan.";
    }
    updateDbStatusBadge();
    showToast("Sambungan Google Sheets diputuskan.");
  }
}

function saveDatabaseConfig(e) {
  e.preventDefault();
  const input = document.getElementById("inputGasUrl");
  const url = input ? input.value.trim() : "";
  if (!url) {
    alert("Sila masukkan URL Web App yang sah.");
    return;
  }
  if (!url.startsWith("https://script.google.com/macros/s/")) {
    alert("Format URL tidak sah. URL mestilah bermula dengan 'https://script.google.com/macros/s/'.");
    return;
  }

  if (window.DatabaseService) {
    DatabaseService.setUrl(url);
  }
  updateDbStatusBadge();
  closeDatabaseSetupModal();
  showToast("Konfigurasi Google Sheets berjaya disimpan!");
}

