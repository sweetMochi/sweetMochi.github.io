var cacheName = "test-v2"
var dataCacheName = 'weatherData-v1';

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');

	var filesToCache = [
		'',
		'index.html',
		'scripts/app.js',
		'styles/inline.css',
		'images/clear.png',
		'images/cloudy-scattered-showers.png',
		'images/cloudy.png',
		'images/fog.png',
		'images/ic\_add\_white\_24px.svg',
		'images/ic\_refresh\_white\_24px.svg',
		'images/partly-cloudy.png',
		'images/rain.png',
		'images/scattered-showers.png',
		'images/sleet.png',
		'images/snow.png',
		'images/thunderstorm.png',
		'images/wind.png'
	];

	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching App Shell');
			return cache.addAll(filesToCache);
		})
	);
});

// 是否清除快取
self.addEventListener('activate', function(e) {
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				console.log('[ServiceWorker] Removing old cache', key);
				if (key !== cacheName) {
					return caches.delete(key);
				}
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
						cache.put(e.request.url, response.clone());
						console.log('[ServiceWorker] Fetched&Cached Data');
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
				return response || fetch(e.request);
			})
		);
	}
});
