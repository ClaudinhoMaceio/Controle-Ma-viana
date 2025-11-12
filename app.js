// ============================================
// PWA MA-VIANA - Sistema de Navegação Interna
// ============================================

// Estado da aplicação
const AppState = {
    currentView: 'main-menu',
    currentSystem: null,
    isOnline: navigator.onLine,
    systems: [
        {
            name: 'Contrato Compra/Venda Máquina',
            url: 'https://claudinhomaceio.github.io/CONTRATO-DE-COMPRA-E-VENDA-DE-MAQUINA-/',
            icon: '📄'
        },
        {
            name: 'Controle de Medição (MA-VIANA)',
            url: 'https://claudinhomaceio.github.io/-CONTROLE-DE-MEDI-O-MA-VIANA/',
            icon: '📏'
        },
        {
            name: 'Proposta de Locação',
            url: 'https://claudinhomaceio.github.io/MA-VIANA/',
            icon: '⚙️'
        }
    ]
};

// ============================================
// Service Worker
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration.scope);
                
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 Nova versão disponível');
                        }
                    });
                });
            })
            .catch(error => {
                console.error('❌ Erro ao registrar Service Worker:', error);
            });
    });
}

// ============================================
// Animação de Máquinas Pesadas 3D
// ============================================
function initMachines() {
    const canvas = document.getElementById('machines-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const machines = [];
    const groundLevel = 0.75;
    const perspective = 300; // Distância de perspectiva
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Função auxiliar para desenhar formas 3D
    function draw3DBox(x, y, width, height, depth, color, lightDir = 0.7) {
        const w = width;
        const h = height;
        const d = depth * 0.3; // Profundidade em perspectiva
        
        // Face frontal
        ctx.fillStyle = color;
        ctx.fillRect(x - w/2, y - h, w, h);
        
        // Face superior (sombra)
        ctx.fillStyle = this.shadeColor(color, -20);
        ctx.beginPath();
        ctx.moveTo(x - w/2, y - h);
        ctx.lineTo(x - w/2 + d, y - h - d);
        ctx.lineTo(x + w/2 + d, y - h - d);
        ctx.lineTo(x + w/2, y - h);
        ctx.closePath();
        ctx.fill();
        
        // Face lateral direita
        ctx.fillStyle = this.shadeColor(color, -30);
        ctx.beginPath();
        ctx.moveTo(x + w/2, y - h);
        ctx.lineTo(x + w/2 + d, y - h - d);
        ctx.lineTo(x + w/2 + d, y - d);
        ctx.lineTo(x + w/2, y);
        ctx.closePath();
        ctx.fill();
        
        // Borda destacada
        ctx.strokeStyle = this.shadeColor(color, 30);
        ctx.lineWidth = 1;
        ctx.strokeRect(x - w/2, y - h, w, h);
    }
    
    // Função para ajustar brilho da cor
    function shadeColor(color, percent) {
        const num = parseInt(color.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, Math.max(0, (num >> 16) + amt));
        const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
        const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
    
    class Machine {
        constructor(type, x, speed) {
            this.type = type;
            this.x = x;
            this.y = canvas.height * groundLevel;
            this.speed = speed;
            this.scale = 0.6 + Math.random() * 0.3;
            this.animationFrame = 0;
            this.color = ['#FF6B35', '#F7931E', '#FFD23F', '#06A77D', '#005377'][Math.floor(Math.random() * 5)];
            this.depth = 15;
        }
        
        update() {
            this.x += this.speed;
            this.animationFrame += 0.08;
            if (this.speed > 0 && this.x > canvas.width + 300) this.x = -300;
            else if (this.speed < 0 && this.x < -300) this.x = canvas.width + 300;
        }
        
        draw3DBox(x, y, w, h, d, color) {
            const depth = d * this.scale;
            const width = w * this.scale;
            const height = h * this.scale;
            
            // Face frontal
            ctx.fillStyle = color;
            ctx.fillRect(x - width/2, y - height, width, height);
            
            // Face superior
            ctx.fillStyle = shadeColor(color, -25);
            ctx.beginPath();
            ctx.moveTo(x - width/2, y - height);
            ctx.lineTo(x - width/2 + depth, y - height - depth);
            ctx.lineTo(x + width/2 + depth, y - height - depth);
            ctx.lineTo(x + width/2, y - height);
            ctx.closePath();
            ctx.fill();
            
            // Face lateral
            ctx.fillStyle = shadeColor(color, -40);
            ctx.beginPath();
            ctx.moveTo(x + width/2, y - height);
            ctx.lineTo(x + width/2 + depth, y - height - depth);
            ctx.lineTo(x + width/2 + depth, y - depth);
            ctx.lineTo(x + width/2, y);
            ctx.closePath();
            ctx.fill();
            
            // Borda iluminada
            ctx.strokeStyle = shadeColor(color, 40);
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x - width/2, y - height, width, height);
        }
        
        drawCylinder(x, y, radius, height, color) {
            const r = radius * this.scale;
            const h = height * this.scale;
            const d = this.depth * this.scale;
            
            // Corpo do cilindro
            const gradient = ctx.createLinearGradient(x - r, y - h, x + r, y);
            gradient.addColorStop(0, shadeColor(color, -30));
            gradient.addColorStop(0.5, color);
            gradient.addColorStop(1, shadeColor(color, -30));
            ctx.fillStyle = gradient;
            ctx.fillRect(x - r, y - h, r * 2, h);
            
            // Topo elíptico
            ctx.fillStyle = shadeColor(color, 20);
            ctx.beginPath();
            ctx.ellipse(x, y - h, r, r * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Sombra inferior
            ctx.fillStyle = shadeColor(color, -50);
            ctx.beginPath();
            ctx.ellipse(x + d, y, r, r * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            if (this.type === 'excavator') {
                this.drawExcavator3D();
            } else if (this.type === 'backhoe') {
                this.drawBackhoe3D();
            } else if (this.type === 'bobcat') {
                this.drawBobcat3D();
            } else if (this.type === 'truck') {
                this.drawTruck3D();
            }
            
            ctx.restore();
        }
        
        drawExcavator3D() {
            const frame = this.animationFrame;
            const armAngle = Math.sin(frame * 0.15) * 0.4;
            const bucketAngle = Math.sin(frame * 0.2) * 0.3;
            
            // Corpo principal (chassi)
            this.draw3DBox(0, 0, 80, 35, this.depth, this.color);
            
            // Esteiras esquerda
            this.draw3DBox(-35, 8, 18, 22, this.depth + 5, '#2C2C2C');
            this.draw3DBox(-18, 8, 18, 22, this.depth + 5, '#2C2C2C');
            
            // Esteiras direita
            this.draw3DBox(18, 8, 18, 22, this.depth + 5, '#2C2C2C');
            this.draw3DBox(35, 8, 18, 22, this.depth + 5, '#2C2C2C');
            
            // Rodas das esteiras
            for (let i = -1; i <= 1; i++) {
                this.drawCylinder(i * 25, 8, 8, 22, '#1A1A1A');
            }
            
            // Cabine
            this.draw3DBox(-15, -20, 30, 25, this.depth - 5, shadeColor(this.color, 20));
            // Janelas da cabine
            ctx.fillStyle = 'rgba(135, 206, 250, 0.4)';
            ctx.fillRect(-12 * this.scale, -18 * this.scale, 10 * this.scale, 12 * this.scale);
            ctx.fillRect(2 * this.scale, -18 * this.scale, 10 * this.scale, 12 * this.scale);
            
            // Braço principal
            ctx.save();
            ctx.translate(25 * this.scale, -15 * this.scale);
            ctx.rotate(armAngle);
            this.draw3DBox(0, 0, 50, 10, this.depth - 3, shadeColor(this.color, -10));
            
            // Braço secundário
            ctx.translate(45 * this.scale, 0);
            ctx.rotate(bucketAngle);
            this.draw3DBox(0, 0, 35, 8, this.depth - 5, shadeColor(this.color, -20));
            
            // Concha
            ctx.translate(30 * this.scale, 0);
            ctx.rotate(0.6);
            this.draw3DBox(0, 0, 25, 15, this.depth - 7, '#FFA500');
            // Dentes da concha
            for (let i = 0; i < 3; i++) {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect((i - 1) * 6 * this.scale, 7 * this.scale, 4 * this.scale, 6 * this.scale);
            }
            ctx.restore();
        }
        
        drawBackhoe3D() {
            const frame = this.animationFrame;
            const bucketAngle = Math.sin(frame * 0.18) * 0.5;
            
            // Chassi
            this.draw3DBox(0, 0, 100, 28, this.depth, this.color);
            
            // Rodas
            this.drawCylinder(-30, 5, 14, 20, '#1A1A1A');
            this.drawCylinder(30, 5, 14, 20, '#1A1A1A');
            // Aros das rodas
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(-30 * this.scale, 5 * this.scale, 8 * this.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(30 * this.scale, 5 * this.scale, 8 * this.scale, 0, Math.PI * 2);
            ctx.fill();
            
            // Cabine
            this.draw3DBox(0, -18, 25, 20, this.depth - 3, shadeColor(this.color, 15));
            ctx.fillStyle = 'rgba(135, 206, 250, 0.4)';
            ctx.fillRect(-8 * this.scale, -16 * this.scale, 16 * this.scale, 12 * this.scale);
            
            // Braço traseiro
            ctx.save();
            ctx.translate(-40 * this.scale, -12 * this.scale);
            ctx.rotate(-0.4 + bucketAngle);
            this.draw3DBox(0, 0, 45, 10, this.depth - 5, shadeColor(this.color, -15));
            
            // Concha traseira
            ctx.translate(40 * this.scale, 0);
            ctx.rotate(0.7);
            this.draw3DBox(0, 0, 20, 12, this.depth - 7, '#FF8C00');
            ctx.restore();
        }
        
        drawBobcat3D() {
            const frame = this.animationFrame;
            const bucketAngle = Math.sin(frame * 0.25) * 0.6;
            
            // Corpo compacto
            this.draw3DBox(0, 0, 60, 25, this.depth, this.color);
            
            // Esteiras
            this.draw3DBox(-22, 8, 15, 18, this.depth + 3, '#2C2C2C');
            this.draw3DBox(22, 8, 15, 18, this.depth + 3, '#2C2C2C');
            
            // Cabine
            this.draw3DBox(-8, -15, 18, 18, this.depth - 2, shadeColor(this.color, 25));
            ctx.fillStyle = 'rgba(135, 206, 250, 0.4)';
            ctx.fillRect(-6 * this.scale, -13 * this.scale, 12 * this.scale, 10 * this.scale);
            
            // Braço frontal
            ctx.save();
            ctx.translate(28 * this.scale, -8 * this.scale);
            ctx.rotate(bucketAngle);
            this.draw3DBox(0, 0, 40, 8, this.depth - 4, shadeColor(this.color, -10));
            
            // Concha
            ctx.translate(35 * this.scale, 0);
            ctx.rotate(0.5);
            this.draw3DBox(0, 0, 18, 10, this.depth - 6, '#FFA500');
            ctx.restore();
        }
        
        drawTruck3D() {
            const frame = this.animationFrame;
            const wheelRotation = frame * 0.3;
            
            // Cabine
            this.draw3DBox(-35, -15, 40, 28, this.depth, this.color);
            // Janela da cabine
            ctx.fillStyle = 'rgba(135, 206, 250, 0.3)';
            ctx.fillRect(-30 * this.scale, -13 * this.scale, 30 * this.scale, 18 * this.scale);
            
            // Carroceria
            this.draw3DBox(15, -18, 70, 35, this.depth, shadeColor(this.color, -15));
            
            // Rodas traseiras duplas
            ctx.save();
            ctx.translate(25 * this.scale, 5 * this.scale);
            ctx.rotate(wheelRotation);
            this.drawCylinder(0, 0, 12, 22, '#1A1A1A');
            this.drawCylinder(8, 0, 12, 22, '#1A1A1A');
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, 8 * this.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(8 * this.scale, 0, 8 * this.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Roda dianteira
            ctx.save();
            ctx.translate(-25 * this.scale, 5 * this.scale);
            ctx.rotate(wheelRotation);
            this.drawCylinder(0, 0, 12, 22, '#1A1A1A');
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, 8 * this.scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Terra caindo
            if (Math.floor(frame) % 12 < 4) {
                ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
                for (let i = 0; i < 8; i++) {
                    const offsetX = -8 + Math.random() * 16;
                    const offsetY = -8 + Math.random() * 12;
                    ctx.fillRect((35 + offsetX) * this.scale, (-15 + offsetY) * this.scale, 5 * this.scale, 5 * this.scale);
                }
            }
        }
    }
    
    const machineTypes = ['excavator', 'backhoe', 'bobcat', 'truck'];
    for (let i = 0; i < 3; i++) {
        const type = machineTypes[Math.floor(Math.random() * machineTypes.length)];
        machines.push(new Machine(type, -300 - (i * 500), 0.4 + Math.random() * 0.4));
    }
    for (let i = 0; i < 2; i++) {
        const type = machineTypes[Math.floor(Math.random() * machineTypes.length)];
        machines.push(new Machine(type, canvas.width + 300 + (i * 500), -(0.4 + Math.random() * 0.4)));
    }
    
    function drawGround() {
        // Terreno com gradiente
        const gradient = ctx.createLinearGradient(0, canvas.height * groundLevel, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(20, 20, 20, 0.2)');
        gradient.addColorStop(1, 'rgba(10, 10, 10, 0.4)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height * groundLevel, canvas.width, canvas.height);
        
        // Linha do horizonte com brilho
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * groundLevel);
        ctx.lineTo(canvas.width, canvas.height * groundLevel);
        ctx.stroke();
        
        // Efeito de profundidade (linhas de perspectiva)
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            const y = canvas.height * groundLevel + i * 20;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawGround();
        
        machines.forEach(m => { 
            m.update(); 
            m.draw(); 
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// Sistema de Navegação
// ============================================
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const view = document.getElementById(viewId);
    if (view) {
        view.classList.add('active');
        AppState.currentView = viewId;
    }
}

function openSystem(system) {
    if (!AppState.isOnline) {
        showNotification(`⚠️ Sem conexão\n\nO sistema "${system.name}" requer internet.`, 'error');
        return;
    }
    
    AppState.currentSystem = system;
    const iframe = document.getElementById('system-iframe');
    const loadingOverlay = document.getElementById('loading-overlay');
    const systemName = document.getElementById('current-system-name');
    
    // Atualizar nome do sistema
    systemName.textContent = system.name;
    
    // Mostrar loading
    loadingOverlay.classList.remove('hidden');
    
    // Carregar iframe
    iframe.src = system.url;
    
    // Esconder loading quando iframe carregar
    iframe.onload = () => {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 500);
    };
    
    // Mostrar view do sistema
    showView('system-view');
    
    // Scroll para o topo
    window.scrollTo(0, 0);
}

function goBack() {
    const iframe = document.getElementById('system-iframe');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Limpar iframe
    iframe.src = '';
    loadingOverlay.classList.remove('hidden');
    
    // Voltar para o menu
    showView('main-menu');
    AppState.currentSystem = null;
}

// ============================================
// Detecção de Conexão
// ============================================
function updateStatusIndicator() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const statusDot = statusIndicator?.querySelector('.status-dot');
    
    if (!statusIndicator) return;
    
    if (AppState.isOnline) {
        statusIndicator.classList.remove('offline');
        statusText.textContent = 'Online';
    } else {
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Offline';
    }
}

window.addEventListener('online', () => {
    AppState.isOnline = true;
    updateStatusIndicator();
    showNotification('✅ Conexão restaurada', 'success');
});

window.addEventListener('offline', () => {
    AppState.isOnline = false;
    updateStatusIndicator();
    showNotification('⚠️ Conexão perdida', 'warning');
});

// ============================================
// Notificações
// ============================================
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#00ff88' : '#00d4ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Inicialização
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar animação de máquinas
    initMachines();
    
    // Atualizar status inicial
    updateStatusIndicator();
    
    // Configurar botões do sistema
    const systemButtons = document.querySelectorAll('.system-button');
    systemButtons.forEach(button => {
        button.addEventListener('click', () => {
            const systemName = button.getAttribute('data-system');
            const systemUrl = button.getAttribute('data-url');
            
            const system = AppState.systems.find(s => s.name === systemName);
            if (system) {
                openSystem(system);
            } else {
                openSystem({ name: systemName, url: systemUrl });
            }
        });
    });
    
    // Configurar botão de voltar
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }
    
    // Configurar botões de instalação
    setupInstallButtons();
    
    // Esconder loader após carregamento
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    }
    
    // Detectar PWA instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone ||
                       document.referrer.includes('android-app://');
    
    if (isInstalled) {
        document.body.classList.add('standalone');
        console.log('📱 PWA rodando em modo standalone');
        hideInstallBanner();
    } else {
        // Verificar se já foi instalado antes (localStorage)
        const installDismissed = localStorage.getItem('pwa-install-dismissed');
        if (!installDismissed) {
            // Mostrar banner após um delay
            setTimeout(() => {
                checkAndShowInstallBanner();
            }, 2000);
        }
    }
    
    console.log('🚀 MA-VIANA Systems Manager inicializado');
});

// ============================================
// Sistema de Instalação PWA
// ============================================
let deferredPrompt = null;

// Detectar evento de instalação
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('💾 PWA pode ser instalado');
    showInstallBanner();
});

// Detectar se foi instalado
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA instalado com sucesso!');
    deferredPrompt = null;
    hideInstallBanner();
    showNotification('✅ MA-VIANA instalado com sucesso!', 'success');
});

