// ====== FIREBASE CONFIG ======
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

// ====== SLIDER ======
function initSliders() {
  const setupSlider = (sliderId, outputId) => {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);
    if (slider && output) {
      slider.oninput = function () {
        output.innerHTML = this.value;
      };
    }
  };

  setupSlider('range-temp', 'temp-value');
  setupSlider('range-hmdty', 'hmdty-value');
}

// ====== APPLY SETPOINT → KIRIM KE FIREBASE ======
function setApplySetpoint() {
  const temp = document.getElementById('range-temp').value;
  const hmdty = document.getElementById('range-hmdty').value;

  const setpointRef = db.ref('setpoint');

  setpointRef.set({
    temperature: Number(temp),
    humidity: Number(hmdty),
    updated_at: new Date().toISOString()
  })
  .then(() => {
    alert("✅ Setpoint berhasil disimpan!");
  })
  .catch((error) => {
    alert("❌ Gagal menyimpan: " + error.message);
  });
}

// ====== LOAD SETPOINT DARI FIREBASE (opsional) ======
function loadSetpoint() {
  db.ref('setpoint').once('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
      document.getElementById('range-temp').value = data.temperature;
      document.getElementById('temp-value').innerHTML = data.temperature;

      document.getElementById('range-hmdty').value = data.humidity;
      document.getElementById('hmdty-value').innerHTML = data.humidity;
    }
  });
}

window.onload = () => {
  initSliders();
  loadSetpoint(); // Ambil nilai terakhir saat halaman dibuka
};