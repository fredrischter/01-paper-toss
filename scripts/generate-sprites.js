#!/usr/bin/env node

/**
 * Sprite Generator - Creates PNG spritesheets from procedural generation
 * This replaces runtime generation with pre-generated assets
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Output directories
const SPRITESHEET_DIR = path.join(__dirname, '../assets/spritesheets');
const IMAGES_DIR = path.join(__dirname, '../assets/images');

// Ensure directories exist
if (!fs.existsSync(SPRITESHEET_DIR)) {
    fs.mkdirSync(SPRITESHEET_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

console.log('🎨 Generating spritesheets...\n');

/**
 * Generate Character Spritesheet
 * 65 frames: 1 stand + 32 walk + 32 jump
 */
function generateCharacterSpritesheet() {
    const frameWidth = 32;
    const frameHeight = 48;
    const framesPerAnimation = 8;
    const totalFrames = 1 + (4 * framesPerAnimation) + (4 * framesPerAnimation); // 65 frames
    
    const canvas = createCanvas(frameWidth * totalFrames, frameHeight);
    const ctx = canvas.getContext('2d');
    
    // Helper to draw character with directional facing
    function drawCharacter(x, y, color, direction = 'down', legOffset = 0, armOffset = 0) {
        ctx.save();
        
        if (direction === 'down') {
            // Front view - facing down
            // Head
            ctx.fillStyle = '#FFD1A3';
            ctx.fillRect(x + 10, y + 5, 12, 12);
            
            // Eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 12, y + 9, 2, 2);
            ctx.fillRect(x + 18, y + 9, 2, 2);
            
            // Body
            ctx.fillStyle = color;
            ctx.fillRect(x + 8, y + 17, 16, 18);
            
            // Arms (both visible)
            ctx.fillStyle = '#FFD1A3';
            ctx.fillRect(x + 4, y + 20, 6, 12 + armOffset);
            ctx.fillRect(x + 22, y + 20, 6, 12 - armOffset);
            
            // Legs with animation
            ctx.fillStyle = '#4A4A4A';
            ctx.fillRect(x + 10, y + 35, 5, 13 - legOffset);
            ctx.fillRect(x + 17, y + 35, 5, 13 + legOffset);
            
        } else if (direction === 'up') {
            // Back view - facing up
            // Head (back of head)
            ctx.fillStyle = '#D4A574';
            ctx.fillRect(x + 10, y + 5, 12, 12);
            
            // Hair/back of head detail
            ctx.fillStyle = '#8B6F47';
            ctx.fillRect(x + 10, y + 5, 12, 4);
            
            // Body
            ctx.fillStyle = color;
            ctx.fillRect(x + 8, y + 17, 16, 18);
            
            // Arms (both visible from back)
            ctx.fillStyle = '#D4A574';
            ctx.fillRect(x + 4, y + 20, 6, 12 - armOffset);
            ctx.fillRect(x + 22, y + 20, 6, 12 + armOffset);
            
            // Legs with animation
            ctx.fillStyle = '#4A4A4A';
            ctx.fillRect(x + 10, y + 35, 5, 13 + legOffset);
            ctx.fillRect(x + 17, y + 35, 5, 13 - legOffset);
            
        } else if (direction === 'left') {
            // Side view - facing left
            // Head
            ctx.fillStyle = '#FFD1A3';
            ctx.fillRect(x + 12, y + 5, 10, 12);
            
            // Eye (one eye visible from side)
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 13, y + 9, 2, 2);
            
            // Body
            ctx.fillStyle = color;
            ctx.fillRect(x + 10, y + 17, 14, 18);
            
            // Arm (one arm visible)
            ctx.fillStyle = '#FFD1A3';
            ctx.fillRect(x + 10, y + 20, 5, 12 + armOffset);
            
            // Legs with animation (show walking motion in side view)
            ctx.fillStyle = '#4A4A4A';
            // Back leg (slightly hidden)
            ctx.fillRect(x + 12, y + 35, 5, 13 - legOffset);
            // Front leg (more visible)
            ctx.fillRect(x + 15, y + 35, 5, 13 + legOffset);
            
        } else if (direction === 'right') {
            // Side view - facing right
            // Head
            ctx.fillStyle = '#FFD1A3';
            ctx.fillRect(x + 10, y + 5, 10, 12);
            
            // Eye (one eye visible from side)
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 17, y + 9, 2, 2);
            
            // Body
            ctx.fillStyle = color;
            ctx.fillRect(x + 8, y + 17, 14, 18);
            
            // Arm (one arm visible)
            ctx.fillStyle = '#FFD1A3';
            ctx.fillRect(x + 17, y + 20, 5, 12 - armOffset);
            
            // Legs with animation (show walking motion in side view)
            ctx.fillStyle = '#4A4A4A';
            // Back leg (slightly hidden)
            ctx.fillRect(x + 12, y + 35, 5, 13 + legOffset);
            // Front leg (more visible)
            ctx.fillRect(x + 15, y + 35, 5, 13 - legOffset);
        }
        
        ctx.restore();
    }
    
    let frameIndex = 0;
    
    // Standing frame (default down direction)
    drawCharacter(frameIndex * frameWidth, 0, '#4169E1', 'down', 0, 0);
    frameIndex++;
    
    // Walking frames (8 frames per direction: down, left, right, up)
    const walkDirections = ['down', 'left', 'right', 'up'];
    for (let dirIdx = 0; dirIdx < 4; dirIdx++) {
        const direction = walkDirections[dirIdx];
        for (let i = 0; i < framesPerAnimation; i++) {
            const x = frameIndex * frameWidth;
            const y = 0;
            const legOffset = Math.sin(i / framesPerAnimation * Math.PI * 2) * 3;
            const armOffset = Math.sin(i / framesPerAnimation * Math.PI * 2) * 2;
            drawCharacter(x, y, '#4169E1', direction, legOffset, armOffset);
            frameIndex++;
        }
    }
    
    // Jumping frames (8 frames per direction: down, left, right, up)
    const jumpDirections = ['down', 'left', 'right', 'up'];
    for (let dirIdx = 0; dirIdx < 4; dirIdx++) {
        const direction = jumpDirections[dirIdx];
        for (let i = 0; i < framesPerAnimation; i++) {
            const x = frameIndex * frameWidth;
            const y = 0;
            const jumpOffset = -Math.abs(Math.sin(i / framesPerAnimation * Math.PI)) * 10;
            drawCharacter(x, y + jumpOffset, '#4169E1', direction, 0, 0);
            frameIndex++;
        }
    }
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(SPRITESHEET_DIR, 'character.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated character.png (${frameWidth * totalFrames}x${frameHeight}, ${totalFrames} frames)`);
}

