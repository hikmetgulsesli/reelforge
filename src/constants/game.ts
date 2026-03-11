// Game Constants - US-002

// Color hex values (matching PRD specifications)
export const COLORS = {
  RED: '#ef4444',
  BLUE: '#3b82f6',
  GREEN: '#22c55e',
  YELLOW: '#eab308',
  
  // Additional UI colors
  BACKGROUND: '#0f172a',
  SURFACE: '#1e293b',
  TEXT: '#f8fafc',
  TEXT_MUTED: '#94a3b8',
  BORDER: '#334155',
  
  // Feedback colors
  SUCCESS: '#22c55e',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
} as const;

// Button color mappings
export const BUTTON_COLORS = {
  RED: COLORS.RED,
  BLUE: COLORS.BLUE,
  GREEN: COLORS.GREEN,
  YELLOW: COLORS.YELLOW,
} as const;

// Sound frequency constants (Hz)
export const SOUND_FREQUENCIES = {
  RED: 261.63,    // C4 (Middle C)
  BLUE: 329.63,   // E4
  GREEN: 392.00,  // G4
  YELLOW: 523.25, // C5 (High C)
  
  // Feedback sounds
  SUCCESS: 880.00,   // A5
  ERROR: 174.61,      // F3 (low)
  WARNING: 440.00,   // A4
  
  // Game sounds
  GAME_START: 523.25,  // C5
  ROUND_START: 659.25, // E5
  GAME_OVER: 392.00,   // G4
} as const;

// Timing constants (milliseconds)
export const TIMING = {
  // Game timing
  ROUND_DURATION: 30000,
  DISPLAY_DURATION: 2000,
  INPUT_TIMEOUT: 5000,
  
  // Animation timing
  BUTTON_PRESS_DURATION: 150,
  SEQUENCE_INTERVAL: 350,
  
  // UI timing
  TOAST_DURATION: 3000,
  MODAL_FADE_DURATION: 200,
  
  // Network timing
  RECONNECT_INTERVAL: 3000,
  MAX_RECONNECT_ATTEMPTS: 5,
} as const;

// localStorage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'game_state',
  PLAYER_ID: 'player_id',
  PLAYER_NAME: 'player_name',
  GAME_CONFIG: 'game_config',
  HIGH_SCORES: 'high_scores',
  SOUND_ENABLED: 'sound_enabled',
  MUSIC_ENABLED: 'music_enabled',
  THEME: 'theme',
} as const;

// Game configuration defaults
export const DEFAULT_GAME_CONFIG = {
  maxPlayers: 4,
  minPlayers: 2,
  roundDurationMs: TIMING.ROUND_DURATION,
  displayDurationMs: TIMING.DISPLAY_DURATION,
  inputTimeoutMs: TIMING.INPUT_TIMEOUT,
  pointsPerCorrect: 10,
  penaltyPerWrong: 5,
} as const;

// Validation constants
export const VALIDATION = {
  PLAYER_NAME_MIN_LENGTH: 2,
  PLAYER_NAME_MAX_LENGTH: 20,
  MAX_HIGH_SCORES: 10,
} as const;
