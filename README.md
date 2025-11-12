# Gerenciamento dos Sistemas MA-VIANA

Progressive Web App (PWA) que serve como painel de acesso centralizado para os sistemas MA-VIANA.

## 📋 Características

- ✅ PWA completo com Service Worker
- ✅ Funcionalidade offline
- ✅ Design responsivo (mobile-first)
- ✅ Detecção de conexão online/offline
- ✅ Interface moderna e intuitiva
- ✅ Cache inteligente de assets

## 🚀 Como Usar

### 1. Gerar os Ícones

Antes de usar o PWA, você precisa gerar os ícones necessários:

1. Abra o arquivo `icons/icon-generator.html` em um navegador moderno
2. Os ícones serão gerados automaticamente e baixados
3. Mova os arquivos `icon-192x192.png` e `icon-512x512.png` para a pasta `icons/`

**Alternativa:** Use o arquivo `icons/icon.svg` e converta para PNG usando ferramentas online como:
- https://convertio.co/svg-png/
- https://cloudconvert.com/svg-to-png

Certifique-se de exportar nas dimensões corretas (192x192 e 512x512).

### 2. Servir o PWA

Para que o Service Worker funcione corretamente, o PWA precisa ser servido através de um servidor HTTP (não pode ser aberto diretamente via `file://`).

#### Opção 1: Usando Python (recomendado)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Opção 2: Usando Node.js
```bash
npx http-server -p 8000
```

#### Opção 3: Usando PHP
```bash
php -S localhost:8000
```

### 3. Acessar o PWA

1. Abra o navegador e acesse `http://localhost:8000`
2. O Service Worker será registrado automaticamente
3. Você pode instalar o PWA no seu dispositivo:
   - **Chrome/Edge**: Clique no ícone de instalação na barra de endereços
   - **Firefox**: Menu → Instalar
   - **Safari iOS**: Compartilhar → Adicionar à Tela de Início

## 📱 Sistemas Disponíveis

1. **Contrato Compra/Venda Máquina** - Sistema de contratos
2. **Controle de Medição (MA-VIANA)** - Sistema de controle de medições
3. **Sistema Principal MA-VIANA** - Sistema principal

## 🔧 Estrutura de Arquivos

```
/
├── index.html          # Interface principal
├── style.css           # Estilos do PWA
├── app.js              # Lógica JavaScript
├── sw.js               # Service Worker
├── manifest.json       # Configurações do PWA
├── icons/              # Pasta de ícones
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── icon.svg
│   └── icon-generator.html
└── README.md           # Este arquivo
```

## 🌐 Funcionalidade Offline

O PWA foi projetado para funcionar offline:

- A interface principal (botões) carrega mesmo sem conexão
- O Service Worker usa estratégia Cache-First para assets estáticos
- Quando offline, um indicador visual mostra o status
- Tentativas de acessar sistemas externos offline mostram um alerta informativo

## 📝 Notas Técnicas

- **Tecnologias**: HTML5, CSS3, JavaScript ES6+
- **Estratégia de Cache**: Cache-First para assets do shell
- **Display Mode**: Standalone (PWA instalado)
- **Orientação**: Portrait-primary (vertical)

## 🔄 Atualizações

Quando você atualizar os arquivos do PWA:

1. Atualize a versão do cache no arquivo `sw.js` (CACHE_NAME)
2. O Service Worker detectará automaticamente as atualizações
3. Os usuários receberão a nova versão na próxima visita

## 📞 Suporte

Para problemas ou dúvidas, verifique:
- Console do navegador (F12) para erros do Service Worker
- Aba "Application" no DevTools para verificar o cache
- Certifique-se de que está servindo via HTTP/HTTPS (não file://)

