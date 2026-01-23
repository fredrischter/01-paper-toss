# Game Server Client Library

JavaScript client library for interacting with the Game Server API.

## Installation

### Option 1: Direct Include

```html
<script src="game-server-client.js"></script>
```

### Option 2: As Module

```javascript
const GameServerClient = require('./game-server-client.js');
```

## Quick Start

```javascript
// Initialize the client
const client = new GameServerClient({
  baseUrl: 'https://game-server-97828933506.europe-west1.run.app',
  gameKey: 'sudoku'
});

// Start a session
await client.startSession();

// Track events
await client.trackWin({ score: 1000 });

// End the session
await client.endSession();
```

## API Reference

### Constructor

```javascript
new GameServerClient(config)
```

**config** object:
- `baseUrl` (string): Base URL of the game server API (default: 'https://game-server-97828933506.europe-west1.run.app')
- `gameKey` (string, required): Key of the game (e.g., 'sudoku')
- `userUuid` (string, optional): User UUID (auto-generated if not provided)
- `language` (string, optional): Language code (auto-detected if not provided)

### Methods

#### startSession(customSessionUuid)

Starts a new game session.

```javascript
await client.startSession();
// or with custom session UUID
await client.startSession('custom-uuid');
```

Returns: Promise with session data

#### endSession()

Ends the current session.

```javascript
await client.endSession();
```

Returns: Promise with session data

#### trackEvent(eventKey, data)

Tracks a custom event.

```javascript
await client.trackEvent('level_complete', { level: 5 });
```

Parameters:
- `eventKey` (string): Event identifier
- `data` (object, optional): Additional event data

Returns: Promise with event data

#### trackWin(data)

Helper method to track a win event.

```javascript
await client.trackWin({ score: 1000, level: 5 });
```

#### trackLose(data)

Helper method to track a lose event.

```javascript
await client.trackLose({ reason: 'timeout' });
```

#### trackLevelComplete(level, data)

Helper method to track level completion.

```javascript
await client.trackLevelComplete(5, { stars: 3, time: 120 });
```

#### getABTestConfig()

Retrieves A/B test configuration for the user.

```javascript
const config = await client.getABTestConfig();
console.log(config.button_color); // 'red' or 'blue'
```

Returns: Promise with A/B test assignments

#### getSessionUuid()

Gets the current session UUID.

```javascript
const sessionId = client.getSessionUuid();
```

#### getUserUuid()

Gets the user UUID.

```javascript
const userId = client.getUserUuid();
```

## Examples

### Complete Game Flow

```javascript
// Initialize
const client = new GameServerClient({
  baseUrl: 'https://game-server-97828933506.europe-west1.run.app',
  gameKey: 'sudoku'
});

// Get A/B test config at game start
const config = await client.getABTestConfig();
const buttonColor = config.button_color || 'blue';

// Start session
await client.startSession();

// Track game events
await client.trackEvent('level_start', { level: 1 });

// ... game logic ...

// Track result
if (playerWon) {
  await client.trackWin({ score: 1000, time: 120 });
} else {
  await client.trackLose({ reason: 'no_moves' });
}

// End session
await client.endSession();
```

### Persistent User

```javascript
// Save user UUID to localStorage
let userUuid = localStorage.getItem('userUuid');

const client = new GameServerClient({
  baseUrl: 'https://game-server-97828933506.europe-west1.run.app',
  gameKey: 'sudoku',
  userUuid: userUuid
});

// Save the UUID for future sessions
if (!userUuid) {
  localStorage.setItem('userUuid', client.getUserUuid());
}
```

### Error Handling

```javascript
try {
  await client.startSession();
} catch (error) {
  console.error('Failed to start session:', error.message);
  // Handle error (e.g., show offline mode)
}
```

## Browser Compatibility

- Modern browsers with Fetch API support
- IE11+ (with polyfills)

## CORS and GitHub Pages

The production server at `https://game-server-97828933506.europe-west1.run.app` has CORS enabled, which allows you to make API requests from any domain, including GitHub Pages.

### Using with GitHub Pages

To use the client library on a GitHub Pages site:

1. Include the client library in your HTML:
```html
<script src="https://raw.githubusercontent.com/fredrischter/game-server/main/client/game-server-client.min.js"></script>
```

2. Initialize the client (the production URL is the default):
```javascript
const client = new GameServerClient({
  gameKey: 'your-game-key'
});
```

3. The client will automatically connect to the production server and work seamlessly from GitHub Pages or any other static hosting service.

**Note:** No special CORS configuration is needed on GitHub Pages as the server already allows cross-origin requests from all domains.

## Testing

Open `example.html` in your browser to test the client library interactively.
