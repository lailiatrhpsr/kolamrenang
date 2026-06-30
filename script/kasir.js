// ── CLOCK & DURASI ──
const SHIFT_START = new Date();
SHIFT_START.setHours(8,3,0,0);
setInterval(()=>{
  const clockEl = document.getElementById('clock');
  const durasiEl = document.getElementById('durasi-kerja');
  if(clockEl) {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    if(durasiEl) {
      const diff = Math.floor((now-SHIFT_START)/60000);
      durasiEl.textContent = Math.floor(diff/60)+'j '+( diff%60)+'m';
    }
  }
},1000);

// ── CHART DASHBOARD ──
const chartEl = document.getElementById('chartKat');
if(chartEl) {
  const ctx = chartEl.getContext('2d');
  new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Dewasa','Anak','Lansia','Rombongan'],
      datasets:[{data:[120,45,22,60],backgroundColor:['#1d4ed8','#22c55e','#f59e0b','#ec4899'],borderWidth:0}]
    },
    options:{responsive:true,plugins:{legend:{position:'bottom',labels:{font:{size:11},padding:12}}}}
  });
}

// ── JUAL TIKET ──
const PRICES={dewasa:25000,anak:15000,lansia:10000,rombongan:12000};
const NAMES={dewasa:'Tiket Dewasa',anak:'Tiket Anak',lansia:'Tiket Lansia',rombongan:'Tiket Rombongan'};
const qtys={dewasa:0,anak:0,lansia:0,rombongan:0};
let cartItems=[], trxNum=7;

const fmt=n=>'Rp'+n.toLocaleString('id-ID');

window.selTiket = function(el,type,price){
  document.querySelectorAll('.topt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel');
  if(qtys[type]===0) cq(type,1);
  document.getElementById('btn-tambah').disabled=false;
}

window.cq = function(type,d){
  qtys[type]=Math.max(0,qtys[type]+d);
  if(type==='rombongan'&&qtys[type]>0&&qtys[type]<10) qtys[type]=d>0?10:0;
  document.getElementById('q-'+type).textContent=qtys[type];
  const t=totalDipilih();
  document.getElementById('total-display').value=t>0?fmt(t):'';
  hitungKembali();
}

function totalDipilih(){ return Object.keys(qtys).reduce((s,k)=>s+qtys[k]*PRICES[k],0); }

window.hitungKembali = function(){
  const t=totalDipilih(),u=parseInt(document.getElementById('uang-masuk').value)||0;
  if(u>0){ document.getElementById('kembalian').value=u>=t?fmt(u-t):'⚠ Kurang '+fmt(t-u); }
  else { document.getElementById('kembalian').value=''; }
}

window.toggleTunai = function(){ 
  document.getElementById('panel-kalkulator').style.display=document.getElementById('metode-beli').value==='tunai'?'block':'none'; 
}

window.tambahKeranjang = function(){
  Object.keys(qtys).forEach(k=>{
    if(qtys[k]>0){
      const e=cartItems.find(c=>c.type===k);
      if(e){e.qty+=qtys[k];e.sub=e.qty*PRICES[k];}
      else cartItems.push({type:k,nama:NAMES[k],harga:PRICES[k],qty:qtys[k],sub:qtys[k]*PRICES[k]});
      qtys[k]=0; document.getElementById('q-'+k).textContent=0;
    }
  });
  document.querySelectorAll('.topt').forEach(o=>o.classList.remove('sel'));
  renderCart();
}

