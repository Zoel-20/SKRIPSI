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

// ── Greeting ──────────────────────────────────────────────────
function updateGreeting() {
  const hours = new Date().getHours();
  let greeting;

  if (hours >= 5 && hours < 11)       greeting = "Good Morning!";
  else if (hours >= 11 && hours < 15) greeting = "Good Afternoon!";
  else if (hours >= 15 && hours < 18) greeting = "Good Evening!";
  else                                greeting = "Good Night!";

  const el = document.getElementById('greeting-text');
  if (el) el.textContent = greeting;
}

// ── Chart Instances (disimpan biar bisa di-destroy sebelum update) ──
let tempChart = null;
let humChart  = null;

// ── Dengerin Firebase — 1 listener aja ───────────────────────
db.ref('sensor/readings').on('value', (snapshot) => {
  const raw = snapshot.val();
  if (!raw) return;

  // Ambil semua data, tapi slice 10 terakhir aja
  const dataArray = Object.values(raw).slice(-10); // ← ini aja yang ditambahin

  const latest = dataArray[dataArray.length - 1];
  document.getElementById('temperature').innerText = latest.suhu.toFixed(1) + ' °C';
  document.getElementById('humidity').innerText    = latest.kelembaban.toFixed(1) + ' %';

  const labels = dataArray.map(d => d.time);
  const suhu   = dataArray.map(d => d.suhu);
  const hum    = dataArray.map(d => d.kelembaban);

  updateCharts(labels, suhu, hum);
});

// ── Fungsi Bikin/Update Grafik ────────────────────────────────
function updateCharts(labels, suhu, hum) {

  // Destroy dulu sebelum bikin baru (wajib, biar ga error)
  if (tempChart) tempChart.destroy();
  if (humChart)  humChart.destroy();

  // Grafik Suhu
  tempChart = new Chart(document.getElementById('tempChart'), {
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
      maintainAspectRatio: false, // ← wajib biar grafik ngikutin tinggi CSS
      plugins: { legend: { display: false } },
      scales: {
        y: { title: { display: true, text: '°C' } },
        x: { title: { display: true, text: 'Time' } }
      }
    }
  });

  // Grafik Kelembaban
  humChart = new Chart(document.getElementById('humChart'), {
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
// ── Init ──────────────────────────────────────────────────────
window.onload = () => {
  updateGreeting();
};