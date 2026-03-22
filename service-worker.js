/* ============================================================
   DIÁRIO DE BORDO — service-worker.js
   Service Worker para suporte offline (PWA)
   ============================================================ */

// Nome do cache — incremente a versão para forçar atualização
const CACHE_NAME = 'diario-de-bordo-v1';

// Lista de arquivos armazenados no cache na instalação
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* ------------------------------------------------------------
   INSTALAÇÃO — pré-carrega os arquivos essenciais no cache
------------------------------------------------------------ */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Armazenando arquivos no cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Força o SW a se tornar ativo sem esperar abas fecharem
  self.skipWaiting();
});

/* ------------------------------------------------------------
   ATIVAÇÃO — remove caches de versões anteriores
------------------------------------------------------------ */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Removendo cache desatualizado:', name);
            return caches.delete(name);
          })
      )
    )
  );
  // Assume controle imediato de todas as páginas abertas
  self.clients.claim();
});

/* ------------------------------------------------------------
   FETCH — estratégia Cache First (cache → rede → fallback)
   Serve do cache quando disponível; caso contrário, busca
   na rede e armazena a resposta para uso futuro offline.
------------------------------------------------------------ */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna do cache se o recurso já estiver armazenado
      if (cachedResponse) {
        return cachedResponse;
      }

      // Tenta buscar na rede
      return fetch(event.request)
        .then((networkResponse) => {
          // Armazena a resposta no cache para acesso offline futuro
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback: retorna a página principal quando offline
          return caches.match('./index.html');
        });
    })
  );
});
