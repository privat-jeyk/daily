const cacheName = 'cache-v1';

const filesToCache = [
    'index.html',
    'game.js',
    'pwa.js',
    'slot.js',
    'serviceWorker.js',
    'style.css',
    'window.js',
    'manifest.json',
    'img/Image0.png',
    'img/Image1.png',
    'img/Image2.png',
    'img/Image3.png',
    'img/Image4.png',
    'img/Image5.png',
    'img/Image6.png',
    'img/Image7.png',
    'img/Image8.png',
    'img/icon512.jpeg'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.log('add files to cache');
        return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {

            if (response) {
                return response;
            }

            return fetch(event.request).then(response => {
                if(!response || response.status !== 200 || response.type !=='basic') {
                    return response;
                }

                var responseToCache = response.clone();

                caches.open(cacheName)
                .then( cache => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});