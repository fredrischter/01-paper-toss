# Game Design Document: Paper Toss!

## Game Overview
A casual physics-based mobile game where players throw paper balls into office trash bins with wind mechanics and precise trajectory controls.

## Technical Specifications

### Platform & Orientation
- **Platform**: Mobile (primary), Desktop fullscreen (secondary)
- **Orientation**: Horizontal (Landscape)
- **Screen Resolution**: 1920x1080 (16:9 aspect ratio)
- **Target Devices**: Mobile phones, tablets, desktop browsers

### Image Assets & Specifications

All images are PNG format with transparency where applicable.

| Asset Name | Size (px) | Description |
|------------|-----------|-------------|
| `background.png` | 1920x1080 | Office environment background |
| `trash_bin.png` | 200x300 | Target trash bin sprite |
| `paper_ball.png` | 64x64 | Paper ball projectile |
| `hand_idle.png` | 150x150 | Hand in neutral position |
| `hand_back.png` | 150x150 | Hand pulled back (wind-up) |
| `hand_forward.png` | 150x150 | Hand extended forward (release) |
| `manager_large_01.png` | 1400x1000 | Manager full body - entering/neutral pose |
| `manager_large_02.png` | 1400x1000 | Manager - mouth open speaking frame 1 |
| `manager_large_03.png` | 1400x1000 | Manager - mouth open speaking frame 2 |
| `manager_large_04.png` | 1400x1000 | Manager - hand raised with papers frame 1 |
| `manager_large_05.png` | 1400x1000 | Manager - hand raised with papers frame 2 |
| `manager_large_06.png` | 1400x1000 | Manager - shaking papers emphasizing |
| `manager_large_07.png` | 1400x1000 | Manager - walking away pose |
| `speech_bubble.png` | 800x200 | Large speech bubble for manager dialogue |
| `fan.png` | 180x180 | Rotating office fan |
| `wind_indicator.png` | 100x40 | Wind direction arrow |
| `power_meter.png` | 60x200 | Vertical power meter bar |
| `score_panel.png` | 400x100 | Score display background |
| `button_throw.png` | 180x180 | Throw button (circular) |
| `success_effect.png` | 256x256 | Success particle effect |

## Game Flow (1-Minute Demo)

### 1. Intro Sequence (7 seconds - Story setup with detailed animation)
- Office background fades in
- **Manager appears large on screen** (covering 70% of screen area, 1400x1000):
  
  **Animation Timeline:**
  - **0.0-0.5s**: Manager enters from left (manager_large_01.png slides in)
  - **0.5-1.0s**: Manager stops center screen, facing player
  - **1.0-2.5s**: Manager speaks - animated dialogue (alternating frames):
    - Frame manager_large_02.png (0.2s) - mouth open
    - Frame manager_large_03.png (0.2s) - mouth wider
    - Repeat 3 times for speaking animation
  - **2.5-3.0s**: Speech bubble appears above manager: **"Prepare this report for tomorrow!"**
  - **3.0-4.5s**: Manager raises hand with papers (alternating frames):
    - Frame manager_large_04.png (0.3s) - hand raising
    - Frame manager_large_05.png (0.3s) - hand higher
    - Repeat 2-3 times
  - **4.5-5.5s**: Manager shakes papers for emphasis:
    - Frame manager_large_06.png - rapid shake animation (0.15s intervals)
  - **5.5-6.5s**: Manager walks away to right (manager_large_07.png slides out)
  - **6.5-7.0s**: Camera zooms/transitions to desk with hand visible
  
- **Manager positioned**: Centered at (260, 40) - takes up most of screen
- **No player input required** - Full cinematic intro auto-advances to gameplay

### 2. Game Screen (Main Gameplay - 50 seconds)
- **Layout**:
  - Left side: Hand position (x: 300, y: 540)
  - Right side: Trash bin (x: 1500, y: 800)
  - Top center: Fan rotating (x: 960, y: 200)
  - Top right: Score display (x: 1700, y: 50)
  - Top left: Timer (x: 100, y: 50)
  - Bottom right: Throw button (x: 1650, y: 900)
  - Bottom center: Power meter (x: 960, y: 900)

- **Controls**: 
  - **ONE BUTTON**: Throw button (hold and release)
  - Press and hold button to charge throw power
  - Hand animates back-and-forth continuously (wind-up motion)
  - Power meter fills while button is held
  - Release button to throw at current power level
  
- **Mechanics**:
  1. Hand continuously animates in wind-up motion (even when not throwing)
  2. Player holds throw button to charge power (max 2 seconds)
  3. Power meter shows current throw strength (0-100%)
  4. Release button triggers throw with charged power
  5. Wind from fan affects ball mid-flight (random direction every 3 seconds)
  6. Score +1 if ball lands in bin
  7. Hand returns to wind-up animation, ready for next throw
  
- **Win Condition**: Score 5 points in 1 minute
- **Lose Condition**: Time runs out with score < 5

