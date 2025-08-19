import React from 'react';
import type { GameStatus, SelectableUnit, Tower, Enemy, Soldier, Hero, PlayerSpell } from '../types';
import { 
    TOWER_STATS, SOLDIER_STATS, ENEMY_STATS, HERO_STATS, EARLY_WAVE_BONUS, 
    WAVES, REINFORCEMENTS_STATS, RAIN_OF_FIRE_STATS
} from '../constants';
import { 
    CoinIcon, HeartIcon, SkullIcon, SoundOnIcon, SoundOffIcon, 
    UIPanel, UIButton,
    PlayIcon, PauseIcon,
    HeroPortrait, ArcherTowerPortrait, MageTowerPortrait, BarracksTowerPortrait, ArtilleryTowerPortrait,
    SoldierPortrait, EnemyPortrait,
    UpgradeIcon, SellIcon, ReinforcementsIcon, RainOfFireIcon, HeroAbilityIcon
} from './icons';

interface HUDProps {
  stats: { gold: number; lives: number };
  currentWave: number;
  gameStatus: GameStatus;
  onStartWave: (isEarly: boolean) => void;
  nextWaveTimer: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  selectedUnit: SelectableUnit | null;
  onUpgradeTower: (towerId: number) => void;
  onSellTower: (towerId: number) => void;
  onHeroAbility: () => void;
  spellCooldowns: Record<PlayerSpell, number>;
  onCastSpell: (spell: PlayerSpell) => void;
  gold: number;
}

const getUnitPortrait = (unit: SelectableUnit) => {
    if ('level' in unit) {
        switch (unit.type) {
            case 'ARCHER': return <ArcherTowerPortrait className="w-full h-full" />;
            case 'MAGE': return <MageTowerPortrait className="w-full h-full" />;
            case 'BARRACKS': return <BarracksTowerPortrait className="w-full h-full" />;
            case 'ARTILLERY': return <ArtilleryTowerPortrait className="w-full h-full" />;
        }
    }
    if ('barracksId' in unit) return <SoldierPortrait className="w-full h-full" />
    if ('pathIndex' in unit) {
        return <EnemyPortrait type={unit.type} className="w-full h-full" />;
    }
    return <HeroPortrait className="w-full h-full" />;
}

