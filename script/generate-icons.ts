/**
 * Script para generar iconos PWA desde una imagen base
 * Genera iconos optimizados para diferentes dispositivos y contextos
 * 
 * Uso:
 * 1. Instalar sharp: npm install --save-dev sharp @types/sharp
 * 2. Colocar tu logo en: public/logo.png (512x512 mínimo recomendado)
 * 3. Ejecutar: npm run generate-icons
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Configuración de tamaños y tipos de iconos
interface IconConfig {
  size: number;
  purpose?: 'any' | 'maskable' | 'monochrome';
  platform?: 'web' | 'apple' | 'android';
}

// Iconos estándar para PWA (Chrome, Edge, Firefox)
const standardIcons: IconConfig[] = [
  { size: 72, purpose: 'any', platform: 'web' },
  { size: 96, purpose: 'any', platform: 'web' },
  { size: 128, purpose: 'any', platform: 'web' },
  { size: 144, purpose: 'any', platform: 'web' },
  { size: 152, purpose: 'any', platform: 'web' },
  { size: 192, purpose: 'any', platform: 'web' },
  { size: 384, purpose: 'any', platform: 'web' },
  { size: 512, purpose: 'any', platform: 'web' },
];

// Iconos maskable (iconos adaptativos con safe zone)
const maskableIcons: IconConfig[] = [
  { size: 192, purpose: 'maskable', platform: 'android' },
  { size: 512, purpose: 'maskable', platform: 'android' },
];

// Iconos para iOS/Apple
const appleIcons: IconConfig[] = [
  { size: 120, platform: 'apple' },  // iPhone 6/7/8
  { size: 152, platform: 'apple' },  // iPad, iPad mini
  { size: 167, platform: 'apple' },  // iPad Pro
  { size: 180, platform: 'apple' },  // iPhone 6+/7+/8+/X/XS/XR
];

// Configuración de rutas
const PATHS = {
  input: 'public/logo.png',
  outputDir: 'public/icons',
  publicDir: 'public',
} as const;

// Colores de fondo
const BACKGROUNDS = {
  transparent: { r: 0, g: 0, b: 0, alpha: 0 },
  white: { r: 255, g: 255, b: 255, alpha: 1 },
  default: { r: 15, g: 0, b: 53, alpha: 1 },
} as const;

/**
 * Crea el directorio de salida si no existe
 */
function ensureOutputDirectory(): void {
  if (!fs.existsSync(PATHS.outputDir)) {
    fs.mkdirSync(PATHS.outputDir, { recursive: true });
    console.log(`📁 Directorio creado: ${PATHS.outputDir}\n`);
  }
}

/**
 * Verifica que existe el archivo de entrada
 */
function validateInputFile(): boolean {
  if (!fs.existsSync(PATHS.input)) {
    console.error(`❌ No se encuentra el archivo: ${PATHS.input}`);
    console.log('📝 Por favor, coloca tu logo en public/logo.png');
    console.log('   Tamaño recomendado: 512x512 o mayor');
    console.log('   Formato: PNG con fondo transparente\n');
    return false;
  }
  return true;
}

/**
 * Genera un icono estándar
 */
async function generateStandardIcon(config: IconConfig): Promise<void> {
  const { size } = config;
  const outputFile = path.join(PATHS.outputDir, `icon-${size}x${size}.png`);
  
  await sharp(PATHS.input)
    .resize(size, size, {
      fit: 'contain',
      background: BACKGROUNDS.transparent,
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputFile);
  
  console.log(`✅ Generado: icon-${size}x${size}.png`);
}

/**
 * Genera un icono maskable (con padding para safe zone)
 */
async function generateMaskableIcon(config: IconConfig): Promise<void> {
  const { size } = config;
  const outputFile = path.join(PATHS.outputDir, `icon-${size}x${size}-maskable.png`);
  
  // Los iconos maskable necesitan 10-20% de padding para la safe zone
  const padding = Math.floor(size * 0.15);
  const innerSize = size - (padding * 2);
  
  // Crear un canvas con el tamaño completo y fondo blanco
  const background = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BACKGROUNDS.default,
    }
  }).png().toBuffer();
  
  // Redimensionar el logo al tamaño interno
  const resizedLogo = await sharp(PATHS.input)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: BACKGROUNDS.transparent,
    })
    .png()
    .toBuffer();
  
  // Componer el logo centrado sobre el fondo
  await sharp(background)
    .composite([{
      input: resizedLogo,
      top: padding,
      left: padding,
    }])
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputFile);
  
  console.log(`✅ Generado: icon-${size}x${size}-maskable.png (con safe zone)`);
}

/**
 * Genera un icono para Apple/iOS
 */