### 3. End Screen (5 seconds)
- **Success Screen** (if won):
  - Display: "Good Work! Boss is Happy!"
  - Show: Score X/5
  - Auto-restart after 3 seconds
  
- **Fail Screen** (if lost):
  - Display: "Boss Won't Be Happy..."
  - Show: Score X/5
  - Auto-restart after 3 seconds

- **Transition**: Fade back to Intro Sequence (full loop)

## Game Elements Detail

### Physics Parameters
```
Gravity: 980 pixels/second²
Initial Velocity: Based on power meter (0-100% = 400-1200 px/s)
Wind Force: Random between -200 to +200 px/s horizontal
Air Resistance: 0.98 multiplier per frame
Ball Mass: 10 (for physics calculations)
Throw Angle: Fixed at 45 degrees upward
```

### Manager Animation System
```
Intro Sequence Animation (7 seconds total):

ENTRANCE (0.0-1.0s):
  - manager_large_01.png slides in from left
  - Position: x starts at -1400, slides to 260
  - Manager fills 70% of screen (1400x1000)

SPEAKING (1.0-2.5s):
  - Alternate between frames for talking animation
  - Frame sequence: 02 → 03 → 02 → 03 → 02 → 03
  - Each frame: 0.2 seconds
  - Creates natural speaking motion

DIALOGUE (2.5-3.0s):
  - Speech bubble appears at (560, 100)
  - Large size: 800x200 to match manager scale
  - Text: "Prepare this report for tomorrow!"

PAPER GESTURE (3.0-4.5s):
  - Hand raising animation with papers
  - Alternate: 04 → 05 → 04 → 05 → 04
  - Each frame: 0.3 seconds
  - Papers visible in hand

EMPHASIS (4.5-5.5s):
  - manager_large_06.png for shake effect
  - Rapid position shifts (±10px horizontal)
  - 0.15 second intervals
  - Creates urgent shaking motion

EXIT (5.5-7.0s):
  - manager_large_07.png slides out to right
  - Position: x=260 slides to x=1920
  - Fade out as exits
```

### Hand Animation System
```
Wind-up Animation Loop (continuous):
  - Frame 1-10: Hand pulls back (hand_back.png)
  - Frame 11-20: Hand moves forward (hand_forward.png)
  - Frame 21-30: Hand returns to back position
  - Cycle Duration: 1.5 seconds per full loop
  
Throw Trigger:
  - When button released, current frame determines slight angle variation
  - Hand completes throw animation
  - Returns to wind-up loop
```

### Visual Feedback
- Hand continuously animates in throwing motion
- Power meter fills during button hold (vertical bar, green to red gradient)
- Wind indicator arrow shows current wind direction
- Ball trail effect during flight
- Bounce effect on bin rim (if hit)
- Success particles when ball lands in bin
- Manager appears briefly at successful shots (thumbs up gesture)

### Audio Cues (Optional)
- Whoosh sound on throw
- Bin clang on successful shot
- Fan ambient sound (looping)
- Success jingle
- Ambient office sounds

## User Interface

### HUD Elements
- **Score Counter**: Top right (1700, 50), white text, shadow effect
- **Timer**: Top left (100, 50), countdown from 60 seconds
- **Wind Indicator**: Bottom center (960, 1000), animated arrow
- **Power Meter**: Bottom center (960, 900), vertical bar (fills green→yellow→red)
- **Throw Button**: Bottom right (1650, 900), circular button (180x180)

### Touch/Click Zones
- **Throw Button**: Circular touch area, bottom right
- Hold = charge power
- Release = throw at current power level

## Placeholder Image Specifications

### background.png
- **Size**: 1920x1080
- **Content**: Office setting with desk, window, filing cabinets
- **Color Scheme**: Soft blues and grays, well-lit
- **Format**: Placeholder = Gradient from light blue (top) to gray (bottom)

### trash_bin.png
- **Size**: 200x300
- **Content**: Office wastebasket, slightly tilted for easier shots
- **Format**: Placeholder = Gray rectangle with darker top circle

### paper_ball.png
- **Size**: 64x64
- **Content**: Crumpled white paper ball with shadows
- **Format**: Placeholder = White circle with gray shading

### hand_idle.png
- **Size**: 150x150
- **Content**: Cartoon hand in neutral throwing position
- **Format**: Placeholder = Beige hand shape, relaxed

### hand_back.png
- **Size**: 150x150
- **Content**: Hand pulled back in wind-up position
- **Format**: Placeholder = Beige hand shape, pulled backward

### hand_forward.png
- **Size**: 150x150
- **Content**: Hand extended forward in release position
- **Format**: Placeholder = Beige hand shape, extended forward

### manager_large_01.png
- **Size**: 1400x1000
- **Content**: Manager full body in neutral/entering pose - business suit, professional appearance
- **Color Scheme**: Dark suit, tie, holding papers
- **Format**: Placeholder = Large gray silhouette of business person with papers in hand
- **Notes**: This is the base pose, manager facing forward/slightly angled

