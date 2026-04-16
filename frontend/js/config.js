const firebaseConfig = {
  apiKey: "AIzaSyA2oiPQPJXLJMftO5iZ82Zd6Z00UfMLhF0",
  authDomain: "nexara-bfb67.firebaseapp.com",
  projectId: "nexara-bfb67",
  storageBucket: "nexara-bfb67.appspot.com",
  messagingSenderId: "1039460241777",
  appId: "1:1039460241777:web:22eb20c4e6ca8d3f6766d0",
  measurementId: "G-010THJ7J1Y"
};

// Backend URL (must be HTTPS + live)
const BACKEND_URL = "https://nexara-9rgc.onrender.com";

// Safety check (helps debugging)
if (!BACKEND_URL.startsWith("https://")) {
  console.warn("BACKEND_URL should be HTTPS for production");
}

export { firebaseConfig, BACKEND_URL };