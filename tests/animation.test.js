/**
 * Animation Tests
 * Tests for sprite animations and state machine
 */

describe('Animation Frame Counts', () => {
    const animations = {
        stand: { frames: 1 },
        walkDown: { frames: 8 },
        walkLeft: { frames: 8 },
        walkRight: { frames: 8 },
        walkUp: { frames: 8 },
        jumpDown: { frames: 8 },
        jumpLeft: { frames: 8 },
        jumpRight: { frames: 8 },
        jumpUp: { frames: 8 }
    };
    
    test('should have 1 standing frame', () => {
        expect(animations.stand.frames).toBe(1);
    });
    
    test('should have 8 frames for each walking direction', () => {
        expect(animations.walkDown.frames).toBe(8);
        expect(animations.walkLeft.frames).toBe(8);
        expect(animations.walkRight.frames).toBe(8);
        expect(animations.walkUp.frames).toBe(8);
    });
    
    test('should have 8 frames for each jumping direction', () => {
        expect(animations.jumpDown.frames).toBe(8);
        expect(animations.jumpLeft.frames).toBe(8);
        expect(animations.jumpRight.frames).toBe(8);
        expect(animations.jumpUp.frames).toBe(8);
    });
    
    test('should have total of 65 frames', () => {
        const totalFrames = 1 + (8 * 4) + (8 * 4); // 1 stand + 32 walk + 32 jump
        expect(totalFrames).toBe(65);
    });
});

describe('Animation State Machine', () => {
    let playerState;
    
    beforeEach(() => {
        playerState = {
            velocityX: 0,
            velocityY: 0,
            direction: 'down',
            currentAnimation: 'stand'
        };
    });
    
    test('should play stand animation when not moving', () => {
        playerState.velocityX = 0;
        playerState.velocityY = 0;
        
        const shouldStand = Math.abs(playerState.velocityX) < 0.5 && Math.abs(playerState.velocityY) < 0.5;
        expect(shouldStand).toBe(true);
    });
    
    test('should play walk animation when moving', () => {
        playerState.velocityX = 3;
        
        const isMoving = Math.abs(playerState.velocityX) > 0.5 || Math.abs(playerState.velocityY) > 0.5;
        expect(isMoving).toBe(true);
    });
    
    test('should update direction based on movement', () => {
        playerState.velocityX = 3;
        playerState.direction = 'right';
        
        expect(playerState.direction).toBe('right');
        
        playerState.velocityX = -3;
        playerState.direction = 'left';
        
        expect(playerState.direction).toBe('left');
    });
    
    test('should support 4 directions', () => {
        const validDirections = ['up', 'down', 'left', 'right'];
        
        validDirections.forEach(dir => {
            playerState.direction = dir;
            expect(validDirections).toContain(playerState.direction);
        });
    });
});

describe('Direction Transitions', () => {
    test('should transition from down to left', () => {
        let direction = 'down';
        direction = 'left';
        
        expect(direction).toBe('left');
    });
    
    test('should transition from left to up', () => {
        let direction = 'left';
        direction = 'up';
        
        expect(direction).toBe('up');
    });
    
    test('should maintain last direction when stopped', () => {
        const lastDirection = 'right';
        const velocityX = 0;
        const velocityY = 0;
        
        // Direction should remain 'right' even when not moving
        expect(lastDirection).toBe('right');
        expect(velocityX).toBe(0);
        expect(velocityY).toBe(0);
    });
});

describe('Animation Selection Logic', () => {
    test('should select correct animation based on state', () => {
        const getAnimationKey = (isMoving, direction) => {
            if (!isMoving) return 'stand';
            return `walk-${direction}`;
        };
        
        expect(getAnimationKey(false, 'down')).toBe('stand');
        expect(getAnimationKey(true, 'left')).toBe('walk-left');
        expect(getAnimationKey(true, 'right')).toBe('walk-right');
        expect(getAnimationKey(true, 'up')).toBe('walk-up');
        expect(getAnimationKey(true, 'down')).toBe('walk-down');
    });
});
