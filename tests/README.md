# Game POC - Automated Testing Documentation

## Overview

This test suite provides comprehensive coverage of the game's logic, physics, and mechanics. Tests are written using Jest and validate core assumptions about the game's behavior.

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

## Test Structure

### 1. Configuration Tests (`tests/config.test.js`)
Tests game configuration and state management:
- Canvas dimensions (800x600)
- Matter.js physics engine usage
- Zero gravity for top-down movement
- Initial game state values
- Default settings (sound, popup, stage)

**Key Assertions:**
- ✓ Correct canvas size
- ✓ Matter physics enabled
- ✓ No gravity (y: 0)
- ✓ Stage starts at 1
- ✓ Popup inactive by default

### 2. Stage Management Tests (`tests/stage.test.js`)
Tests multi-stage system and transitions:
- Stage initialization
- Stage transitions (1→2→3→1)
- Background visibility switching
- Player repositioning on stage changes
- Edge detection triggers

**Key Assertions:**
- ✓ 3 total stages
- ✓ Left edge triggers popup (-20 threshold)
- ✓ Right edge triggers stage transition (820 threshold)
- ✓ Player repositioned correctly per stage
- ✓ Background visibility managed properly

### 3. Physics Tests (`tests/physics.test.js`)
Tests Matter.js physics implementation:
- Player and doll mass configuration
- Collision and pushing mechanics
- Movement damping
- Doll cleanup and recreation
- Top-down movement (no gravity)

**Key Assertions:**
- ✓ Player mass (10) > Doll mass (3)
- ✓ Fixed rotation prevents spinning
- ✓ Velocity damping for smooth control
- ✓ 2 dolls created per stage
- ✓ Dolls destroyed and recreated on transitions

### 4. Popup Tests (`tests/popup.test.js`)
Tests popup overlay functionality:
- Popup activation triggers
- Element structure and content
- Button behavior (OK/Cancel)
- Input blocking during popup
- Game reset on close

**Key Assertions:**
- ✓ Popup appears on left edge exit
- ✓ Correct text content
- ✓ OK and Cancel have same behavior
- ✓ Semi-transparent overlay (0.7 alpha)
- ✓ Player movement blocked when active

### 5. Animation Tests (`tests/animation.test.js`)
Tests sprite animation system:
- Frame counts (65 total frames)
- Animation state machine
- Direction transitions
- Walk/stand animation selection

**Key Assertions:**
- ✓ 1 standing frame
- ✓ 8 frames × 4 directions for walking (32 frames)
- ✓ 8 frames × 4 directions for jumping (32 frames)
- ✓ Correct animation based on velocity
- ✓ Direction updates based on input

### 6. Input Tests (`tests/input.test.js`)
Tests keyboard and touch input handling:
- Arrow key support
- WASD key support
- Mobile D-pad controls
- Input combination logic
- Mobile device detection
- Key caching optimization

**Key Assertions:**
- ✓ Arrow keys and WASD both work
- ✓ Mobile controls appear on mobile devices
- ✓ Input properly combined (keyboard + touch)
- ✓ WASD keys cached to avoid recreation
- ✓ Mobile detection regex works correctly

## Test Coverage

### Core Game Logic
- ✓ Configuration management
- ✓ State transitions
- ✓ Physics calculations
- ✓ Animation selection
- ✓ Input processing
- ✓ Popup logic

### Physics System
- ✓ Mass-based pushing
- ✓ Collision detection
- ✓ Velocity damping
- ✓ Fixed rotation
- ✓ Top-down movement

### Multi-Stage System
- ✓ Stage transitions
- ✓ Background switching
- ✓ Player repositioning
- ✓ Doll recreation
- ✓ Edge detection

### UI Components
- ✓ Popup overlay
- ✓ Button interactions
- ✓ Mobile controls
- ✓ Input blocking

## Validation Points

### Physics Validation
1. **Mass Difference**: Player (10) can push dolls (3) ✓
2. **No Gravity**: Gravity Y = 0 for top-down movement ✓
3. **Damping**: Velocity reduced by 0.9 when no input ✓
4. **Fixed Rotation**: Objects don't spin ✓

### Stage Validation
1. **Edge Thresholds**: Left (-20), Right (820) ✓
2. **Stage Count**: 3 stages total ✓
3. **Interstitial**: Stage 3 returns to stage 1 ✓
4. **Dolls**: 2 per stage, recreated on transition ✓

### Animation Validation
1. **Frame Count**: 65 total frames (1+32+32) ✓
2. **Directions**: 4 directions supported ✓
3. **State Machine**: Correct animation per state ✓
4. **Transitions**: Smooth direction changes ✓

### Input Validation
1. **Dual Controls**: Arrow + WASD both work ✓
2. **Mobile Detection**: Regex correctly identifies devices ✓
3. **Touch Controls**: D-pad + action button ✓
4. **Optimization**: Keys cached, not recreated ✓

## Expected Test Results

When all tests pass, you should see:

```
PASS  tests/config.test.js
PASS  tests/stage.test.js
PASS  tests/physics.test.js
PASS  tests/popup.test.js
PASS  tests/animation.test.js
PASS  tests/input.test.js

Test Suites: 6 passed, 6 total
Tests:       XX passed, XX total
Snapshots:   0 total
Time:        X.XXXs
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Testing Best Practices

1. **Isolated Tests**: Each test is independent
2. **Clear Assertions**: Each test has clear expected outcomes
3. **Descriptive Names**: Test names explain what is being tested
4. **Organized**: Tests grouped by feature/component
5. **Fast**: All tests run quickly (< 10 seconds total)

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test
  
- name: Generate Coverage
  run: npm run test:coverage
```

## Future Test Additions

Potential areas for expanded testing:
- E2E tests with Playwright/Puppeteer
- Performance benchmarks
- Visual regression tests
- Sound system tests
- Spritesheet generation tests
