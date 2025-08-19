import { Vector2D, TowerType, EnemyType, Wave, ProjectileType, DamageType, ArmorType } from './types';

export const GAME_CONFIG = {
  fps: 30,
  startingGold: 220, // Adjusted to match user screenshot
  startingLives: 20,
  gridWidth: 24,
  gridHeight: 11, 
  tileWidth: 80,
  tileHeight: 40,
  timeBetweenWaves: 15000, // ms
  width: 1920,
  height: 880,
};

export const EARLY_WAVE_BONUS = {
    gold: 15,
    cooldownReduction: 2000, //ms
}

// Path transformed to span the entire screen width
export const MAP_PATH: Vector2D[] = [
    {x: -11, y: 13}, {x: -9, y: 14}, {x: -7, y: 14}, {x: -5, y: 14}, 
    {x: -3, y: 14}, {x: -1, y: 16}, {x: 1, y: 18}, {x: 3, y: 20}, 
    {x: 5, y: 18}, {x: 7, y: 16}, {x: 9, y: 14}, {x: 11, y: 16}, 
    {x: 13, y: 18}, {x: 15, y: 20}, {x: 17, y: 22}, {x: 19, y: 20}, 
    {x: 21, y: 18}, {x: 23, y: 16}, {x: 25, y: 14}, {x: 27, y: 16}, 
    {x: 29, y: 18}, {x: 31, y: 20}, {x: 33, y: 18}, {x: 35, y: 16}, 
    {x: 37, y: 14}, {x: 38, y: 15}, {x: 40, y: 15}, {x: 42, y: 15}
];

export const HERO_START_GRID_POS: Vector2D = MAP_PATH[2]; // Use a point that's visible on screen

// Tower spots adjusted to be closer to the path for optimal engagement.
export const TOWER_SPOTS: Vector2D[] = [
  { x: -4, y: 12 },
  { x: 2, y: 17 },
  { x: 6, y: 20 },
  { x: 10, y: 13 },
  { x: 15, y: 22 },
  { x: 18, y: 19 },
  { x: 24, y: 13 },
  { x: 29, y: 20 },
  { x: 36, y: 13 },
];

interface TowerLevelStats {
  name: string;
  cost: number;
  upgradeCost: number;
  sellValue: number;
  damage: number;
  range: number;
  fireRate: number;
  damageType: DamageType;
  projectileType?: ProjectileType;
  projectileSpeed?: number;
  splashRadius?: number;
}

export const TOWER_STATS: Record<TowerType, TowerLevelStats[]> = {
  ARCHER: [
    { name: 'Archer I', cost: 70, upgradeCost: 60, sellValue: 35, damage: 12, range: 160, fireRate: 800, damageType: DamageType.PHYSICAL, projectileType: 'ARROW', projectileSpeed: 350 },
    { name: 'Archer II', cost: 0, upgradeCost: 80, sellValue: 65, damage: 20, range: 180, fireRate: 750, damageType: DamageType.PHYSICAL, projectileType: 'ARROW', projectileSpeed: 380 },
    { name: 'Archer III', cost: 0, upgradeCost: 0, sellValue: 105, damage: 32, range: 200, fireRate: 700, damageType: DamageType.PHYSICAL, projectileType: 'ARROW', projectileSpeed: 420 },
  ],
  MAGE: [
    { name: 'Mage I', cost: 100, upgradeCost: 90, sellValue: 50, damage: 25, range: 140, fireRate: 1500, damageType: DamageType.MAGIC, projectileType: 'MAGIC_BOLT', projectileSpeed: 250 },
    { name: 'Mage II', cost: 0, upgradeCost: 120, sellValue: 95, damage: 45, range: 150, fireRate: 1400, damageType: DamageType.MAGIC, projectileType: 'MAGIC_BOLT', projectileSpeed: 280 },
    { name: 'Mage III', cost: 0, upgradeCost: 0, sellValue: 155, damage: 70, range: 160, fireRate: 1300, damageType: DamageType.MAGIC, projectileType: 'MAGIC_BOLT', projectileSpeed: 320 },
  ],
  BARRACKS: [
    { name: 'Barracks I', cost: 80, upgradeCost: 70, sellValue: 40, damage: 0, range: 120, fireRate: 0, damageType: DamageType.PHYSICAL },
    { name: 'Barracks II', cost: 0, upgradeCost: 90, sellValue: 75, damage: 0, range: 140, fireRate: 0, damageType: DamageType.PHYSICAL },
    { name: 'Barracks III', cost: 0, upgradeCost: 0, sellValue: 120, damage: 0, range: 160, fireRate: 0, damageType: DamageType.PHYSICAL },
  ],
  ARTILLERY: [
    { name: 'Catapult I', cost: 120, upgradeCost: 100, sellValue: 60, damage: 30, range: 220, fireRate: 3000, damageType: DamageType.PHYSICAL, projectileType: 'CANNONBALL', projectileSpeed: 150, splashRadius: 60 },
    { name: 'Catapult II', cost: 0, upgradeCost: 150, sellValue: 110, damage: 55, range: 240, fireRate: 2800, damageType: DamageType.PHYSICAL, projectileType: 'CANNONBALL', projectileSpeed: 150, splashRadius: 70 },
    { name: 'Catapult III', cost: 0, upgradeCost: 0, sellValue: 185, damage: 90, range: 260, fireRate: 2600, damageType: DamageType.PHYSICAL, projectileType: 'CANNONBALL', projectileSpeed: 150, splashRadius: 80 },
  ],
};

