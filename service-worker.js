// public/service-worker.js

self.addEventListener('install', (event) => {
    console.log('Service Worker установился.');

    event.waitUntil(
      caches.open('my-cache-v1').then((cache) => {
        return cache.addAll([
            '/',
            '/index.html',
            '/static/css/main.css', // путь к вашему CSS
            '/static/js/bundle.js', // путь к вашему JS
            '/logo192.png',          // ваши иконки
            '/logo512.png',   
        ]);
      })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker активирован.');

    const cacheWhitelist = ['my-cache-v1'];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});