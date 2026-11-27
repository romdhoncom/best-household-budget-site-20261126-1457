// DompetKeluarga — seeded household data for November 2026.
// All figures are realistic example figures for one Indonesian household
// (a family of four in Bandung); every number on the site comes from here.

export const HOUSEHOLD = {
  name: 'Keluarga Rahmawati',
  members: 4,
  city: 'Bandung',
  month: 'November 2026',
  currency: 'IDR',
};

export const INCOME = [
  { source: 'Gaji — Andi (ayah)', amount: 8500000, note: 'Gaji pokok, diterima 1 Nov' },
  { source: 'Gaji — Sari (ibu)', amount: 3200000, note: 'Gaji pokok, diterima 1 Nov' },
  { source: 'Usaha sampingan — katering', amount: 1850000, note: 'Pesanan akhir pekan' },
  { source: 'Bunga tabungan', amount: 42000, note: 'Bunga bulan Oktober' },
];

export const CATEGORIES = [
  { id: 'harian', name: 'Belanja Harian', color: '#2e7d5b', budget: 2800000 },
  { id: 'tagihan', name: 'Tagihan & Utilitas', color: '#4a6fa5', budget: 1450000 },
  { id: 'transport', name: 'Transportasi', color: '#b7791f', budget: 1200000 },
  { id: 'makan', name: 'Makan di Luar', color: '#c0564f', budget: 900000 },
  { id: 'pendidikan', name: 'Pendidikan', color: '#6b5ca5', budget: 1500000 },
  { id: 'kesehatan', name: 'Kesehatan', color: '#2f8f83', budget: 600000 },
  { id: 'hiburan', name: 'Hiburan', color: '#a05a8c', budget: 500000 },
  { id: 'lainnya', name: 'Lainnya', color: '#7a7a7a', budget: 400000 },
];

// Transactions for November 2026, newest first. Amounts in rupiah.
export const TRANSACTIONS = [
  { date: '2026-11-26', desc: 'Belanja mingguan — Pasar Kosambi', category: 'harian', amount: 312000 },
  { date: '2026-11-25', desc: 'Bensin Pertalite — SPBU Dago', category: 'transport', amount: 150000 },
  { date: '2026-11-25', desc: 'Makan malam — Warung Sate Shinta', category: 'makan', amount: 186000 },
  { date: '2026-11-24', desc: 'Les matematika — Budi (anak)', category: 'pendidikan', amount: 400000 },
  { date: '2026-11-23', desc: 'Listrik PLN — token 200 kWh', category: 'tagihan', amount: 310000 },
  { date: '2026-11-22', desc: 'Belanja bulanan — Supermarket Griya', category: 'harian', amount: 845000 },
  { date: '2026-11-21', desc: 'Tiket bioskop — keluarga (4 orang)', category: 'hiburan', amount: 200000 },
  { date: '2026-11-20', desc: 'Internet rumah — IndiHome', category: 'tagihan', amount: 345000 },
  { date: '2026-11-19', desc: 'Ojek online — antar jemput sekolah', category: 'transport', amount: 96000 },
  { date: '2026-11-18', desc: 'Obat flu & vitamin — Apotek K24', category: 'kesehatan', amount: 128000 },
  { date: '2026-11-17', desc: 'Buku & alat tulis — Toko Buku Togamas', category: 'pendidikan', amount: 215000 },
  { date: '2026-11-15', desc: 'Belanja mingguan — Pasar Kosambi', category: 'harian', amount: 298000 },
  { date: '2026-11-14', desc: 'Makan siang — RM Padang Sederhana', category: 'makan', amount: 142000 },
  { date: '2026-11-12', desc: 'Air PDAM — tagihan Oktober', category: 'tagihan', amount: 187000 },
  { date: '2026-11-10', desc: 'Servis motor — bengkel AHASS', category: 'transport', amount: 265000 },
  { date: '2026-11-08', desc: 'Belanja bulanan — Supermarket Griya', category: 'harian', amount: 912000 },
  { date: '2026-11-05', desc: 'Iuran RT & kebersihan', category: 'lainnya', amount: 75000 },
  { date: '2026-11-03', desc: 'Langganan streaming — film keluarga', category: 'hiburan', amount: 59000 },
  { date: '2026-11-02', desc: 'Pulsa & paket data — 2 nomor', category: 'tagihan', amount: 150000 },
  { date: '2026-11-01', desc: 'SPP sekolah — Budi & Ani', category: 'pendidikan', amount: 900000 },
];

// Monthly totals for the trend chart (Jun–Nov 2026).
export const MONTHLY = [
  { month: 'Jun', income: 13200000, spent: 9480000 },
  { month: 'Jul', income: 13450000, spent: 10250000 },
  { month: 'Agu', income: 13100000, spent: 9910000 },
  { month: 'Sep', income: 13750000, spent: 10420000 },
  { month: 'Okt', income: 13590000, spent: 9780000 },
  { month: 'Nov', income: 13592000, spent: 0 }, // Nov spent is computed live below
];

export const GOALS = [
  { id: 'darurat', name: 'Dana Darurat', target: 20000000, saved: 12400000, note: 'Target 6x pengeluaran bulanan' },
  { id: 'liburan', name: 'Liburan Keluarga — Yogyakarta', target: 8000000, saved: 3200000, note: 'Berangkat libur sekolah Juni 2027' },
  { id: 'rumah', name: 'DP Rumah', target: 150000000, saved: 47500000, note: 'Menabung Rp 2.500.000 per bulan' },
];

export const TIPS = [
  { title: 'Belanja harian 12% di bawah anggaran', body: 'Pasar tradisional dua kali seminggu menghemat sekitar Rp 180.000 dibanding belanja harian di minimarket.' },
  { title: 'Makan di luar melewati separuh anggaran', body: 'Rp 328.000 dari Rp 900.000 sudah terpakai. Satu kali masak di rumah akhir pekan ini menghemat sekitar Rp 120.000.' },
  { title: 'Tabungan otomatis di awal bulan', body: 'Pindahkan Rp 2.500.000 ke DP Rumah setiap tanggal 2 — sebelum uangnya terpakai untuk hal lain.' },
];

export function totalIncome() {
  return INCOME.reduce((sum, item) => sum + item.amount, 0);
}

export function totalSpent() {
  return TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);
}

export function spentByCategory() {
  const map = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of TRANSACTIONS) map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  return CATEGORIES.map((c) => ({ ...c, spent: map.get(c.id) ?? 0 }));
}

export function formatRupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function formatShort(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return formatRupiah(n);
}
