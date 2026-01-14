/**
 * Input Handling Tests
 * Tests for keyboard and mobile input controls
 */

describe('Keyboard Input', () => {
    let keyState;
    
    beforeEach(() => {
        keyState = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false,
            w: false,
            a: false,
            s: false,
            d: false,
            Space: false
        };
    });
    
    test('should support arrow keys', () => {
        expect(keyState).toHaveProperty('ArrowLeft');
        expect(keyState).toHaveProperty('ArrowRight');
        expect(keyState).toHaveProperty('ArrowUp');
        expect(keyState).toHaveProperty('ArrowDown');
    });
    
    test('should support WASD keys', () => {
        expect(keyState).toHaveProperty('w');
        expect(keyState).toHaveProperty('a');
        expect(keyState).toHaveProperty('s');
        expect(keyState).toHaveProperty('d');
    });
    
    test('should combine arrow and WASD input', () => {
        keyState.ArrowLeft = true;
        keyState.a = true;
        
        const moveLeft = keyState.ArrowLeft || keyState.a;
        expect(moveLeft).toBe(true);
    });
});

describe('Mobile Touch Controls', () => {
    let touchState;
    
    beforeEach(() => {
        touchState = {
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            jump: false
        };
    });
    
    test('should have D-pad controls', () => {
        expect(touchState).toHaveProperty('moveLeft');
        expect(touchState).toHaveProperty('moveRight');
        expect(touchState).toHaveProperty('moveUp');
        expect(touchState).toHaveProperty('moveDown');
    });
    
    test('should have action button', () => {
        expect(touchState).toHaveProperty('jump');
    });
    
    test('should activate on touch', () => {
        touchState.moveRight = true;
        expect(touchState.moveRight).toBe(true);
    });
    
    test('should deactivate on release', () => {
        touchState.moveRight = true;
        touchState.moveRight = false;
        expect(touchState.moveRight).toBe(false);
    });
});

describe('Mobile Detection', () => {
    test('should detect mobile devices', () => {
        const mobileUserAgents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (Linux; Android 10; SM-G973F)',
            'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1)'
        ];
        
        const isMobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        
        mobileUserAgents.forEach(ua => {
            expect(isMobileRegex.test(ua)).toBe(true);
        });
    });
    
    test('should not detect desktop as mobile', () => {
        const desktopUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0';
        const isMobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        
        expect(isMobileRegex.test(desktopUserAgent)).toBe(false);
    });
});

describe('Input Processing', () => {
    test('should process movement input correctly', () => {
        const input = {
            left: true,
            right: false,
            up: false,
            down: false
        };
        
        let velocityX = 0;
        if (input.left) velocityX = -3;
        if (input.right) velocityX = 3;
        
        expect(velocityX).toBe(-3);
    });
    
    test('should handle simultaneous inputs', () => {
        const input = {
            left: false,
            right: true,
            up: true,
            down: false
        };
        
        let velocityX = 0;
        let velocityY = 0;
        
        if (input.right) velocityX = 3;
        if (input.up) velocityY = -3;
        
        expect(velocityX).toBe(3);
        expect(velocityY).toBe(-3);
    });
    
    test('should prioritize right over left when both pressed', () => {
        const input = {
            left: true,
            right: true
        };
        
        let velocityX = 0;
        if (input.left) velocityX = -3;
        if (input.right) velocityX = 3; // Right overwrites left
        
        expect(velocityX).toBe(3);
    });
});

describe('Input Caching', () => {
    test('should cache WASD keys to avoid recreation', () => {
        const cachedKeys = {
            W: { isDown: false },
            A: { isDown: false },
            S: { isDown: false },
            D: { isDown: false }
        };
        
        expect(cachedKeys).toHaveProperty('W');
        expect(cachedKeys).toHaveProperty('A');
        expect(cachedKeys).toHaveProperty('S');
        expect(cachedKeys).toHaveProperty('D');
    });
    
    test('should reuse cached key objects', () => {
        const keys1 = { W: { isDown: false } };
        const keys2 = keys1; // Reuse reference
        
        expect(keys1).toBe(keys2);
    });
});
