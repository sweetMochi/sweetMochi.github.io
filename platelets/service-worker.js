var cacheName = "test"
var dataCacheName = 'weatherData-v1';

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching App Shell');
		})
	);
});

self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);
});
