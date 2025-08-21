import React from 'react';
import { TOWER_SPOTS, GAME_CONFIG, MAP_PATH, HERO_STATS, TOWER_STATS, REINFORCEMENTS_STATS, HERO_START_GRID_POS, ENVIRONMENT_DECORATIONS } from '../constants';
import type { Tower, Enemy, Vector2D, Projectile, Soldier, Hero, SelectableUnit, Reinforcement, Explosion, PlayerSpell, GoldParticle, RallyPointDragState, EnvironmentDecoration } from '../types';
import { gameToScreen } from '../utils';
import { 
    WinterfellWatchtowerIcon, 
    WeirwoodGroveIcon, 
    NorthernBarracksIcon,
    SiegeWorkshopIcon,
    NorthernSoldierIcon, 
    BrienneIcon,
    EnemyIcon,
    IceArrowProjectileIcon, 
    NatureBoltProjectileIcon,
    CatapultRockProjectileIcon,
    TowerSpotIcon,
    GameBackground,
    SelectionCircle,
    RallyPointRangeCircle,
    RallyPointFlag,
    BannermanIcon,
    Explosion as ExplosionIcon,
    TargetCursor,
    CoinIcon,
    SkullIcon,
    BuffEffect,
    SlowEffect,
    TauntEffect,
    TreeIcon1,
    TreeIcon2,
    RockIcon1,
    RockIcon2,
} from './icons';
import { SOLDIER_STATS } from '../constants';

interface GameBoardProps {
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  soldiers: Soldier[];
  hero: Hero;
  reinforcements: Reinforcement[];
  explosions: Explosion[];
  goldParticles: GoldParticle[];
  activeSpell: PlayerSpell | null;
  onSpotClick: (spot: Vector2D) => void;
  onSelectUnit: (unit: SelectableUnit) => void;
  selectedUnit: SelectableUnit | null;
  rallyPointDrag: RallyPointDragState | null;
}

const DecorationComponent: React.FC<{ decoration: EnvironmentDecoration }> = React.memo(({ decoration }) => {
    let Icon;
    switch(decoration.type) {
        case 'TREE_1': Icon = TreeIcon1; break;
        case 'TREE_2': Icon = TreeIcon2; break;
        case 'ROCK_1': Icon = RockIcon1; break;
        case 'ROCK_2': Icon = RockIcon2; break;
    }
    const screenPos = gameToScreen(decoration.position);

    return (
        <div 
            className="absolute transform -translate-x-1/2 -translate-y-[85%]"
            style={{
                left: screenPos.x,
                top: screenPos.y,
                zIndex: Math.floor(screenPos.y),
                pointerEvents: 'none',
            }}
        >
            <Icon />
        </div>
    );
});

const EnemyComponent: React.FC<{ enemy: Enemy; onSelect: (e: Enemy) => void }> = React.memo(({ enemy, onSelect }) => {
  const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-[90%] cursor-pointer"
      style={{
        left: enemy.position.x,
        top: enemy.position.y,
        zIndex: Math.floor(enemy.position.y),
      }}
      onMouseDown={(e) => { e.stopPropagation(); onSelect(enemy); }}
    >
      {enemy.slowTimer > 0 && <SlowEffect />}
      <EnemyIcon type={enemy.type} isAttacking={enemy.isAttacking}/>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-black rounded-full overflow-hidden border border-gray-600">
        <div className="h-full bg-red-500 rounded-full" style={{ width: `${healthPercentage}%` }} />
      </div>
    </div>
  );
});

const TowerComponent: React.FC<{ tower: Tower, onSelect: (t: Tower) => void }> = ({ tower, onSelect }) => {
  let TowerIcon: React.FC<any>;
  switch(tower.type) {
    case 'WINTERFELL_WATCHTOWER': TowerIcon = WinterfellWatchtowerIcon; break;
    case 'WEIRWOOD_GROVE': TowerIcon = WeirwoodGroveIcon; break;
    case 'NORTHERN_BARRACKS': TowerIcon = NorthernBarracksIcon; break;
    case 'SIEGE_WORKSHOP': TowerIcon = SiegeWorkshopIcon; break;
    default: return null;
  }

  const screenPos = gameToScreen(tower.position);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-[70%] cursor-pointer"
      style={{
        left: screenPos.x,
        top: screenPos.y,
        zIndex: Math.floor(screenPos.y),
      }}
      onMouseDown={(e) => { e.stopPropagation(); onSelect(tower); }}
    >
      <TowerIcon isAttacking={tower.isAttacking} level={tower.level} />
    </div>
  );
};

