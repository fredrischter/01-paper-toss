// Boot Scene - Shows loading screen while assets load
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x2d5016);
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const progressBarBg = this.add.rectangle(width / 2, height / 2 + 20, 400, 30, 0x555555);
        const progressBar = this.add.rectangle(width / 2 - 200, height / 2 + 20, 0, 26, 0xffffff);
        progressBar.setOrigin(0, 0.5);

        const progressText = this.add.text(width / 2, height / 2 + 60, '0%', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.width = 400 * value;
            progressText.setText(Math.floor(value * 100) + '%');
        });

        this.load.on('complete', () => {
            loadingText.setText('Ready!');
            setTimeout(() => {
                this.scene.start('GameScene');
            }, 500);
        });

        preload.call(this);
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        create.call(this);
    }

    update() {
        update.call(this);
    }
}


// Game configuration - Physics Adventure Variant
const gameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 }, // Strong gravity for platformer feel
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Game state variables
let player;
let cursors;
let shiftKey;
let wasdKeys;
let platforms;
let isMobile;
let ground;

// Terrain elements
let terrain = [];
let goalFlag;

// Movement state
let isCharging = false;
let moveSpeed = 200; // Normal speed
let chargeSpeed = 400; // Speed boost when holding Shift
let jumpPower = 400; // Base jump power

// Stage management
// currentStage declared on line 66
let stageText;

// UI buttons
let menuButton;
let soundButton;

// Sound
let backgroundMusic;
let soundEnabled = true;
let moveUp = false;
let moveDown = false;
let mobileJumpPressed = false; // Track mobile jump button press

// Animation state
let currentDirection = 'down'; // down, up, left, right
let isJumping = false;

// Stage management
let currentStage = 1; // 1, 2, or 3
let stageBackgrounds = {}; // Will hold background images

// Popup state
let popupOverlay = null;
let popupActive = false;

// Particle systems
let smokeParticles = null;     // Running smoke particles
let sparkParticles = null;      // Collision spark particles
let celebrationParticles = null; // Level complete celebration

// Physics Adventure Implementation
// Terrain generation with slopes and momentum-based platforming

let chargeStartTime = 0;
let isChargingActive = false;

function generateTerrain(scene, stage) {
    // Clear existing terrain
    terrain.forEach(t => t.destroy());
    terrain = [];
    
    const worldWidth = 4000;
    const worldHeight = 600;
    
    // Create camera world bounds
    scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    
    // Stage-specific terrain layouts with slopes
    if (stage === 1) {
        // Stage 1: Gentle hills with slopes
        createGround(scene, 0, 500, 700, 50); // Starting platform
        createSlope(scene, 700, 500, 200, 40, true); // Upward slope
        createGround(scene, 900, 460, 300, 50); // Hill top
        createSlope(scene, 1200, 460, 200, 40, false); // Downward slope
        createGround(scene, 1400, 500, 300, 50); // Mid platform
        // Hole from 1700-1900
        createGround(scene, 1900, 520, 400, 30); // After hole (lower)
        createSlope(scene, 2300, 520, 250, 70, true); // Up slope
        createGround(scene, 2550, 450, 600, 50); // Higher platform
        createSlope(scene, 3150, 450, 200, 50, false); // Down slope
        createGround(scene, 3350, 500, 650, 50); // End platform
    } else if (stage === 2) {
        // Stage 2: More challenging with steeper slopes and valleys
        createGround(scene, 0, 500, 500, 50);
        createSlope(scene, 500, 500, 250, 60, true); // Steep up
        createGround(scene, 750, 440, 250, 50); // Hill
        createSlope(scene, 1000, 440, 300, 80, false); // Steep down
        createGround(scene, 1300, 520, 300, 30); // Valley
        createSlope(scene, 1600, 520, 200, 60, true); // Up
        createGround(scene, 1800, 460, 300, 40); // Platform
        // Hole from 2100-2400
        createSlope(scene, 2400, 520, 300, 80, true); // Big up slope
        createGround(scene, 2700, 440, 500, 60); // Big hill
        createSlope(scene, 3200, 440, 250, 60, false); // Down
        createGround(scene, 3450, 500, 550, 50); // End
    } else {
        // Stage 3: Complex terrain with multiple slopes and holes
        createGround(scene, 0, 500, 400, 50);
        createSlope(scene, 400, 500, 200, 50, true);
        createGround(scene, 600, 450, 200, 50);
        createSlope(scene, 800, 450, 150, 50, false);
        // Hole from 950-1150
        createGround(scene, 1150, 500, 300, 50);
        createSlope(scene, 1450, 500, 250, 70, true); // Up
        createGround(scene, 1700, 430, 300, 50);
        createSlope(scene, 2000, 430, 200, 50, false); // Down
        // Hole from 2200-2450
        createSlope(scene, 2450, 530, 300, 80, true); // Big climb
        createGround(scene, 2750, 450, 400, 50);
        createSlope(scene, 3150, 450, 200, 50, false);
        createGround(scene, 3350, 500, 650, 50); // End platform
    }
    
    // Create goal flag at end
    if (goalFlag) goalFlag.destroy();
    goalFlag = scene.add.rectangle(3900, 460, 30, 80, 0x00ff00);
    scene.physics.add.existing(goalFlag, true); // Static body
}