const SelectionDetails: React.FC<{
    unit: SelectableUnit;
    onUpgrade: (id: number) => void;
    onSell: (id: number) => void;
    onHeroAbility: () => void;
    gold: number;
}> = ({unit, onUpgrade, onSell, onHeroAbility, gold}) => {
    
    const isTower = 'level' in unit;
    const isHero = 'abilityCooldown' in unit;
    
    let name: string;
    let damage: number | string = 0;
    let range: number = 0;
    let speed: string | number = 'N/A';

    const hasHealth = 'health' in unit;
    const health = hasHealth ? unit.health : 0;
    const maxHealth = hasHealth ? unit.maxHealth : 0;
    const healthPercentage = maxHealth > 0 ? (health / maxHealth) * 100 : 0;

    const towerStats = isTower ? TOWER_STATS[unit.type][unit.level - 1] : null;

    if (isTower && towerStats) {
        name = towerStats.name;
        damage = towerStats.damage > 0 ? towerStats.damage : 'N/A';
        range = towerStats.range;
        speed = towerStats.fireRate > 0 ? `${towerStats.fireRate / 1000}s` : 'N/A';
    } else {
        name = (unit as Exclude<SelectableUnit, Tower>).name;
        if ('barracksId' in unit) {
            damage = SOLDIER_STATS.damage; range = SOLDIER_STATS.range; speed = `${SOLDIER_STATS.attackRate/1000}s`;
        } else if ('pathIndex' in unit) {
            const stats = ENEMY_STATS[unit.type];
            damage = stats.damage; speed = stats.speed;
        } else { // Hero
            damage = HERO_STATS.damage; range = HERO_STATS.range; speed = `${HERO_STATS.attackRate/1000}s`;
        }
    }
    
    return (
        <div className="relative w-[450px] h-36 flex items-center p-2 rounded-lg gap-3 pointer-events-auto">
             <UIPanel className="absolute inset-0 w-full h-full" />
             <div className="relative z-10 w-28 h-28 bg-gray-900 rounded-md overflow-hidden border-2 border-gray-500 flex-shrink-0">
                {getUnitPortrait(unit)}
             </div>
             <div className="relative z-10 flex flex-col justify-center text-left text-white flex-grow h-full">
                <h3 className="text-3xl" style={{ textShadow: '2px 2px #000' }}>{name}</h3>
                {hasHealth && (
                    <div className="relative w-full h-5 bg-black/50 rounded-full border border-gray-600 overflow-hidden mt-1">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${healthPercentage}%` }}/>
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-mono">
                            {Math.ceil(health)} / {maxHealth}
                        </div>
                    </div>
                )}
                <div className="flex gap-4 text-xl mt-1" style={{ textShadow: '1px 1px #000' }}>
                   {damage !== 'N/A' && <span>DMG: {damage}</span>}
                   {range > 0 && <span>RNG: {range}</span>}
                   {speed !== 'N/A' && <span>SPD: {speed}</span>}
                </div>
                <div className="flex gap-2 mt-2">
                    {isTower && towerStats && (
                        <>
                            {unit.level < 3 && (
                                <button 
                                    onClick={() => onUpgrade(unit.id)}
                                    disabled={gold < towerStats.upgradeCost}
                                    className="relative flex-grow h-12 px-2 disabled:grayscale disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                                >
                                    <UIButton/>
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 z-10">
                                        <UpgradeIcon className="w-6 h-6"/>
                                        <span className="text-2xl">{towerStats.upgradeCost}</span>
                                        <CoinIcon className="w-5 h-5"/>
                                    </div>
                                </button>
                            )}
                            <button 
                                onClick={() => onSell(unit.id)}
                                className="relative flex-shrink-0 h-12 px-4 transition-transform transform hover:scale-105"
                            >
                                <UIButton/>
                                <div className="absolute inset-0 flex items-center justify-center gap-2 z-10">
                                    <SellIcon className="w-6 h-6"/>
                                    <span className="text-2xl">{towerStats.sellValue}</span>
                                    <CoinIcon className="w-5 h-5"/>
                                </div>
                            </button>
                        </>
                    )}
                    {isHero && <HeroAbilityButton hero={unit} onCast={onHeroAbility} />}
                </div>
             </div>
        </div>
    )
}

const HeroAbilityButton: React.FC<{hero: Hero, onCast: () => void}> = ({hero, onCast}) => {
    const cooldown = hero.abilityCooldown;
    const totalCooldown = HERO_STATS.abilityCooldown;
    const cooldownPercentage = 100 - (cooldown / totalCooldown) * 100;
    const ready = cooldown <= 0;
    const active = hero.abilityActiveTimer > 0;

    return (
        <button
            onClick={onCast}
            disabled={!ready}
            className={`relative w-24 h-24 transition-transform transform hover:scale-105 active:scale-95 disabled:grayscale disabled:cursor-not-allowed ${active ? 'border-4 border-yellow-400 rounded-lg' : ''} pointer-events-auto`}
        >
            <UIButton className="absolute inset-0 w-full h-full"/>
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                <HeroAbilityIcon className="w-full h-full"/>
            </div>
            {!ready && (
                 <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 overflow-hidden rounded-md">
                    <div className="absolute top-0 left-0 w-full bg-black/50" style={{height: `${100 - cooldownPercentage}%`}}/>
                    <span className="text-3xl font-mono text-white relative" style={{textShadow: '1px 1px #000'}}>{Math.ceil(cooldown/1000)}</span>
                </div>
            )}
        </button>
    )
}

const SpellButton: React.FC<{spell: PlayerSpell, cooldown: number, onCast: (s: PlayerSpell) => void}> = ({spell, cooldown, onCast}) => {
    const Icon = spell === 'REINFORCEMENTS' ? ReinforcementsIcon : RainOfFireIcon;
    const totalCooldown = spell === 'REINFORCEMENTS' ? REINFORCEMENTS_STATS.cooldown : RAIN_OF_FIRE_STATS.cooldown;
    const cooldownPercentage = 100 - (cooldown / totalCooldown) * 100;
    const ready = cooldown <= 0;
    return (
        <button
            onClick={() => onCast(spell)}
            disabled={!ready}
            className="relative w-20 h-20 transition-transform transform hover:scale-105 active:scale-95 disabled:grayscale disabled:cursor-not-allowed pointer-events-auto"
        >
            <UIButton className="absolute inset-0 w-full h-full"/>
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                <Icon className="w-full h-full"/>
            </div>
            {!ready && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 overflow-hidden rounded-md">
                    <div className="absolute top-0 left-0 w-full bg-black/50" style={{height: `${100-cooldownPercentage}%`}}/>
                    <span className="text-2xl font-mono text-white relative" style={{textShadow: '1px 1px #000'}}>{Math.ceil(cooldown/1000)}</span>
                </div>
            )}
        </button>
    )
}

export const HUD: React.FC<HUDProps> = ({ 
    stats, currentWave, gameStatus, onStartWave, nextWaveTimer,
    isMuted, onToggleMute, isPaused, onTogglePause, selectedUnit,
    onUpgradeTower, onSellTower, onHeroAbility, spellCooldowns, onCastSpell, gold
}) => {
  const waveDisplay = gameStatus === 'IDLE' ? 0 : currentWave;
    
  return (
    <div className="absolute inset-0 text-white pointer-events-none p-4" style={{ fontFamily: "'Bangers', cursive" }}>
      {/* Top Left: Stats */}
      <div className="absolute top-4 left-4 flex items-center gap-4">
        <div className="relative flex items-center justify-center w-48 h-16 pointer-events-auto">
          <UIPanel className="absolute inset-0 w-full h-full" />
          <div className="relative z-10 flex items-center gap-2 text-4xl">
            <CoinIcon id="gold-hud-icon" className="w-10 h-10" />
            <span className="text-yellow-300" style={{ textShadow: '2px 2px #000' }}>{stats.gold}</span>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-40 h-16 pointer-events-auto">
          <UIPanel className="absolute inset-0 w-full h-full" />
          <div className="relative z-10 flex items-center gap-2 text-4xl">
            <HeartIcon className="w-10 h-10" />
            <span className="text-red-400" style={{ textShadow: '2px 2px #000' }}>{stats.lives}</span>
          </div>
        </div>
      </div>

      {/* Top Right: Wave Info & Controls */}
       <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <div className='flex items-center gap-4'>
            <div className="relative flex items-center justify-center w-48 h-16 pointer-events-auto">
                <UIPanel className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 text-4xl text-gray-300 uppercase" style={{ textShadow: '2px 2px #000' }}>
                Wave: <span className="text-white">{waveDisplay}/{WAVES.length}</span>
                </div>
            </div>
            <button onClick={onTogglePause} className="relative w-16 h-16 flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 pointer-events-auto" aria-label={isPaused ? "Play" : "Pause"}>
                <UIButton className="absolute inset-0 w-full h-full" />
                <div className="relative z-10"> {isPaused ? <PlayIcon className="w-10 h-10" /> : <PauseIcon className="w-10 h-10" />}</div>
            </button>
            <button onClick={onToggleMute} className="relative w-16 h-16 flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 pointer-events-auto" aria-label={isMuted ? "Unmute" : "Mute"}>
                <UIButton className="absolute inset-0 w-full h-full" />
                <div className="relative z-10">{isMuted ? <SoundOffIcon className="w-10 h-10" /> : <SoundOnIcon className="w-10 h-10" />}</div>
            </button>
        </div>
        {(gameStatus === 'IDLE' || gameStatus === 'WAVE_COMPLETE') && (
            <button
            onClick={() => onStartWave(gameStatus === 'WAVE_COMPLETE')}
            disabled={isPaused}
            className="relative px-6 py-2 text-white text-3xl uppercase transition-transform transform hover:scale-105 active:scale-95 disabled:grayscale disabled:cursor-not-allowed pointer-events-auto"
            >
                <UIButton className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 flex flex-col items-center" style={{ textShadow: '2px 2px #000' }}>
                {gameStatus === 'IDLE' ? (
                    <span>Start Wave 1</span>
                ) : (
                    <>
                        <span>Call Wave Early</span>
                        <span className="text-sm -mt-1 text-yellow-300">+{EARLY_WAVE_BONUS.gold} Gold / -{EARLY_WAVE_BONUS.cooldownReduction/1000}s CD</span>
                    </>
                )}
                </div>
                {gameStatus === 'WAVE_COMPLETE' && <div className="absolute -bottom-4 text-2xl text-white">{Math.ceil(nextWaveTimer/1000)}s</div>}
            </button>
        )}
      </div>

      {/* Bottom Left: Spells & Contextual Panel */}
      <div className="absolute bottom-4 left-4 flex items-end gap-4">
        <div className="flex flex-col gap-2">
            <SpellButton spell="REINFORCEMENTS" cooldown={spellCooldowns.REINFORCEMENTS} onCast={onCastSpell} />
            <SpellButton spell="RAIN_OF_FIRE" cooldown={spellCooldowns.RAIN_OF_FIRE} onCast={onCastSpell} />
        </div>
        
        <div className="flex flex-col items-center">
            {selectedUnit ? (
            <SelectionDetails unit={selectedUnit} onUpgrade={onUpgradeTower} onSell={onSellTower} onHeroAbility={onHeroAbility} gold={gold}/>
            ) : (
            <>
                {gameStatus === 'WAVE_IN_PROGRESS' && (
                    <div className="relative flex items-center gap-3 px-8 py-2 text-white text-4xl uppercase pointer-events-auto">
                        <UIPanel className="absolute inset-0 w-full h-full" />
                        <div className="relative z-10 flex items-center gap-3" style={{ textShadow: '2px 2px #000' }}>
                        <SkullIcon className="w-10 h-10 animate-pulse"/>
                        <span>Wave {currentWave}</span>
                        </div>
                    </div>
                )}
            </>
            )}
        </div>
      </div>
    </div>
  );
};