function renderCart(){
  const body=document.getElementById('cart-body');
  if(!body) return;
  const t=cartItems.reduce((s,c)=>s+c.sub,0);
  if(!cartItems.length){ body.innerHTML='<div style="text-align:center;padding:24px 0;color:#94a3b8;font-size:12px"><i class="ti ti-shopping-cart-off" style="font-size:28px;display:block;margin-bottom:6px;opacity:.3"></i>Belum ada tiket</div>'; }
  else { body.innerHTML=cartItems.map((c,i)=>`<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:10px 11px;margin-bottom:7px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><div><div style="font-size:12px;font-weight:700">${c.nama}</div><div style="font-size:10px;color:#64748b">${fmt(c.harga)}/org</div></div><i class="ti ti-x" style="color:#cbd5e1;cursor:pointer;font-size:16px" onclick="hapusItem(${i})"></i></div><div style="display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:6px"><button class="qb" onclick="ubahQty(${i},-1)">−</button><span style="font-size:13px;font-weight:700;min-width:20px;text-align:center">${c.qty}</span><button class="qb" onclick="ubahQty(${i},1)">+</button></div><span style="font-size:14px;font-weight:800;color:var(--primary)">${fmt(c.sub)}</span></div></div>`).join(''); }
  document.getElementById('cart-count').textContent=cartItems.length;
  document.getElementById('j-subtotal').textContent=fmt(t);
  document.getElementById('j-total').textContent=fmt(t);
  document.getElementById('btn-bayar').disabled=!cartItems.length;
  document.getElementById('total-display').value=t>0?fmt(t):'';
}

window.hapusItem = function(i){ cartItems.splice(i,1); renderCart(); }
window.ubahQty = function(i,d){ cartItems[i].qty=Math.max(1,cartItems[i].qty+d); cartItems[i].sub=cartItems[i].qty*cartItems[i].harga; renderCart(); }

window.prosesBayar = function(){
  const total=cartItems.reduce((s,c)=>s+c.sub,0);
  const metode=document.getElementById('metode-beli').value;
  const nama=document.getElementById('nama-beli').value.trim()||'Pengunjung Umum';
  const uang=parseInt(document.getElementById('uang-masuk').value)||0;
  if(metode==='tunai'&&uang<total){ alert('Uang yang diterima belum mencukupi!'); return; }
  const btn=document.getElementById('btn-bayar');
  btn.disabled=true; btn.innerHTML='<i class="ti ti-loader-2" style="animation:spin .8s linear infinite"></i> Memproses...';
  setTimeout(()=>{
    trxNum++;
    const kode='TKT-OFFLINE-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+String(trxNum).padStart(5,'0');
    tampilStruk(kode,nama,total,metode,uang);
    btn.disabled=false; btn.innerHTML='<i class="ti ti-cash"></i>Proses Bayar';
    document.getElementById('trx-badge').textContent=trxNum;
    document.getElementById('d-offline').textContent=parseInt(document.getElementById('d-offline').textContent)+1;
    document.getElementById('lap-offline').textContent=parseInt(document.getElementById('lap-offline').textContent)+1;
  },800);
}

function tampilStruk(kode,nama,total,metode,uang){
  const now=new Date();
  document.getElementById('struk-kode').textContent=kode;
  document.getElementById('struk-tgl').textContent=now.toLocaleString('id-ID');
  document.getElementById('struk-nama').textContent=nama;
  document.getElementById('struk-metode').textContent=metode==='tunai'?'Tunai':'QRIS';
  document.getElementById('struk-terima').textContent=metode==='tunai'?fmt(uang):fmt(total);
  document.getElementById('struk-kembali').textContent=metode==='tunai'?fmt(uang-total):'—';
  document.getElementById('struk-total').textContent=fmt(total);
  document.getElementById('barcode-txt').textContent=kode;
  document.getElementById('struk-items').innerHTML=cartItems.map(c=>`<div class="struk-row"><span class="sk">${c.nama} × ${c.qty}</span><span class="sv">${fmt(c.sub)}</span></div>`).join('');
  const bl=document.getElementById('barcode-el'); bl.innerHTML='';
  [2,1,2,1,1,2,1,2,1,1,2,2,1,1,2,1,1,2,1,2,2,1,1,2,1,2,1,1,2,2,1,1,2,1,2,1,1,2,1,2].forEach((w,i)=>{ const b=document.createElement('div'); b.className='bar'; b.style.cssText=`width:${w*2}px;height:${38+Math.sin(i*.8)*10}px`; bl.appendChild(b); });
  document.getElementById('struk-modal').classList.add('show');
  
  const aList=document.getElementById('act-list');
  const now2=now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  if(aList) {
    aList.insertAdjacentHTML('afterbegin',`<div class="act-item"><div class="act-dot" style="background:#22c55e"></div><div class="act-name">${nama}</div><div class="act-detail">Offline · ${cartItems.map(c=>c.nama+'×'+c.qty).join(', ')}</div><div class="act-time">${now2}</div></div>`);
  }
  const tbody=document.getElementById('tbody-laporan');
  if(tbody) {
    tbody.insertAdjacentHTML('afterbegin',`<tr><td style="color:var(--primary);font-weight:600">${kode}</td><td>${now2}</td><td>${nama}</td><td>${cartItems[0]?.nama||'—'}</td><td>${cartItems.reduce((s,c)=>s+c.qty,0)}</td><td>${fmt(total)}</td><td><span class="sbadge s-offline">Offline</span></td><td>${metode==='tunai'?'Tunai':'QRIS'}</td><td><span class="sbadge s-lunas">Lunas</span></td></tr>`);
  }
}

