// Nome do cache
const CACHE_NAME = 'ma-viana-pwa-v2';
const RUNTIME_CACHE = 'ma-viana-runtime-v2';

// Arquivos essenciais para cache (shell do app)
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icons/gerar_icone.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando assets estáticos');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Instalação concluída');
                // Força a ativação imediata do novo Service Worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Erro ao cachear assets:', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Remove caches antigos que não correspondem ao cache atual
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('Service Worker: Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Ativação concluída');
                // Assume controle de todas as páginas imediatamente
                return self.clients.claim();
            })
    );
});

// Estratégia Cache-First para assets do shell
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar requisições que não são GET
    if (request.method !== 'GET') {
        return;
    }
    
    // Ignorar requisições para APIs externas ou sistemas externos
    // Permitir apenas requisições para o próprio domínio
    if (url.origin !== location.origin) {
        // Para recursos externos, usar network-first ou ignorar
        return;
    }
    
    // Estratégia Cache-First para assets estáticos
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Se encontrou no cache, retorna do cache
                if (cachedResponse) {
                    console.log('Service Worker: Retornando do cache:', request.url);
                    return cachedResponse;
                }
                
                // Se não encontrou no cache, busca na rede
                return fetch(request)
                    .then((response) => {
                        // Verifica se a resposta é válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clona a resposta para armazenar no cache
                        const responseToCache = response.clone();
                        
                        // Armazena no cache para uso futuro
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Erro ao buscar recurso:', error);
                        // Se falhar e for uma página HTML, retorna a página offline do cache
                        if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// Mensagens do Service Worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

