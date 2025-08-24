// Nama cache untuk PWA kita.
// PENTING: Ganti nomor versi ini (misal, v2, v3) setiap kali Anda mengubah file di dalam urlsToCache.
const CACHE_NAME = 'checklist-kebersihan-cache-v2';

// Daftar lengkap file yang akan disimpan di cache untuk mode offline
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon/apple-touch-icon.png',
  '/favicon/favicon-96x96.png',
  '/favicon/favicon.ico',
  '/favicon/favicon.svg',
  '/favicon/site.webmanifest',
  '/favicon/web-app-manifest-192x192.png',
  '/favicon/web-app-manifest-512x512.png'
];

// Event listener untuk proses 'install' Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Cache dibuka dan file ditambahkan');
      return cache.addAll(urlsToCache);
    })
  );
});

// Event listener untuk setiap request 'fetch'
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      // Jika request ada di cache, kembalikan dari cache
      if (response) {
        return response;
      }
      // Jika tidak ada, fetch dari network
      return fetch(event.request);
    })
  );
});

// Event listener untuk 'activate', membersihkan cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Hapus semua cache yang tidak sama dengan CACHE_NAME terbaru
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});