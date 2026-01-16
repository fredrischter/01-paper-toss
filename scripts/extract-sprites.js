#!/usr/bin/env node

/**
 * Extract individual sprites from sprites-1.png spritesheet
 * 
 * The spritesheet (1536x1024) contains:
 * Top row: 3 trash bins + 1 desk fan (4 items at ~384px each)
 * Middle row: 5 fan blade frames (5 items at ~307px each)
 * Bottom row: 3 paper balls (3 items at ~512px each)
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');
const SPRITESHEET_PATH = path.join(ASSETS_DIR, 'sprites-1.png');

async function extractSprites() {
    console.log('Loading spritesheet from:', SPRITESHEET_PATH);
    
    if (!fs.existsSync(SPRITESHEET_PATH)) {
        console.error('Spritesheet not found:', SPRITESHEET_PATH);
        process.exit(1);
    }
    
    const image = await loadImage(SPRITESHEET_PATH);
    console.log(`Spritesheet dimensions: ${image.width}x${image.height}`);
    
    // Define sprite locations based on visual inspection
    // Trash bins (top row, left side)
    const trashBins = [
        { name: 'trash_bin_open.png', x: 0, y: 0, width: 384, height: 420 },
        { name: 'trash_bin_with_lid.png', x: 384, y: 0, width: 384, height: 420 },
        { name: 'trash_bin_tilted.png', x: 768, y: 0, width: 384, height: 420 }
    ];
    
    // Desk fan (top row, right side)
    const deskFan = { name: 'desk_fan.png', x: 1152, y: 0, width: 384, height: 420 };
    
    // Fan blades (middle row)
    const fanBlades = [
        { name: 'fan_blade_1.png', x: 0, y: 480, width: 307, height: 200 },
        { name: 'fan_blade_2.png', x: 307, y: 480, width: 307, height: 200 },
        { name: 'fan_blade_3.png', x: 614, y: 480, width: 307, height: 200 },
        { name: 'fan_blade_4.png', x: 921, y: 480, width: 307, height: 200 },
        { name: 'fan_blade_5.png', x: 1228, y: 480, width: 307, height: 200 }
    ];
    
    // Paper balls (bottom row)
    const paperBalls = [
        { name: 'paper_ball_crumpled_1.png', x: 0, y: 720, width: 512, height: 304 },
        { name: 'paper_ball_crumpled_2.png', x: 512, y: 720, width: 512, height: 304 },
        { name: 'paper_ball_crumpled_3.png', x: 1024, y: 720, width: 512, height: 304 }
    ];
    
    const allSprites = [
        ...trashBins,
        deskFan,
        ...fanBlades,
        ...paperBalls
    ];
    
    // Extract each sprite
    for (const sprite of allSprites) {
        console.log(`Extracting ${sprite.name} from (${sprite.x}, ${sprite.y}) size ${sprite.width}x${sprite.height}`);
        
        const canvas = createCanvas(sprite.width, sprite.height);
        const ctx = canvas.getContext('2d');
        
        // Draw the sprite portion
        ctx.drawImage(
            image,
            sprite.x, sprite.y, sprite.width, sprite.height,
            0, 0, sprite.width, sprite.height
        );
        
        // Save to file
        const outputPath = path.join(ASSETS_DIR, sprite.name);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        console.log(`  Saved to ${sprite.name}`);
    }
    
    console.log('\nSprite extraction complete!');
}

extractSprites().catch(err => {
    console.error('Error extracting sprites:', err);
    process.exit(1);
});
