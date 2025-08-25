
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
    BriennePortrait, WinterfellWatchtowerPortrait, WeirwoodGrovePortrait, NorthernBarracksPortrait, SiegeWorkshopPortrait,
    NorthernSoldierPortrait, EnemyPortrait,
    UpgradeIcon, SellIcon, ReinforcementsIcon, RainOfFireIcon, OathkeeperStandIcon
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
  hero: Hero;
}

const getUnitPortrait = (unit: SelectableUnit) => {
    if ('level' in unit) {
        switch (unit.type) {
            case 'WINTERFELL_WATCHTOWER': return <WinterfellWatchtowerPortrait className="w-full h-full" level={unit.level}/>;
            case 'WEIRWOOD_GROVE': return <WeirwoodGrovePortrait className="w-full h-full" level={unit.level}/>;
            case 'NORTHERN_BARRACKS': return <NorthernBarracksPortrait className="w-full h-full" level={unit.level}/>;
            case 'SIEGE_WORKSHOP': return <SiegeWorkshopPortrait className="w-full h-full" level={unit.level}/>;
        }
    }
    if ('barracksId' in unit) return <NorthernSoldierPortrait className="w-full h-full" />
    if ('pathIndex' in unit) {
        return <EnemyPortrait type={unit.type} className="w-full h-full" />;
    }
    return <BriennePortrait />;
}

const SelectionDetails: React.FC<{
    unit: SelectableUnit;
    onUpgrade: (id: number) => void;
    onSell: (id: number) => void;
    gold: number;
}> = ({unit, onUpgrade, onSell, gold}) => {
    
    const isTower = 'level' in unit;
    
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
        <div 
            className="relative w-full max-w-xs sm:w-[450px] h-auto sm:h-36 flex flex-col sm:flex-row items-center p-2 gap-3 pointer-events-auto"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
             <UIPanel className="absolute inset-0 w-full h-full" />
             <div className="relative z-10 w-20 h-20 sm:w-28 sm:h-28 bg-gray-900 overflow-hidden border-2 border-gray-500 flex-shrink-0 p-1">
                {getUnitPortrait(unit)}
             </div>
             <div className="relative z-10 flex flex-col justify-center text-left text-white flex-grow h-full w-full text-sm pb-2 sm:pb-0">
                <h3 className="text-lg sm:text-xl -mt-2" style={{ textShadow: '2px 2px #000' }}>{name}</h3>
                {hasHealth && (
                    <div className="relative w-full h-4 bg-black/50 border border-gray-600 overflow-hidden mt-1">
                        <div className="h-full bg-red-500" style={{ width: `${healthPercentage}%` }}/>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono">
                            {Math.ceil(health)}/{maxHealth}
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs sm:text-sm" style={{ textShadow: '1px 1px #000' }}>
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
                                    className="relative flex-grow h-8 sm:h-10 px-2 disabled:grayscale disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                                >
                                    <UIButton/>
                                    <div className="absolute inset-0 flex items-center justify-center gap-1 z-10 text-xs">
                                        <UpgradeIcon className="w-5 h-5"/>
                                        <span>{towerStats.upgradeCost}</span>
                                        <CoinIcon className="w-4 h-4"/>
                                    </div>
                                </button>
                            )}
                            <button 
                                onClick={() => onSell(unit.id)}
                                className="relative flex-shrink-0 h-8 sm:h-10 px-4 transition-transform transform hover:scale-105"
                            >
                                <UIButton/>
                                <div className="absolute inset-0 flex items-center justify-center gap-1 z-10 text-xs">
                                    <SellIcon className="w-5 h-5"/>
                                    <span>{towerStats.sellValue}</span>
                                    <CoinIcon className="w-4 h-4"/>
                                </div>
                            </button>
                        </>
                    )}
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
            className={`relative w-16 h-16 sm:w-20 sm:h-20 transition-transform transform hover:scale-105 active:scale-95 disabled:grayscale disabled:cursor-not-allowed ${active ? 'border-4 border-yellow-400' : ''} pointer-events-auto`}
        >
            <UIButton className="absolute inset-0 w-full h-full"/>
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                <OathkeeperStandIcon className="w-full h-full"/>
            </div>
            {!ready && (
                 <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full bg-black/50" style={{height: `${100 - cooldownPercentage}%`}}/>
                    <span className="text-lg sm:text-xl font-mono text-white relative" style={{textShadow: '1px 1px #000'}}>{Math.ceil(cooldown/1000)}</span>
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
            className="relative w-16 h-16 sm:w-20 sm:h-20 transition-transform transform hover:scale-105 active:scale-95 disabled:grayscale disabled:cursor-not-allowed pointer-events-auto"
        >
            <UIButton className="absolute inset-0 w-full h-full"/>
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                <Icon className="w-full h-full"/>
            </div>
            {!ready && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full bg-black/50" style={{height: `${100-cooldownPercentage}%`}}/>
                    <span className="text-lg sm:text-xl font-mono text-white relative" style={{textShadow: '1px 1px #000'}}>{Math.ceil(cooldown/1000)}</span>
                </div>
            )}
        </button>
    )
}

