
import React, { useState, useEffect, useCallback, useRef, useMemo, useLayoutEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { HUD } from './components/HUD';
import { TowerMenu } from './components/TowerMenu';
import { Modal } from './components/Modal';
import { 
  TOWER_STATS, 
  ENEMY_STATS,
  SOLDIER_STATS,
  HERO_STATS,
  WAVES, 
  GAME_CONFIG, 
  REINFORCEMENTS_STATS,
  RAIN_OF_FIRE_STATS,
  EARLY_WAVE_BONUS,
  HERO_START_GRID_POS,
} from './constants';
import { DamageType, ArmorType } from './types';
import type { 
  GameStatus, 
  Tower, 
  Enemy, 
  Vector2D, 
  TowerType, 
  Projectile,
  Soldier,
  Hero,
  SelectableUnit,
  PlayerSpell,
  Reinforcement,
  Explosion,
  GoldParticle,
  RallyPointDragState,
  ProjectileType,
  GroundUnitAnimationState,
} from './types';
import { getDistance, AudioManager, gameToScreen } from './utils';
import { MAP_PATH } from './constants';

const projectileSoundMap: Record<ProjectileType, 'ARROW' | 'MAGIC_BOLT' | 'CANNONBALL'> = {
    'ICE_ARROW': 'ARROW',
    'NATURE_BOLT': 'MAGIC_BOLT',
    'CATAPULT_ROCK': 'CANNONBALL',
};

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [stats, setStats] = useState({ gold: GAME_CONFIG.startingGold, lives: GAME_CONFIG.startingLives });
  const [currentWave, setCurrentWave] = useState(0);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [reinforcements, setReinforcements] = useState<Reinforcement[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [goldParticles, setGoldParticles] = useState<GoldParticle[]>([]);
  const [spellCooldowns, setSpellCooldowns] = useState({ REINFORCEMENTS: 0, RAIN_OF_FIRE: 0 });
  const [activeSpell, setActiveSpell] = useState<PlayerSpell | null>(null);
  const [nextWaveTimer, setNextWaveTimer] = useState(0);
  
  const [hero, setHero] = useState<Hero>({
    id: 1,
    name: HERO_STATS.name,
    position: gameToScreen(HERO_START_GRID_POS),
    gridPosition: {...HERO_START_GRID_POS},
    health: HERO_STATS.health,
    maxHealth: HERO_STATS.health,
    damage: HERO_STATS.damage,
    attackCooldown: 0,
    targetId: null,
    respawnTimer: 0,
    rallyPoint: gameToScreen(HERO_START_GRID_POS),
    abilityCooldown: 0,
    abilityActiveTimer: 0,
    armorType: HERO_STATS.armorType,
    armorValue: HERO_STATS.armorValue,
    animationState: 'idle',
    direction: 'right',
  });
  const [selectedSpot, setSelectedSpot] = useState<Vector2D | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<SelectableUnit | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rallyPointDrag, setRallyPointDrag] = useState<RallyPointDragState | null>(null);
  const [scale, setScale] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimers = useRef<Map<string | number, ReturnType<typeof setTimeout>>>(new Map());
  const waveTimerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const audioManager = useMemo(() => new AudioManager(), []);
  
  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const scaleX = clientWidth / GAME_CONFIG.width;
        const scaleY = clientHeight / GAME_CONFIG.height;
        setScale(Math.min(scaleX, scaleY));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    audioManager.toggleMute(isMuted);
  }, [isMuted, audioManager]);
  
  useEffect(() => {
    // Autoplay for background music is often restricted by browsers.
    // This effect starts the music when the first wave begins,
    // which is triggered by a user click, ensuring compatibility.
    if (gameStatus === 'WAVE_IN_PROGRESS' && currentWave === 1 && !isPaused) {
      audioManager.playMusic();
    }
  }, [gameStatus, currentWave, isPaused, audioManager]);

  const waveSpawnData = useRef({ spawnIndex: 0, lastSpawnTime: 0 });

  const findClosestPathPoint = useCallback((point: Vector2D): Vector2D => {
      let closestPoint: Vector2D = {...MAP_PATH[0]};
      let minDistance = Infinity;
      const screenPoint = gameToScreen(point);

      for(let i = 0; i < MAP_PATH.length; i++) {
          const pathScreenPoint = gameToScreen(MAP_PATH[i]);
          const dist = getDistance(screenPoint, pathScreenPoint);
          if(dist < minDistance) {
              minDistance = dist;
              closestPoint = MAP_PATH[i];
          }
      }
      return closestPoint;
  }, []);
  
  const deselectAll = () => {
    setSelectedSpot(null);
    setSelectedUnit(null);
    setActiveSpell(null);
    setRallyPointDrag(null);
  };

  const handleSelectUnit = useCallback((unit: SelectableUnit) => {
    audioManager.playSound('uiClick');
    setSelectedUnit(unit);
    setSelectedSpot(null);
    setActiveSpell(null);
  }, [audioManager]);

  const resetGame = useCallback(() => {
    audioManager.playSound('uiClick');
    setGameStatus('IDLE');
    setStats({ gold: GAME_CONFIG.startingGold, lives: GAME_CONFIG.startingLives });
    setCurrentWave(0);
    setTowers([]);
    setEnemies([]);
    setProjectiles([]);
    setSoldiers([]);
    setReinforcements([]);
    setExplosions([]);
    setGoldParticles([]);
    setSpellCooldowns({ REINFORCEMENTS: 0, RAIN_OF_FIRE: 0 });
    setNextWaveTimer(0);
    if(waveTimerInterval.current) clearInterval(waveTimerInterval.current);
    
    setHero({
        id: 1,
        name: HERO_STATS.name,
        position: gameToScreen(HERO_START_GRID_POS),
        gridPosition: {...HERO_START_GRID_POS},
        health: HERO_STATS.health,
        maxHealth: HERO_STATS.health,
        damage: HERO_STATS.damage,
        attackCooldown: 0,
        targetId: null,
        respawnTimer: 0,
        rallyPoint: gameToScreen(HERO_START_GRID_POS),
        abilityCooldown: 0,
        abilityActiveTimer: 0,
        armorType: HERO_STATS.armorType,
        armorValue: HERO_STATS.armorValue,
        animationState: 'idle',
        direction: 'right',
    });
    setSelectedSpot(null);
    setSelectedUnit(null);
    setActiveSpell(null);
    setRallyPointDrag(null);
    setIsPaused(false);
    waveSpawnData.current = { spawnIndex: 0, lastSpawnTime: 0 };
    audioManager.stopMusic();
  }, [audioManager]);
  
    useEffect(() => {
    return () => {
      animationTimers.current.forEach(timer => clearTimeout(timer));
      if (waveTimerInterval.current) clearInterval(waveTimerInterval.current);
    };
  }, []);

  const startNextWave = useCallback(() => {
    if (gameStatus !== 'IDLE' && gameStatus !== 'WAVE_COMPLETE') return;
    audioManager.playSound('waveStart');
    if(waveTimerInterval.current) clearInterval(waveTimerInterval.current);
    setNextWaveTimer(0);
    waveSpawnData.current = { spawnIndex: 0, lastSpawnTime: Date.now() };
    setEnemies([]);
    setGameStatus('WAVE_IN_PROGRESS');
    setCurrentWave(prev => prev + 1);
    deselectAll();
  }, [gameStatus, audioManager]);

  const handleStartWave = useCallback((isEarly: boolean) => {
      if (isEarly) {
          setStats(s => ({...s, gold: s.gold + EARLY_WAVE_BONUS.gold}));
          setSpellCooldowns(cds => ({
              REINFORCEMENTS: Math.max(0, cds.REINFORCEMENTS - EARLY_WAVE_BONUS.cooldownReduction),
              RAIN_OF_FIRE: Math.max(0, cds.RAIN_OF_FIRE - EARLY_WAVE_BONUS.cooldownReduction)
          }));
      }
      startNextWave();
  }, [startNextWave]);

  const handleSpotClick = useCallback((spot: Vector2D) => {
    audioManager.playSound('uiClick');
    const existingTower = towers.find(t => t.position.x === spot.x && t.position.y === spot.y);
    if (existingTower) {
      handleSelectUnit(existingTower);
    } else {
      setSelectedSpot(spot);
      setSelectedUnit(null);
      setActiveSpell(null);
    }
  }, [towers, handleSelectUnit, audioManager]);

  const handleBuildTower = useCallback((towerType: TowerType) => {
    if (!selectedSpot) return;

    const towerCost = TOWER_STATS[towerType][0].cost;
    if (stats.gold >= towerCost) {
      audioManager.playSound('build');
      setStats(prev => ({ ...prev, gold: prev.gold - towerCost }));
      const newTower: Tower = {
        id: Date.now(),
        type: towerType,
        position: selectedSpot,
        level: 1,
        cooldown: 0,
        targetId: null,
        isAttacking: false,
        damageType: TOWER_STATS[towerType][0].damageType,
        spawnCounter: 0,
      };

      if (towerType === 'NORTHERN_BARRACKS') {
          const rallyPoint = findClosestPathPoint(selectedSpot);
          const newSoldiers: Soldier[] = [];
          for (let i = 0; i < SOLDIER_STATS.count; i++) {
              const angle = (i / SOLDIER_STATS.count) * 2 * Math.PI;
              const screenRallyPos = gameToScreen(rallyPoint);
              const individualRallyPoint = { 
                  x: screenRallyPos.x + Math.cos(angle) * 25,
                  y: screenRallyPos.y + Math.sin(angle) * 25
              };
              newSoldiers.push({
                  id: newTower.id + i + 1,
                  name: SOLDIER_STATS.name,
                  barracksId: newTower.id,
                  position: { ...individualRallyPoint },
                  rallyPoint: { ...individualRallyPoint },
                  gridPosition: rallyPoint,
                  health: SOLDIER_STATS.health,
                  maxHealth: SOLDIER_STATS.health,
                  damage: SOLDIER_STATS.damage,
                  attackCooldown: 0,
                  targetId: null,
                  respawnTimer: 0,
                  animationState: 'idle',
                  direction: 'right',
              });
          }
          setSoldiers(prev => [...prev, ...newSoldiers]);
      }

      setTowers(prev => [...prev, newTower]);
      setSelectedSpot(null);
    }
  }, [selectedSpot, stats.gold, findClosestPathPoint, audioManager]);

   const handleUpgradeTower = useCallback((towerId: number) => {
    setTowers(prev => prev.map(t => {
      if (t.id === towerId) {
        const currentStats = TOWER_STATS[t.type][t.level - 1];
        if (t.level < 3 && stats.gold >= currentStats.upgradeCost) {
          audioManager.playSound('upgradeTower');
          setStats(s => ({...s, gold: s.gold - currentStats.upgradeCost}));
          return {...t, level: t.level + 1};
        }
      }
      return t;
    }));
  }, [stats.gold, audioManager]);

  const handleSellTower = useCallback((towerId: number) => {
    audioManager.playSound('uiClick');
    const towerToSell = towers.find(t => t.id === towerId);
    if (!towerToSell) return;

    const sellValue = TOWER_STATS[towerToSell.type][towerToSell.level - 1].sellValue;
    setStats(s => ({...s, gold: s.gold + sellValue}));
    setTowers(prev => prev.filter(t => t.id !== towerId));
    if (towerToSell.type === 'NORTHERN_BARRACKS') {
      setSoldiers(prev => prev.filter(s => s.barracksId !== towerId));
    }
    deselectAll();
  }, [towers, audioManager]);
  
  const handleCastSpell = useCallback((spell: PlayerSpell) => {
      if (spellCooldowns[spell] <= 0) {
          audioManager.playSound('uiClick');
          setActiveSpell(spell);
          setSelectedUnit(null);
          setSelectedSpot(null);
      }
  }, [spellCooldowns, audioManager]);

  const handleHeroAbility = useCallback(() => {
    setHero(h => {
        if (h.health > 0 && h.respawnTimer <= 0 && h.abilityCooldown <= 0) {
            audioManager.playSound('heroAbility');
            setEnemies(prevEnemies => prevEnemies.map(enemy => {
                if (getDistance(h.position, enemy.position) <= HERO_STATS.abilityRange) {
                    return {...enemy, tauntedBy: h.id};
                }
                return enemy;
            }));
            return {
                ...h,
                abilityCooldown: HERO_STATS.abilityCooldown,
                abilityActiveTimer: HERO_STATS.abilityDuration,
            };
        }
        return h;
    });
  }, [audioManager]);

  const setRallyPoint = useCallback((screenPos: Vector2D) => {
    if (selectedUnit && 'health' in selectedUnit && selectedUnit.id === hero.id) {
       setHero(h => ({ ...h, rallyPoint: screenPos, targetId: null }));
    }
  }, [selectedUnit, hero.id]);

  const getGameCoordinates = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): Vector2D => {
      const rect = e.currentTarget.getBoundingClientRect();
      let clientX, clientY;
      if ('touches' in e.nativeEvent) {
          clientX = e.nativeEvent.touches[0].clientX;
          clientY = e.nativeEvent.touches[0].clientY;
      } else {
          clientX = (e as React.MouseEvent<HTMLDivElement>).clientX;
          clientY = (e as React.MouseEvent<HTMLDivElement>).clientY;
      }

      const x = (clientX - rect.left) / scale;
      const y = (clientY - rect.top) / scale;
      return {x, y};
  }, [scale]);

  const handleMapInteractionStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const screenPos = getGameCoordinates(e);
    if (activeSpell) return;
      
    if (selectedUnit) {
        if ('abilityCooldown' in selectedUnit) { // It's the Hero
            setRallyPointDrag({
                startPosition: selectedUnit.position,
                currentPosition: screenPos,
                unitId: selectedUnit.id,
            });
        }
    } else {
      deselectAll();
    }
  }, [activeSpell, selectedUnit, getGameCoordinates]);

  const handleMapInteractionMove = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      const screenPos = getGameCoordinates(e);
      if (rallyPointDrag) {
          setRallyPointDrag(prev => prev ? { ...prev, currentPosition: screenPos } : null);
      }
  }, [rallyPointDrag, getGameCoordinates]);

  const handleMapInteractionEnd = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      const screenPos = getGameCoordinates(e);
      if (activeSpell) {
          if (activeSpell === 'REINFORCEMENTS') {
              const newReinforcements: Reinforcement[] = [];
              const closestPathGridPoint = findClosestPathPoint({x: screenPos.x / (GAME_CONFIG.tileWidth / 2), y: screenPos.y / (GAME_CONFIG.tileHeight / 2)});
              const destination = gameToScreen(closestPathGridPoint);
              for(let i = 0; i < REINFORCEMENTS_STATS.count; i++) {
                  newReinforcements.push({
                      id: Date.now() + i,
                      position: {x: screenPos.x + (i * 30 - 15), y: screenPos.y},
                      health: REINFORCEMENTS_STATS.health,
                      maxHealth: REINFORCEMENTS_STATS.health,
                      targetId: null,
                      attackCooldown: 0,
                      lifetime: REINFORCEMENTS_STATS.duration,
                      animationState: 'walk',
                      direction: 'right',
                      destination: destination,
                      damage: REINFORCEMENTS_STATS.damage,
                      range: REINFORCEMENTS_STATS.range,
                      speed: REINFORCEMENTS_STATS.speed,
                  });
              }
              setReinforcements(r => [...r, ...newReinforcements]);
              setSpellCooldowns(cds => ({...cds, REINFORCEMENTS: REINFORCEMENTS_STATS.cooldown}));
          } else if (activeSpell === 'RAIN_OF_FIRE') {
              audioManager.playSound('rainOfFire');
              setExplosions(ex => [...ex, {
                  id: Date.now(),
                  position: screenPos,
                  radius: RAIN_OF_FIRE_STATS.radius,
                  lifetime: 500,
                  type: 'FIRE'
              }]);
              setEnemies(prevEnemies => prevEnemies.map(enemy => {
                  if (getDistance(screenPos, enemy.position) <= RAIN_OF_FIRE_STATS.radius) {
                      return {...enemy, health: enemy.health - RAIN_OF_FIRE_STATS.damage};
                  }
                  return enemy;
              }));
              setSpellCooldowns(cds => ({...cds, RAIN_OF_FIRE: RAIN_OF_FIRE_STATS.cooldown}));
          }
          setActiveSpell(null);
          return;
      }
      
      if (rallyPointDrag) {
          setRallyPoint(screenPos);
          setRallyPointDrag(null);
          setSelectedUnit(null);
      } else if (!selectedUnit && !selectedSpot) {
          deselectAll();
      }
  }, [rallyPointDrag, activeSpell, setRallyPoint, selectedUnit, selectedSpot, audioManager, getGameCoordinates, findClosestPathPoint]);

  const cancelRallyPointDrag = useCallback(() => {
    setRallyPointDrag(null);
  }, []);
  
  const setAttackingState = (unitId: number | string, duration: number) => {
     const timerKey = `${unitId}`;
     const existingTimer = animationTimers.current.get(timerKey);
     if(existingTimer) clearTimeout(existingTimer);
     
     if (typeof unitId === 'number' && unitId === hero.id) {
         setHero(h => h.id === unitId ? { ...h, animationState: 'attack' } : h);
     } else if (reinforcements.some(r => r.id === unitId)) {
         setReinforcements(prev => prev.map(u => u.id === unitId ? { ...u, animationState: 'attack' } : u));
     } else {
         setSoldiers(prev => prev.map(u => u.id === unitId ? { ...u, animationState: 'attack' } : u));
     }

     const newTimer = setTimeout(() => {
         setTowers(prev => prev.map(u => u.id === unitId ? { ...u, isAttacking: false } : u));
         if (typeof unitId === 'number' && unitId === hero.id) {
            setHero(h => h.id === unitId ? { ...h, animationState: 'idle' } : h);
         } else if (reinforcements.some(r => r.id === unitId)) {
            setReinforcements(prev => prev.map(u => u.id === unitId ? { ...u, animationState: 'idle' } : u));
         } else {
            setSoldiers(prev => prev.map(u => u.id === unitId ? { ...u, animationState: 'idle' } : u));
         }

         animationTimers.current.delete(timerKey);
     }, duration);
     animationTimers.current.set(timerKey, newTimer);
  };

  useEffect(() => {
    if ((gameStatus !== 'WAVE_IN_PROGRESS' && gameStatus !== 'WAVE_COMPLETE') || isPaused) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeDelta = 1 / GAME_CONFIG.fps;
      const msPerFrame = 1000 / GAME_CONFIG.fps;
      let gameLost = false;

      let newProjectiles: Projectile[] = [];
      let killedEnemies: Enemy[] = [];
      let enemiesWhoReachedEnd: string[] = [];

      let currentEnemies = [...enemies];
      let currentTowers = [...towers];
      let currentSoldiers = [...soldiers];
      let currentReinforcements = [...reinforcements];
      let currentHero = {...hero};

      setSpellCooldowns(cds => ({
          REINFORCEMENTS: Math.max(0, cds.REINFORCEMENTS - msPerFrame),
          RAIN_OF_FIRE: Math.max(0, cds.RAIN_OF_FIRE - msPerFrame),
      }));
      setExplosions(exps => exps.map(e => ({...e, lifetime: e.lifetime - msPerFrame})).filter(e => e.lifetime > 0));
      
      setGoldParticles(prev => {
          const finishedParticles = prev.filter(p => getDistance(p.position, p.targetPosition) < 20);
          if (finishedParticles.length > 0) {
              const goldToAdd = finishedParticles.reduce((sum, p) => sum + p.value, 0);
              setStats(s => ({ ...s, gold: s.gold + goldToAdd }));
          }
          
          return prev
              .filter(p => getDistance(p.position, p.targetPosition) >= 20)
              .map(p => {
                  const dist = getDistance(p.position, p.targetPosition);
                  const dir = { x: (p.targetPosition.x - p.position.x) / dist, y: (p.targetPosition.y - p.position.y) / dist };
                  const speed = 25;
                  return {
                      ...p,
                      position: {
                          x: p.position.x + dir.x * speed,
                          y: p.position.y + dir.y * speed,
                      }
                  };
              });
      });

      const waveDefinition = WAVES[currentWave - 1];
      if (gameStatus === 'WAVE_IN_PROGRESS' && waveDefinition && waveSpawnData.current.spawnIndex < waveDefinition.enemies.length) {
          if (now - waveSpawnData.current.lastSpawnTime > waveDefinition.spawnRate) {
              const enemyType = waveDefinition.enemies[waveSpawnData.current.spawnIndex];
              const enemyStats = ENEMY_STATS[enemyType];
              const pathOffset = (Math.random() - 0.5) * GAME_CONFIG.pathWidth;
              const startPos = gameToScreen(MAP_PATH[0]);
              startPos.y += pathOffset;

              const newEnemy: Enemy = {
                  id: Date.now() + Math.random(),
                  type: enemyType,
                  name: enemyStats.name,
                  position: startPos,
                  health: enemyStats.health,
                  maxHealth: enemyStats.health,
                  pathIndex: 0,
                  armorType: enemyStats.armorType,
                  armorValue: enemyStats.armorValue,
                  attackCooldown: 0,
                  animationState: 'walk',
                  speed: enemyStats.speed,
                  slowTimer: 0,
                  pathOffset,
              };
              currentEnemies.push(newEnemy);
              waveSpawnData.current.spawnIndex++;
              waveSpawnData.current.lastSpawnTime = now;
          }
      }

      currentHero.abilityCooldown = Math.max(0, currentHero.abilityCooldown - msPerFrame);
      const wasAbilityActive = currentHero.abilityActiveTimer > 0;
      currentHero.abilityActiveTimer = Math.max(0, currentHero.abilityActiveTimer - msPerFrame);
      const isAbilityActive = currentHero.abilityActiveTimer > 0;
      if (wasAbilityActive && !isAbilityActive) {
          currentEnemies = currentEnemies.map(e => e.tauntedBy === currentHero.id ? { ...e, tauntedBy: null } : e);
      }
      
      const currentArmorValue = isAbilityActive 
          ? HERO_STATS.armorValue + HERO_STATS.abilityDefenseBonus
          : HERO_STATS.armorValue;
      currentHero.armorValue = Math.min(0.9, currentArmorValue);

      if (currentHero.animationState === 'die') {
        // Hero is in death animation, do nothing else
      }
      else if (currentHero.respawnTimer > 0) {
        currentHero.respawnTimer = Math.max(0, currentHero.respawnTimer - msPerFrame);
        if (currentHero.respawnTimer <= 0) {
            currentHero.health = currentHero.maxHealth;
            currentHero.position = gameToScreen(HERO_START_GRID_POS);
            currentHero.rallyPoint = gameToScreen(HERO_START_GRID_POS);
            currentHero.animationState = 'idle';
        }
    } else if (currentHero.health > 0) {
        let newHeroTargetId = currentHero.targetId;
        const newAttackCooldown = Math.max(0, currentHero.attackCooldown - msPerFrame);
        let newHeroPatrolTarget = currentHero.patrolTarget;
        let newIdleTimer = Math.max(0, (currentHero.idleTimer || 0) - msPerFrame);

        const currentTarget = newHeroTargetId ? currentEnemies.find(e => e.id === newHeroTargetId) : undefined;
        
        if (!currentTarget || getDistance(currentHero.rallyPoint, currentTarget.position) > HERO_STATS.patrolRange) {
            newHeroTargetId = null;
        }

        if (!newHeroTargetId) {
            let potentialTarget: Enemy | null = null;
            let minDistance = Infinity;
            for (const enemy of currentEnemies) {
                if (enemy.health > 0) {
                    const distanceToRally = getDistance(currentHero.rallyPoint, enemy.position);
                    if (distanceToRally <= HERO_STATS.patrolRange) {
                        const distanceToHero = getDistance(currentHero.position, enemy.position);
                        if (distanceToHero < minDistance) {
                            minDistance = distanceToHero;
                            potentialTarget = enemy;
                        }
                    }
                }
            }
            if (potentialTarget) newHeroTargetId = potentialTarget.id;
        }
        
        const targetEnemy = newHeroTargetId ? currentEnemies.find(e => e.id === newHeroTargetId) : null;

        if (targetEnemy) {
            newHeroPatrolTarget = undefined;
            const distanceToTarget = getDistance(currentHero.position, targetEnemy.position);

            if (distanceToTarget <= HERO_STATS.range) {
                currentHero.animationState = 'idle';
                if (newAttackCooldown <= 0) {
                    audioManager.playSound('heroAttack');
                    const targetIndex = currentEnemies.findIndex(e => e.id === newHeroTargetId);
                    if (targetIndex !== -1) {
                        let damage = HERO_STATS.damage;
                        if(targetEnemy.armorType === 'PHYSICAL') damage *= (1 - targetEnemy.armorValue);
                        currentEnemies[targetIndex] = { ...targetEnemy, health: targetEnemy.health - damage };
                    }
                    currentHero.attackCooldown = HERO_STATS.attackRate;
                    setAttackingState(currentHero.id, 400);
                }
            } 
            else {
                currentHero.animationState = 'walk';
                const moveDistance = HERO_STATS.speed * timeDelta;
                const direction = { x: targetEnemy.position.x - currentHero.position.x, y: targetEnemy.position.y - currentHero.position.y };
                currentHero.direction = direction.x >= 0 ? 'right' : 'left';
                const normalizedDir = { x: direction.x / distanceToTarget, y: direction.y / distanceToTarget };
                currentHero.position.x += normalizedDir.x * moveDistance;
                currentHero.position.y += normalizedDir.y * moveDistance;
            }
        } 
        else { // No enemy, patrol
            if (newHeroPatrolTarget) {
                const distanceToTarget = getDistance(currentHero.position, newHeroPatrolTarget);
                if (distanceToTarget < 10) {
                    newHeroPatrolTarget = undefined;
                    newIdleTimer = 1000 + Math.random() * 2000;
                    currentHero.animationState = 'idle';
                } else {
                    currentHero.animationState = 'walk';
                    const moveDistance = HERO_STATS.speed * timeDelta;
                    const direction = { x: newHeroPatrolTarget.x - currentHero.position.x, y: newHeroPatrolTarget.y - currentHero.position.y };
                    currentHero.direction = direction.x >= 0 ? 'right' : 'left';
                    const normalizedDir = { x: direction.x / distanceToTarget, y: direction.y / distanceToTarget };
                    currentHero.position.x += normalizedDir.x * moveDistance;
                    currentHero.position.y += normalizedDir.y * moveDistance;
                }
            } else if (newIdleTimer <= 0) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * HERO_STATS.patrolRadius;
                newHeroPatrolTarget = {
                    x: currentHero.rallyPoint.x + Math.cos(angle) * radius,
                    y: currentHero.rallyPoint.y + Math.sin(angle) * radius,
                };
            } else {
                currentHero.animationState = 'idle';
            }
        }
        currentHero.targetId = newHeroTargetId;
        currentHero.attackCooldown = newAttackCooldown;
        currentHero.patrolTarget = newHeroPatrolTarget;
        currentHero.idleTimer = newIdleTimer;
    }

      currentTowers = currentTowers.map(tower => {
        if (tower.type === 'NORTHERN_BARRACKS') return tower;
        const newCooldown = Math.max(0, tower.cooldown - msPerFrame);
        let newTargetId = tower.targetId;
        const towerLevelStats = TOWER_STATS[tower.type][tower.level - 1];
        const screenTowerPos = gameToScreen(tower.position);
        const currentTarget = newTargetId ? currentEnemies.find(e => e.id === newTargetId) : undefined;
        if (!currentTarget || getDistance(screenTowerPos, currentTarget.position) > towerLevelStats.range) newTargetId = null;
        if (newCooldown <= 0) {
          if (!newTargetId) {
            let potentialTarget: Enemy | null = null;
            let minDistance = Infinity;
            for (const enemy of currentEnemies) {
              if (enemy.health > 0) {
                  const distance = getDistance(screenTowerPos, enemy.position);
                  if (distance < towerLevelStats.range && distance < minDistance) {
                    minDistance = distance;
                    potentialTarget = enemy;
                  }
              }
            }
            if (potentialTarget) newTargetId = potentialTarget.id;
          }
          if (newTargetId) {
            const targetEnemy = currentEnemies.find(e => e.id === newTargetId);
            if (towerLevelStats.projectileType && towerLevelStats.projectileSpeed && targetEnemy) {
              const sound = projectileSoundMap[towerLevelStats.projectileType];
              audioManager.playSound(sound);
              newProjectiles.push({
                id: now + Math.random(), type: towerLevelStats.projectileType, position: { ...screenTowerPos },
                targetId: tower.type === 'SIEGE_WORKSHOP' ? null : newTargetId, targetPosition: {...targetEnemy.position},
                damage: towerLevelStats.damage, damageType: towerLevelStats.damageType, speed: towerLevelStats.projectileSpeed,
                splashRadius: towerLevelStats.splashRadius,
                slows: towerLevelStats.slows,
              });
              
              setTowers(prev => prev.map(u => u.id === tower.id ? { ...u, isAttacking: true } : u));
              setTimeout(() => setTowers(prev => prev.map(u => u.id === tower.id ? { ...u, isAttacking: false } : u)), 300);
              
              return { ...tower, cooldown: towerLevelStats.fireRate, targetId: newTargetId, isAttacking: true };
            }
          }
        }
        return { ...tower, cooldown: newCooldown, targetId: newTargetId };
      });

      currentSoldiers = currentSoldiers.map(soldier => {
        if (soldier.respawnTimer > 0) {
            const newRespawnTimer = Math.max(0, soldier.respawnTimer - msPerFrame);
            if (newRespawnTimer <= 0) {
                // Soldier has respawned. Trigger barracks animation.
                const barracksIndex = currentTowers.findIndex(t => t.id === soldier.barracksId);
                if (barracksIndex > -1) {
                    const currentCounter = currentTowers[barracksIndex].spawnCounter || 0;
                    currentTowers[barracksIndex] = {...currentTowers[barracksIndex], spawnCounter: currentCounter + 1};
                }
                return { ...soldier, health: soldier.maxHealth, position: { ...soldier.rallyPoint! }, respawnTimer: 0, animationState: 'idle' };
            }
            return { ...soldier, respawnTimer: newRespawnTimer };
        }

        if (soldier.deathAnimTimer !== undefined && soldier.deathAnimTimer > 0) {
            const newTimer = soldier.deathAnimTimer - msPerFrame;
            if (newTimer <= 0) {
                // Death animation is over, start respawn
                return { ...soldier, deathAnimTimer: 0, respawnTimer: SOLDIER_STATS.respawnTime };
            }
            // Still dying, update timer and do nothing else
            return { ...soldier, deathAnimTimer: newTimer };
        }
        
        if (soldier.health <= 0) {
            // Start death animation sequence if not already dying
            if (soldier.animationState !== 'die') {
                return { ...soldier, animationState: 'die', targetId: null, deathAnimTimer: 600 };
            }
            return soldier;
        }

        if (soldier.animationState === 'die') {
            return soldier;
        }

        let newTargetId = soldier.targetId;
        const newAttackCooldown = Math.max(0, soldier.attackCooldown - msPerFrame);
        let newPatrolTarget = soldier.patrolTarget;
        let newIdleTimer = Math.max(0, (soldier.idleTimer || 0) - msPerFrame);
        
        let targetEnemy = newTargetId ? currentEnemies.find(e => e.id === newTargetId) : undefined;
        
        const needsNewTarget = !targetEnemy || getDistance(soldier.position, targetEnemy.position) > SOLDIER_STATS.range || targetEnemy.health <= 0;

        if (needsNewTarget) {
            newTargetId = null;
            const potentialTargets = currentEnemies.filter(e => e.health > 0 && getDistance(soldier.position, e.position) <= SOLDIER_STATS.range);

            if (potentialTargets.length > 0) {
                const enemyTargetCounts = new Map<number, number>();
                currentSoldiers.forEach(s => {
                    if (s.targetId) {
                        enemyTargetCounts.set(s.targetId, (enemyTargetCounts.get(s.targetId) || 0) + 1);
                    }
                });

                potentialTargets.sort((a, b) => {
                    const countA = enemyTargetCounts.get(a.id) || 0;
                    const countB = enemyTargetCounts.get(b.id) || 0;
                    if (countA !== countB) {
                        return countA - countB;
                    }
                    return getDistance(soldier.position, a.position) - getDistance(soldier.position, b.position);
                });
                
                newTargetId = potentialTargets[0].id;
            }
            targetEnemy = newTargetId ? currentEnemies.find(e => e.id === newTargetId) : undefined;
        }
        
        let newAnimationState = soldier.animationState;
        let newDirection = soldier.direction;
        
        if (targetEnemy) {
            newPatrolTarget = undefined;
            const distanceToTarget = getDistance(soldier.position, targetEnemy.position);
             if (distanceToTarget <= SOLDIER_STATS.blockingRadius + 5) {
                newAnimationState = 'idle';
                if (newAttackCooldown <= 0) {
                    audioManager.playSound('soldierAttack');
                    const targetIndex = currentEnemies.findIndex(e => e.id === newTargetId);
                    if (targetIndex !== -1) {
                        const enemy = currentEnemies[targetIndex];
                        let damage = SOLDIER_STATS.damage;
                        if(enemy.armorType === 'PHYSICAL') damage *= (1 - enemy.armorValue);
                        currentEnemies[targetIndex] = { ...enemy, health: enemy.health - damage };
                    }
                    setAttackingState(soldier.id, 400);
                    return { ...soldier, attackCooldown: SOLDIER_STATS.attackRate, targetId: newTargetId };
                }
             } else {
                 newAnimationState = 'walk';
                 const moveDistance = SOLDIER_STATS.speed * timeDelta;
                 const directionVec = { x: targetEnemy.position.x - soldier.position.x, y: targetEnemy.position.y - soldier.position.y };
                 newDirection = directionVec.x >= 0 ? 'right' : 'left';
                 const normalizedDir = { x: directionVec.x / distanceToTarget, y: directionVec.y / distanceToTarget };
                 soldier.position.x += normalizedDir.x * moveDistance;
                 soldier.position.y += normalizedDir.y * moveDistance;
             }
        } else {
             if (newPatrolTarget) {
                const distanceToTarget = getDistance(soldier.position, newPatrolTarget);
                if (distanceToTarget < 10) {
                    newPatrolTarget = undefined;
                    newIdleTimer = 1000 + Math.random() * 2000;
                    newAnimationState = 'idle';
                } else {
                    newAnimationState = 'walk';
                    const moveDistance = SOLDIER_STATS.speed * timeDelta;
                    const directionVec = { x: newPatrolTarget.x - soldier.position.x, y: newPatrolTarget.y - soldier.position.y };
                    newDirection = directionVec.x >= 0 ? 'right' : 'left';
                    const normalizedDir = { x: directionVec.x / distanceToTarget, y: directionVec.y / distanceToTarget };
                    soldier.position.x += normalizedDir.x * moveDistance;
                    soldier.position.y += normalizedDir.y * moveDistance;
                }
            } else if (newIdleTimer <= 0) {
              const angle = Math.random() * 2 * Math.PI;
              const radius = Math.random() * SOLDIER_STATS.patrolRadius;
              newPatrolTarget = {
                x: soldier.rallyPoint!.x + Math.cos(angle) * radius,
                y: soldier.rallyPoint!.y + Math.sin(angle) * radius,
              };
            } else {
                newAnimationState = 'idle';
            }
        }
        return { ...soldier, attackCooldown: newAttackCooldown, targetId: newTargetId, animationState: newAnimationState, direction: newDirection, patrolTarget: newPatrolTarget, idleTimer: newIdleTimer };
    });

      currentReinforcements = currentReinforcements.map(r => {
        if (r.health <= 0) return { ...r, animationState: 'die' };
        if (r.animationState === 'die') return r;

        let newTargetId = r.targetId;
        const newAttackCooldown = Math.max(0, r.attackCooldown - msPerFrame);
        
        let targetEnemy = newTargetId ? currentEnemies.find(e => e.id === newTargetId) : undefined;
        if (!targetEnemy || targetEnemy.health <= 0) {
            newTargetId = null;
            let potentialTarget: Enemy | null = null;
            let minDistance = r.range;
            for (const enemy of currentEnemies) {
               if (enemy.health > 0) {
                    const distance = getDistance(r.position, enemy.position);
                    if (distance < minDistance) { minDistance = distance; potentialTarget = enemy; }
               }
            }
            if (potentialTarget) newTargetId = potentialTarget.id;
            targetEnemy = newTargetId ? currentEnemies.find(e => e.id === newTargetId) : undefined;
        }

        let newAnimationState: GroundUnitAnimationState = r.animationState;
        let newDirection = r.direction;

        if (targetEnemy) {
            const distanceToTarget = getDistance(r.position, targetEnemy.position);
            if (distanceToTarget <= REINFORCEMENTS_STATS.blockingRadius + 5) {
                newAnimationState = 'idle';
                if (newAttackCooldown <= 0) {
                    const targetIndex = currentEnemies.findIndex(e => e.id === newTargetId);
                    if (targetIndex !== -1) {
                        const enemy = currentEnemies[targetIndex];
                        let damage = r.damage;
                        if (enemy.armorType === 'PHYSICAL') damage *= (1 - enemy.armorValue);
                        currentEnemies[targetIndex] = {...enemy, health: enemy.health - damage };
                    }
                    setAttackingState(r.id, 400);
                    return { ...r, attackCooldown: REINFORCEMENTS_STATS.attackRate, targetId: newTargetId };
                }
            } else {
                newAnimationState = 'walk';
                const moveDistance = r.speed * timeDelta;
                const directionVec = { x: targetEnemy.position.x - r.position.x, y: targetEnemy.position.y - r.position.y };
                newDirection = directionVec.x >= 0 ? 'right' : 'left';
                const normalizedDir = { x: directionVec.x / distanceToTarget, y: directionVec.y / distanceToTarget };
                r.position.x += normalizedDir.x * moveDistance;
                r.position.y += normalizedDir.y * moveDistance;
            }
        } else {
            const distanceToDestination = getDistance(r.position, r.destination);
            if (distanceToDestination > 10) {
                newAnimationState = 'walk';
                const moveDistance = r.speed * timeDelta;
                const directionVec = { x: r.destination.x - r.position.x, y: r.destination.y - r.position.y };
                newDirection = directionVec.x >= 0 ? 'right' : 'left';
                const normalizedDir = { x: directionVec.x / distanceToDestination, y: directionVec.y / distanceToDestination };
                r.position.x += normalizedDir.x * moveDistance;
                r.position.y += normalizedDir.y * moveDistance;
            } else {
                newAnimationState = 'idle';
            }
        }
        
        return {...r, lifetime: r.lifetime - msPerFrame, attackCooldown: newAttackCooldown, targetId: newTargetId, animationState: newAnimationState, direction: newDirection };
      }).filter(r => r.lifetime > 0 && r.animationState !== 'die');
      
      const updatedProjectiles = projectiles.filter(proj => {
          const targetPosition = proj.targetId ? currentEnemies.find(e => e.id === proj.targetId)?.position : proj.targetPosition;
          if (!targetPosition) return false;
          const distanceToTarget = getDistance(proj.position, targetPosition);
          const moveDistance = proj.speed * timeDelta;
          if (distanceToTarget <= moveDistance) {
              const applyDamage = (enemy: Enemy) => {
                  let actualDamage = proj.damage;
                  if (proj.damageType === DamageType.PHYSICAL && enemy.armorType === 'PHYSICAL') actualDamage *= (1 - enemy.armorValue);
                  if (proj.damageType === DamageType.MAGIC && enemy.armorType === ArmorType.NONE) actualDamage *= 1.25; // Example: magic is strong vs unarmored
                  
                  let newSlowTimer = enemy.slowTimer;
                  if (proj.slows) {
                      newSlowTimer = proj.slows.duration;
                  }

                  return {...enemy, health: enemy.health - actualDamage, slowTimer: newSlowTimer };
              }

              if (proj.splashRadius && proj.splashRadius > 0) {
                   audioManager.playSound('explosion');
                   setExplosions(exps => [...exps, { id: Date.now() + Math.random(), position: targetPosition, radius: proj.splashRadius!, lifetime: 300, type: 'GENERIC' }]);
                   currentEnemies = currentEnemies.map(enemy => {
                       if (getDistance(enemy.position, targetPosition) <= proj.splashRadius!) {
                           return applyDamage(enemy);
                       }
                       return enemy;
                   });
              } else {
                  const targetIndex = currentEnemies.findIndex(e => e.id === proj.targetId);
                  if (targetIndex !== -1) {
                      currentEnemies[targetIndex] = applyDamage(currentEnemies[targetIndex]);
                  }
              }
              return false; 
          }
          const direction = { x: targetPosition.x - proj.position.x, y: targetPosition.y - proj.position.y };
          const normalizedDir = { x: direction.x / distanceToTarget, y: direction.y / distanceToTarget };
          proj.position.x += normalizedDir.x * moveDistance;
          proj.position.y += normalizedDir.y * moveDistance;
          return true;
      });

      currentEnemies = currentEnemies.map((enemy): Enemy | null => {
        if (enemy.health <= 0) {
            killedEnemies.push(enemy);
            audioManager.playSound('enemyDeath');
            return null;
        }

        let newAnimationState = enemy.animationState;
        if (newAnimationState === 'attack') {
            newAnimationState = 'idle'; // Reset after 1 frame, animation will play out
        }

        let isBlocked = false;
        let blocker: Soldier | Hero | Reinforcement | null = null;
        let blockerType: 'soldier' | 'hero' | 'reinforcement' | null = null;
        let closestDist = Infinity;
        
        // Check for hero first if taunted
        if (enemy.tauntedBy === currentHero.id && currentHero.health > 0) {
            const dist = getDistance(enemy.position, currentHero.position);
            if (dist < HERO_STATS.blockingRadius) {
                 closestDist = dist; isBlocked = true; blocker = currentHero; blockerType = 'hero';
            }
        }
        
        if (!isBlocked) {
            const allMeleeUnits: (Soldier | Reinforcement)[] = [...currentSoldiers.filter(s => s.health > 0 && s.animationState !== 'die' && s.respawnTimer <= 0), ...currentReinforcements.filter(r => r.health > 0)];
            allMeleeUnits.forEach(unit => {
                const dist = getDistance(enemy.position, unit.position);
                const blockingRadius = 'barracksId' in unit ? SOLDIER_STATS.blockingRadius : REINFORCEMENTS_STATS.blockingRadius;
                if (dist < blockingRadius && dist < closestDist) {
                    closestDist = dist; isBlocked = true; blocker = unit;
                    blockerType = 'barracksId' in unit ? 'soldier' : 'reinforcement';
                }
            });
            if (currentHero.health > 0 && currentHero.respawnTimer <= 0) {
                const dist = getDistance(enemy.position, currentHero.position);
                if (dist < HERO_STATS.blockingRadius && dist < closestDist) {
                    isBlocked = true; blocker = currentHero; blockerType = 'hero';
                }
            }
        }

        const enemyStats = ENEMY_STATS[enemy.type];
        const newAttackCooldown = Math.max(0, (enemy.attackCooldown || 0) - msPerFrame);
        let updatedEnemy = { ...enemy, attackCooldown: newAttackCooldown };

        if (isBlocked && blocker) {
            newAnimationState = 'idle';
            if (newAttackCooldown <= 0) {
                audioManager.playSound('enemyAttack');
                newAnimationState = 'attack';
                let damageDealt = enemyStats.damage;
                if (blockerType === 'hero') {
                     const heroBlocker = blocker as Hero;
                     damageDealt *= (1 - heroBlocker.armorValue);
                     heroBlocker.health = Math.max(0, heroBlocker.health - damageDealt);
                     if (heroBlocker.health <= 0) {
                        heroBlocker.animationState = 'die';
                        const dieAnimDuration = 600;
                        setTimeout(() => {
                            setHero(h => ({...h, respawnTimer: HERO_STATS.respawnTime}))
                        }, dieAnimDuration);
                        audioManager.playSound('enemyDeath'); // a hero death sound
                     }
                } else if (blockerType === 'soldier') {
                    const soldierIndex = currentSoldiers.findIndex(s => s.id === blocker!.id);
                    if (soldierIndex !== -1) currentSoldiers[soldierIndex].health = Math.max(0, currentSoldiers[soldierIndex].health - damageDealt);
                } else if (blockerType === 'reinforcement') {
                     const reinforcementIndex = currentReinforcements.findIndex(s => s.id === blocker!.id);
                    if (reinforcementIndex !== -1) currentReinforcements[reinforcementIndex].health = Math.max(0, currentReinforcements[reinforcementIndex].health - damageDealt);
                }
                updatedEnemy = { ...updatedEnemy, attackCooldown: enemyStats.attackRate, animationState: 'attack' };
            }
            return { ...updatedEnemy, animationState: newAnimationState };
        }
        
        newAnimationState = 'walk';
        if (enemy.tauntedBy === currentHero.id && currentHero.health > 0) {
            const distToTaunter = getDistance(enemy.position, currentHero.position);
            const moveDistance = enemy.speed * timeDelta;
            const direction = { x: currentHero.position.x - enemy.position.x, y: currentHero.position.y - enemy.position.y };
            const normalizedDir = { x: direction.x / distToTaunter, y: direction.y / distToTaunter };
            const newPos = {x: enemy.position.x + normalizedDir.x * moveDistance, y: enemy.position.y + normalizedDir.y * moveDistance};
            return { ...enemy, position: newPos, animationState: newAnimationState };
        }

        const newSlowTimer = Math.max(0, enemy.slowTimer - msPerFrame);
        const currentSpeed = enemy.slowTimer > 0 ? enemy.speed * 0.5 : enemy.speed; // 50% slow
        const distanceToTravel = currentSpeed * timeDelta;
        let currentPathIndex = enemy.pathIndex;
        let newPosition = { ...enemy.position };
        if (currentPathIndex < MAP_PATH.length - 1) {
          const nextPathNodeGrid = MAP_PATH[currentPathIndex + 1];
          const nextPathNodeScreen = gameToScreen(nextPathNodeGrid);
          nextPathNodeScreen.y += enemy.pathOffset;

          const distanceToNextNode = getDistance(newPosition, nextPathNodeScreen);
          if (distanceToNextNode < distanceToTravel) {
              const remainingDistance = distanceToTravel - distanceToNextNode;
              currentPathIndex++;
               if (currentPathIndex >= MAP_PATH.length - 1) {
                   enemiesWhoReachedEnd.push(enemy.id.toString());
                   return null;
               } else {
                    const nextNextNodeGrid = MAP_PATH[currentPathIndex + 1];
                    const nextNextNode = gameToScreen(nextNextNodeGrid);
                    nextNextNode.y += enemy.pathOffset;

                    const directionToNext = {x: nextNextNode.x - nextPathNodeScreen.x, y: nextNextNode.y - nextPathNodeScreen.y};
                    const distToNext = getDistance(nextPathNodeScreen, nextNextNode) || 1;
                    const normalizedDir = {x: directionToNext.x / distToNext, y: directionToNext.y / distToNext};
                    newPosition = { x: nextPathNodeScreen.x + normalizedDir.x * remainingDistance, y: nextPathNodeScreen.y + normalizedDir.y * remainingDistance };
               }
          } else {
              const direction = { x: nextPathNodeScreen.x - newPosition.x, y: nextPathNodeScreen.y - newPosition.y };
              const normalizedDir = { x: direction.x / distanceToNextNode, y: direction.y / distanceToNextNode };
              newPosition.x += normalizedDir.x * distanceToTravel;
              newPosition.y += normalizedDir.y * distanceToTravel;
          }
        } else {
           enemiesWhoReachedEnd.push(enemy.id.toString());
           return null;
        }
        return { ...enemy, position: newPosition, pathIndex: currentPathIndex, attackCooldown: 0, slowTimer: newSlowTimer, animationState: newAnimationState };
        
      }).filter((e): e is Enemy => e !== null);
      
      if (enemiesWhoReachedEnd.length > 0) {
        audioManager.playSound('lifeLost');
        setStats(s => {
            const newLives = Math.max(0, s.lives - enemiesWhoReachedEnd.length);
            if (newLives === 0) gameLost = true;
            return { ...s, lives: newLives };
        });
      }
      if (killedEnemies.length > 0) {
        const targetPos = { x: 100, y: 50 };
        const newParticles: GoldParticle[] = killedEnemies.map(enemy => ({
            id: enemy.id,
            position: { ...enemy.position },
            targetPosition: targetPos,
            value: ENEMY_STATS[enemy.type].gold,
        }));
        setGoldParticles(gp => [...gp, ...newParticles]);
      }
      
      setTowers(currentTowers);
      setProjectiles([...updatedProjectiles, ...newProjectiles]);
      setSoldiers(currentSoldiers);
      setReinforcements(currentReinforcements);
      setEnemies(currentEnemies);
      setHero(currentHero);

      if (selectedUnit) {
        let updatedUnit: SelectableUnit | null = null;
        if ('level' in selectedUnit) updatedUnit = currentTowers.find(t => t.id === selectedUnit.id) || null;
        else if ('barracksId' in selectedUnit) updatedUnit = currentSoldiers.find(s => s.id === selectedUnit.id) || null;
        else if ('pathIndex' in selectedUnit) updatedUnit = currentEnemies.find(e => e.id === selectedUnit.id) || null;
        else if (selectedUnit.id === currentHero.id) updatedUnit = currentHero;
        setSelectedUnit(updatedUnit);
      }

      if (gameLost) {
        setGameStatus('GAME_OVER');
        audioManager.playSound('gameOver');
        audioManager.stopMusic();
        return;
      }
      
      if (gameStatus === 'WAVE_IN_PROGRESS' && waveDefinition && waveSpawnData.current.spawnIndex >= waveDefinition.enemies.length && currentEnemies.length === 0) {
         if (currentWave === WAVES.length) {
              setGameStatus('VICTORY');
              audioManager.playSound('victory');
              audioManager.stopMusic();
         } else {
             setGameStatus('WAVE_COMPLETE');
             setNextWaveTimer(GAME_CONFIG.timeBetweenWaves);
             if(waveTimerInterval.current) clearInterval(waveTimerInterval.current);
             waveTimerInterval.current = setInterval(() => {
                 setNextWaveTimer(t => {
                     if (t <= 1000) {
                         startNextWave();
                         return 0;
                     }
                     return t - 1000;
                 })
             }, 1000);
         }
      }

    }, 1000 / GAME_CONFIG.fps);

    return () => clearInterval(intervalId);
  }, [gameStatus, isPaused, currentWave, enemies, towers, projectiles, soldiers, hero, reinforcements, audioManager, selectedUnit, startNextWave]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-black">
      <div 
        className="relative bg-gray-800 shadow-2xl overflow-hidden"
        style={{
          width: GAME_CONFIG.width,
          height: GAME_CONFIG.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          touchAction: 'none',
        }}
        onMouseDown={handleMapInteractionStart}
        onMouseMove={handleMapInteractionMove}
        onMouseUp={handleMapInteractionEnd}
        onTouchStart={handleMapInteractionStart}
        onTouchMove={handleMapInteractionMove}
        onTouchEnd={handleMapInteractionEnd}
        onMouseLeave={cancelRallyPointDrag}
        onTouchCancel={cancelRallyPointDrag}
      >
        <GameBoard
          towers={towers}
          enemies={enemies}
          projectiles={projectiles}
          soldiers={soldiers}
          hero={hero}
          reinforcements={reinforcements}
          explosions={explosions}
          goldParticles={goldParticles}
          activeSpell={activeSpell}
          onSpotClick={handleSpotClick}
          onSelectUnit={handleSelectUnit}
          selectedUnit={selectedUnit}
          rallyPointDrag={rallyPointDrag}
        />
        {selectedSpot && (
          <TowerMenu
            position={gameToScreen(selectedSpot)}
            onBuild={handleBuildTower}
            onClose={() => setSelectedSpot(null)}
            gold={stats.gold}
          />
        )}
         <HUD 
          stats={stats} 
          currentWave={currentWave} 
          gameStatus={gameStatus} 
          onStartWave={handleStartWave}
          nextWaveTimer={nextWaveTimer}
          isMuted={isMuted}
          onToggleMute={() => {
              audioManager.playSound('uiClick');
              setIsMuted(prev => !prev);
          }}
          isPaused={isPaused}
          onTogglePause={() => {
              audioManager.playSound('uiClick');
              setIsPaused(p => !p);
          }}
          selectedUnit={selectedUnit}
          onUpgradeTower={handleUpgradeTower}
          onSellTower={handleSellTower}
          onHeroAbility={handleHeroAbility}
          spellCooldowns={spellCooldowns}
          onCastSpell={handleCastSpell}
          gold={stats.gold}
          hero={hero}
       />
        {(gameStatus === 'GAME_OVER' || gameStatus === 'VICTORY') && (
          <Modal status={gameStatus} onRestart={resetGame} />
        )}
      </div>
    </div>
  );
};

export default App;
