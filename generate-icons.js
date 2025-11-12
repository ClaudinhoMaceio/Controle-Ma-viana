// Script Node.js para gerar ícones do PWA
// Execute com: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Nota: Este script requer a biblioteca 'canvas' do Node.js
// Instale com: npm install canvas

try {
    const { createCanvas } = require('canvas');
    
    function generateIcon(size) {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        
        // Fundo azul (#2196F3)
        ctx.fillStyle = '#2196F3';
        ctx.fillRect(0, 0, size, size);
        
        // Bordas arredondadas (simulado)
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        const radius = size * 0.125; // 12.5% do tamanho
        ctx.roundRect(0, 0, size, size, radius);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        
        // Texto "MV" no centro
        ctx.fillStyle = 'white';
        ctx.font = `bold ${size * 0.4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MV', size / 2, size / 2);
        
        // Salvar arquivo
        const buffer = canvas.toBuffer('image/png');
        const filename = path.join(__dirname, 'icons', `icon-${size}x${size}.png`);
        fs.writeFileSync(filename, buffer);
        console.log(`✅ Ícone ${size}x${size} gerado: ${filename}`);
    }
    
    // Criar pasta icons se não existir
    const iconsDir = path.join(__dirname, 'icons');
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }
    
    // Gerar ícones
    generateIcon(192);
    generateIcon(512);
    
    console.log('\n✅ Todos os ícones foram gerados com sucesso!');
    
} catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
        console.log('⚠️  Biblioteca "canvas" não encontrada.');
        console.log('\nPara gerar os ícones, você tem duas opções:');
        console.log('\n1. Instalar a biblioteca canvas:');
        console.log('   npm install canvas');
        console.log('   node generate-icons.js');
        console.log('\n2. Usar o gerador HTML:');
        console.log('   Abra icons/icon-generator.html no navegador');
    } else {
        console.error('Erro ao gerar ícones:', error);
    }
}

