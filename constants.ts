import { Vector2D, TowerType, EnemyType, Wave, ProjectileType, DamageType, ArmorType, EnvironmentDecoration } from './types';

export const GAME_CONFIG = {
  fps: 30,
  startingGold: 250,
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
    gold: 20,
    cooldownReduction: 2000, //ms
}

export const MAP_PATH: Vector2D[] = [
    {x: -11, y: 13}, {x: -9, y: 14}, {x: -7, y: 14}, {x: -5, y: 14}, 
    {x: -3, y: 14}, {x: -1, y: 16}, {x: 1, y: 18}, {x: 3, y: 20}, 
    {x: 5, y: 18}, {x: 7, y: 16}, {x: 9, y: 14}, {x: 11, y: 16}, 
    {x: 13, y: 18}, {x: 15, y: 20}, {x: 17, y: 22}, {x: 19, y: 20}, 
    {x: 21, y: 18}, {x: 23, y: 16}, {x: 25, y: 14}, {x: 27, y: 16}, 
    {x: 29, y: 18}, {x: 31, y: 20}, {x: 33, y: 18}, {x: 35, y: 16}, 
    {x: 37, y: 14}, {x: 38, y: 15}, {x: 40, y: 15}, {x: 42, y: 15}
];

export const HERO_START_GRID_POS: Vector2D = { x: -3, y: 13 };

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

export const ENVIRONMENT_DECORATIONS: EnvironmentDecoration[] = [
    // These are now baked into the background image for a more integrated look
    // { type: 'TREE_1', position: { x: -8, y: 12 } },
    // { type: 'TREE_2', position: { x: 0, y: 19 } },
    // { type: 'ROCK_1', position: { x: 4, y: 17 } },
    // { type: 'TREE_1', position: { x: 8, y: 12 } },
    // { type: 'ROCK_2', position: { x: 13, y: 15 } },
    // { type: 'TREE_2', position: { x: 17, y: 24 } },
    // { type: 'ROCK_1', position: { x: 20, y: 17 } },
    // { type: 'TREE_1', position: { x: 26, y: 12 } },
    // { type: 'ROCK_2', position: { x: 32, y: 17 } },
    // { type: 'TREE_2', position: { x: 38, y: 13 } },
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
  slows?: { factor: number, duration: number };
}

export const TOWER_STATS: Record<TowerType, TowerLevelStats[]> = {
  WINTERFELL_WATCHTOWER: [
    { name: 'Watchtower', cost: 70, upgradeCost: 60, sellValue: 35, damage: 12, range: 160, fireRate: 800, damageType: DamageType.PHYSICAL, projectileType: 'ICE_ARROW', projectileSpeed: 350 },
    { name: 'Guard Tower', cost: 0, upgradeCost: 80, sellValue: 65, damage: 20, range: 180, fireRate: 750, damageType: DamageType.PHYSICAL, projectileType: 'ICE_ARROW', projectileSpeed: 380, slows: { factor: 0.5, duration: 1500 } },
    { name: 'Castle Tower', cost: 0, upgradeCost: 0, sellValue: 105, damage: 32, range: 200, fireRate: 700, damageType: DamageType.PHYSICAL, projectileType: 'ICE_ARROW', projectileSpeed: 420, slows: { factor: 0.5, duration: 2000 } },
  ],
  WEIRWOOD_GROVE: [
    { name: 'Weirwood Sapling', cost: 100, upgradeCost: 90, sellValue: 50, damage: 25, range: 140, fireRate: 1500, damageType: DamageType.MAGIC, projectileType: 'NATURE_BOLT', projectileSpeed: 250 },
    { name: 'Weirwood Grove', cost: 0, upgradeCost: 120, sellValue: 95, damage: 45, range: 150, fireRate: 1400, damageType: DamageType.MAGIC, projectileType: 'NATURE_BOLT', projectileSpeed: 280 },
    { name: 'Ancient Weirwood', cost: 0, upgradeCost: 0, sellValue: 155, damage: 70, range: 160, fireRate: 1300, damageType: DamageType.MAGIC, projectileType: 'NATURE_BOLT', projectileSpeed: 320 },
  ],
  NORTHERN_BARRACKS: [
    { name: 'Encampment', cost: 80, upgradeCost: 70, sellValue: 40, damage: 0, range: 120, fireRate: 0, damageType: DamageType.PHYSICAL },
    { name: 'Barracks', cost: 0, upgradeCost: 90, sellValue: 75, damage: 0, range: 140, fireRate: 0, damageType: DamageType.PHYSICAL },
    { name: 'Fortress', cost: 0, upgradeCost: 0, sellValue: 120, damage: 0, range: 160, fireRate: 0, damageType: DamageType.PHYSICAL },
  ],
  SIEGE_WORKSHOP: [
    { name: 'Catapult', cost: 120, upgradeCost: 100, sellValue: 60, damage: 30, range: 220, fireRate: 3000, damageType: DamageType.PHYSICAL, projectileType: 'CATAPULT_ROCK', projectileSpeed: 150, splashRadius: 60 },
    { name: 'Trebuchet', cost: 0, upgradeCost: 150, sellValue: 110, damage: 55, range: 240, fireRate: 2800, damageType: DamageType.PHYSICAL, projectileType: 'CATAPULT_ROCK', projectileSpeed: 150, splashRadius: 70 },
    { name: 'Siege Engine', cost: 0, upgradeCost: 0, sellValue: 185, damage: 90, range: 260, fireRate: 2600, damageType: DamageType.PHYSICAL, projectileType: 'CATAPULT_ROCK', projectileSpeed: 150, splashRadius: 80 },
  ],
};

