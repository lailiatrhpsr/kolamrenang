// ── SYSTEM NAVIGATION BOTTOM TAB MOBILE ──
window.switchMobileTab = function(element, targetPaneId) {
  // Reset seluruh state navigasi bawah
  document.querySelectorAll('.tab-nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.mobile-pane').forEach(pane => pane.classList.remove('active'));
  
  // Aktifkan tab dan pane tujuan
  element.classList.add('active');
  
  // Penyesuaian pengecekan id dikarenakan ada mapping menu khusus laporan
  const targetId = targetPaneId === 'm-m-report' ? 'pane-m-report' : 'pane-' + targetPaneId;
  const paneElement = document.getElementById(targetId);
  if (paneElement) paneElement.classList.add('active');
};

// Hitung Jam Kerja Aktif Lapangan (Simulasi)
const MOBILE_SHIFT_START = new Date();
setInterval(() => {
  const diff = Math.floor((new Date() - MOBILE_SHIFT_START) / 60000);
  const durasiEl = document.getElementById('m-durasi-kerja');
  if (durasiEl) {
    durasiEl.textContent = Math.floor(diff / 60) + 'j ' + (diff % 60) + 'm';
  }
}, 1000);

// ── SIMULASI VALIDASI HARDWARE KAMERA BROWSER (SCAN TIKET) ──
window.simulasiScanBarcode = function() {
  alert("Menghubungkan API Kamera... Memindai QR Code... \n\n✓ VALID: E-Tiket Terverifikasi! Kategori: Terusan VIP. Hak Akses Terbuka.");
};

// ── SIMULASI VALIDASI GEOFENCE/NFC AKSES GERBANG WAHANA ──
window.simulasiTapGelang = function(isAllowed) {
  const resultBox = document.getElementById('m-nfc-result');
  if (!resultBox) return;
  
  resultBox.style.display = 'block';
  if (isAllowed) {
    resultBox.className = 'nfc-result-box success';
    resultBox.innerHTML = `<strong>✓ AKSES DIIZINKAN</strong><br><small>Gelang Valid. Hak akses semua wahana terbuka.</small>`;
  } else {
    resBox = resultBox;
    resBox.className = 'nfc-result-box';
    resBox.style.cssText = 'background:#fee2e2; border-color:#ef4444; color:#991b1b; border-left:4px solid #ef4444; padding:14px 16px; margin-top:16px; font-size:12.5px; text-align:left;';
    resBox.innerHTML = `<strong>✕ AKSES DITOLAK</strong><br><small>Gelang Invalid atau kuota wahana paket ini habis.</small>`;
  }
};

// ── TRANSMIT LAPORAN SITUASI CEPAT KE ADMIN DATABASE ──
window.kirimLaporanSituasi = function() {
  const kategori = document.getElementById('lap-kondisi-kategori').value;
  const deskripsi = document.getElementById('lap-kondisi-desc').value;
  
  alert(`Laporan Sukses Terkirim!\n\nKategori: ${kategori}\nData diteruskan secara real-time ke sistem Dashboard Pusat Admin.`);
  document.getElementById('form-situasi-cepat').reset();
};