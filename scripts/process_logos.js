const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const p1 = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\9241009b-fda6-4df9-9ef7-0a7cc7ec37fb\\.user_uploaded\\media_1791572963007.png';
const p2 = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\9241009b-fda6-4df9-9ef7-0a7cc7ec37fb\\.user_uploaded\\media_1791572985114.png';
const publicDir = path.join(__dirname, '..', 'public');

async function process() {
  console.log('Processing logos...');
  
  // 1. Process logo-icon (p1)
  // Copy original uploaded
  fs.copyFileSync(p1, path.join(publicDir, 'logo-icon-original.png'));
  
  // Cut and trim p1 to extract the pink icon with transparent background
  const img1 = sharp(p1);
  const { data: d1, info: info1 } = await img1.raw().toBuffer({ resolveWithObject: true });
  
  // The background of p1 is near-white (top) and light grey (bottom).
  // The icon is pink/magenta with a card with 3 white dots.
  const dIcon = Buffer.from(d1);
  
  // Simple flood-fill / edge detection for transparent background:
  // For pixels: if they are background (near-white or grey shadow outside icon), make alpha 0
  // Pink pixels: (r > 150 && g < 120) or (r > 200 && b > 80 && g < 150)
  // Inside the card: 3 white dots (surrounded by pink)
  for (let y = 0; y < info1.height; y++) {
    for (let x = 0; x < info1.width; x++) {
      const idx = (y * info1.width + x) * 4;
      const r = dIcon[idx], g = dIcon[idx+1], b = dIcon[idx+2];
      
      // Is background:
      // White/light grey background has r, g, b all relatively close and high:
      const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
      const brightness = (r + g + b) / 3;
      
      // The background is grey/white where maxDiff is low (< 25)
      // Pink icon has high red and low green: maxDiff > 35
      // The 3 white dots in the card are white (brightness > 240, maxDiff < 15) BUT they are inside the pink box:
      // In the card, the pink box is around x: 40-80, y: 5-45
      const isInCardArea = (x >= 40 && x <= 85 && y >= 5 && y <= 45);
      
      if (maxDiff < 25) {
        if (isInCardArea && brightness > 220) {
          // It's a white dot on the pink card! Keep it opaque white!
          dIcon[idx+3] = 255;
        } else {
          // Transparent background
          dIcon[idx+3] = 0;
        }
      } else {
        // Icon pixel
        dIcon[idx+3] = 255;
      }
    }
  }
  
  // Save trimmed transparent icon as logo-icon.png
  await sharp(dIcon, { raw: { width: info1.width, height: info1.height, channels: 4 } })
    .trim({ threshold: 10 })
    .png()
    .toFile(path.join(publicDir, 'logo-icon.png'));
  console.log('Saved public/logo-icon.png');

  // Also create a 512x512 square centered logo icon for high-res / favicons
  await sharp(path.join(publicDir, 'logo-icon.png'))
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('Saved public/logo.png');

  // 2. Process wordmark (p2)
  fs.copyFileSync(p2, path.join(publicDir, 'logo-text-original.png'));
  
  const img2 = sharp(p2);
  const { data: d2, info: info2 } = await img2.raw().toBuffer({ resolveWithObject: true });
  
  const dDark = Buffer.from(d2); // white text for dark theme
  const dLight = Buffer.from(d2); // black text for light theme
  
  for (let i = 0; i < d2.length; i += 4) {
    const r = d2[i], g = d2[i+1], b = d2[i+2];
    const brightness = (r + g + b) / 3;
    
    // Background is dark (~18)
    if (brightness < 32) {
      dDark[i+3] = 0;
      dLight[i+3] = 0;
    } else {
      // Antialiased edge
      const alpha = Math.min(255, Math.max(0, Math.round(((brightness - 25) / 50) * 255)));
      dDark[i+3] = alpha;
      dLight[i+3] = alpha;
      
      // Is yellow triangle in 'A':
      const isYellow = (r > 160 && g > 100 && b < 80);
      if (isYellow) {
        dDark[i] = r; dDark[i+1] = g; dDark[i+2] = b;
        dLight[i] = r; dLight[i+1] = g; dLight[i+2] = b;
      } else {
        // Dark theme: crisp white text
        dDark[i] = 255; dDark[i+1] = 255; dDark[i+2] = 255;
        // Light theme: crisp black text
        dLight[i] = 0; dLight[i+1] = 0; dLight[i+2] = 0;
      }
    }
  }
  
  await sharp(dDark, { raw: { width: info2.width, height: info2.height, channels: 4 } })
    .trim({ threshold: 5 })
    .png()
    .toFile(path.join(publicDir, 'logo-text-white.png'));
    
  await sharp(dLight, { raw: { width: info2.width, height: info2.height, channels: 4 } })
    .trim({ threshold: 5 })
    .png()
    .toFile(path.join(publicDir, 'logo-text-dark.png'));
    
  console.log('Saved public/logo-text-white.png and public/logo-text-dark.png');
}

process().catch(console.error);
