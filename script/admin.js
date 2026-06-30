// ── DATA ARRAYS / LOCAL MEMORY STATE ──
let kategoriTiketData = [
  { id: "CAT-001", nama: "Tiket Reguler Anak", harga: 35000, wahana: "Semua Kolam Basah", status: "Aktif" },
  { id: "CAT-002", nama: "Tiket Reguler Dewasa", harga: 50000, wahana: "Semua Kolam + Area Gym", status: "Aktif" },
  { id: "CAT-003", nama: "Tiket Terusan VIP", harga: 85000, wahana: "Akses Wahana Premium + Handuk", status: "Aktif" }
];

let wahanaData = [
  { id: "W-01", nama: "Kolam Utama Dewasa", dalam: "1.4m - 1.8m", kapasitas: 100, status: "Beroperasi" },
  { id: "W-02", nama: "Waterboom Arena Anak", dalam: "0.3m - 0.6m", kapasitas: 50, status: "Beroperasi" },
  { id: "W-03", nama: "Kolam Ombak Buatan", dalam: "0m - 1.6m", kapasitas: 80, status: "Perawatan Air" }
];

let staffData = [
  { nama: "Mayapada Naira", email: "mayapada@aquapass.com", role: "Kasir Utama", geo: "Valid (Dalam Radius)" },
  { nama: "Bunga Jelita", email: "bunga@aquapass.com", role: "Petugas Wahana", geo: "Valid (Dalam Radius)" },
  { nama: "Hasbi Biruan", email: "hasbi@aquapass.com", role: "Admin Lapangan", geo: "Invalid (Luar Radius)" }
];

const dataTransaksiHarian = [
  { id: "TRX-10293", waktu: "2026-06-30 09:12", tipe: "Online", total: 170000, status: "Lunas" },
  { id: "TRX-10294", waktu: "2026-06-30 09:45", tipe: "Online", total: 85000, status: "Lunas" },
  { id: "TKT-OFFLINE-001", waktu: "2026-06-30 10:05", tipe: "Offline", total: 100000, status: "Lunas" }
];

// INITIALIZATION RUNNER
document.addEventListener("DOMContentLoaded", () => {
  renderGlobalTransaksi();
  renderKategoriTiket();
  renderWahana();
  renderStaff();
  initDashboardStaffList();
  initCharts();
  buildLokerGrid();
});

// ── 1. RENDER DASHBOARD & TRANSAKSI ──
function renderGlobalTransaksi() {
  const tbody = document.getElementById("table-body-transaksi");
  if (!tbody) return;
  tbody.innerHTML = dataTransaksiHarian.map(tx => `
    <tr>
      <td><strong>${tx.id}</strong></td>
      <td>${tx.waktu}</td>
      <td><span class="badge-status ${tx.tipe === 'Online' ? 'bg-info-sub' : 'bg-warning-sub'}">${tx.tipe}</span></td>
      <td>Rp ${tx.total.toLocaleString("id-ID")}</td>
      <td><span class="badge-status bg-success-sub">${tx.status}</span></td>
    </tr>
  `).join('');
}

function initDashboardStaffList() {
  const list = document.getElementById("list-staff-dashboard");
  if (!list) return;
  list.innerHTML = staffData.map(st => `
    <li class="list-group-item d-flex justify-content-between align-items-center px-0">
      <div><strong>${st.nama}</strong><br><small class="text-muted">${st.role}</small></div>
      <span class="badge-status ${st.geo.includes('Valid') ? 'bg-success-sub' : 'bg-danger-sub'}">${st.geo.split(' ')[0]}</span>
    </li>
  `).join('');
}

