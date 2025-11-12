# 🚀 Instruções Rápidas - PWA MA-VIANA

## Passo 1: Gerar os Ícones

**Opção A - Usando o Gerador HTML (Mais Fácil):**
1. Abra o arquivo `icons/icon-generator.html` no seu navegador
2. Os ícones serão baixados automaticamente
3. Mova os arquivos `icon-192x192.png` e `icon-512x512.png` para a pasta `icons/`

**Opção B - Usando Node.js:**
```bash
npm install canvas
node generate-icons.js
```

## Passo 2: Iniciar o Servidor

O PWA precisa ser servido via HTTP (não pode abrir direto com `file://`).

**Escolha uma opção:**

### Python 3:
```bash
python -m http.server 8000
```

### Python 2:
```bash
python -m SimpleHTTPServer 8000
```

### Node.js:
```bash
npx http-server -p 8000
```

### PHP:
```bash
php -S localhost:8000
```

## Passo 3: Acessar e Testar

1. Abra o navegador em: `http://localhost:8000`
2. Abra o DevTools (F12) e vá na aba "Console" para verificar se o Service Worker foi registrado
3. Vá na aba "Application" → "Service Workers" para ver o status
4. Teste o modo offline:
   - DevTools → Network → Marque "Offline"
   - A interface deve continuar funcionando
   - Tente clicar em um botão - deve aparecer um alerta

## Passo 4: Instalar o PWA

### Chrome/Edge:
- Clique no ícone de instalação na barra de endereços
- Ou: Menu (⋮) → "Instalar aplicativo"

### Firefox:
- Menu → "Instalar"

### Safari iOS:
- Compartilhar → "Adicionar à Tela de Início"

## ✅ Checklist

- [ ] Ícones gerados e na pasta `icons/`
- [ ] Servidor HTTP rodando
- [ ] Service Worker registrado (verificar no Console)
- [ ] Interface carrega corretamente
- [ ] Modo offline funciona
- [ ] Botões abrem os sistemas em nova aba
- [ ] Alerta aparece quando offline e tenta acessar sistema

## 🔧 Solução de Problemas

**Service Worker não registra:**
- Certifique-se de estar usando HTTP/HTTPS (não file://)
- Verifique o Console do navegador para erros
- Limpe o cache: DevTools → Application → Clear storage

**Ícones não aparecem:**
- Verifique se os arquivos PNG existem na pasta `icons/`
- Verifique os caminhos no `manifest.json`

**Modo offline não funciona:**
- Verifique se o Service Worker está ativo
- Verifique se os arquivos foram cacheados (Application → Cache Storage)