### manager_large_02.png
- **Size**: 1400x1000
- **Content**: Manager speaking - mouth open (first speaking frame)
- **Format**: Placeholder = Same as 01 but with mouth circle open (small)
- **Notes**: Subtle mouth open position for speaking animation

### manager_large_03.png
- **Size**: 1400x1000
- **Content**: Manager speaking - mouth wider open (second speaking frame)
- **Format**: Placeholder = Same as 01 but with mouth circle open (larger)
- **Notes**: More pronounced mouth open for alternating speech animation

### manager_large_04.png
- **Size**: 1400x1000
- **Content**: Manager with hand raised holding papers - mid-raise position
- **Format**: Placeholder = Silhouette with arm partially raised, papers visible
- **Notes**: Hand coming up to emphasize the papers

### manager_large_05.png
- **Size**: 1400x1000
- **Content**: Manager with hand raised higher holding papers
- **Format**: Placeholder = Silhouette with arm fully raised, papers prominent
- **Notes**: Full gesture, papers clearly shown

### manager_large_06.png
- **Size**: 1400x1000
- **Content**: Manager shaking papers with emphasis - dynamic pose
- **Format**: Placeholder = Silhouette with slight lean, papers in motion
- **Notes**: More energetic pose showing urgency/emphasis

### manager_large_07.png
- **Size**: 1400x1000
- **Content**: Manager walking away - side view departing
- **Format**: Placeholder = Silhouette in walking stance, facing right
- **Notes**: Exit pose for leaving the scene

### speech_bubble.png
- **Size**: 800x200
- **Content**: Large comic-style speech bubble with tail pointing down to manager
- **Format**: Placeholder = White rounded rectangle with tail, large enough for dialogue text
- **Notes**: Sized to match large manager sprite, highly visible

### fan.png
- **Size**: 180x180
- **Content**: Office desk fan with visible blades
- **Format**: Placeholder = Circle with three lines (blades)

### wind_indicator.png
- **Size**: 100x40
- **Content**: Arrow showing wind direction
- **Format**: Placeholder = Simple arrow shape

### power_meter.png
- **Size**: 60x200
- **Content**: Vertical power meter bar background
- **Format**: Placeholder = Vertical rectangle with segments

### score_panel.png
- **Size**: 400x100
- **Content**: Panel background for score display
- **Format**: Placeholder = Semi-transparent dark rectangle with rounded corners

### button_throw.png
- **Size**: 180x180
- **Content**: Circular throw button with icon
- **Format**: Placeholder = Green circle with hand/throw icon

### success_effect.png
- **Size**: 256x256
- **Content**: Star burst or confetti particle
- **Format**: Placeholder = Yellow star shape

## Development Notes

### Simplified 1-Minute Demo Flow
```
[Intro Story 7s] → [Gameplay 48s] → [End Screen 5s] → [Loop to Intro]
```

### Key Features for Demo
1. ✅ Cinematic story-driven intro with large manager character
2. ✅ Multi-frame manager animation (7 frames for speaking, gesturing, emphasis)
3. ✅ ONE BUTTON control (hold and release)
4. ✅ Continuous hand animation (always in motion)
5. ✅ Power-based throwing (no drag controls)
6. ✅ Clear visual feedback (power meter, animations)
7. ✅ Quick restart loop for replayability

### Animation Sequence Details
```
INTRO (7 seconds - Detailed Manager Animation):
  0.0s - Fade in office background
  0.0-1.0s - Manager (1400x1000) slides in from left, fills 70% of screen
  1.0-2.5s - Manager speaking animation (frames 02↔03 alternating, 0.2s each)
  2.5-3.0s - Large speech bubble appears: "Prepare this report for tomorrow!"
  3.0-4.5s - Manager raises hand with papers (frames 04↔05, 0.3s each)
  4.5-5.5s - Manager shakes papers for emphasis (frame 06, rapid shake)
  5.5-7.0s - Manager walks away to right (frame 07 slides out)
  7.0s - Transition to gameplay, zoom to desk area

GAMEPLAY LOOP (48 seconds):
  - Hand continuously animates (1.5s cycle)
  - Player holds button to charge power
  - Release triggers throw
  - Ball flies with physics + wind
  - Score updates if successful
  - Repeat until timer ends

END SCREEN (5s):
  - Show results
  - Auto-restart to intro
```
  - Auto-restart (no button needed)
```

### Performance Targets
- 60 FPS on mobile devices
- Touch response < 16ms
- Asset loading < 1 second

## Completion Checklist
- [ ] All PNG placeholder images created
- [ ] Physics system implemented
- [ ] Trajectory prediction working
- [ ] Wind mechanics functional
- [ ] Score tracking implemented
- [ ] Timer countdown working
- [ ] End screen with restart loop
- [ ] Touch/mouse controls responsive
- [ ] Assets optimized for mobile