export const SOLDIER_STATS = {
    name: 'Soldier',
    health: 100,
    damage: 8,
    attackRate: 1000,
    range: 50,
    speed: 100,
    respawnTime: 10000,
    count: 3,
    blockingRadius: 30,
};

export const REINFORCEMENTS_STATS = {
    name: 'Militia',
    health: 80,
    damage: 10,
    attackRate: 1200,
    range: 50,
    duration: 15000, // ms
    cooldown: 20000, // ms
    count: 2,
    blockingRadius: 30,
}

export const RAIN_OF_FIRE_STATS = {
    damage: 80,
    radius: 100, // pixels
    cooldown: 30000, // ms
}

export const HERO_STATS = {
    name: 'Sir Reginald',
    health: 400,
    damage: 25,
    attackRate: 800,
    range: 60,
    speed: 150,
    respawnTime: 20000,
    blockingRadius: 35,
    abilityName: 'Battle Cry',
    abilityCooldown: 25000, // ms
    abilityDuration: 8000, // ms
    abilityRange: 150, // pixels
    abilityDamageBoost: 1.5, // 50% damage boost
};

interface EnemyStat {
    name: string;
    health: number;
    speed: number;
    gold: number;
    damage: number;
    attackRate: number;
    armorType: ArmorType;
    armorValue: number;
}

export const ENEMY_STATS: Record<EnemyType, EnemyStat> = {
  GOBLIN: { name: 'Pea Pod', health: 60, speed: 60, gold: 5, damage: 5, attackRate: 800, armorType: ArmorType.NONE, armorValue: 0 },
  ORC: { name: 'Stumpy', health: 150, speed: 45, gold: 10, damage: 15, attackRate: 1200, armorType: ArmorType.PHYSICAL, armorValue: 0.3 },
  TROLL: { name: 'Rock Golem', health: 400, speed: 30, gold: 25, damage: 30, attackRate: 1500, armorType: ArmorType.PHYSICAL, armorValue: 0.5 },
};

export const WAVES: Wave[] = [
  { enemies: Array(7).fill('GOBLIN'), spawnRate: 1200 },
  { enemies: [...Array(12).fill('GOBLIN'), ...Array(5).fill('ORC')], spawnRate: 800 },
  { enemies: [...Array(5).fill('GOBLIN'), ...Array(10).fill('ORC')], spawnRate: 700 },
  { enemies: [...Array(15).fill('ORC'), ...Array(3).fill('TROLL')], spawnRate: 600 },
  { enemies: [...Array(10).fill('GOBLIN'), ...Array(10).fill('ORC'), ...Array(6).fill('TROLL')], spawnRate: 500 },
  { enemies: [...Array(10).fill('ORC'), ...Array(10).fill('TROLL')], spawnRate: 800 },
];