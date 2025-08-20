
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
import { DamageType } from './types';
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
} from './types';
import { getDistance, AudioManager, gameToScreen } from './utils';
import { MAP_PATH } from './constants';

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
    isAttacking: false,
    abilityCooldown: 0,
    abilityActiveTimer: 0,
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

  const waveSpawnData = useRef({ spawnIndex: 0, lastSpawnTime: 0 });

  const findClosestPathPoint = useCallback((point: Vector2D): Vector2D => {
      let closestPoint: Vector2D = {...MAP_PATH[0]};
      let minDistance = Infinity;

      for(let i = 0; i < MAP_PATH.length; i++) {
          const dist = getDistance(point, MAP_PATH[i]);
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
        isAttacking: false,
        abilityCooldown: 0,
        abilityActiveTimer: 0,
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
    if(currentWave === 0) {
       audioManager.playMusic();
    }
  }, [gameStatus, audioManager, currentWave]);

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
      };

      if (towerType === 'BARRACKS') {
          const rallyPoint = findClosestPathPoint(selectedSpot);
          newTower.rallyPoint = rallyPoint;
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
                  isAttacking: false,
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
    if (towerToSell.type === 'BARRACKS') {
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
       setHero(h => ({ ...h, rallyPoint: screenPos }));
    } else if (selectedUnit && 'type' in selectedUnit && selectedUnit.type === 'BARRACKS') {
        const towerStats = TOWER_STATS.BARRACKS[selectedUnit.level - 1];
        const barracksScreenPos = gameToScreen(selectedUnit.position);
        if (getDistance(barracksScreenPos, screenPos) <= towerStats.range) {
            let closestGridPoint: Vector2D = {...MAP_PATH[0]};
            let minDistance = Infinity;
            for(const pathPoint of MAP_PATH) {
                const pathScreenPos = gameToScreen(pathPoint);
                const dist = getDistance(screenPos, pathScreenPos);
                if(dist < minDistance) {
                    minDistance = dist;
                    closestGridPoint = pathPoint;
                }
            }

            setTowers(prevTowers => prevTowers.map(t => 
                t.id === selectedUnit.id ? {...t, rallyPoint: closestGridPoint} : t
            ));
            
            setSoldiers(prevSoldiers => {
                const newRallyScreenPos = gameToScreen(closestGridPoint);
                return prevSoldiers.map((s) => {
                    if (s.barracksId === selectedUnit.id) {
                        const siblingSoldiers = prevSoldiers.filter(so => so.barracksId === selectedUnit.id);
                        const soldierIndex = siblingSoldiers.findIndex(ss => ss.id === s.id);
                        const angle = (soldierIndex / siblingSoldiers.length) * 2 * Math.PI;
                        const individualRallyPoint = {
                            x: newRallyScreenPos.x + Math.cos(angle) * 25,
                            y: newRallyScreenPos.y + Math.sin(angle) * 25
                        };
                        return {...s, rallyPoint: individualRallyPoint};
                    }
                    return s;
                });
            });
        }
    }
  }, [selectedUnit, hero.id]);

  const getGameCoordinates = useCallback((e: React.MouseEvent<HTMLDivElement>): Vector2D => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      return {x, y};
  }, [scale]);

  const handleMapMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const screenPos = getGameCoordinates(e);
    if (activeSpell) return;
      
    if (selectedUnit) {
        if ('abilityCooldown' in selectedUnit) { // It's the Hero
            setRallyPointDrag({
                startPosition: selectedUnit.position,
                currentPosition: screenPos,
                unitId: selectedUnit.id,
            });
        } else if ('level' in selectedUnit && selectedUnit.type === 'BARRACKS' && selectedUnit.rallyPoint) {
            setRallyPointDrag({
                startPosition: gameToScreen(selectedUnit.rallyPoint),
                currentPosition: screenPos,
                unitId: selectedUnit.id,
            });
        }
    } else {
      deselectAll();
    }
  }, [activeSpell, selectedUnit, getGameCoordinates]);

  const handleMapMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const screenPos = getGameCoordinates(e);
      if (rallyPointDrag) {
          setRallyPointDrag(prev => prev ? { ...prev, currentPosition: screenPos } : null);
      }
  }, [rallyPointDrag, getGameCoordinates]);

  const handleMapMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const screenPos = getGameCoordinates(e);
      if (activeSpell) {
          if (activeSpell === 'REINFORCEMENTS') {
              const newReinforcements: Reinforcement[] = [];
              for(let i = 0; i < REINFORCEMENTS_STATS.count; i++) {
                  newReinforcements.push({
                      id: Date.now() + i,
                      position: {x: screenPos.x + (i * 30 - 15), y: screenPos.y},
                      health: REINFORCEMENTS_STATS.health,
                      maxHealth: REINFORCEMENTS_STATS.health,
                      targetId: null,
                      attackCooldown: 0,
                      lifetime: REINFORCEMENTS_STATS.duration,
                      isAttacking: false,
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
                  lifetime: 500
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
  }, [rallyPointDrag, activeSpell, setRallyPoint, selectedUnit, selectedSpot, audioManager, getGameCoordinates]);

  const cancelRallyPointDrag = useCallback(() => {
    setRallyPointDrag(null);
  }, []);
  
  const setAttackingState = (unitId: number | string, isAttacking: boolean, duration: number) => {
     const timerKey = `${unitId}`;
     const existingTimer = animationTimers.current.get(timerKey);
     if(existingTimer) clearTimeout(existingTimer);

     const newTimer = setTimeout(() => {
         setEnemies(prev => prev.map(u => u.id === unitId ? { ...u, isAttacking: false } : u));
         setTowers(prev => prev.map(u => u.id === unitId ? { ...u, isAttacking: false } : u));
         setSoldiers(prev => prev.map(u => u.id === unitId ? { ...u, isAttacking: false } : u));
         setReinforcements(prev => prev.map(u => u.id === unitId ? { ...u, isAttacking: false } : u));
         setHero(h => h.id === unitId ? { ...h, isAttacking: false } : h);
         animationTimers.current.delete(timerKey);
     }, duration);
     animationTimers.current.set(timerKey, newTimer);
  };

  useEffect(() => {
    if (gameStatus !== 'WAVE_IN_PROGRESS' || isPaused) return;

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
      if (waveDefinition && waveSpawnData.current.spawnIndex < waveDefinition.enemies.length) {
          if (now - waveSpawnData.current.lastSpawnTime > waveDefinition.spawnRate) {
              const enemyType = waveDefinition.enemies[waveSpawnData.current.spawnIndex];
              const enemyStats = ENEMY_STATS[enemyType];
              const newEnemy: Enemy = {
                  id: Date.now() + Math.random(),
                  type: enemyType,
                  name: enemyStats.name,
                  position: gameToScreen(MAP_PATH[0]),
                  health: enemyStats.health,
                  maxHealth: enemyStats.health,
                  pathIndex: 0,
                  armorType: enemyStats.armorType,
                  armorValue: enemyStats.armorValue,
                  attackCooldown: 0,
                  isAttacking: false,
              };
              currentEnemies.push(newEnemy);
              waveSpawnData.current.spawnIndex++;
              waveSpawnData.current.lastSpawnTime = now;
          }
      }

      currentHero.abilityCooldown = Math.max(0, currentHero.abilityCooldown - msPerFrame);
      currentHero.abilityActiveTimer = Math.max(0, currentHero.abilityActiveTimer - msPerFrame);
      const isHeroAbilityActive = currentHero.abilityActiveTimer > 0;

      if (currentHero.respawnTimer > 0) {
        currentHero.respawnTimer = Math.max(0, currentHero.respawnTimer - msPerFrame);
        if (currentHero.respawnTimer <= 0) {
            currentHero.health = currentHero.maxHealth;
            currentHero.position = gameToScreen(HERO_START_GRID_POS);
            currentHero.rallyPoint = gameToScreen(HERO_START_GRID_POS);
        }
    } else if (currentHero.health > 0) {
        let newHeroTargetId = currentHero.targetId;
        const newAttackCooldown = Math.max(0, currentHero.attackCooldown - msPerFrame);

        const currentTarget = newHeroTargetId ? currentEnemies.find(e => e.id === newHeroTargetId) : undefined;
        if (!currentTarget || getDistance(currentHero.position, currentTarget.position) > HERO_STATS.range) {
            newHeroTargetId = null;
        }

        if (!newHeroTargetId) {
            let potentialTarget: Enemy | null = null;
            let minDistance = HERO_STATS.range;
            for (const enemy of currentEnemies) {
                if (enemy.health > 0) {
                    const distance = getDistance(currentHero.position, enemy.position);
                    if (distance < minDistance) {
                        minDistance = distance;
                        potentialTarget = enemy;
                    }
                }
            }
            if (potentialTarget) newHeroTargetId = potentialTarget.id;
        }

        if (newHeroTargetId) {
            if (newAttackCooldown <= 0) {
                audioManager.playSound('heroAttack');
                const targetIndex = currentEnemies.findIndex(e => e.id === newHeroTargetId);
                if (targetIndex !== -1) {
                    const enemy = currentEnemies[targetIndex];
                    let damage = HERO_STATS.damage;
                    if(isHeroAbilityActive) damage *= HERO_STATS.abilityDamageBoost;
                    if (enemy.armorType === 'PHYSICAL') damage *= (1 - enemy.armorValue);
                    currentEnemies[targetIndex] = { ...enemy, health: enemy.health - damage };
                }
                currentHero.attackCooldown = HERO_STATS.attackRate;
                currentHero.isAttacking = true;
                setAttackingState(currentHero.id, true, 300);
            }
        } else {
            const distanceToRally = getDistance(currentHero.position, currentHero.rallyPoint);
            if (distanceToRally > 5) {
                const moveDistance = HERO_STATS.speed * timeDelta;
                const direction = { x: currentHero.rallyPoint.x - currentHero.position.x, y: currentHero.rallyPoint.y - currentHero.position.y };
                const normalizedDir = { x: direction.x / distanceToRally, y: direction.y / distanceToRally };
                currentHero.position.x += normalizedDir.x * moveDistance;
                currentHero.position.y += normalizedDir.y * moveDistance;
            }
        }
        currentHero.targetId = newHeroTargetId;
        currentHero.attackCooldown = newAttackCooldown;
    }

      currentTowers = currentTowers.map(tower => {
        if (tower.type === 'BARRACKS') return tower;
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
              audioManager.playSound(towerLevelStats.projectileType);
              newProjectiles.push({
                id: now + Math.random(), type: towerLevelStats.projectileType, position: { ...screenTowerPos },
                targetId: tower.type === 'ARTILLERY' ? null : newTargetId, targetPosition: {...targetEnemy.position},
                damage: towerLevelStats.damage, damageType: towerLevelStats.damageType, speed: towerLevelStats.projectileSpeed,
                splashRadius: towerLevelStats.splashRadius
              });
              
              setAttackingState(tower.id, true, 300);
              return { ...tower, cooldown: towerLevelStats.fireRate, targetId: newTargetId, isAttacking: true };
            }
          }
        }
        return { ...tower, cooldown: newCooldown, targetId: newTargetId };
      });

      currentSoldiers = currentSoldiers.map(soldier => {
        if (soldier.respawnTimer > 0) {
            const newRespawnTimer = Math.max(0, soldier.respawnTimer - msPerFrame);
            if (newRespawnTimer <= 0) return { ...soldier, health: soldier.maxHealth, position: { ...soldier.rallyPoint! }, respawnTimer: 0, isAttacking: false };
            return { ...soldier, respawnTimer: newRespawnTimer };
        }
        if (soldier.health <= 0) return { ...soldier, respawnTimer: SOLDIER_STATS.respawnTime, targetId: null, isAttacking: false };
        const isBuffed = isHeroAbilityActive && getDistance(soldier.position, currentHero.position) < HERO_STATS.abilityRange;
        let newTargetId = soldier.targetId;
        const newAttackCooldown = Math.max(0, soldier.attackCooldown - msPerFrame);
        const currentTarget = newTargetId ? currentEnemies.find(e => e.id === newTargetId) : undefined;
        if (!currentTarget || getDistance(soldier.position, currentTarget.position) > SOLDIER_STATS.range) newTargetId = null;
        if (!newTargetId) {
            let potentialTarget: Enemy | null = null;
            let minDistance = SOLDIER_STATS.range;
            for (const enemy of currentEnemies) {
                if (enemy.health > 0) {
                    const distance = getDistance(soldier.position, enemy.position);
                    if (distance < minDistance) {
                        minDistance = distance;
                        potentialTarget = enemy;
                    }
                }
            }
            if (potentialTarget) newTargetId = potentialTarget.id;
        }
        if (newTargetId) {
            if (newAttackCooldown <= 0) {
                audioManager.playSound('soldierAttack');
                const targetIndex = currentEnemies.findIndex(e => e.id === newTargetId);
                if (targetIndex !== -1) {
                    const enemy = currentEnemies[targetIndex];
                    let damage = SOLDIER_STATS.damage;
                    if(isBuffed) damage *= HERO_STATS.abilityDamageBoost;
                    if(enemy.armorType === 'PHYSICAL') damage *= (1 - enemy.armorValue);
                    currentEnemies[targetIndex] = { ...enemy, health: enemy.health - damage };
                }
                setAttackingState(soldier.id, true, 300);
                return { ...soldier, attackCooldown: SOLDIER_STATS.attackRate, targetId: newTargetId, isBuffed, isAttacking: true };
            }
        } else {
            const distanceToRally = getDistance(soldier.position, soldier.rallyPoint!);
            if (distanceToRally > 5) {
                const moveDistance = SOLDIER_STATS.speed * timeDelta;
                const direction = { x: soldier.rallyPoint!.x - soldier.position.x, y: soldier.rallyPoint!.y - soldier.position.y };
                const normalizedDir = { x: direction.x / distanceToRally, y: direction.y / distanceToRally };
                soldier.position.x += normalizedDir.x * moveDistance;
                soldier.position.y += normalizedDir.y * moveDistance;
            }
        }
        return { ...soldier, attackCooldown: newAttackCooldown, targetId: newTargetId, isBuffed };
    });

      currentReinforcements = currentReinforcements.map(r => {
          let newTargetId = r.targetId;
          const newAttackCooldown = Math.max(0, r.attackCooldown - msPerFrame);
          const isBuffed = isHeroAbilityActive && getDistance(r.position, currentHero.position) < HERO_STATS.abilityRange;
          const currentTarget = newTargetId ? currentEnemies.find(e => e.id === newTargetId) : undefined;
          if (!currentTarget || getDistance(r.position, currentTarget.position) > REINFORCEMENTS_STATS.range) newTargetId = null;
          if (!newTargetId) {
              let potentialTarget: Enemy | null = null;
              let minDistance = REINFORCEMENTS_STATS.range;
              for (const enemy of currentEnemies) {
                 if (enemy.health > 0) {
                      const distance = getDistance(r.position, enemy.position);
                      if (distance < minDistance) { minDistance = distance; potentialTarget = enemy; }
                 }
              }
              if (potentialTarget) newTargetId = potentialTarget.id;
          } else {
               if (newAttackCooldown <= 0) {
                  const targetIndex = currentEnemies.findIndex(e => e.id === newTargetId);
                  if (targetIndex !== -1) {
                      const enemy = currentEnemies[targetIndex];
                      let damage = REINFORCEMENTS_STATS.damage;
                      if(isBuffed) damage *= HERO_STATS.abilityDamageBoost;
                      if(enemy.armorType === 'PHYSICAL') damage *= (1 - enemy.armorValue);
                      currentEnemies[targetIndex] = {...enemy, health: enemy.health - damage };
                  }
                  setAttackingState(r.id, true, 300);
                  return { ...r, attackCooldown: REINFORCEMENTS_STATS.attackRate, targetId: newTargetId, isBuffed, isAttacking: true };
              }
          }
          return {...r, lifetime: r.lifetime - msPerFrame, attackCooldown: newAttackCooldown, targetId: newTargetId, isBuffed};
      }).filter(r => r.lifetime > 0 && r.health > 0);
      
      const updatedProjectiles = projectiles.filter(proj => {
          const targetPosition = proj.targetId ? currentEnemies.find(e => e.id === proj.targetId)?.position : proj.targetPosition;
          if (!targetPosition) return false;
          const distanceToTarget = getDistance(proj.position, targetPosition);
          const moveDistance = proj.speed * timeDelta;
          if (distanceToTarget <= moveDistance) {
              if (proj.splashRadius && proj.splashRadius > 0) {
                   audioManager.playSound('explosion');
                   setExplosions(exps => [...exps, { id: Date.now() + Math.random(), position: targetPosition, radius: proj.splashRadius!, lifetime: 300 }]);
                   currentEnemies = currentEnemies.map(enemy => {
                       if (getDistance(enemy.position, targetPosition) <= proj.splashRadius!) {
                           let actualDamage = proj.damage;
                            if (proj.damageType === DamageType.PHYSICAL && enemy.armorType === 'PHYSICAL') actualDamage *= (1 - enemy.armorValue);
                           return {...enemy, health: enemy.health - actualDamage };
                       }
                       return enemy;
                   });
              } else {
                  const targetIndex = currentEnemies.findIndex(e => e.id === proj.targetId);
                  if (targetIndex !== -1) {
                      const enemy = currentEnemies[targetIndex];
                      let actualDamage = proj.damage;
                      if (proj.damageType === DamageType.PHYSICAL && enemy.armorType === 'PHYSICAL') actualDamage *= (1 - enemy.armorValue);
                      currentEnemies[targetIndex] = {...enemy, health: enemy.health - actualDamage };
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
        let isBlocked = false;
        let blocker: Soldier | Hero | Reinforcement | null = null;
        let blockerType: 'soldier' | 'hero' | 'reinforcement' | null = null;
        let closestDist = Infinity;
        const allMeleeUnits: (Soldier | Reinforcement)[] = [...currentSoldiers, ...currentReinforcements];
        allMeleeUnits.forEach(unit => {
            if (unit.health > 0 && ('barracksId' in unit ? unit.respawnTimer <= 0 : true)) {
                const dist = getDistance(enemy.position, unit.position);
                const blockingRadius = 'barracksId' in unit ? SOLDIER_STATS.blockingRadius : REINFORCEMENTS_STATS.blockingRadius;
                if (dist < blockingRadius && dist < closestDist) {
                    closestDist = dist; isBlocked = true; blocker = unit;
                    blockerType = 'barracksId' in unit ? 'soldier' : 'reinforcement';
                }
            }
        });
        if (currentHero.health > 0 && currentHero.respawnTimer <= 0) {
            const dist = getDistance(enemy.position, currentHero.position);
            if (dist < HERO_STATS.blockingRadius && dist < closestDist) {
                closestDist = dist; isBlocked = true; blocker = currentHero; blockerType = 'hero';
            }
        }
        const enemyStats = ENEMY_STATS[enemy.type];
        const newAttackCooldown = Math.max(0, (enemy.attackCooldown || 0) - msPerFrame);
        if (isBlocked && blocker && blockerType) {
            if (newAttackCooldown <= 0) {
                audioManager.playSound('enemyAttack');
                if (blockerType === 'hero') {
                    currentHero.health = Math.max(0, currentHero.health - enemyStats.damage);
                    if (currentHero.health <= 0) currentHero.respawnTimer = HERO_STATS.respawnTime;
                } else if (blockerType === 'soldier') {
                    const soldierIndex = currentSoldiers.findIndex(s => s.id === blocker!.id);
                    if (soldierIndex !== -1) currentSoldiers[soldierIndex].health = Math.max(0, currentSoldiers[soldierIndex].health - enemyStats.damage);
                } else if (blockerType === 'reinforcement') {
                    const reinforcementIndex = currentReinforcements.findIndex(s => s.id === blocker!.id);
                    if (reinforcementIndex !== -1) currentReinforcements[reinforcementIndex].health = Math.max(0, currentReinforcements[reinforcementIndex].health - enemyStats.damage);
                }
                setAttackingState(enemy.id, true, 300);
                return { ...enemy, attackCooldown: enemyStats.attackRate, isAttacking: true };
            }
            return { ...enemy, attackCooldown: newAttackCooldown };
        } else {
            const distanceToTravel = enemyStats.speed * timeDelta;
            let currentPathIndex = enemy.pathIndex;
            let newPosition = { ...enemy.position };
            if (currentPathIndex < MAP_PATH.length - 1) {
              const nextPathNodeScreen = gameToScreen(MAP_PATH[currentPathIndex + 1]);
              const distanceToNextNode = getDistance(newPosition, nextPathNodeScreen);
              if (distanceToNextNode < distanceToTravel) {
                  const remainingDistance = distanceToTravel - distanceToNextNode;
                  currentPathIndex++;
                   if (currentPathIndex >= MAP_PATH.length - 1) {
                       enemiesWhoReachedEnd.push(enemy.id.toString());
                       return null;
                   } else {
                        const nextNextNode = gameToScreen(MAP_PATH[currentPathIndex + 1]);
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
            return { ...enemy, position: newPosition, pathIndex: currentPathIndex, attackCooldown: 0 };
        }
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
      
      if (waveDefinition && waveSpawnData.current.spawnIndex >= waveDefinition.enemies.length && currentEnemies.length === 0) {
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
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div 
        className="relative bg-gray-800 shadow-2xl overflow-hidden"
        style={{
          width: GAME_CONFIG.width,
          height: GAME_CONFIG.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        onMouseDown={handleMapMouseDown}
        onMouseMove={handleMapMouseMove}
        onMouseUp={handleMapMouseUp}
        onMouseLeave={cancelRallyPointDrag}
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
       />
        {(gameStatus === 'GAME_OVER' || gameStatus === 'VICTORY') && (
          <Modal status={gameStatus} onRestart={resetGame} />
        )}
      </div>
    </div>
  );
};

export default App;