export const SOLDIER_STATS = {
    name: 'Northern Soldier',
    health: 120,
    damage: 10,
    attackRate: 1000,
    range: 50,
    speed: 100,
    respawnTime: 10000,
    count: 3,
    blockingRadius: 30,
};

export const REINFORCEMENTS_STATS = {
    name: 'Stark Bannerman',
    health: 90,
    damage: 12,
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
    name: 'Brienne of Tarth',
    health: 250,
    damage: 14,
    attackRate: 1500,
    range: 50, // Melee range
    speed: 120,
    respawnTime: 20000,
    blockingRadius: 30,
    patrolRange: 150, // pixels from rally point
    armorType: ArmorType.PHYSICAL,
    armorValue: 0.1,
    abilityName: 'Oathkeeper\'s Stand',
    abilityCooldown: 75000, // ms
    abilityRange: 150, // pixels for taunt
    abilityDuration: 4000, // ms
    abilityDefenseBonus: 0.50, // 50% armor increase
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
  ORC_GRUNT: { name: 'Fuggler Orc Grunt', health: 70, speed: 60, gold: 5, damage: 8, attackRate: 800, armorType: ArmorType.NONE, armorValue: 0 },
  ORC_BERSERKER: { name: 'Fuggler Orc Berserker', health: 180, speed: 50, gold: 12, damage: 18, attackRate: 1100, armorType: ArmorType.PHYSICAL, armorValue: 0.3 },
  OGRE_BRUTE: { name: 'Fuggler Ogre Brute', health: 500, speed: 30, gold: 30, damage: 40, attackRate: 1500, armorType: ArmorType.PHYSICAL, armorValue: 0.5 },
};

export const WAVES: Wave[] = [
  { enemies: Array(8).fill('ORC_GRUNT'), spawnRate: 1200 },
  { enemies: [...Array(12).fill('ORC_GRUNT'), ...Array(5).fill('ORC_BERSERKER')], spawnRate: 800 },
  { enemies: [...Array(6).fill('ORC_GRUNT'), ...Array(10).fill('ORC_BERSERKER')], spawnRate: 700 },
  { enemies: [...Array(15).fill('ORC_BERSERKER'), ...Array(3).fill('OGRE_BRUTE')], spawnRate: 600 },
  { enemies: [...Array(10).fill('ORC_GRUNT'), ...Array(10).fill('ORC_BERSERKER'), ...Array(6).fill('OGRE_BRUTE')], spawnRate: 500 },
  { enemies: [...Array(12).fill('ORC_BERSERKER'), ...Array(10).fill('OGRE_BRUTE')], spawnRate: 800 },
];
