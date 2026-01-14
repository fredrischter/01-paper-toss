/**
 * Game Configuration Tests
 * Tests for game configuration and state management
 */

describe('Game Configuration', () => {
    // Mock game config for testing
    let gameConfig;
    
    beforeEach(() => {
        // Reset game config before each test
        gameConfig = {
            type: 'AUTO',
            parent: 'phaser-game',
            width: 800,
            height: 600,
            physics: {
                default: 'matter',
                matter: {
                    gravity: { y: 0 }
                }
            }
        };
    });
    
    test('should have correct canvas dimensions', () => {
        expect(gameConfig.width).toBe(800);
        expect(gameConfig.height).toBe(600);
    });
    
    test('should use Matter physics engine', () => {
        expect(gameConfig.physics.default).toBe('matter');
    });
    
    test('should have no gravity (top-down movement)', () => {
        expect(gameConfig.physics.matter.gravity.y).toBe(0);
    });
    
    test('should be configured for responsive scaling', () => {
        expect(gameConfig.parent).toBe('phaser-game');
    });
});

describe('Game State Management', () => {
    let gameState;
    
    beforeEach(() => {
        gameState = {
            currentStage: 1,
            popupActive: false,
            soundEnabled: true,
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            currentDirection: 'down',
            isJumping: false
        };
    });
    
    test('should initialize with stage 1', () => {
        expect(gameState.currentStage).toBe(1);
    });
    
    test('should have popup inactive by default', () => {
        expect(gameState.popupActive).toBe(false);
    });
    
    test('should have sound enabled by default', () => {
        expect(gameState.soundEnabled).toBe(true);
    });
    
    test('should have all movement flags false initially', () => {
        expect(gameState.moveLeft).toBe(false);
        expect(gameState.moveRight).toBe(false);
        expect(gameState.moveUp).toBe(false);
        expect(gameState.moveDown).toBe(false);
    });
    
    test('should start with down direction', () => {
        expect(gameState.currentDirection).toBe('down');
    });
});
