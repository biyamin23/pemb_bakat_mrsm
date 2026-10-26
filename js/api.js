/**
 * ==============================================================================
 * DATABASE SERVICE & GOOGLE SHEETS CONNECTOR
 * DASHBOARD PEMBANGUNAN BAKAT MRSM KUCHING
 * ==============================================================================
 */

const GAS_CONFIG_KEY = "pemb_bakat_mrsm_gas_url";

const DatabaseService = {
  /**
   * Dapatkan URL Google Apps Script yang disimpan
   */
  getUrl: function() {
    return localStorage.getItem(GAS_CONFIG_KEY) || "";
  },

  /**
   * Simpan URL Google Apps Script
   */
  setUrl: function(url) {
    if (url) {
      localStorage.setItem(GAS_CONFIG_KEY, url.trim());
    } else {
      localStorage.removeItem(GAS_CONFIG_KEY);
    }
  },

  /**
   * Semak sama ada Google Sheets telah disambung
   */
  isConnected: function() {
    const url = this.getUrl();
    return Boolean(url && url.startsWith("https://script.google.com/macros/s/"));
  },

  /**
   * Uji sambungan ke Google Sheets (Ping)
   */
  testConnection: async function(targetUrl) {
    const url = (targetUrl || this.getUrl()).trim();
    if (!url) {
      throw new Error("Sila masukkan URL Google Apps Script Web App yang sah.");
    }

    const testEndpoint = url.includes("?") ? `${url}&action=ping` : `${url}?action=ping`;

    try {
      const response = await fetch(testEndpoint, {
        method: "GET",
        mode: "cors"
      });

      if (!response.ok) {
        throw new Error(`Ralat HTTP: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        return result;
      } else {
        throw new Error(result.message || "Ujian sambungan gagal");
      }
    } catch (err) {
      console.error("Test Connection Error:", err);
      throw new Error("Gagal menyambung ke Google Sheets. Sila pastikan Web App dideploy dengan akses 'Anyone'. Butiran: " + err.message);
    }
  },

  /**
   * Tarik keseluruhan data terkini daripada Google Sheets
   */
  syncFromGoogleSheets: async function() {
    const url = this.getUrl();
    if (!this.isConnected()) {
      return { success: false, message: "Google Sheets belum disambungkan." };
    }

    const endpoint = url.includes("?") ? `${url}&action=getAllData` : `${url}?action=getAllData`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        mode: "cors"
      });

      const res = await response.json();
      if (res.status === "success" && res.data) {
        // Gabungkan data dari Google Sheets ke dalam localStorage aplikasi
        const incoming = res.data;
        const currentData = getAppData();

        const mergedData = {
          users: (incoming.users && incoming.users.length > 0) ? incoming.users : currentData.users,
          students: (incoming.students && incoming.students.length > 0) ? incoming.students : currentData.students,
          units: (incoming.units && incoming.units.length > 0) ? incoming.units : currentData.units,
          pelaporan: (incoming.pelaporan && incoming.pelaporan.length > 0) ? incoming.pelaporan : currentData.pelaporan,
          takwim: (incoming.takwim && incoming.takwim.length > 0) ? incoming.takwim : currentData.takwim,
          rpt: (incoming.rpt && incoming.rpt.length > 0) ? incoming.rpt : currentData.rpt,
          borang: (incoming.borang && incoming.borang.length > 0) ? incoming.borang : currentData.borang
        };

        saveAppData(mergedData);
        return { success: true, message: "Data berjaya disegerakkan dari Google Sheets!" };
      } else {
        throw new Error(res.message || "Format data tidak sah.");
      }
    } catch (err) {
      console.warn("Sync from Google Sheets failed, using local offline cache:", err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Hantar data baharu / kemaskini ke Google Sheets secara asinkronus
   */
  postAction: async function(action, payload) {
    const url = this.getUrl();
    if (!this.isConnected()) {
      // Simpan tempatan sahaja jika tiada sambungan cloud
      return { success: true, offline: true, message: "Disimpan secara tempatan (Offline Mode)" };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "no-cors", // Google Apps Script Web App post redirect requires no-cors atau follow
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action, payload })
      });

      return { success: true, offline: false, message: "Disegerakkan ke Google Sheets Cloud Database!" };
    } catch (err) {
      console.error("Post to Google Sheets error:", err);
      return { success: false, offline: true, message: "Gagal hantar ke Cloud, disimpan secara tempatan: " + err.message };
    }
  }
};
