const CACHE_NAME = 'dte-chatbot-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: pre-cache app shell
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for other assets
self.addEventListener('fetch', event => {
  const req = event.request;
  // Navigation requests (HTML pages)
  if (req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(req)
        .then(networkRes => {
          // update cache then return response
          caches.open(CACHE_NAME).then(cache => cache.put(req, networkRes.clone()));
          return networkRes;
        })
        .catch(() => caches.match(req).then(r => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // For other requests: try cache, then network and cache the result
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req)
        .then(networkRes => {
          // ignore opaque responses that can't be cached if you prefer
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(req, networkRes.clone()).catch(()=>{/* some responses cross-origin may not be cacheable */});
            return networkRes;
          });
        })
        .catch(() => {
          // fallback for images or other assets: optional
          if (req.destination === 'image') return caches.match('/icons/icon-192.png');
          return null;
        });
    })
  );
});
