const CACHE_NAME = 'landcros-v2'; // Mudei de v1 para v2 para forçar o navegador a notar a troca

self.addEventListener('install', (event) => {
  // Força o novo Service Worker a ativar imediatamente, sem esperar fechar abas
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpa caches antigos para não ocupar espaço com lixo
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Estratégia: Tenta a REDE primeiro. Se falhar (offline), usa o CACHE.
  // Para navegação, se falhar, retorna o index.html (SPA fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});