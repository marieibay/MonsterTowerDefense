
export interface Vector2D {
  x: number;
  y: number;
}

export type TowerType = 'WINTERFELL_WATCHTOWER' | 'WEIRWOOD_GROVE' | 'NORTHERN_BARRACKS' | 'SIEGE_WORKSHOP';
export type EnemyType = 'ORC_GRUNT' | 'ORC_BERSERKER' | 'OGRE_BRUTE';
export type ProjectileType = 'ICE_ARROW' | 'NATURE_BOLT' | 'CATAPULT_ROCK';

export enum DamageType {
  PHYSICAL = 'PHYSICAL',
  MAGIC = 'MAGIC',
}

export enum ArmorType {
  NONE = 'NONE',
  PHYSICAL = 'PHYSICAL',
  MAGIC = 'MAGIC',
}

export interface Tower {
  id: number;
  type: TowerType;
  position: Vector2D; // Grid Position
  level: number;
  cooldown: number;
  targetId: number | null;
  isAttacking?: boolean;
  damageType: DamageType;
  spawnCounter?: number;
}

export type EnemyAnimationState = 'walk' | 'idle' | 'attack';

export interface Enemy {
  id: number;
  type: EnemyType;
  name: string;
  position: Vector2D; // Screen Position
  health: number;
  maxHealth: number;
  pathIndex: number;
  attackCooldown?: number;
  animationState: EnemyAnimationState;
  armorType: ArmorType;
  armorValue: number; // e.g., 0.3 for 30% reduction
  speed: number;
  slowTimer: number; // in ms
  tauntedBy?: number | null;
  pathOffset: number;
}

export interface Projectile {
    id: number;
    type: ProjectileType;
    position: Vector2D; // Screen Position
    targetId: number | null; // Can be null for area targets
    targetPosition: Vector2D; // The destination
    damage: number;
    damageType: DamageType;
    speed: number;
    splashRadius?: number;
    slows?: { factor: number; duration: number };
}

export type GroundUnitAnimationState = 'idle' | 'walk' | 'attack' | 'die';

export interface Soldier {
    id: number;
    name: string;
    barracksId: number;
    position: Vector2D; // Screen Position
    rallyPoint?: Vector2D; // Screen Position
    gridPosition: Vector2D; // Grid Position
    health: number;
    maxHealth: number;
    damage: number;
    attackCooldown: number;
    targetId: number | null;
    respawnTimer: number; // in ms
    isBuffed?: boolean;
    animationState: GroundUnitAnimationState;
    direction: 'left' | 'right';
    deathAnimTimer?: number;
    patrolTarget?: Vector2D;
    idleTimer?: number;
}

export interface Hero {
    id: number;
    name: string;
    position: Vector2D; // Screen Position
    gridPosition: Vector2D; // Grid Position
    health: number;
    maxHealth: number;
    damage: number;
    attackCooldown: number;
    targetId: number | null;
    respawnTimer: number; // in ms
    rallyPoint: Vector2D; // Screen Position
    abilityCooldown: number;
    abilityActiveTimer: number;
    armorType: ArmorType;
    armorValue: number;
    animationState: GroundUnitAnimationState;
    direction: 'left' | 'right';
    patrolTarget?: Vector2D;
    idleTimer?: number;
}

export interface Reinforcement {
    id: number;
    position: Vector2D;
    destination: Vector2D;
    health: number;
    maxHealth: number;
    targetId: number | null;
    attackCooldown: number;
    lifetime: number; // in ms
    damage: number;
    range: number;
    speed: number;
    animationState: GroundUnitAnimationState;
    direction: 'left' | 'right';
}

export interface Explosion {
    id: number;
    position: Vector2D;
    radius: number;
    lifetime: number; // in ms
    type: 'FIRE' | 'GENERIC' | 'DRAGON_BREATH';
    angle?: number;
}

export interface GoldParticle {
    id: number;
    position: Vector2D;
    targetPosition: Vector2D;
    value: number;
}

export type PlayerSpell = 'REINFORCEMENTS' | 'RAIN_OF_FIRE';

export type SelectableUnit = Tower | Enemy | Soldier | Hero;

export type GameStatus = 'IDLE' | 'WAVE_IN_PROGRESS' | 'WAVE_COMPLETE' | 'GAME_OVER' | 'VICTORY';

export interface Wave {
  enemies: EnemyType[];
  spawnRate: number; // ms between spawns
}

export interface RallyPointDragState {
  startPosition: Vector2D;
  currentPosition: Vector2D;
  unitId: number;
}

export interface EnvironmentDecoration {
  type: 'TREE_1' | 'TREE_2' | 'ROCK_1' | 'ROCK_2';
  position: Vector2D; // Grid Position
}