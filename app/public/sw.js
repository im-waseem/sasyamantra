const CACHE_NAME = 'sasya-mantra-v2'; // Updated version
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;

// Core files that should always be cached
const CORE_ASSETS = [
  '/',
  '/offline.html',
  // Add your critical CSS and JS files here
  // '/static/css/main.css',
  // '/static/js/main.js'
];

// Routes to cache
const CACHEABLE_ROUTES = [
  '/',
  '/products',
  '/about',
  '/contact'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Core assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache core assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - handle requests with cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Different strategies for different types of requests
  if (CACHEABLE_ROUTES.includes(url.pathname)) {
    // Cache First strategy for app routes
    event.respondWith(cacheFirst(request));
  } else if (request.destination === 'image') {
    // Cache First for images
    event.respondWith(cacheFirst(request));
  } else if (request.url.includes('/api/')) {
    // Network First for API calls
    event.respondWith(networkFirst(request));
  } else {
    // Stale While Revalidate for other assets
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache First Strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache First failed:', error);
    return await handleOffline(request);
  }
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network First failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || await handleOffline(request);
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    });

    return cachedResponse || await fetchPromise;
  } catch (error) {
    console.log('Stale While Revalidate failed:', error);
    return await handleOffline(request);
  }
}

// Handle offline scenarios
async function handleOffline(request) {
  // For navigation requests, return offline page
  if (request.mode === 'navigate') {
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('You are offline', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // For other requests, return a generic offline response
  return new Response('Content not available offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Handle background sync (if supported)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  // Add background sync logic here if needed
});

// Handle push notifications (if needed)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  // Add push notification logic here if needed
});

// Clean up dynamic cache periodically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanDynamicCache();
  }
});

// Clean dynamic cache function
async function cleanDynamicCache() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Keep only last 50 items in dynamic cache
    if (requests.length > 50) {
      const requestsToDelete = requests.slice(0, requests.length - 50);
      await Promise.all(
        requestsToDelete.map(request => cache.delete(request))
      );
      console.log(`Cleaned ${requestsToDelete.length} items from dynamic cache`);
    }
  } catch (error) {
    console.error('Failed to clean dynamic cache:', error);
  }
}