import React from 'react';
import type { GameStatus, SelectableUnit, Tower, Enemy, Soldier, Hero, PlayerSpell } from '../types';
import { 
    TOWER_STATS, SOLDIER_STATS, ENEMY_STATS, HERO_STATS, EARLY_WAVE_BONUS, 
    WAVES, REINFORCEMENTS_STATS, RAIN_OF_FIRE_STATS
} from '../constants';
import { 
    CoinIcon, HeartIcon, SkullIcon,
    PlayIcon, PauseIcon,
    BriennePortrait, WinterfellWatchtowerPortrait, WeirwoodGrovePortrait, NorthernBarracksPortrait, SiegeWorkshopPortrait,
    NorthernSoldierPortrait, EnemyPortrait,
    UpgradeIcon, SellIcon, ShieldIcon, FireIcon, SwordsIcon
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
  totalWaves: number;
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
            className="bg-gray-800/90 border border-gray-600 rounded-lg w-[450px] h-36 flex flex-row items-center p-3 gap-3 pointer-events-auto shadow-lg"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
             <div className="relative z-10 w-28 h-full bg-gray-900 overflow-hidden border-2 border-gray-500 rounded-md flex-shrink-0 p-1">
                {getUnitPortrait(unit)}
             </div>
             <div className="relative z-10 flex flex-col justify-center text-left text-white flex-grow h-full w-full text-sm pb-0">
                <h3 className="text-xl -mt-2">{name}</h3>
                {hasHealth && (
                    <div className="relative w-full h-4 bg-black/50 border border-gray-600 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-red-500" style={{ width: `${healthPercentage}%` }}/>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono">
                            {Math.ceil(health)}/{maxHealth}
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
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
                                    className="flex-grow h-10 px-2 disabled:grayscale disabled:cursor-not-allowed transition-transform transform hover:scale-105 bg-blue-600 text-white rounded-lg border border-blue-800 hover:bg-blue-700"
                                >
                                    <div className="flex items-center justify-center gap-1 z-10 text-xs">
                                        <UpgradeIcon className="w-5 h-5"/>
                                        <span>{towerStats.upgradeCost}</span>
                                        <CoinIcon className="w-4 h-4"/>
                                    </div>
                                </button>
                            )}
                            <button 
                                onClick={() => onSell(unit.id)}
                                className="flex-shrink-0 h-10 px-4 transition-transform transform hover:scale-105 bg-blue-600 text-white rounded-lg border border-blue-800 hover:bg-blue-700"
                            >
                                <div className="flex items-center justify-center gap-1 z-10 text-xs">
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
            className={`relative w-16 h-16 transition-transform transform hover:scale-105 active:scale-95 disabled:grayscale disabled:cursor-not-allowed pointer-events-auto bg-gray-800 rounded-lg border border-gray-600 overflow-hidden ${active ? 'border-2 border-yellow-400' : ''}`}
        >
            <div className="w-full h-full flex items-center justify-center p-2">
                <ShieldIcon className="w-full h-full"/>
            </div>
            {!ready && (
                 <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full bg-blue-500/50" style={{height: `${cooldownPercentage}%`}}/>
                    <span className="text-xl font-mono text-white relative">{Math.ceil(cooldown/1000)}</span>
                </div>
            )}
        </button>
    )
}

const SpellButton: React.FC<{spell: PlayerSpell, cooldown: number, onCast: (s: PlayerSpell) => void}> = ({spell, cooldown, onCast}) => {
    const Icon = spell === 'REINFORCEMENTS' ? SwordsIcon : FireIcon;
    const totalCooldown = spell === 'REINFORCEMENTS' ? REINFORCEMENTS_STATS.cooldown : RAIN_OF_FIRE_STATS.cooldown;
    const cooldownPercentage = 100 - (cooldown / totalCooldown) * 100;
    const ready = cooldown <= 0;
    return (
        <button
            onClick={() => onCast(spell)}
            disabled={!ready}
            className="relative w-16 h-16 transition-transform transform hover:scale-105 active:scale-95 disabled:grayscale disabled:cursor-not-allowed pointer-events-auto bg-gray-800 rounded-lg border border-gray-600 overflow-hidden"
        >
            <div className="w-full h-full flex items-center justify-center p-2">
                <Icon className="w-full h-full"/>
            </div>
            {!ready && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full bg-blue-500/50" style={{height: `${cooldownPercentage}%`}}/>
                    <span className="text-xl font-mono text-white relative">{Math.ceil(cooldown/1000)}</span>
                </div>
            )}
        </button>
    )
}

export const HUD: React.FC<HUDProps> = ({ 
    stats, currentWave, gameStatus, onStartWave, nextWaveTimer,
    isMuted, onToggleMute, isPaused, onTogglePause, selectedUnit,
    onUpgradeTower, onSellTower, onHeroAbility, spellCooldowns, onCastSpell, gold, hero, totalWaves
}) => {
  const waveDisplay = gameStatus === 'IDLE' ? 0 : currentWave;
    
  return (
    <div 
        className="absolute inset-0 text-white pointer-events-none p-4 flex flex-col justify-between"
        style={{ zIndex: 9000 }}
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-start">
        {/* Top Left: Stats */}
        <div className="flex items-center gap-2 pointer-events-auto">
            <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-600">
                <CoinIcon className="w-6 h-6" />
                <span className="text-lg text-yellow-300 tracking-tighter">{stats.gold}</span>
            </div>
            <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-600">
                <HeartIcon className="w-6 h-6" />
                <span className="text-lg text-red-400 tracking-tighter">{stats.lives}</span>
            </div>
        </div>
        
        <div className="flex items-start gap-2 pointer-events-auto">
            <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-600 text-center">
                <span className="text-lg text-gray-300">WAVE: {waveDisplay}/{totalWaves}</span>
            </div>
            {(gameStatus === 'IDLE' || gameStatus === 'WAVE_COMPLETE') && (
                <div className="flex flex-col items-center">
                    <button
                    onClick={() => onStartWave(gameStatus === 'WAVE_COMPLETE')}
                    disabled={isPaused}
                    className="bg-green-600 text-white text-lg py-2 px-4 rounded-lg border border-green-800 hover:bg-green-700 disabled:grayscale disabled:cursor-not-allowed transition-all"
                    >
                        Start Wave
                    </button>
                    {gameStatus === 'WAVE_COMPLETE' && nextWaveTimer > 0 && <div className="mt-1 text-lg text-white">{Math.ceil(nextWaveTimer/1000)}s</div>}
                </div>
            )}
        </div>


        {/* Top Right: Controls */}
        <div className="flex items-center gap-2 p-1 border border-gray-600 rounded-lg pointer-events-auto bg-gray-900/50">
            <button onClick={onTogglePause} className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md border border-blue-800 hover:bg-blue-700 w-24" aria-label={isPaused ? "Resume" : "Pause"}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={onToggleMute} className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md border border-blue-800 hover:bg-blue-700 w-24" aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="w-full flex flex-row justify-between items-end gap-2">
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
                    <div className="bg-gray-800/90 border border-gray-600 rounded-lg flex items-center gap-3 px-8 py-2 text-white text-xl pointer-events-auto h-12">
                        <SkullIcon className="w-6 h-6 animate-pulse"/>
                        <span>Wave {currentWave}</span>
                    </div>
                )}
            </>
            )}
        </div>
      </div>
    </div>
  );
};
