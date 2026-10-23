const CACHE_NAME = 'food-assistant-v0.11';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css?v=0.11',
  './config.js?v=0.11',
  './app.js?v=0.11',
  './manifest.json'
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
  // Only handle GET requests and exclude external APIs (Gemini, Supabase, Google Fonts, CORS proxies)
  if (
    event.request.method !== 'GET' || 
    event.request.url.includes('generativelanguage.googleapis.com') ||
    event.request.url.includes('supabase.co') ||
    event.request.url.includes('r.jina.ai') ||
    event.request.url.includes('allorigins.win') ||
    event.request.url.includes('codetabs.com') ||
    event.request.url.includes('corsproxy.io')
  ) {
    return;
  }

  // Network-First strategy: guarantees user always gets fresh code when online, with instant offline cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