const SoldierComponent: React.FC<{ soldier: Soldier; onSelect: (s: Soldier) => void }> = React.memo(({ soldier, onSelect }) => {
  const healthPercentage = (soldier.health / soldier.maxHealth) * 100;

  if (soldier.respawnTimer > 0) {
    const respawnProgress = 1 - (soldier.respawnTimer / SOLDIER_STATS.respawnTime);
    const screenPos = gameToScreen(soldier.gridPosition);
    return (
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: screenPos.x, top: screenPos.y, zIndex: Math.floor(screenPos.y) }}>
          <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
             <svg className="w-8 h-8" viewBox="0 0 100 100">
                <path d="M50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10" fill="none" stroke="#666" strokeWidth="10"/>
                <path d="M50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10" fill="none" stroke="yellow" strokeWidth="10" strokeDasharray={`${respawnProgress * 251.2} 251.2`} transform="rotate(-90 50 50)" />
             </svg>
          </div>
      </div>
    )
  }

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer"
      style={{
        left: soldier.position.x,
        top: soldier.position.y,
        zIndex: Math.floor(soldier.position.y),
      }}
      onMouseDown={(e) => { e.stopPropagation(); onSelect(soldier); }}
    >
        {soldier.isBuffed && <BuffEffect />}
        <NorthernSoldierIcon isAttacking={soldier.isAttacking} />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-black rounded-full overflow-hidden border border-gray-500">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${healthPercentage}%` }} />
        </div>
    </div>
  );
});

const ReinforcementComponent: React.FC<{ reinforcement: Reinforcement }> = React.memo(({ reinforcement }) => {
    const healthPercentage = (reinforcement.health / reinforcement.maxHealth) * 100;
    const lifetimePercentage = (reinforcement.lifetime / REINFORCEMENTS_STATS.duration) * 100;

    return (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{
            left: reinforcement.position.x,
            top: reinforcement.position.y,
            zIndex: Math.floor(reinforcement.position.y),
            opacity: reinforcement.lifetime < 2000 ? lifetimePercentage / 100 : 1,
          }}
        >
            {reinforcement.isBuffed && <BuffEffect />}
            <BannermanIcon isAttacking={reinforcement.isAttacking} />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-black rounded-full overflow-hidden border border-gray-500">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${healthPercentage}%` }} />
            </div>
        </div>
    );
});

const HeroComponent: React.FC<{ hero: Hero, onSelect: (h: Hero) => void }> = React.memo(({ hero, onSelect }) => {
    if (hero.respawnTimer > 0) {
        const respawnProgress = 1 - (hero.respawnTimer / HERO_STATS.respawnTime);
        const screenPos = gameToScreen(HERO_START_GRID_POS);
        return (
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: screenPos.x, top: screenPos.y, zIndex: 10000 }}>
                <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center border-2 border-yellow-400">
                    <svg className="w-14 h-14" viewBox="0 0 100 100">
                        <path d="M50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10" fill="none" stroke="#888" strokeWidth="12"/>
                        <path d="M50 10 A 40 40 0 0 1 50 90 A 40 40 0 0 1 50 10" fill="none" stroke="lime" strokeWidth="12" strokeDasharray={`${respawnProgress * 251.2} 251.2`} transform="rotate(-90 50 50)" />
                    </svg>
                </div>
            </div>
        )
    }

    const healthPercentage = (hero.health / hero.maxHealth) * 100;
    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
            style={{
                left: hero.position.x,
                top: hero.position.y,
                zIndex: Math.floor(hero.position.y),
            }}
            onMouseDown={(e) => { e.stopPropagation(); onSelect(hero); }}
        >
            {hero.abilityActiveTimer > 0 && <TauntEffect />}
            <BrienneIcon isAttacking={!!hero.isAttacking} />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black rounded-full overflow-hidden border border-gray-500">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${healthPercentage}%` }} />
            </div>
        </div>
    );
});


const ProjectileComponent: React.FC<{ projectile: Projectile }> = ({ projectile }) => {
    let ProjectileIcon;
    switch (projectile.type) {
        case 'ICE_ARROW': ProjectileIcon = IceArrowProjectileIcon; break;
        case 'NATURE_BOLT': ProjectileIcon = NatureBoltProjectileIcon; break;
        case 'CATAPULT_ROCK': ProjectileIcon = CatapultRockProjectileIcon; break;
        default: return null;
    }
    return (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: projectile.position.x,
            top: projectile.position.y,
            zIndex: 10000, 
          }}
        >
          <ProjectileIcon className="w-10 h-10"/>
        </div>
    )
}

const GoldParticleComponent: React.FC<{ particle: GoldParticle }> = ({ particle }) => (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: particle.position.x, top: particle.position.y, zIndex: 20000 }}>
        <CoinIcon className="w-6 h-6" />
    </div>
);

