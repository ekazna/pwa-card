const CACHE_NAME = 'visit-card-cache-v1';
const urlsToCache = [
  '/pwa-card/',
  '/pwa-card/index.html',
  '/pwa-card/styles.css',
  '/pwa-card/app.js',
  '/pwa-card/images/image.jpg',
  '/pwa-card/icons/512.png',
  '/pwa-card/icons/192.png',
  '/pwa-card/icons/qr-phone.png',
  '/pwa-card/icons/qr-tg.png',
  '/pwa-card/icons/qr-vk.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${url}: ${response.status}`);
                }
                return cache.put(url, response);
              })
              .catch(err => {
                console.error(`Failed to cache ${url}:`, err);
              });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});


self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
