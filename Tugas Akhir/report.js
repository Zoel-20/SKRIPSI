// ── Firebase Config ───────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBF1tIAOGAtLpdyMLWjZVRpA1HSgeGLeI8",
  authDomain: "skripsi-22.firebaseapp.com",
  databaseURL: "https://skripsi-22-default-rtdb.firebaseio.com",
  projectId: "skripsi-22",
  storageBucket: "skripsi-22.firebasestorage.app",
  messagingSenderId: "80955788067",
  appId: "1:80955788067:web:b8a8561722d21286701a96",
  measurementId: "G-HLJHB94MH7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ── Chart Instances ───────────────────────────────────────────
let reporttempChart = null;
let reporthumChart  = null;

// ── Listener Firebase ─────────────────────────────────────────
db.ref('sensor/readings').on('value', (snapshot) => {
  const raw = snapshot.val();
  if (!raw) return;

  // Ambil 10 data terakhir
  const dataArray = Object.values(raw).slice(-10);

  // ✅ Dihapus: baris getElementById('temperature') & getElementById('humidity')
  //    karena elemen itu ga ada di HTML

  const labels = dataArray.map(d => d.time);
  const suhu   = dataArray.map(d => d.suhu);
  const hum    = dataArray.map(d => d.kelembaban);

  updateCharts(labels, suhu, hum);
});

// ── Fungsi Update Grafik ──────────────────────────────────────
function updateCharts(labels, suhu, hum) {

  // Destroy dulu sebelum bikin baru
  if (reporttempChart) reporttempChart.destroy();
  if (reporthumChart)  reporthumChart.destroy();

  // Grafik Suhu
  reporttempChart = new Chart(document.getElementById('reporttempChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Suhu (°C)',
        data: suhu,
        borderColor: '#e53e3e',
        backgroundColor: 'rgba(229,62,62,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { title: { display: true, text: '°C' } },
        x: { title: { display: true, text: 'Time' } }
      }
    }
  });

  // Grafik Kelembaban
  reporthumChart = new Chart(document.getElementById('reporthumChart'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Kelembaban (%)',
        data: hum,
        borderColor: '#046468',
        backgroundColor: 'rgba(4,100,104,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { title: { display: true, text: '%' } },
        x: { title: { display: true, text: 'Time' } }
      }
    }
  });
}