/**
 * Generate UI Buttons Spritesheet
 * Frames: 0-Menu, 1-Sound, 2-DpadUp, 3-DpadDown, 4-DpadLeft, 5-DpadRight, 6-Action
 */
function generateUIButtonsSpritesheet() {
    const buttonSize = 64;
    const buttonCount = 7;
    
    const canvas = createCanvas(buttonSize * buttonCount, buttonSize);
    const ctx = canvas.getContext('2d');
    
    // Menu button (hamburger)
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, buttonSize, buttonSize);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, buttonSize - 4, buttonSize - 4);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(16, 20 + i * 12, 32, 4);
    }
    
    // Sound button
    ctx.fillStyle = '#444';
    ctx.fillRect(buttonSize, 0, buttonSize, buttonSize);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(buttonSize + 2, 2, buttonSize - 4, buttonSize - 4);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(buttonSize + 25, 32, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(buttonSize + 32, 24, 12, 16);
    
    // D-pad arrows
    const dpadColors = ['#333', '#333', '#333', '#333'];
    const dpadX = [2, 3, 4, 5];
    
    dpadX.forEach((frameIdx, idx) => {
        const x = frameIdx * buttonSize;
        ctx.fillStyle = dpadColors[idx];
        ctx.fillRect(x, 0, buttonSize, buttonSize);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 2, 2, buttonSize - 4, buttonSize - 4);
        
        // Draw arrow
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        if (idx === 0) { // Up
            ctx.moveTo(x + 32, 20);
            ctx.lineTo(x + 42, 40);
            ctx.lineTo(x + 22, 40);
        } else if (idx === 1) { // Down
            ctx.moveTo(x + 32, 44);
            ctx.lineTo(x + 42, 24);
            ctx.lineTo(x + 22, 24);
        } else if (idx === 2) { // Left
            ctx.moveTo(x + 20, 32);
            ctx.lineTo(x + 40, 42);
            ctx.lineTo(x + 40, 22);
        } else { // Right
            ctx.moveTo(x + 44, 32);
            ctx.lineTo(x + 24, 42);
            ctx.lineTo(x + 24, 22);
        }
        ctx.fill();
    });
    
    // Action button
    const actionX = 6 * buttonSize;
    ctx.fillStyle = '#555';
    ctx.fillRect(actionX, 0, buttonSize, buttonSize);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(actionX + 2, 2, buttonSize - 4, buttonSize - 4);
    ctx.beginPath();
    ctx.arc(actionX + 32, 32, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(SPRITESHEET_DIR, 'ui-buttons.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated ui-buttons.png (${buttonSize * buttonCount}x${buttonSize}, ${buttonCount} frames)`);
}

/**
 * Generate Popup Buttons Spritesheet
 * Frame 0: OK button, Frame 1: Cancel button
 */
function generatePopupButtonsSpritesheet() {
    const buttonWidth = 90;
    const buttonHeight = 50;
    
    const canvas = createCanvas(buttonWidth * 2, buttonHeight);
    const ctx = canvas.getContext('2d');
    
    // OK button (green)
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, buttonWidth, buttonHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, buttonWidth - 2, buttonHeight - 2);
    
    // Cancel button (red)
    ctx.fillStyle = '#f44336';
    ctx.fillRect(buttonWidth, 0, buttonWidth, buttonHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonWidth + 1, 1, buttonWidth - 2, buttonHeight - 2);
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(SPRITESHEET_DIR, 'popup-buttons.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated popup-buttons.png (${buttonWidth * 2}x${buttonHeight}, 2 frames)`);
}

/**
 * Generate Square Doll Sprite
 */
function generateSquareDollSprite() {
    const size = 50;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(1, '#C92A2A');
    ctx.fillStyle = gradient;
    ctx.fillRect(5, 5, 40, 40);
    
    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, 40, 40);
    
    // Face
    ctx.fillStyle = '#000';
    ctx.fillRect(15, 15, 5, 5); // Left eye
    ctx.fillRect(30, 15, 5, 5); // Right eye
    ctx.fillRect(15, 30, 20, 3); // Mouth
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(IMAGES_DIR, 'square-doll.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated square-doll.png (${size}x${size})`);
}

/**
 * Generate Stage Backgrounds
 */
function generateStageBackgrounds() {
    const width = 800;
    const height = 600;
    
    const stages = [
        { name: 'stage1-bg', color1: '#2d5a3d', color2: '#1a3d2d' },
        { name: 'stage2-bg', color1: '#5a3d2d', color2: '#3d2d1a' },
        { name: 'stage3-bg', color1: '#3d2d5a', color2: '#2d1a3d' }
    ];
    
    stages.forEach(stage => {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, stage.color1);
        gradient.addColorStop(1, stage.color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Decorative elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * (height - 100);
            const size = Math.random() * 30 + 10;
            ctx.fillRect(x, y, size, size);
        }
        
        const buffer = canvas.toBuffer('image/png');
        const filename = path.join(IMAGES_DIR, `${stage.name}.png`);
        fs.writeFileSync(filename, buffer);
        console.log(`✓ Generated ${stage.name}.png (${width}x${height})`);
    });
}

