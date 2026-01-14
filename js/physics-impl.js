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
