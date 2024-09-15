// public/service-worker.js

// Событие установки Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker установился.');

    event.waitUntil(
      caches.open('my-cache-v1').then((cache) => {
        return cache.addAll([
            '/',
            '/index.html',
            '/logo192.png', 
            '/logo512.png', 
            '/screenshot1.png',
            '/screenshot2.png'  
        ]);
      })
    );

    self.skipWaiting(); // Позволяет принять новую версию сразу после установки
});

// Событие активации Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = ['my-cache-v2']; // Укажите новую версию кэша
  
  event.waitUntil(
      caches.keys().then(cacheNames => {
          return Promise.all(
              cacheNames.map(cacheName => {
                  if (cacheWhitelist.indexOf(cacheName) === -1) {
                      return caches.delete(cacheName); // Удаляем старый кэш
                  }
              })
          );
      })
  );

  event.waitUntil(
    clients.claim().then(() => {
        // Уведомление о новой версии
        clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ type: 'NEW_VERSION_AVAILABLE' });
            });
        });
    })
);
});

// Событие запроса (fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
      caches.open('my-cache-v2').then(cache => {
          return fetch(event.request).then(response => {
              // Обновляем кэш новыми данными
              cache.put(event.request, response.clone());
              return response;
          }).catch(() => {
              // Если запрос не удался, возвращаем кэшированный ответ
              return caches.match(event.request);
          });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});