async function generateAppleIcon(config: IconConfig): Promise<void> {
  const { size } = config;
  const outputFile = path.join(PATHS.outputDir, `apple-icon-${size}x${size}.png`);
  
  await sharp(PATHS.input)
    .resize(size, size, {
      fit: 'contain',
      background: BACKGROUNDS.white, // iOS prefiere fondo blanco
    })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputFile);
  
  console.log(`✅ Generado: apple-icon-${size}x${size}.png`);
}

/**
 * Genera favicon en múltiples tamaños
 */
async function generateFavicons(): Promise<void> {
  console.log('\n🌐 Generando favicons...\n');
  
  // Favicon 32x32
  await sharp(PATHS.input)
    .resize(32, 32, {
      fit: 'contain',
      background: BACKGROUNDS.transparent,
    })
    .png()
    .toFile(path.join(PATHS.publicDir, 'favicon-32x32.png'));
  console.log('✅ Generado: favicon-32x32.png');
  
  // Favicon 16x16
  await sharp(PATHS.input)
    .resize(16, 16, {
      fit: 'contain',
      background: BACKGROUNDS.transparent,
    })
    .png()
    .toFile(path.join(PATHS.publicDir, 'favicon-16x16.png'));
  console.log('✅ Generado: favicon-16x16.png');
  
  // Favicon principal (para compatibilidad)
  await sharp(PATHS.input)
    .resize(48, 48, {
      fit: 'contain',
      background: BACKGROUNDS.transparent,
    })
    .png()
    .toFile(path.join(PATHS.publicDir, 'favicon.ico'));
  console.log('✅ Generado: favicon.ico');
}

/**
 * Genera apple-touch-icon
 */
async function generateAppleTouchIcon(): Promise<void> {
  await sharp(PATHS.input)
    .resize(180, 180, {
      fit: 'contain',
      background: BACKGROUNDS.white,
    })
    .png({ quality: 100 })
    .toFile(path.join(PATHS.publicDir, 'apple-touch-icon.png'));
  
  console.log('✅ Generado: apple-touch-icon.png');
}

/**
 * Genera screenshot para PWA (opcional)
 */
async function generateScreenshot(): Promise<void> {
  console.log('\n📱 Generando screenshots para PWA...\n');
  
  // Screenshot móvil (9:16 aspect ratio)
  await sharp(PATHS.input)
    .resize(540, 960, {
      fit: 'contain',
      background: BACKGROUNDS.white,
    })
    .png()
    .toFile(path.join(PATHS.outputDir, 'screenshot-mobile.png'));
  console.log('✅ Generado: screenshot-mobile.png (540x960)');
  
  // Screenshot desktop (16:9 aspect ratio)
  await sharp(PATHS.input)
    .resize(1280, 720, {
      fit: 'contain',
      background: BACKGROUNDS.white,
    })
    .png()
    .toFile(path.join(PATHS.outputDir, 'screenshot-desktop.png'));
  console.log('✅ Generado: screenshot-desktop.png (1280x720)');
}

/**
 * Función principal
 */
async function generateIcons(): Promise<void> {
  console.log('🎨 Generador de Iconos PWA\n');
  console.log('='.repeat(50) + '\n');
  
  // Validaciones
  if (!validateInputFile()) {
    process.exit(1);
  }
  
  ensureOutputDirectory();
  
  try {
    // Generar iconos estándar
    console.log('📦 Generando iconos estándar...\n');
    for (const config of standardIcons) {
      await generateStandardIcon(config);
    }
    
    // Generar iconos maskable
    console.log('\n🎭 Generando iconos maskable (Android adaptive)...\n');
    for (const config of maskableIcons) {
      await generateMaskableIcon(config);
    }
    
    // Generar iconos Apple
    console.log('\n🍎 Generando iconos para iOS/Apple...\n');
    for (const config of appleIcons) {
      await generateAppleIcon(config);
    }
    
    // Apple touch icon
    await generateAppleTouchIcon();
    
    // Favicons
    await generateFavicons();
    
    // Screenshots (opcional, comenta si no necesitas)
    await generateScreenshot();
    
    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('\n✨ ¡Iconos generados exitosamente!\n');
    console.log(`📁 Ubicación: ${PATHS.outputDir}`);
    console.log(`📁 Favicons: ${PATHS.publicDir}`);
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Verifica que los iconos se vean correctos');
    console.log('   2. Actualiza public/manifest.json si es necesario');
    console.log('   3. Prueba tu PWA en diferentes dispositivos\n');
    
  } catch (error) {
    console.error('\n❌ Error generando iconos:', error);
    process.exit(1);
  }
}

// Ejecutar
generateIcons();