/**
 * Generate Popup Background
 */
function generatePopupBackground() {
    const width = 500;
    const height = 300;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background with border
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Inner decoration
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(10, 10, width - 20, height - 20);
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(IMAGES_DIR, 'popup-bg.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated popup-bg.png (${width}x${height})`);
}

/**
 * Generate Interstitial Image
 */
function generateInterstitial() {
    const width = 800;
    const height = 600;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Radial gradient
    const gradient = ctx.createRadialGradient(400, 300, 50, 400, 300, 400);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF6347');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Stage Transition', 400, 280);
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Loading...', 400, 340);
    
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(IMAGES_DIR, 'interstitial.png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Generated interstitial.png (${width}x${height})`);
}

/**
 * Generate Particle Textures
 * Creates small PNG textures for particle effects
 */
function generateParticleTextures() {
    // Smoke particle - small gray puff
    const smokeSize = 8;
    const smokeCanvas = createCanvas(smokeSize, smokeSize);
    const smokeCtx = smokeCanvas.getContext('2d');
    
    // Circular gradient for soft smoke
    const smokeGradient = smokeCtx.createRadialGradient(4, 4, 0, 4, 4, 4);
    smokeGradient.addColorStop(0, 'rgba(200, 200, 200, 0.8)');
    smokeGradient.addColorStop(0.5, 'rgba(150, 150, 150, 0.5)');
    smokeGradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
    smokeCtx.fillStyle = smokeGradient;
    smokeCtx.fillRect(0, 0, smokeSize, smokeSize);
    
    const smokeBuffer = smokeCanvas.toBuffer('image/png');
    fs.writeFileSync(path.join(IMAGES_DIR, 'particle-smoke.png'), smokeBuffer);
    console.log(`✓ Generated particle-smoke.png (${smokeSize}x${smokeSize})`);
    
    // Spark particle - bright yellow/orange star
    const sparkSize = 6;
    const sparkCanvas = createCanvas(sparkSize, sparkSize);
    const sparkCtx = sparkCanvas.getContext('2d');
    
    // Star shape for spark
    sparkCtx.fillStyle = '#FFD700';
    sparkCtx.beginPath();
    sparkCtx.arc(3, 3, 2.5, 0, Math.PI * 2);
    sparkCtx.fill();
    
    // Bright center
    sparkCtx.fillStyle = '#FFFF00';
    sparkCtx.beginPath();
    sparkCtx.arc(3, 3, 1, 0, Math.PI * 2);
    sparkCtx.fill();
    
    const sparkBuffer = sparkCanvas.toBuffer('image/png');
    fs.writeFileSync(path.join(IMAGES_DIR, 'particle-spark.png'), sparkBuffer);
    console.log(`✓ Generated particle-spark.png (${sparkSize}x${sparkSize})`);
    
    // Celebration confetti - colorful squares and circles
    const confettiSize = 10;
    const confettiCanvas = createCanvas(confettiSize, confettiSize);
    const confettiCtx = confettiCanvas.getContext('2d');
    
    // Random colorful shape
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCF7F', '#C77DFF', '#FF8E53'];
    confettiCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    
    // Draw a rotated square
    confettiCtx.save();
    confettiCtx.translate(5, 5);
    confettiCtx.rotate(Math.PI / 4);
    confettiCtx.fillRect(-3, -3, 6, 6);
    confettiCtx.restore();
    
    const confettiBuffer = confettiCanvas.toBuffer('image/png');
    fs.writeFileSync(path.join(IMAGES_DIR, 'particle-confetti.png'), confettiBuffer);
    console.log(`✓ Generated particle-confetti.png (${confettiSize}x${confettiSize})`);
    
    // Additional confetti variations
    for (let i = 0; i < 4; i++) {
        const varCanvas = createCanvas(confettiSize, confettiSize);
        const varCtx = varCanvas.getContext('2d');
        varCtx.fillStyle = colors[(i + 1) % colors.length];
        
        if (i % 2 === 0) {
            // Circle
            varCtx.beginPath();
            varCtx.arc(5, 5, 4, 0, Math.PI * 2);
            varCtx.fill();
        } else {
            // Triangle
            varCtx.beginPath();
            varCtx.moveTo(5, 2);
            varCtx.lineTo(8, 8);
            varCtx.lineTo(2, 8);
            varCtx.closePath();
            varCtx.fill();
        }
        
        const varBuffer = varCanvas.toBuffer('image/png');
        fs.writeFileSync(path.join(IMAGES_DIR, `particle-confetti${i + 1}.png`), varBuffer);
        console.log(`✓ Generated particle-confetti${i + 1}.png (${confettiSize}x${confettiSize})`);
    }
}

// Generate all sprites
try {
    generateCharacterSpritesheet();
    generateUIButtonsSpritesheet();
    generatePopupButtonsSpritesheet();
    generateSquareDollSprite();
    generateStageBackgrounds();
    generatePopupBackground();
    generateInterstitial();
    generateParticleTextures();
    
    console.log('\n✅ All spritesheets generated successfully!');
    console.log(`\n📁 Spritesheets: ${SPRITESHEET_DIR}`);
    console.log(`📁 Images: ${IMAGES_DIR}`);
} catch (error) {
    console.error('\n❌ Error generating spritesheets:', error.message);
    process.exit(1);
}
