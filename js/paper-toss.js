// Paper Toss Game - Complete Implementation Based on GDD.MD
// Game Flow: Intro (7s) -> Gameplay (50s) -> End Screen (5s) -> Loop

// ============================================================================
// INTRO SCENE - Manager Animation Sequence (7 seconds)
// ============================================================================
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // Load all assets
        this.load.image('background', 'assets/images/background.png');
        this.load.image('trash_bin', 'assets/images/trash_bin.png');
        this.load.image('paper_ball', 'assets/images/paper_ball.png');
        this.load.image('hand_idle', 'assets/images/hand_idle.png');
        this.load.image('hand_back', 'assets/images/hand_back.png');
        this.load.image('hand_forward', 'assets/images/hand_forward.png');
        
        // Manager sprites (7 frames)
        for (let i = 1; i <= 7; i++) {
            this.load.image(`manager_large_0${i}`, `assets/images/manager_large_0${i}.png`);
        }
        
        this.load.image('speech_bubble', 'assets/images/speech_bubble.png');
        this.load.image('fan', 'assets/images/fan.png');
        this.load.image('wind_indicator', 'assets/images/wind_indicator.png');
        this.load.image('power_meter', 'assets/images/power_meter.png');
        this.load.image('score_panel', 'assets/images/score_panel.png');
        this.load.image('button_throw', 'assets/images/button_throw.png');
        this.load.image('success_effect', 'assets/images/success_effect.png');
    }

    create() {
        // Add office background
        this.add.image(960, 540, 'background');
        
        // Create manager sprite (large, 1400x1000, positioned at 260, 40)
        this.manager = this.add.image(-1400, 540, 'manager_large_01');
        this.manager.setScale(1);
        
        // Speech bubble (initially hidden)
        this.speechBubble = this.add.image(560, 100, 'speech_bubble').setVisible(false);
        this.speechText = this.add.text(560, 100, 'Prepare this report\nfor tomorrow!', {
            fontSize: '48px',
            fill: '#000000',
            align: 'center',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setVisible(false);
        
        // Start animation timeline
        this.startIntroAnimation();
    }

    startIntroAnimation() {
        // 0.0-1.0s: Manager enters from left
        this.tweens.add({
            targets: this.manager,
            x: 260,
            duration: 1000,
            ease: 'Power2'
        });
        
        // 1.0-2.5s: Speaking animation (alternating frames 02/03)
        this.time.delayedCall(1000, () => {
            this.manager.setTexture('manager_large_02');
            this.speakingInterval = this.time.addEvent({
                delay: 200,
                callback: () => {
                    const currentFrame = this.manager.texture.key;
                    if (currentFrame === 'manager_large_02') {
                        this.manager.setTexture('manager_large_03');
                    } else {
                        this.manager.setTexture('manager_large_02');
                    }
                },
                repeat: 6
            });
        });
        
        // 2.5-3.0s: Speech bubble appears
        this.time.delayedCall(2500, () => {
            if (this.speakingInterval) {
                this.speakingInterval.remove();
            }
            this.manager.setTexture('manager_large_01');
            this.speechBubble.setVisible(true);
            this.speechText.setVisible(true);
        });
        
        // 3.0-4.5s: Manager raises hand with papers (frames 04/05)
        this.time.delayedCall(3000, () => {
            this.manager.setTexture('manager_large_04');
            this.paperInterval = this.time.addEvent({
                delay: 300,
                callback: () => {
                    const currentFrame = this.manager.texture.key;
                    if (currentFrame === 'manager_large_04') {
                        this.manager.setTexture('manager_large_05');
                    } else {
                        this.manager.setTexture('manager_large_04');
                    }
                },
                repeat: 4
            });
        });
        
        // 4.5-5.5s: Manager shakes papers for emphasis (frame 06)
        this.time.delayedCall(4500, () => {
            if (this.paperInterval) {
                this.paperInterval.remove();
            }
            this.manager.setTexture('manager_large_06');
            this.shakeInterval = this.time.addEvent({
                delay: 150,
                callback: () => {
                    this.manager.x += (Math.random() > 0.5 ? 10 : -10);
                },
                repeat: 6
            });
        });
        
        // 5.5-7.0s: Manager walks away to right (frame 07 slides out)
        this.time.delayedCall(5500, () => {
            if (this.shakeInterval) {
                this.shakeInterval.remove();
            }
            this.manager.x = 260;
            this.manager.setTexture('manager_large_07');
            
            this.tweens.add({
                targets: [this.manager, this.speechBubble, this.speechText],
                x: 2500,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => {
                    // Transition to gameplay
                    this.scene.start('GameScene');
                }
            });
        });
    }
}

// ============================================================================
// GAME SCENE - Main Gameplay (50 seconds)
// ============================================================================
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.timeRemaining = 60;
        this.windForce = 0;
        this.isPowerCharging = false;
        this.currentPower = 0;
        this.paperBalls = [];
        this.handAnimFrame = 0;
    }

    create() {
        // Add background
        this.add.image(960, 540, 'background');
        
        // Add trash bin (right side: x=1500, y=800)
        this.trashBin = this.add.image(1500, 800, 'trash_bin');
        this.physics.add.existing(this.trashBin, true); // Static body
        
        // Add fan (top center: x=960, y=200) - rotating
        this.fan = this.add.image(960, 200, 'fan');
        this.tweens.add({
            targets: this.fan,
            angle: 360,
            duration: 2000,
            repeat: -1
        });
        
        // Add hand (left side: x=300, y=540)
        this.hand = this.add.image(300, 540, 'hand_idle');
        
        // Start hand wind-up animation loop
        this.startHandAnimation();
        
        // Score display (top right: x=1700, y=50)
        this.scorePanel = this.add.image(1700, 50, 'score_panel');
        this.scoreText = this.add.text(1700, 50, 'Score: 0/5', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Timer (top left: x=100, y=50)
        this.timerText = this.add.text(100, 50, 'Time: 60', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        });
        
        // Wind indicator (bottom center: x=960, y=1000)
        this.windIndicator = this.add.image(960, 1000, 'wind_indicator');
        
        // Power meter (bottom center: x=960, y=900)
        this.powerMeterBg = this.add.rectangle(960, 900, 60, 200, 0x333333);
        this.powerMeterFill = this.add.rectangle(960, 1000, 56, 0, 0x00ff00);
        this.powerMeterFill.setOrigin(0.5, 1);
        
        // Throw button (bottom right: x=1650, y=900)
        this.throwButton = this.add.image(1650, 900, 'button_throw').setInteractive();
        this.throwButton.on('pointerdown', () => this.startCharging());
        this.throwButton.on('pointerup', () => this.throwPaper());
        
        // Initialize physics
        this.physics.world.gravity.y = 980; // Gravity: 980 pixels/second²
        
        // Start timer countdown
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        
        // Change wind every 3 seconds
        this.windEvent = this.time.addEvent({
            delay: 3000,
            callback: this.changeWind,
            callbackScope: this,
            loop: true
        });
        
        // Initial wind
        this.changeWind();
    }

    startHandAnimation() {
        // Continuous wind-up animation (1.5 second cycle)
        this.handAnimEvent = this.time.addEvent({
            delay: 50, // Update every 50ms
            callback: () => {
                this.handAnimFrame = (this.handAnimFrame + 1) % 30;
                
                if (this.handAnimFrame < 10) {
                    this.hand.setTexture('hand_back');
                } else if (this.handAnimFrame < 20) {
                    this.hand.setTexture('hand_forward');
                } else {
                    this.hand.setTexture('hand_back');
                }
            },
            loop: true
        });
    }

    changeWind() {
        // Random wind force between -200 and +200 px/s
        this.windForce = Phaser.Math.Between(-200, 200);
        
        // Update wind indicator
        if (this.windForce > 0) {
            this.windIndicator.setAngle(0); // Right
        } else {
            this.windIndicator.setAngle(180); // Left
        }
    }

    startCharging() {
        this.isPowerCharging = true;
        this.currentPower = 0;
    }

    throwPaper() {
        if (!this.isPowerCharging) return;
        
        this.isPowerCharging = false;
        
        // Create paper ball
        const paper = this.physics.add.sprite(300, 540, 'paper_ball');
        paper.setMass(10);
        
        // Calculate initial velocity based on power (0-100% = 400-1200 px/s)
        const velocity = 400 + (this.currentPower / 100) * 800;
        
        // Fixed 45-degree throw angle
        const angle = -45 * (Math.PI / 180);
        paper.setVelocity(
            Math.cos(angle) * velocity,
            Math.sin(angle) * velocity
        );
        
        this.paperBalls.push(paper);
        
        // Reset power meter
        this.currentPower = 0;
        this.powerMeterFill.height = 0;
        
        // Check collision with trash bin
        this.physics.add.overlap(paper, this.trashBin, () => {
            this.onPaperInBin(paper);
        });
    }

    onPaperInBin(paper) {
        // Score point
        this.score++;
        this.scoreText.setText(`Score: ${this.score}/5`);
        
        // Show success effect
        const effect = this.add.image(paper.x, paper.y, 'success_effect');
        this.tweens.add({
            targets: effect,
            alpha: 0,
            scale: 2,
            duration: 500,
            onComplete: () => effect.destroy()
        });
        
        // Remove paper
        paper.destroy();
        
        // Check win condition
        if (this.score >= 5) {
            this.endGame(true);
        }
    }

    updateTimer() {
        this.timeRemaining--;
        this.timerText.setText(`Time: ${this.timeRemaining}`);
        
        if (this.timeRemaining <= 0) {
            this.endGame(false);
        }
    }

    endGame(won) {
        // Stop all timers
        if (this.timerEvent) this.timerEvent.remove();
        if (this.windEvent) this.windEvent.remove();
        if (this.handAnimEvent) this.handAnimEvent.remove();
        
        // Transition to end scene
        this.scene.start('EndScene', { won: won, score: this.score });
    }

    update() {
        // Update power meter while charging
        if (this.isPowerCharging) {
            this.currentPower = Math.min(100, this.currentPower + 1.67); // 2 seconds to full
            this.powerMeterFill.height = (this.currentPower / 100) * 196;
            
            // Update color (green -> yellow -> red)
            if (this.currentPower < 50) {
                this.powerMeterFill.setFillStyle(0x00ff00);
            } else if (this.currentPower < 80) {
                this.powerMeterFill.setFillStyle(0xffff00);
            } else {
                this.powerMeterFill.setFillStyle(0xff0000);
            }
        }
        
        // Apply wind force to paper balls
        this.paperBalls.forEach(paper => {
            if (paper && paper.body) {
                paper.body.velocity.x += this.windForce * 0.016; // Apply wind
                paper.body.velocity.x *= 0.98; // Air resistance
                paper.body.velocity.y *= 0.98;
                
                // Remove if off screen
                if (paper.y > 1200 || paper.x < -100 || paper.x > 2020) {
                    paper.destroy();
                    this.paperBalls = this.paperBalls.filter(p => p !== paper);
                }
            }
        });
    }
}

// ============================================================================
// END SCENE - Success/Fail Screen (5 seconds)
// ============================================================================
class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    create(data) {
        const won = data.won;
        const score = data.score;
        
        // Add background
        this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.7);
        
        // Show result text
        if (won) {
            this.add.text(960, 400, 'Good Work!\nBoss is Happy!', {
                fontSize: '72px',
                fill: '#00ff00',
                align: 'center',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5);
        } else {
            this.add.text(960, 400, "Boss Won't Be Happy...", {
                fontSize: '72px',
                fill: '#ff0000',
                align: 'center',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5);
        }
        
        // Show score
        this.add.text(960, 600, `Score: ${score}/5`, {
            fontSize: '56px',
            fill: '#ffffff',
            align: 'center',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Auto-restart after 3 seconds
        this.time.delayedCall(3000, () => {
            this.scene.start('IntroScene');
        });
    }
}

// ============================================================================
// GAME CONFIGURATION
// ============================================================================
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Set in GameScene
            debug: false
        }
    },
    scene: [IntroScene, GameScene, EndScene]
};

// Start the game
const game = new Phaser.Game(config);
