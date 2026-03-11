// Game Types - US-002

// Button colors used in the game
export enum ButtonColor {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
}

// Player action types
export enum PlayerAction {
  PRESS = 'PRESS',
  WAIT = 'WAIT',
  IDLE = 'IDLE',
}

// Game state
export interface GameState {
  id: string;
  status: GameStatus;
  players: Player[];
  currentRound: number;
  maxRounds: number;
  currentPlayerIndex: number;
  sequence: ButtonColor[];
  playerInputs: PlayerInput[];
  startedAt: number | null;
  endedAt: number | null;
  winner: string | null;
}

export enum GameStatus {
  WAITING = 'WAITING',
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

// Player in a game
export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  joinedAt: number;
  color: ButtonColor | null;
}

// Player input/action
export interface PlayerInput {
  playerId: string;
  button: ButtonColor;
  timestamp: number;
  reactionTimeMs: number;
  isCorrect: boolean;
}

// Game configuration
export interface GameConfig {
  roundDurationMs: number;
  displayDurationMs: number;
  inputTimeoutMs: number;
  maxPlayers: number;
  minPlayers: number;
  pointsPerCorrect: number;
  penaltyPerWrong: number;
}

// Round result
export interface RoundResult {
  round: number;
  sequence: ButtonColor[];
  playerResults: PlayerRoundResult[];
}

export interface PlayerRoundResult {
  playerId: string;
  input: ButtonColor | null;
  isCorrect: boolean;
  reactionTimeMs: number;
  score: number;
}

// Game events
export interface GameEvent {
  type: GameEventType;
  gameId: string;
  playerId?: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export enum GameEventType {
  GAME_STARTED = 'GAME_STARTED',
  ROUND_STARTED = 'ROUND_STARTED',
  SEQUENCE_DISPLAYED = 'SEQUENCE_DISPLAYED',
  PLAYER_INPUT = 'PLAYER_INPUT',
  ROUND_ENDED = 'ROUND_ENDED',
  GAME_ENDED = 'GAME_ENDED',
  PLAYER_JOINED = 'PLAYER_JOINED',
  PLAYER_LEFT = 'PLAYER_LEFT',
}