function createGround(scene, x, y, width, height) {
    const platform = scene.add.rectangle(x + width/2, y + height/2, width, height, 0x8b4513);
    scene.physics.add.existing(platform, true); // Static body
    terrain.push(platform);
    return platform;
}

function createSlope(scene, x, y, width, height, upward) {
    // Create a sloped platform with actual physics slope
    // Build slope as a series of small steps for realistic physics
    const stepCount = Math.floor(width / 20); // 20px steps
    const stepWidth = width / stepCount;
    const stepHeight = height / stepCount;
    
    for (let i = 0; i < stepCount; i++) {
        const stepX = x + i * stepWidth;
        const stepY = upward ? (y - i * stepHeight) : (y + i * stepHeight);
        
        // Create small platform for each step
        const step = scene.add.rectangle(
            stepX + stepWidth/2, 
            stepY + stepHeight/2, 
            stepWidth + 1, // Slight overlap to prevent gaps
            stepHeight + 10, // Extra height for solid collision
            0x8b4513
        );
        scene.physics.add.existing(step, true);
        terrain.push(step);
    }
    
    // Also add visual slope overlay (non-collidable) for appearance
    const slopeVisual = scene.add.rectangle(x + width/2, y, width, height, 0x8b4513, 0.5);
    const angle = upward ? -Math.atan(height / width) : Math.atan(height / width);
    slopeVisual.rotation = angle;
    const yAdjust = upward ? -height/2 : -height/2;
    slopeVisual.y = y + yAdjust;
    // Don't add physics to visual - it's just for looks
    terrain.push(slopeVisual);
}

function setupPhysicsControls(scene) {
    // Keyboard controls
    cursors = scene.input.keyboard.createCursorKeys();
    wasdKeys = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
}

function updatePhysicsMovement(scene) {
    if (!player || !player.body) return;
    
    const body = player.body;
    const onGround = body.touching.down;
    
    // Check if shift key is pressed (start/continue charge)
    if (shiftKey.isDown) {
        if (!isChargingActive) {
            // Start charging
            isChargingActive = true;
            chargeStartTime = scene.time.now;
        }
    } else {
        // Stop charging
        isChargingActive = false;
    }
    
    // Determine current speed based on charge status
    let currentSpeed = moveSpeed;
    if (isChargingActive) {
        // Charge lasts for 1 second (1000ms) after activation
        const chargeElapsed = scene.time.now - chargeStartTime;
        if (chargeElapsed < 1000) {
            currentSpeed = chargeSpeed;
        } else {
            // Charge duration expired, deactivate
            isChargingActive = false;
        }
    }
    
    // Horizontal movement
    if (cursors.left.isDown || wasdKeys.left.isDown) {
        body.setVelocityX(-currentSpeed);
        player.flipX = true;
    } else if (cursors.right.isDown || wasdKeys.right.isDown) {
        body.setVelocityX(currentSpeed);
        player.flipX = false;
    } else {
        // Apply friction when not moving
        body.setVelocityX(body.velocity.x * 0.85);
    }
    
    // Jump (only when on ground)
    if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(wasdKeys.up)) {
        if (onGround) {
            // Momentum-based jump: faster horizontal speed = longer jump
            const horizontalSpeed = Math.abs(body.velocity.x);
            const jumpBonus = horizontalSpeed / 10; // Extra jump power based on speed
            body.setVelocityY(-(jumpPower + jumpBonus));
        }
    }
    
    // Camera follow
    scene.cameras.main.scrollX = Phaser.Math.Clamp(player.x - 400, 0, 4000 - 800);
    
    // Check if reached goal
    if (goalFlag && Phaser.Geom.Rectangle.Overlaps(player.getBounds(), goalFlag.getBounds())) {
        completeStage(scene);
    }
    
    // Check if fell off map
    if (player.y > 700) {
        resetPlayerPosition(scene);
    }
}

