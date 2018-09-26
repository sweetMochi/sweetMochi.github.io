var cacheName = "test-v2"
var dataCacheName = 'weatherData-v1';

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching App Shell');
		})
	);
});

// 是否清除快取
self.addEventListener('activate', function(e) {
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
			}));
		})
	);
});

self.addEventListener('fetch', function(e) {

	console.log('[ServiceWorker] Fetch', e.request.url);
	var dataUrl = self.location.hostname

	if (e.request.url.indexOf(dataUrl) < 0 ) {
		e.respondWith(
			fetch(e.request)
				.then(function(response) {
					return caches.open(dataCacheName).then(function(cache) {
						return response;
					});
				})
				.catch(function(e){
					console.log('出現錯誤：');
					console.log(e);
				})
		);
	} else {
		e.respondWith(
			caches.match(e.request).then(function(response) {
			})
		);
	}
});