const ExitWarning: React.FC = () => {
    const exitPos = gameToScreen(MAP_PATH[MAP_PATH.length - 1]);
    return (
        <div className="absolute transform -translate-x-1/2 -translate-y-full" style={{ left: exitPos.x + 40, top: exitPos.y, zIndex: 10000 }}>
            <SkullIcon className="w-16 h-16 text-red-500 animate-ping" />
        </div>
    );
};

const PathPreviewLine: React.FC<{ start: Vector2D; end: Vector2D }> = ({ start, end }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20000 }}>
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke="#fdd835"
      strokeWidth="4"
      strokeDasharray="10 5"
      strokeLinecap="round"
      filter="url(#glow)"
    />
  </svg>
);


export const GameBoard: React.FC<GameBoardProps> = ({ 
    towers, enemies, projectiles, soldiers, hero, reinforcements, explosions, goldParticles, activeSpell,
    onSpotClick, onSelectUnit,
    selectedUnit, rallyPointDrag
}) => {
  const [cursorPos, setCursorPos] = React.useState<Vector2D | null>(null);
  
  const getGameCoordinates = (e: React.MouseEvent<HTMLDivElement>): Vector2D => {
      const rect = e.currentTarget.getBoundingClientRect();
      const scale = rect.width / GAME_CONFIG.width; // Re-calculate scale here for accuracy
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      return {x, y};
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const pos = getGameCoordinates(e);
      if (activeSpell) {
          setCursorPos(pos);
      } else if (cursorPos) {
          setCursorPos(null);
      }
  }

  const handleMouseLeave = () => {
      setCursorPos(null);
  };

  const selectionPosition = selectedUnit ? ('level' in selectedUnit ? gameToScreen(selectedUnit.position) : selectedUnit.position) : null;
  const isBarracksSelected = selectedUnit && 'type' in selectedUnit && selectedUnit.type === 'NORTHERN_BARRACKS';
  const showExitWarning = enemies.some(e => e.pathIndex >= MAP_PATH.length - 4);

  return (
    <div 
        className={`w-full h-full relative overflow-hidden ${activeSpell ? 'cursor-pointer' : ''}`}
        onMouseMove={handleMouseMove} 
        onMouseLeave={handleMouseLeave}
    >
        <GameBackground className="absolute inset-0 w-full h-full" />
        
        {ENVIRONMENT_DECORATIONS.map((deco, i) => <DecorationComponent key={`deco-${i}`} decoration={deco} />)}

        {TOWER_SPOTS.map((spot, i) => {
          const screenPos = gameToScreen(spot);
          const isOccupied = towers.some(t => t.position.x === spot.x && t.position.y === spot.y);
          return (
             <div
              key={i}
              className={`absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2 transition-transform`}
              style={{
                left: screenPos.x,
                top: screenPos.y,
                zIndex: Math.floor(screenPos.y) -10 // Place below path
              }}
              onMouseDown={(e) => { e.stopPropagation(); onSpotClick(spot);}}
            >
              <TowerSpotIcon isOccupied={isOccupied} />
            </div>
          )
        })}
      
      {selectionPosition && <SelectionCircle position={selectionPosition} />}
      {isBarracksSelected && (
        <>
            <RallyPointRangeCircle 
                position={gameToScreen((selectedUnit as Tower).position)} 
                range={TOWER_STATS.NORTHERN_BARRACKS[(selectedUnit as Tower).level -1].range} 
            />
            {(selectedUnit as Tower).rallyPoint && (
                <RallyPointFlag position={gameToScreen((selectedUnit as Tower).rallyPoint!)} />
            )}
        </>
      )}
      {rallyPointDrag && <PathPreviewLine start={rallyPointDrag.startPosition} end={rallyPointDrag.currentPosition} />}
      {showExitWarning && <ExitWarning />}

      {towers.map(tower => <TowerComponent key={`tower-${tower.id}`} tower={tower} onSelect={onSelectUnit} />)}
      {soldiers.map(soldier => <SoldierComponent key={`soldier-${soldier.id}`} soldier={soldier} onSelect={onSelectUnit} />)}
      {reinforcements.map(r => <ReinforcementComponent key={`reinforcement-${r.id}`} reinforcement={r}/>)}
      <HeroComponent hero={hero} onSelect={onSelectUnit} />
      {enemies.map(enemy => <EnemyComponent key={`enemy-${enemy.id}`} enemy={enemy} onSelect={onSelectUnit} />)}
      {projectiles.map(projectile => <ProjectileComponent key={projectile.id} projectile={projectile}/>)}
      {explosions.map(exp => {
        return <ExplosionIcon key={exp.id} position={exp.position} radius={exp.radius}/>
      })}
      {goldParticles.map(p => <GoldParticleComponent key={p.id} particle={p} />)}

      {activeSpell && cursorPos && <TargetCursor position={cursorPos} spell={activeSpell} />}
    </div>
  );
};