window.tutupStruk = function(){ document.getElementById('struk-modal').classList.remove('show'); cartItems=[]; renderCart(); document.getElementById('uang-masuk').value=''; document.getElementById('kembalian').value=''; document.getElementById('nama-beli').value=''; }
window.dlPDF = function(){ alert('Struk PDF diunduh!'); }

// ── NFC ──
window.aktivasiNfc = function(){
  document.getElementById('nfc-status-txt').textContent='NFC Aktif — Menunggu tap gelang...';
  document.getElementById('nfc-sub-txt').textContent='Dekatkan gelang NFC ke belakang perangkat Android';
}
window.tulisGelang = function(){
  const kode=document.getElementById('nfc-kode').value.trim();
  const nama=document.getElementById('nfc-nama').value.trim();
  if(!kode||!nama){ alert('Isi kode transaksi dan nama pengunjung!'); return; }
  demoNfc('write');
}
window.resetGelang = function(){
  const serial=document.getElementById('reset-serial').value.trim();
  if(!serial){ alert('Isi serial NFC gelang!'); return; }
  demoNfc('reset');
}
window.demoNfc = function(type){
  const res=document.getElementById('nfc-result');
  const log=document.getElementById('nfc-log');
  const now=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  if(!res || !log) return;
  if(type==='write'){
    res.className='nfc-result ok';
    res.style.display='block';
    res.innerHTML=`<div style="font-size:12px;font-weight:700;color:#166534;margin-bottom:6px;display:flex;align-items:center;gap:5px"><i class="ti ti-circle-check" style="font-size:15px"></i>Data Berhasil Ditulis ke Gelang</div><div style="font-size:11px;color:#475569">Serial chip: 04:AB:CD:EF:${Math.floor(Math.random()*90+10)}:${Math.floor(Math.random()*90+10)}</div>`;
    const nama=document.getElementById('nfc-nama').value||'Pengunjung';
    log.insertAdjacentHTML('afterbegin',`<div class="act-item"><div class="act-dot" style="background:#1d4ed8"></div><div class="act-name">${nama}</div><div class="act-detail">Tulis · ${document.getElementById('nfc-kode').value||'—'}</div><div class="act-time">${now}</div></div>`);
  } else {
    res.className='nfc-result ok';
    res.style.display='block';
    res.innerHTML=`<div style="font-size:12px;font-weight:700;color:#166534;margin-bottom:6px;display:flex;align-items:center;gap:5px"><i class="ti ti-circle-check" style="font-size:15px"></i>Gelang Berhasil Direset</div><div style="font-size:11px;color:#475569">Data dihapus. Gelang siap dipakai ulang.</div>`;
    log.insertAdjacentHTML('afterbegin',`<div class="act-item"><div class="act-dot" style="background:#f59e0b"></div><div class="act-name">${document.getElementById('reset-serial').value||'04:FF:FF:FF'}</div><div class="act-detail">Reset · dikembalikan</div><div class="act-time">${now}</div></div>`);
    document.getElementById('reset-serial').value='';
  }
}

