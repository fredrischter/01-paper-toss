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