export const HUD: React.FC<HUDProps> = ({ 
    stats, currentWave, gameStatus, onStartWave, nextWaveTimer,
    isMuted, onToggleMute, isPaused, onTogglePause, selectedUnit,
    onUpgradeTower, onSellTower, onHeroAbility, spellCooldowns, onCastSpell, gold, hero
}) => {
  const waveDisplay = gameStatus === 'IDLE' ? 0 : currentWave;
    
  return (
    <div className="absolute inset-0 text-white pointer-events-none p-2 sm:p-4 text-xs tracking-tighter flex flex-col justify-between">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-start">
        {/* Top Left: Stats */}
        <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex items-center justify-center w-28 sm:w-40 h-10 sm:h-12 pointer-events-auto">
            <UIPanel className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 flex items-center gap-2 text-lg sm:text-xl">
                <CoinIcon id="gold-hud-icon" className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-yellow-300" style={{ textShadow: '2px 2px #000' }}>{stats.gold}</span>
            </div>
            </div>
            <div className="relative flex items-center justify-center w-24 sm:w-32 h-10 sm:h-12 pointer-events-auto">
            <UIPanel className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 flex items-center gap-2 text-lg sm:text-xl">
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-red-400" style={{ textShadow: '2px 2px #000' }}>{stats.lives}</span>
            </div>
            </div>
        </div>

        {/* Top Right: Wave Info & Controls */}
        <div className="flex flex-col items-end gap-2">
            <div className='flex items-center gap-2 sm:gap-4'>
                <div className="relative flex items-center justify-center w-36 sm:w-48 h-10 sm:h-12 pointer-events-auto">
                    <UIPanel className="absolute inset-0 w-full h-full" />
                    <div className="relative z-10 text-base sm:text-lg text-gray-300" style={{ textShadow: '2px 2px #000' }}>
                    Wave: <span className="text-white">{waveDisplay}/{WAVES.length}</span>
                    </div>
                </div>
                <div className="flex sm:flex-row flex-col gap-2">
                    <button onClick={onTogglePause} className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 pointer-events-auto" aria-label={isPaused ? "Play" : "Pause"}>
                        <UIButton className="absolute inset-0 w-full h-full" />
                        <div className="relative z-10"> {isPaused ? <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8" /> : <PauseIcon className="w-6 h-6 sm:w-8 sm:h-8" />}</div>
                    </button>
                    <button onClick={onToggleMute} className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 pointer-events-auto" aria-label={isMuted ? "Unmute" : "Mute"}>
                        <UIButton className="absolute inset-0 w-full h-full" />
                        <div className="relative z-10">{isMuted ? <SoundOffIcon className="w-6 h-6 sm:w-8 sm:h-8" /> : <SoundOnIcon className="w-6 h-6 sm:w-8 sm:h-8" />}</div>
                    </button>
                </div>
            </div>
            {(gameStatus === 'IDLE' || gameStatus === 'WAVE_COMPLETE') && (
                <button
                onClick={() => onStartWave(gameStatus === 'WAVE_COMPLETE')}
                disabled={isPaused}
                className="relative px-4 py-2 text-white text-base sm:text-lg transition-transform transform hover:scale-105 active:scale-95 disabled:grayscale disabled:cursor-not-allowed pointer-events-auto"
                >
                    <UIButton className="absolute inset-0 w-full h-full" />
                    <div className="relative z-10 flex flex-col items-center" style={{ textShadow: '2px 2px #000' }}>
                    {gameStatus === 'IDLE' ? (
                        <span>Start Wave</span>
                    ) : (
                        <>
                            <span>Call Early</span>
                            <span className="text-xs -mt-1 text-yellow-300 block sm:inline whitespace-nowrap"> (+{EARLY_WAVE_BONUS.gold}G / -{EARLY_WAVE_BONUS.cooldownReduction/1000}s CD)</span>
                        </>
                    )}
                    </div>
                    {gameStatus === 'WAVE_COMPLETE' && nextWaveTimer > 0 && <div className="absolute -bottom-5 sm:-bottom-4 text-base sm:text-lg text-white">{Math.ceil(nextWaveTimer/1000)}s</div>}
                </button>
            )}
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="w-full flex flex-col-reverse sm:flex-row justify-center sm:justify-between items-center sm:items-end gap-2">
        {/* Bottom Left: Spells & Hero Ability */}
        <div className="flex items-end gap-2">
            <SpellButton spell="REINFORCEMENTS" cooldown={spellCooldowns.REINFORCEMENTS} onCast={onCastSpell} />
            <SpellButton spell="RAIN_OF_FIRE" cooldown={spellCooldowns.RAIN_OF_FIRE} onCast={onCastSpell} />
            <HeroAbilityButton hero={hero} onCast={onHeroAbility} />
        </div>
        
        {/* Bottom Right: Contextual Panel */}
        <div className="flex flex-col items-center">
            {selectedUnit && !('level' in selectedUnit) ? (
            <SelectionDetails unit={selectedUnit} onUpgrade={onUpgradeTower} onSell={onSellTower} gold={gold}/>
            ) : (
            <>
                {gameStatus === 'WAVE_IN_PROGRESS' && (
                    <div className="relative flex items-center gap-3 px-8 py-2 text-white text-xl pointer-events-auto h-12">
                        <UIPanel className="absolute inset-0 w-full h-full" />
                        <div className="relative z-10 flex items-center gap-3" style={{ textShadow: '2px 2px #000' }}>
                        <SkullIcon className="w-6 h-6 animate-pulse"/>
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