// ── GEO ──
const AQ_LAT=-7.5621, AQ_LNG=112.7234;
function haversine(a,b,c,d){ const R=6371,dL=(c-a)*Math.PI/180,dG=(d-b)*Math.PI/180,x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dG/2)**2; return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)); }

window.verifikasiLokasi = function(jenis){
  const btn=document.getElementById('btn-verif-loc');
  if(btn) {
    btn.disabled=true; btn.innerHTML='<i class="ti ti-loader-2" style="animation:spin .8s linear infinite"></i> Mengambil lokasi...';
  }
  const proses=(lat,lng)=>{
    const jarak=haversine(lat,lng,AQ_LAT,AQ_LNG);
    const jarakM=Math.round(jarak*1000);
    const ok=jarak<=0.2;
    const now=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const res=document.getElementById('geo-result');
    if(res) {
      res.style.display='block';
      res.className='geo-verif '+(ok?'ok':'fail');
      res.innerHTML=`<div style="font-size:13px;font-weight:700;margin-bottom:8px;color:${ok?'#166534':'#991b1b'}">${ok?'✓ Lokasi Terverifikasi':'✗ Lokasi Ditolak'}</div><div style="font-size:11px;color:#475569"><div style="display:flex;justify-content:space-between;padding:3px 0"><span>Jenis</span><span style="font-weight:600">${jenis==='mulai'?'Mulai Shift':'Selesai Shift'}</span></div><div style="display:flex;justify-content:space-between;padding:3px 0"><span>Jarak ke AquaPass</span><span style="font-weight:600">${jarakM}m</span></div><div style="display:flex;justify-content:space-between;padding:3px 0"><span>Status</span><span style="font-weight:600;color:${ok?'#166534':'#991b1b'}">${ok?'Dalam radius 200m':'Di luar radius 200m'}</span></div><div style="display:flex;justify-content:space-between;padding:3px 0"><span>Waktu</span><span style="font-weight:600">${now}</span></div></div>`;
    }
    const pinGeo = document.getElementById('user-pin-geo');
    if(pinGeo) pinGeo.classList.add('show');
    if(btn) {
      btn.disabled=false; btn.innerHTML='<i class="ti ti-map-check"></i>Verifikasi Mulai Shift';
    }
  };
  if(navigator.geolocation){ navigator.geolocation.getCurrentPosition(p=>proses(p.coords.latitude,p.coords.longitude),()=>proses(AQ_LAT+0.001,AQ_LNG-0.001),{enableHighAccuracy:true,timeout:8000}); }
  else { proses(AQ_LAT+0.001,AQ_LNG-0.001); }
}

// ── LAPORAN ──
window.filterLaporan = function(){ alert('Filter diterapkan (demo)'); }
window.exportLaporan = function(){ alert('Laporan diekspor ke Excel (demo)'); }

// ── PROFIL ──
window.simpanProfil = function(){ alert('Profil berhasil disimpan!'); }
window.ubahPassword = function(){
  const baru=document.getElementById('pw-baru').value, konfirm=document.getElementById('pw-konfirm').value;
  if(baru!==konfirm){ alert('Password baru tidak cocok!'); return; }
  if(baru.length<8){ alert('Password minimal 8 karakter!'); return; }
  alert('Password berhasil diubah!');
  document.getElementById('pw-lama').value=''; document.getElementById('pw-baru').value=''; document.getElementById('pw-konfirm').value='';
}
window.konfirmasiLogout = function(){
  if(confirm('Yakin ingin logout dari AquaPass?')) window.location.href='login-staff.html';
}