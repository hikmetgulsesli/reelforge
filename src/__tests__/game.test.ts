// Tests for game types and constants - US-002
import { 
  ButtonColor, 
  PlayerAction, 
  GameStatus,
  GameEventType 
} from '../types/game';
import { 
  COLORS, 
  BUTTON_COLORS, 
  SOUND_FREQUENCIES, 
  TIMING, 
  STORAGE_KEYS,
  DEFAULT_GAME_CONFIG,
  VALIDATION
} from '../constants/game';

describe('ButtonColor', () => {
  test('has all expected colors', () => {
    expect(ButtonColor.RED).toBe('RED');
    expect(ButtonColor.BLUE).toBe('BLUE');
    expect(ButtonColor.GREEN).toBe('GREEN');
    expect(ButtonColor.YELLOW).toBe('YELLOW');
  });
});

describe('PlayerAction', () => {
  test('has all expected actions', () => {
    expect(PlayerAction.PRESS).toBe('PRESS');
    expect(PlayerAction.WAIT).toBe('WAIT');
    expect(PlayerAction.IDLE).toBe('IDLE');
  });
});

describe('GameStatus', () => {
  test('has all expected statuses', () => {
    expect(GameStatus.WAITING).toBe('WAITING');
    expect(GameStatus.STARTED).toBe('STARTED');
    expect(GameStatus.PAUSED).toBe('PAUSED');
    expect(GameStatus.COMPLETED).toBe('COMPLETED');
    expect(GameStatus.ABANDONED).toBe('ABANDONED');
  });
});

describe('GameEventType', () => {
  test('has all expected event types', () => {
    expect(GameEventType.GAME_STARTED).toBe('GAME_STARTED');
    expect(GameEventType.ROUND_STARTED).toBe('ROUND_STARTED');
    expect(GameEventType.SEQUENCE_DISPLAYED).toBe('SEQUENCE_DISPLAYED');
    expect(GameEventType.PLAYER_INPUT).toBe('PLAYER_INPUT');
    expect(GameEventType.ROUND_ENDED).toBe('ROUND_ENDED');
    expect(GameEventType.GAME_ENDED).toBe('GAME_ENDED');
    expect(GameEventType.PLAYER_JOINED).toBe('PLAYER_JOINED');
    expect(GameEventType.PLAYER_LEFT).toBe('PLAYER_LEFT');
  });
});

describe('COLORS', () => {
  test('all button colors are valid hex values', () => {
    expect(COLORS.RED).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(COLORS.BLUE).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(COLORS.GREEN).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(COLORS.YELLOW).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  test('UI colors are defined', () => {
    expect(COLORS.BACKGROUND).toBeDefined();
    expect(COLORS.SURFACE).toBeDefined();
    expect(COLORS.TEXT).toBeDefined();
    expect(COLORS.TEXT_MUTED).toBeDefined();
    expect(COLORS.BORDER).toBeDefined();
  });

  test('feedback colors are defined', () => {
    expect(COLORS.SUCCESS).toBeDefined();
    expect(COLORS.ERROR).toBeDefined();
    expect(COLORS.WARNING).toBeDefined();
  });
});

describe('BUTTON_COLORS', () => {
  test('maps button colors to hex values', () => {
    expect(BUTTON_COLORS.RED).toBe(COLORS.RED);
    expect(BUTTON_COLORS.BLUE).toBe(COLORS.BLUE);
    expect(BUTTON_COLORS.GREEN).toBe(COLORS.GREEN);
    expect(BUTTON_COLORS.YELLOW).toBe(COLORS.YELLOW);
  });
});

describe('SOUND_FREQUENCIES', () => {
  test('all frequencies are positive numbers', () => {
    Object.values(SOUND_FREQUENCIES).forEach(freq => {
      expect(typeof freq).toBe('number');
      expect(freq).toBeGreaterThan(0);
    });
  });

  test('musical notes are in reasonable range (100-2000 Hz)', () => {
    Object.values(SOUND_FREQUENCIES).forEach(freq => {
      expect(freq).toBeGreaterThan(100);
      expect(freq).toBeLessThan(2000);
    });
  });
});

describe('TIMING', () => {
  test('all timing values are positive', () => {
    Object.values(TIMING).forEach(value => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    });
  });

  test('input timeout is greater than display duration', () => {
    expect(TIMING.INPUT_TIMEOUT).toBeGreaterThan(TIMING.DISPLAY_DURATION);
  });

  test('animation timings are under 400ms as per design standards', () => {
    expect(TIMING.BUTTON_PRESS_DURATION).toBeLessThanOrEqual(400);
    expect(TIMING.SEQUENCE_INTERVAL).toBeLessThanOrEqual(400);
    expect(TIMING.MODAL_FADE_DURATION).toBeLessThanOrEqual(400);
  });
});

describe('STORAGE_KEYS', () => {
  test('all storage keys are strings', () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });
  });

  test('storage keys follow naming convention', () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      expect(key).toMatch(/^[a-z_]+$/);
    });
  });
});

describe('DEFAULT_GAME_CONFIG', () => {
  test('max players is greater than min players', () => {
    expect(DEFAULT_GAME_CONFIG.maxPlayers).toBeGreaterThan(DEFAULT_GAME_CONFIG.minPlayers);
  });

  test('penalty is non-negative', () => {
    expect(DEFAULT_GAME_CONFIG.penaltyPerWrong).toBeGreaterThanOrEqual(0);
  });

  test('points per correct is greater than penalty', () => {
    expect(DEFAULT_GAME_CONFIG.pointsPerCorrect).toBeGreaterThan(DEFAULT_GAME_CONFIG.penaltyPerWrong);
  });
});

describe('VALIDATION', () => {
  test('player name length constraints are reasonable', () => {
    expect(VALIDATION.PLAYER_NAME_MIN_LENGTH).toBeLessThan(VALIDATION.PLAYER_NAME_MAX_LENGTH);
    expect(VALIDATION.PLAYER_NAME_MIN_LENGTH).toBeGreaterThan(0);
  });

  test('max high scores is positive', () => {
    expect(VALIDATION.MAX_HIGH_SCORES).toBeGreaterThan(0);
  });
});