function resetPlayerPosition(scene) {
    player.setPosition(100, 400);
    player.setVelocity(0, 0);
}

function completeStage(scene) {
    if (currentStage < 3) {
        currentStage++;
        stageText.setText(`Stage ${currentStage}`);
        generateTerrain(scene, currentStage);
        resetPlayerPosition(scene);
    } else {
        // Victory!
        const victoryText = scene.add.text(player.x, 250, 'Victory!\n\nAll Stages Complete!', {
            fontSize: '48px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);
        
        scene.time.delayedCall(3000, () => {
            currentStage = 1;
            stageText.setText(`Stage ${currentStage}`);
            generateTerrain(scene, currentStage);
            resetPlayerPosition(scene);
            victoryText.destroy();
        });
    }
}

function preload() {
    // Detect if mobile
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Load character spritesheet (65 frames: 1 stand + 32 walk + 32 jump)
    this.load.spritesheet('player', 'assets/spritesheets/character.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    
    // Load UI buttons spritesheet (7 frames: menu, sound, dpad-up, dpad-down, dpad-left, dpad-right, action)
    this.load.spritesheet('ui-buttons', 'assets/spritesheets/ui-buttons.png', {
        frameWidth: 64,
        frameHeight: 64
    });
    
    // Load popup buttons spritesheet (2 frames: OK, Cancel)
    this.load.spritesheet('popup-buttons', 'assets/spritesheets/popup-buttons.png', {
        frameWidth: 90,
        frameHeight: 50
    });
    
    // Load stage backgrounds
    this.load.image('bg-stage1', 'assets/images/stage1-bg.png');
    this.load.image('bg-stage2', 'assets/images/stage2-bg.png');
    this.load.image('bg-stage3', 'assets/images/stage3-bg.png');
    
    // Load popup background
    this.load.image('popup-bg', 'assets/images/popup-bg.png');
    
    // Load square doll sprite
    this.load.image('square-doll', 'assets/images/square-doll.png');
    
    // Load interstitial image
    this.load.image('interstitial', 'assets/images/interstitial.png');
    
    // Load particle textures
    this.load.image('particle-smoke', 'assets/images/particle-smoke.png');
    this.load.image('particle-spark', 'assets/images/particle-spark.png');
    this.load.image('particle-confetti', 'assets/images/particle-confetti.png');
    this.load.image('particle-confetti1', 'assets/images/particle-confetti1.png');
    this.load.image('particle-confetti2', 'assets/images/particle-confetti2.png');
    this.load.image('particle-confetti3', 'assets/images/particle-confetti3.png');
    this.load.image('particle-confetti4', 'assets/images/particle-confetti4.png');
    
    // Note: Background music uses Web Audio API (no file to load)
    // In production, you could load: this.load.audio('bgmusic', 'assets/audio/background.mp3');
}

function create() {
    // Add scrolling background
    const bg = this.add.rectangle(2000, 300, 4000, 600, 0x87CEEB).setDepth(-1); // Sky blue
    
    // Create player sprite with Arcade physics
    player = this.physics.add.sprite(100, 400, 'player', 0);
    player.setCollideWorldBounds(false); // Allow falling off
    player.setBounce(0);
    player.setGravityY(0); // Use world gravity
    
    // Create animations for player
    createPlayerAnimations(this);
    
    // Generate terrain for stage 1
    generateTerrain(this, 1);
    
    // Enable collisions between player and terrain
    this.physics.add.collider(player, terrain);
    
    // Set up controls
    setupPhysicsControls(this);
    
    // Create UI elements
    createPhysicsUI(this);
    
    // Initialize sound (Web Audio API)
    initSound(this);
}

function createPlayerAnimations(scene) {
    // Simple walk animation
    if (!scene.anims.exists('walk-right')) {
        scene.anims.create({
            key: 'walk-right',
            frames: scene.anims.generateFrameNumbers('player', { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }
}

function createPhysicsUI(scene) {
    // Stage text
    stageText = scene.add.text(16, 16, 'Stage 1', {
        fontSize: '24px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
    }).setScrollFactor(0).setDepth(100);
    
    // Instructions
    const instructions = scene.add.text(400, 16, 'Arrow keys to move | SHIFT to charge | UP/W to jump', {
        fontSize: '18px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);
    
    // Menu button (top left)
    menuButton = scene.add.rectangle(50, 50, 60, 60, 0x333333)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(100);
    scene.add.text(50, 50, 'MENU', {
        fontSize: '14px',
        fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    
    // Sound button (top right)
    soundButton = scene.add.rectangle(750, 50, 60, 60, 0x333333)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(100);
    scene.add.text(750, 50, 'SOUND', {
        fontSize: '14px',
        fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
}

function initSound(scene) {
    // Placeholder for sound
    soundEnabled = false;
}


function createParticleSystems(scene) {
    // Smoke particles - emit when player is running
    smokeParticles = scene.add.particles(0, 0, 'particle-smoke', {
        speed: { min: 10, max: 30 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.6, end: 0 },
        lifespan: 500,
        frequency: 80,
        emitting: false,
        blendMode: 'ADD'
    });
    smokeParticles.setDepth(5);
    
    // Spark particles - emit when hitting blocks
    sparkParticles = scene.add.particles(0, 0, 'particle-spark', {
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0.2 },
        alpha: { start: 1, end: 0 },
        lifespan: 300,
        gravityY: 0,
        emitting: false,
        blendMode: 'ADD'
    });
    sparkParticles.setDepth(100);
    
    // Celebration particles - shower when level completes
    celebrationParticles = scene.add.particles(0, 0, 'particle-confetti', {
        speed: { min: 100, max: 300 },
        angle: { min: 240, max: 300 },
        scale: { start: 1, end: 0.5 },
        alpha: { start: 1, end: 0.5 },
        lifespan: 2000,
        gravityY: 0,
        rotate: { min: 0, max: 360 },
        emitting: false,
        blendMode: 'NORMAL'
    });
    celebrationParticles.setDepth(200);
}

function emitCollisionSparks(x, y) {
    if (!sparkParticles) return;
    
    sparkParticles.emitParticleAt(x, y, 8);
}

function startCelebration(scene) {
    if (!celebrationParticles) return;
    
    // Create multiple confetti emitters across the screen
    const confettiTextures = ['particle-confetti', 'particle-confetti1', 'particle-confetti2', 'particle-confetti3', 'particle-confetti4'];
    
    // Emit celebration particles from multiple points
    for (let i = 0; i < 5; i++) {
        const x = 160 + i * 160;
        const texture = confettiTextures[i % confettiTextures.length];
        
        // Create temporary emitter for each confetti type
        const emitter = scene.add.particles(x, 50, texture, {
            speed: { min: 100, max: 300 },
            angle: { min: 60, max: 120 },
            scale: { start: 1, end: 0.3 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            gravityY: 0,
            rotate: { min: 0, max: 360 },
            quantity: 3,
            frequency: 50,
            blendMode: 'NORMAL'
        });
        emitter.setDepth(200);
        
        // Stop after 2 seconds
        scene.time.delayedCall(2000, () => {
            emitter.stop();
            scene.time.delayedCall(2500, () => {
                emitter.destroy();
            });
        });
    }
}

function createAnimations(scene) {
    // Standing animation
    scene.anims.create({
        key: 'stand',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 10
    });
    
    // Walking animations (8 frames each)
    const directions = ['down', 'left', 'right', 'up'];
    
    directions.forEach((dir, index) => {
        scene.anims.create({
            key: `walk-${dir}`,
            frames: scene.anims.generateFrameNumbers('player', { 
                start: 1 + index * 8, 
                end: 1 + index * 8 + 7 
            }),
            frameRate: 10,
            repeat: -1
        });
    });
    
    // Jumping animations (8 frames each)
    directions.forEach((dir, index) => {
        scene.anims.create({
            key: `jump-${dir}`,
            frames: scene.anims.generateFrameNumbers('player', { 
                start: 33 + index * 8, 
                end: 33 + index * 8 + 7 
            }),
            frameRate: 10,
            repeat: 0
        });
    });
}

function createUI(scene) {
    // Top-left: Menu button
    menuButton = scene.add.sprite(40, 40, 'ui-buttons', 0)
        .setInteractive()
        .setScrollFactor(0)
        .setScale(0.8);
    
    menuButton.on('pointerdown', () => {
        console.log('Menu clicked');
        alert('Menu\n\nControls:\n- Arrow keys or WASD to move\n- Space to jump\n- Click sound button to toggle music');
    });
    
    // Top-right: Sound button
    soundButton = scene.add.sprite(760, 40, 'ui-buttons', 1)
        .setInteractive()
        .setScrollFactor(0)
        .setScale(0.8);
    
    soundButton.on('pointerdown', () => {
        toggleSound();
        updateSoundButton();
    });
    
    // Middle-top: Score/title text
    const titleText = scene.add.text(400, 30, 'Game POC - Character Demo', {
        fontSize: '24px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5, 0).setScrollFactor(0);
    
    // Middle-bottom: Instructions text
    const instructionsText = scene.add.text(400, 560, 
        isMobile ? 'Use D-pad to move, Action to jump' : 'Arrow keys or WASD to move, Space to jump', 
        {
            fontSize: '16px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5, 0).setScrollFactor(0);
    
    // Mobile controls
    if (isMobile) {
        createMobileControls(scene);
    }
}

function createMobileControls(scene) {
    // D-pad (bottom-left area)
    const dpadX = 100;
    const dpadY = 500;
    const buttonSpacing = 70;
    
    // Up button
    const upButton = scene.add.sprite(dpadX, dpadY - buttonSpacing, 'ui-buttons', 2)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    upButton.on('pointerdown', () => { moveUp = true; });
    upButton.on('pointerup', () => { moveUp = false; });
    upButton.on('pointerout', () => { moveUp = false; });
    
    // Down button
    const downButton = scene.add.sprite(dpadX, dpadY + buttonSpacing, 'ui-buttons', 3)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    downButton.on('pointerdown', () => { moveDown = true; });
    downButton.on('pointerup', () => { moveDown = false; });
    downButton.on('pointerout', () => { moveDown = false; });
    
    // Left button
    const leftButton = scene.add.sprite(dpadX - buttonSpacing, dpadY, 'ui-buttons', 4)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    leftButton.on('pointerdown', () => { moveLeft = true; });
    leftButton.on('pointerup', () => { moveLeft = false; });
    leftButton.on('pointerout', () => { moveLeft = false; });
    
    // Right button
    const rightButton = scene.add.sprite(dpadX + buttonSpacing, dpadY, 'ui-buttons', 5)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    rightButton.on('pointerdown', () => { moveRight = true; });
    rightButton.on('pointerup', () => { moveRight = false; });
    rightButton.on('pointerout', () => { moveRight = false; });
    
    // Action button (bottom-right)
    actionButton = scene.add.circle(700, 500, 40, 0xFF6B6B)
        .setInteractive()
        .setScrollFactor(0)
        .setAlpha(0.7);
    
    const actionText = scene.add.text(700, 500, 'JUMP', {
        fontSize: '14px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0);
    
    actionButton.on('pointerdown', () => {
        mobileJumpPressed = true;
    });
}

function initSound(scene) {
    // Create a simple background sound using Web Audio API
    // In production, you would use: backgroundMusic = scene.sound.add('bgmusic', { loop: true });
    
    // For this POC, we'll create a simple tone
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a simple melody loop
        window.gameSoundContext = audioContext;
        window.playBackgroundMusic = function() {
            if (!soundEnabled) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 2);
            
            // Loop
            if (soundEnabled) {
                setTimeout(window.playBackgroundMusic, 2000);
            }
        };
        
        if (soundEnabled) {
            window.playBackgroundMusic();
        }
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled && window.playBackgroundMusic) {
        window.playBackgroundMusic();
    }
}

function updateSoundButton() {
    // Visual feedback for sound state
    if (soundButton) {
        soundButton.setAlpha(soundEnabled ? 1.0 : 0.5);
    }
}

function showPopup(scene) {
    if (popupActive) return;
    
    popupActive = true;
    
    // Create semi-transparent overlay
    const overlay = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setDepth(1000);
    
    // Create popup background
    const popupBg = scene.add.image(400, 300, 'popup-bg').setDepth(1001);
    
    // Add text
    const titleText = scene.add.text(400, 200, 'Demonstration Pop-up', {
        fontSize: '32px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1002);
    
    const messageText = scene.add.text(400, 260, 'You went off the left edge!', {
        fontSize: '20px',
        fill: '#ccc'
    }).setOrigin(0.5).setDepth(1002);
    
    // Create OK button
    const okButton = scene.add.sprite(300, 360, 'popup-buttons', 0)
        .setInteractive()
        .setDepth(1002)
        .setScale(1.5);
    
    const okText = scene.add.text(300, 360, 'OK', {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1003);
    
    // Create Cancel button
    const cancelButton = scene.add.sprite(500, 360, 'popup-buttons', 1)
        .setInteractive()
        .setDepth(1002)
        .setScale(1.5);
    
    const cancelText = scene.add.text(500, 360, 'Cancel', {
        fontSize: '20px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1003);
    
    // Store popup elements
    popupOverlay = {
        overlay,
        popupBg,
        titleText,
        messageText,
        okButton,
        okText,
        cancelButton,
        cancelText
    };
    
    // Close popup function
    const closePopup = () => {
        if (!popupActive) return;
        
        // Destroy all popup elements
        overlay.destroy();
        popupBg.destroy();
        titleText.destroy();
        messageText.destroy();
        okButton.destroy();
        okText.destroy();
        cancelButton.destroy();
        cancelText.destroy();
        
        popupOverlay = null;
        popupActive = false;
        
        // Reset game to beginning
        resetGame(scene);
    };
    
    // Button event handlers
    okButton.on('pointerdown', closePopup);
    okButton.on('pointerover', () => okButton.setTint(0xcccccc));
    okButton.on('pointerout', () => okButton.clearTint());
    
    cancelButton.on('pointerdown', closePopup);
    cancelButton.on('pointerover', () => cancelButton.setTint(0xcccccc));
    cancelButton.on('pointerout', () => cancelButton.clearTint());
}

function resetGame(scene) {
    // Reset to stage 1
    currentStage = 1;
    stageBackgrounds.bg1.setVisible(true);
    stageBackgrounds.bg2.setVisible(false);
    stageBackgrounds.bg3.setVisible(false);
    
    // Reset player position
    player.setPosition(100, 300);
    player.setVelocity(0, 0);
    
    // Remove old square dolls and create new ones
    destroySquareDolls();
    createSquareDollsForStage(scene, 1);
}

function switchToStage(scene, stageNumber) {
    currentStage = stageNumber;
    
    if (stageNumber === 2) {
        // Trigger celebration for completing stage 1
        startCelebration(scene);
        
        // Wait 2 seconds for celebration, then switch
        scene.time.delayedCall(2000, () => {
            // Switch to stage 2
            stageBackgrounds.bg1.setVisible(false);
            stageBackgrounds.bg2.setVisible(true);
            stageBackgrounds.bg3.setVisible(false);
            
            // Position player at left side
            player.setPosition(50, 300);
            player.setVelocity(0, 0);
            
            // Remove old square dolls and create new ones for stage 2
            destroySquareDolls();
            createSquareDollsForStage(scene, 2);
        });
    } else if (stageNumber === 3) {
        // Trigger celebration for completing stage 2
        startCelebration(scene);
        
        // Wait 2 seconds for celebration, then show interstitial
        scene.time.delayedCall(2000, () => {
            // Show interstitial
            showInterstitial(scene);
        });
    }
}

function createSquareDollsForStage(scene, stage) {
    // Create two square dolls for the current stage
    const positions = [
        { x: 250, y: 200 },
        { x: 550, y: 400 }
    ];
    
    squareDolls = [];
    
    positions.forEach(pos => {
        const doll = scene.matter.add.sprite(pos.x, pos.y, 'square-doll');
        doll.setFriction(0.5);
        doll.setMass(3); // Lighter than player so it can be pushed
        doll.setBounce(0.2);
        doll.setFixedRotation(); // Prevent rotation
        
        squareDolls.push(doll);
    });
}

function destroySquareDolls() {
    squareDolls.forEach(doll => {
        if (doll && doll.scene) {
            doll.destroy();
        }
    });
    squareDolls = [];
}

function showInterstitial(scene) {
    // Create full-screen interstitial
    const interstitial = scene.add.image(400, 300, 'interstitial').setDepth(2000);
    
    // After 3 seconds, remove interstitial and go back to stage 1
    scene.time.delayedCall(3000, () => {
        interstitial.destroy();
        resetGame(scene);
    });
}

function update() {
    // Update physics-based movement
    updatePhysicsMovement(this);
}


// Initialize game
const game = new Phaser.Game(gameConfig);
console.log('Physics Adventure game initialized');
