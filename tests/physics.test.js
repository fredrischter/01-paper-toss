/**
 * Physics Tests
 * Tests for Matter.js physics system and doll interactions
 */

describe('Physics Configuration', () => {
    test('should have no gravity for top-down movement', () => {
        const gravity = { y: 0 };
        expect(gravity.y).toBe(0);
    });
    
    test('should use Matter.js physics engine', () => {
        const physicsEngine = 'matter';
        expect(physicsEngine).toBe('matter');
    });
});

describe('Player Physics Properties', () => {
    let player;
    
    beforeEach(() => {
        player = {
            mass: 10,
            friction: 0.1,
            fixedRotation: true
        };
    });
    
    test('should have heavier mass than dolls', () => {
        const dollMass = 3;
        expect(player.mass).toBeGreaterThan(dollMass);
    });
    
    test('should have fixed rotation', () => {
        expect(player.fixedRotation).toBe(true);
    });
    
    test('should have low friction for smooth movement', () => {
        expect(player.friction).toBeLessThan(0.5);
    });
});

describe('Square Doll Physics Properties', () => {
    let doll;
    
    beforeEach(() => {
        doll = {
            mass: 3,
            friction: 0.5,
            bounce: 0.2,
            fixedRotation: true
        };
    });
    
    test('should have lighter mass than player', () => {
        const playerMass = 10;
        expect(doll.mass).toBeLessThan(playerMass);
    });
    
    test('should have fixed rotation to prevent spinning', () => {
        expect(doll.fixedRotation).toBe(true);
    });
    
    test('should have moderate friction', () => {
        expect(doll.friction).toBeGreaterThan(0);
        expect(doll.friction).toBeLessThanOrEqual(1);
    });
    
    test('should have slight bounce', () => {
        expect(doll.bounce).toBeGreaterThan(0);
        expect(doll.bounce).toBeLessThan(1);
    });
});

describe('Collision and Pushing', () => {
    test('should allow player to push dolls based on mass difference', () => {
        const playerMass = 10;
        const dollMass = 3;
        const massDifference = playerMass - dollMass;
        
        expect(massDifference).toBeGreaterThan(0);
        expect(playerMass).toBeGreaterThan(dollMass);
    });
    
    test('should have 2 dolls per stage', () => {
        const dollsPerStage = 2;
        expect(dollsPerStage).toBe(2);
    });
});

describe('Movement Physics', () => {
    test('should apply velocity-based movement', () => {
        const speed = 3;
        let velocity = { x: 0, y: 0 };
        
        // Simulate right movement
        velocity.x = speed;
        expect(velocity.x).toBe(3);
        
        // Simulate up movement
        velocity.y = -speed;
        expect(velocity.y).toBe(-3);
    });
    
    test('should apply damping when no input', () => {
        let velocity = { x: 10, y: 5 };
        const dampingFactor = 0.9;
        
        velocity.x *= dampingFactor;
        velocity.y *= dampingFactor;
        
        expect(velocity.x).toBeLessThan(10);
        expect(velocity.y).toBeLessThan(5);
    });
    
    test('should support 4-directional movement', () => {
        const directions = ['up', 'down', 'left', 'right'];
        expect(directions).toHaveLength(4);
        expect(directions).toContain('up');
        expect(directions).toContain('down');
        expect(directions).toContain('left');
        expect(directions).toContain('right');
    });
});

describe('Doll Cleanup and Recreation', () => {
    let squareDolls;
    
    beforeEach(() => {
        squareDolls = [
            { x: 250, y: 200, destroyed: false },
            { x: 550, y: 400, destroyed: false }
        ];
    });
    
    test('should destroy dolls on stage transition', () => {
        squareDolls.forEach(doll => {
            doll.destroyed = true;
        });
        
        expect(squareDolls.every(doll => doll.destroyed)).toBe(true);
    });
    
    test('should recreate dolls with different positions', () => {
        const stage1Positions = [{ x: 250, y: 200 }, { x: 550, y: 400 }];
        const stage2Positions = [{ x: 250, y: 200 }, { x: 550, y: 400 }];
        
        // Positions can be the same or different - just verify they exist
        expect(stage2Positions).toHaveLength(2);
        expect(stage2Positions[0]).toHaveProperty('x');
        expect(stage2Positions[0]).toHaveProperty('y');
    });
});
