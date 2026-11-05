const CACHE_NAME = 'food-assistant-v1.27';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css?v=1.27',
  './config.js?v=1.27',
  './app.js?v=1.27',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isSameOrigin = url.startsWith(self.location.origin);
  const isPrecachedExternal = url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com') ||
    url.includes('cdn.jsdelivr.net');

  // Only handle same-origin GET requests or precached external assets (fonts/icons, Supabase SDK)
  if (event.request.method !== 'GET' || (!isSameOrigin && !isPrecachedExternal)) {
    return;
  }

  // Network-First strategy: guarantees fresh content online, seamless cache fallback offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