function checkAndShowInstallBanner() {
    // Verificar se o banner já foi fechado
    const installDismissed = localStorage.getItem('pwa-install-dismissed');
    if (installDismissed) return;
    
    // Verificar se já está instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone;
    
    if (!isInstalled && deferredPrompt) {
        showInstallBanner();
    }
}

function showInstallBanner() {
    const banner = document.getElementById('install-banner');
    if (banner) {
        banner.classList.remove('hidden');
        banner.classList.add('show');
    }
}

function hideInstallBanner() {
    const banner = document.getElementById('install-banner');
    if (banner) {
        banner.classList.add('hidden');
        banner.classList.remove('show');
    }
}

// Configurar botões de instalação (chamado no DOMContentLoaded principal)
function setupInstallButtons() {
    const installButton = document.getElementById('install-button');
    const installClose = document.getElementById('install-close');
    
    if (installButton) {
        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) {
                // Fallback para iOS
                if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                    showNotification('📱 No iOS, toque no botão de compartilhar e selecione "Adicionar à Tela de Início"', 'info');
                    return;
                }
                
                // Fallback para outros navegadores
                showNotification('ℹ️ Use o menu do navegador para instalar o aplicativo', 'info');
                return;
            }
            
            // Mostrar prompt de instalação
            deferredPrompt.prompt();
            
            // Aguardar resposta do usuário
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ Usuário aceitou a instalação');
                showNotification('✅ Instalando MA-VIANA...', 'success');
            } else {
                console.log('❌ Usuário rejeitou a instalação');
            }
            
            deferredPrompt = null;
            hideInstallBanner();
        });
    }
    
    if (installClose) {
        installClose.addEventListener('click', () => {
            hideInstallBanner();
            localStorage.setItem('pwa-install-dismissed', 'true');
        });
    }
}

// ============================================
// Gestos (para mobile)
// ============================================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    // Swipe da direita para esquerda (voltar)
    if (diff > swipeThreshold && AppState.currentView === 'system-view') {
        goBack();
    }
}

// ============================================
// Prevenção de zoom duplo toque (iOS)
// ============================================
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });
