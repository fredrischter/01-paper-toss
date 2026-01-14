# Sprite Generation Guide

This document explains how sprites are generated and used in the Game POC.

## Overview

All game sprites are **pre-generated as PNG files** stored in the `assets/` directory. They are **not** generated at runtime. This approach provides:

- ✅ Better performance (no runtime canvas operations)
- ✅ Easier asset management and version control
- ✅ Ability to edit sprites with image editors
- ✅ Consistent appearance across runs
- ✅ Faster game loading

## Directory Structure

```
assets/
├── spritesheets/          # Spritesheets with multiple frames
│   ├── character.png      # 65-frame character spritesheet
│   ├── ui-buttons.png     # 7-frame UI buttons
│   └── popup-buttons.png  # 2-frame popup buttons
└── images/                # Single images
    ├── stage1-bg.png      # Stage 1 background
    ├── stage2-bg.png      # Stage 2 background
    ├── stage3-bg.png      # Stage 3 background
    ├── popup-bg.png       # Popup overlay background
    ├── square-doll.png    # Square doll sprite
    ├── interstitial.png   # Interstitial screen
    ├── particle-smoke.png      # Smoke particle (8x8)
    ├── particle-spark.png      # Spark particle (6x6)
    ├── particle-confetti.png   # Confetti particle (10x10)
    ├── particle-confetti1.png  # Confetti variation 1
    ├── particle-confetti2.png  # Confetti variation 2
    ├── particle-confetti3.png  # Confetti variation 3
    └── particle-confetti4.png  # Confetti variation 4
```

## Generating Sprites

### Prerequisites

```bash
npm install
```

This installs the `canvas` package needed for sprite generation.

### Generate All Sprites

```bash
npm run generate-sprites
```

This runs `scripts/generate-sprites.js` which creates all PNG files.

### What Gets Generated

#### 1. Character Spritesheet (`character.png`)
- **Dimensions**: 2080×48 pixels (65 frames × 32px width)
- **Frame size**: 32×48 pixels
- **Total frames**: 65
  - Frame 0: Standing (1 frame, facing down)
  - Frames 1-32: Walking in 4 directions (8 frames each)
    - Down-facing (front view)
    - Left-facing (side view)
    - Right-facing (side view)
    - Up-facing (back view)
  - Frames 33-64: Jumping in 4 directions (8 frames each)
    - Same directional facing as walking animations
  
**Directional Visuals**: Each direction has a distinct visual appearance:
- **Down (front)**: Shows character's face with two eyes, arms on both sides
- **Up (back)**: Shows back of head with hair detail, no face visible
- **Left (side)**: Profile view with one eye visible, one arm showing
- **Right (side)**: Profile view facing right with one eye visible, one arm showing

#### 2. UI Buttons Spritesheet (`ui-buttons.png`)
- **Dimensions**: 448×64 pixels (7 frames × 64px width)
- **Frame size**: 64×64 pixels
- **Frames**:
  - 0: Menu button (hamburger icon)
  - 1: Sound button (speaker icon)
  - 2: D-pad Up arrow
  - 3: D-pad Down arrow
  - 4: D-pad Left arrow
  - 5: D-pad Right arrow
  - 6: Action button (circle)

#### 3. Popup Buttons Spritesheet (`popup-buttons.png`)
- **Dimensions**: 180×50 pixels (2 frames × 90px width)
- **Frame size**: 90×50 pixels
- **Frames**:
  - 0: OK button (green)
  - 1: Cancel button (red)

#### 4. Stage Backgrounds
- **Dimensions**: 800×600 pixels each
- **Files**:
  - `stage1-bg.png`: Green gradient with decorative elements
  - `stage2-bg.png`: Brown/orange gradient
  - `stage3-bg.png`: Purple gradient

#### 5. Other Images
- `popup-bg.png`: 500×300 popup background with border
- `square-doll.png`: 50×50 red square doll with face
- `interstitial.png`: 800×600 radial gradient transition screen

#### 6. Particle Textures
- **Purpose**: Used for visual effects
- **Files**:
  - `particle-smoke.png`: 8×8 gray smoke puff (running effect)
  - `particle-spark.png`: 6×6 yellow/orange star (collision effect)
  - `particle-confetti.png`: 10×10 colorful square (celebration)
  - `particle-confetti1.png` to `particle-confetti4.png`: Variations with different shapes and colors

**Particle Effects**:
- **Smoke**: Emitted behind character while running
- **Sparks**: Appear when character collides with dolls
- **Celebration**: Shower of confetti when completing a stage

## How Sprites Are Loaded

In `js/preload.js`:

