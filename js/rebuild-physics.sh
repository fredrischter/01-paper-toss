#!/bin/bash
# Special rebuild for physics-adventure with physics-impl.js

# Create boot scene
cat > temp-boot.js << 'BOOTEOF'
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

BOOTEOF

# Create new game-all.js
cat temp-boot.js > game-all-new.js
echo "" >> game-all-new.js
cat config.js >> game-all-new.js
echo "" >> game-all-new.js
cat physics-impl.js >> game-all-new.js
echo "" >> game-all-new.js
cat preload.js >> game-all-new.js
echo "" >> game-all-new.js
cat create.js >> game-all-new.js
echo "" >> game-all-new.js
cat update.js >> game-all-new.js
echo "" >> game-all-new.js

cat >> game-all-new.js << 'GAMEEOF'

// Initialize game
const game = new Phaser.Game(gameConfig);
console.log('Physics Adventure game initialized');
GAMEEOF

# Replace old file
mv game-all-new.js game-all.js
rm temp-boot.js
echo "Physics Adventure game-all.js rebuilt successfully"
