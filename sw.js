const CACHE_NAME = 'visit-card-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/images/image.jpg',
  '/icons/512.png',
  '/icons/192.png',
  '/icons/qr-phone.png',
  '/icons/qr-tg.png',
  '/icons/qr-vk.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Кэшируем файлы по одному с обработкой ошибок
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
