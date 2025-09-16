import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

precacheAndRoute(self.__WB_MANIFEST);

// Cache GET requests for notes
registerRoute(
  ({ url, request }) => url.origin === (import.meta.env.VITE_BASE_URL) && request.method === 'GET',
  new StaleWhileRevalidate({ cacheName: 'api-cache' })
);

// Queue non-GET requests for background sync
const bgSyncPlugin = new BackgroundSyncPlugin('notes-queue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

registerRoute(
  ({ url, request }) => url.origin === (import.meta.env.VITE_BASE_URL) && request.method !== 'GET',
  new NetworkOnly({
    plugins: [bgSyncPlugin]
  })
);