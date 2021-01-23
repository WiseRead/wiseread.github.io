if ("serviceWorker" in navigator) {
  try {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  } catch (e) {}
}