```javascript
function preload() {
    // Load spritesheets
    this.load.spritesheet('player', 'assets/spritesheets/character.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    
    this.load.spritesheet('ui-buttons', 'assets/spritesheets/ui-buttons.png', {
        frameWidth: 64,
        frameHeight: 64
    });
    
    // Load images
    this.load.image('bg-stage1', 'assets/images/stage1-bg.png');
    this.load.image('square-doll', 'assets/images/square-doll.png');
    // ... etc
}
```

## Customizing Sprites

### Option 1: Modify Generation Script

Edit `scripts/generate-sprites.js` to change:
- Colors
- Sizes
- Shapes
- Animation frames
- Any visual aspect

Then regenerate:
```bash
npm run generate-sprites
```

### Option 2: Edit PNG Files Directly

Use any image editor (GIMP, Photoshop, Aseprite, etc.) to edit the PNG files in `assets/` directories.

**Important for spritesheets**: Maintain the correct frame size and layout:
- `character.png`: 65 frames horizontally, each 32×48px
- `ui-buttons.png`: 7 frames horizontally, each 64×64px
- `popup-buttons.png`: 2 frames horizontally, each 90×50px

### Option 3: Replace with Your Own Art

Create your own PNG files with the same dimensions and filenames, or update the preload.js to match your new asset structure.

## Frame Mapping

### Character Animation Frames

```
Frame 0: Standing (facing down/front)

Walking Animations:
Frames 1-8:   Walk Down (front view - face visible, both arms)
Frames 9-16:  Walk Left (side view - left profile, one eye)
Frames 17-24: Walk Right (side view - right profile, one eye)  
Frames 25-32: Walk Up (back view - hair visible, no face)

Jumping Animations:
Frames 33-40: Jump Down (front view)
Frames 41-48: Jump Left (side view - left profile)
Frames 49-56: Jump Right (side view - right profile)
Frames 57-64: Jump Up (back view)
```

**Directional Features**:
- Each direction shows a different view of the character
- Walking animations include leg movement
- Jumping animations include vertical displacement
- Direction transitions are handled by the animation system

### UI Buttons Frames

```
Frame 0: Menu (hamburger)
Frame 1: Sound (speaker)
Frame 2: D-pad Up
Frame 3: D-pad Down
Frame 4: D-pad Left
Frame 5: D-pad Right
Frame 6: Action button
```

## Version Control

All generated PNG files are **committed to the repository**. This ensures:
- Consistent assets across different environments
- No need to run generation on deployment
- Easy to see visual changes in git diffs (with LFS or similar tools)

## Production Deployment

No build step required! The PNG files are ready to use:

1. The `assets/` directory is already populated
2. Just deploy the entire `game-poc/` folder
3. Serve via any static web server

## Optimization

### Current File Sizes

```
character.png:      ~2.3 KB
ui-buttons.png:     ~3.3 KB
popup-buttons.png:  ~0.3 KB
stage1-bg.png:      ~5.1 KB
stage2-bg.png:      ~4.9 KB
stage3-bg.png:      ~4.9 KB
popup-bg.png:       ~1.4 KB
square-doll.png:    ~0.5 KB
interstitial.png:   ~85 KB
----------------------------
Total:              ~108 KB
```

### Further Optimization

For production, you can:

1. **Optimize PNGs**: Use tools like `pngcrush`, `optipng`, or `imagemin`
   ```bash
   npm install -g imagemin-cli
   imagemin assets/**/*.png --out-dir=assets-optimized
   ```

2. **Use Sprite Atlases**: Combine multiple spritesheets into one atlas
   
3. **Compress**: Use WebP format for better compression
   ```bash
   cwebp input.png -o output.webp
   ```

4. **Lazy Load**: Load stage backgrounds only when needed

## Troubleshooting

### Sprites Not Showing

1. Check browser console for loading errors
2. Verify PNG files exist in `assets/` directories
3. Check file paths in `preload.js` are correct
4. Ensure web server serves static files from `assets/`

### Need to Regenerate

```bash
# Delete old assets
rm -rf assets/spritesheets/* assets/images/*

# Regenerate
npm run generate-sprites
```

### Canvas Package Issues

If `npm install` fails for `canvas`:

```bash
# On Ubuntu/Debian
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# On macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg

# Then retry
npm install canvas
```

## Migration from Procedural Generation

The original POC generated sprites at runtime. This has been replaced with pre-generated PNG files for better performance and maintainability.

If you need to revert to procedural generation, see `to-remove.txt` in the `.github/copilot-instructions/` folder.

## Related Documentation

- `/README.md` - Main project documentation
- `/.github/copilot-instructions/requirements.txt` - Full requirements
- `/.github/copilot-instructions/implementation-guidelines.txt` - Implementation patterns
- `/tests/README.md` - Testing documentation