// ── 2. CRUD OPERASIONAL KATEGORI TIKET ──
let editTiketId = null;
function renderKategoriTiket() {
  const tbody = document.getElementById("table-body-kategori");
  if (!tbody) return;
  tbody.innerHTML = kategoriTiketData.map((item, index) => `
    <tr>
      <td>${item.id}</td>
      <td><strong>${item.nama}</strong></td>
      <td>Rp ${item.harga.toLocaleString("id-ID")}</td>
      <td><span class="text-muted">${item.wahana}</span></td>
      <td><span class="badge-status bg-success-sub">${item.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon btn-edit" onclick="bukaEditKategori(${index})"><i class="ti ti-edit"></i></button>
          <button class="btn-icon btn-delete" onclick="hapusKategori(${index})"><i class="ti ti-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.simpanKategori = function() {
  const nama = document.getElementById("kat-nama").value;
  const harga = parseInt(document.getElementById("kat-harga").value);
  const wahana = document.getElementById("kat-wahana").value;

  if (editTiketId !== null) {
    kategoriTiketData[editTiketId] = { ...kategoriTiketData[editTiketId], nama, harga, wahana };
    editTiketId = null;
    document.getElementById("btn-submit-kat").innerText = "Simpan Kategori";
  } else {
    kategoriTiketData.push({ id: `CAT-00${kategoriTiketData.length + 1}`, nama, harga, wahana, status: "Aktif" });
  }
  document.getElementById("form-kategori").reset();
  renderKategoriTiket();
};

window.bukaEditKategori = function(index) {
  const item = kategoriTiketData[index];
  document.getElementById("kat-nama").value = item.nama;
  document.getElementById("kat-harga").value = item.harga;
  document.getElementById("kat-wahana").value = item.wahana;
  editTiketId = index;
  document.getElementById("btn-submit-kat").innerText = "Perbarui Kategori";
};

window.hapusKategori = function(index) {
  if (confirm("Hapus kategori tiket ini?")) { kategoriTiketData.splice(index, 1); renderKategoriTiket(); }
};

// ── 3. CRUD OPERASIONAL DATA WAHANA ──
let editWahanaId = null;
function renderWahana() {
  const tbody = document.getElementById("table-body-wahana");
  if (!tbody) return;
  tbody.innerHTML = wahanaData.map((item, index) => `
    <tr>
      <td><strong>${item.nama}</strong></td>
      <td>${item.dalam}</td>
      <td>${item.kapasitas} Orang</td>
      <td><span class="badge-status ${item.status === 'Beroperasi' ? 'bg-success-sub' : 'bg-danger-sub'}">${item.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon btn-edit" onclick="bukaEditWahana(${index})"><i class="ti ti-edit"></i></button>
          <button class="btn-icon btn-delete" onclick="hapusWahana(${index})"><i class="ti ti-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.simpanWahana = function() {
  const nama = document.getElementById("wahana-nama").value;
  const dalam = document.getElementById("wahana-dalam").value;
  const kapasitas = parseInt(document.getElementById("wahana-kapasitas").value);

  if (editWahanaId !== null) {
    wahanaData[editWahanaId] = { ...wahanaData[editWahanaId], nama, dalam, kapasitas };
    editWahanaId = null;
    document.getElementById("btn-submit-wahana").innerText = "Simpan Wahana";
  } else {
    wahanaData.push({ id: `W-0${wahanaData.length + 1}`, nama, dalam, kapasitas, status: "Beroperasi" });
  }
  document.getElementById("form-wahana").reset();
  renderWahana();
};

window.bukaEditWahana = function(index) {
  const item = wahanaData[index];
  document.getElementById("wahana-nama").value = item.nama;
  document.getElementById("wahana-dalam").value = item.dalam;
  document.getElementById("wahana-kapasitas").value = item.kapasitas;
  editWahanaId = index;
  document.getElementById("btn-submit-wahana").innerText = "Perbarui Wahana";
};

window.hapusWahana = function(index) {
  if (confirm("Hapus data wahana ini?")) { wahanaData.splice(index, 1); renderWahana(); }
};

// ── 4. CRUD OPERASIONAL AKUN STAFF ──
let editStaffId = null;
function renderStaff() {
  const tbody = document.getElementById("table-body-staff");
  if (!tbody) return;
  tbody.innerHTML = staffData.map((item, index) => `
    <tr>
      <td><strong>${item.nama}</strong></td>
      <td>${item.email}</td>
      <td>${item.role}</td>
      <td><span class="badge-status ${item.geo.includes('Valid') ? 'bg-success-sub' : 'bg-danger-sub'}">${item.geo}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon btn-edit" onclick="bukaEditStaff(${index})"><i class="ti ti-edit"></i></button>
          <button class="btn-icon btn-delete" onclick="hapusStaff(${index})"><i class="ti ti-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.simpanStaff = function() {
  const nama = document.getElementById("staff-nama").value;
  const email = document.getElementById("staff-email").value;
  const role = document.getElementById("staff-role").value;

  if (editStaffId !== null) {
    staffData[editStaffId] = { ...staffData[editStaffId], nama, email, role };
    editStaffId = null;
    document.getElementById("btn-submit-staff").innerText = "Daftarkan Akun Staff";
  } else {
    staffData.push({ nama, email, role, geo: "Valid (Dalam Radius)" });
  }
  document.getElementById("form-staff").reset();
  renderStaff();
};

window.bukaEditStaff = function(index) {
  const item = staffData[index];
  document.getElementById("staff-nama").value = item.nama;
  document.getElementById("staff-email").value = item.email;
  document.getElementById("staff-role").value = item.role;
  editStaffId = index;
  document.getElementById("btn-submit-staff").innerText = "Perbarui Akun Staff";
};

window.hapusStaff = function(index) {
  if (confirm("Hapus akun staff ini?")) { staffData.splice(index, 1); renderStaff(); }
};

// ── 5. CRUD MATRIX LOKER GENERATOR & MANUAL REGISTRATION ──
function buildLokerGrid() {
  const grid = document.getElementById("lokerGridContainer");
  if (!grid) return;
  grid.innerHTML = "";
  for (let i = 1; i <= 40; i++) {
    const label = 'L-' + String(i).padStart(2, '0');
    const cell = document.createElement('div');
    cell.id = 'cell-' + label;
    cell.className = 'loker-cell lc-empty';
    cell.textContent = label;
    grid.appendChild(cell);
  }
}

window.tambahLokerManual = function() {
  const label = document.getElementById("loker-label").value.trim().toUpperCase();
  const status = document.getElementById("loker-status").value;
  const targetCell = document.getElementById('cell-' + label);
  
  if(targetCell) {
    targetCell.className = 'loker-cell ' + status;
    alert(`Unit Loker ${label} berhasil diperbarui kondisinya!`);
  } else {
    // Jika kode baru diluar matriks 1-40
    const grid = document.getElementById("lokerGridContainer");
    const cell = document.createElement('div');
    cell.id = 'cell-' + label;
    cell.className = 'loker-cell ' + status;
    cell.textContent = label;
    grid.appendChild(cell);
    alert(`Unit Loker baru ${label} sukses ditambahkan ke matriks ekspansi!`);
  }
  document.getElementById("form-loker").reset();
};

// ── 6. GRAPHICS / CHARTS ENGINE ──
function initCharts() {
  const ctxTren = document.getElementById("chartTrenBaru");
  if (ctxTren) {
    new Chart(ctxTren.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
        datasets: [{
          data: [1200000, 3100000, 4800000, 6200000, 7150000, 7650000],
          borderColor: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.05)', fill: true, tension: 0.3, borderWidth: 2
        }]
      },
      options: { plugins: { legend: { display: false } } }
    });
  }

  const ctxKat = document.getElementById("chartKategoriTiket");
  if (ctxKat) {
    new Chart(ctxKat.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Reguler Anak', 'Reguler Dewasa', 'Terusan VIP'],
        datasets: [{ data: [45, 82, 28], backgroundColor: ['#38bdf8', '#0284c7', '#9333ea'] }]
      }
    });
  }
}

window.demoNfc = function(type) {
  const res = document.getElementById('nfc-result');
  const log = document.getElementById('nfc-log');
  const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  if (!res || !log) return;
  
  res.style.display = 'block';
  res.className = 'nfc-result-box success'; // Memakai style box terupdate
  
  if (type === 'write') {
    res.innerHTML = `<strong>✓ Data Transmit Berhasil!</strong><br><small style="color:#047857">Paket data enkripsi sukses disuntikkan ke dalam chip internal gelang pintar.</small>`;
  } else {
    res.innerHTML = `<strong>✓ Format Ulang Selesai!</strong><br><small style="color:#047857">Memory block dibersihkan. Gelang siap disalurkan untuk pengunjung baru.</small>`;
    document.getElementById('reset-serial').value = '';
  }
};