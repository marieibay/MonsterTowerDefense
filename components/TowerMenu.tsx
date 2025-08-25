
import React from 'react';
import type { Vector2D, TowerType, Tower } from '../types';
import { TOWER_STATS } from '../constants';
import { gameToScreen } from '../utils';
import { 
    WinterfellWatchtowerIcon,
    WeirwoodGroveIcon,
    NorthernBarracksIcon,
    SiegeWorkshopIcon,
    CoinIcon, 
    UIPanel,
    UIButton,
    UpgradeIcon,
    SellIcon
} from './icons';

interface TowerMenuProps {
  position: Vector2D; // Now expects screen coordinates
  gold: number;
  onBuild: (type: TowerType) => void;
  onClose: () => void;
}

const towerOptions: { type: TowerType; icon: React.FC<any> }[] = [
    { type: 'WINTERFELL_WATCHTOWER', icon: WinterfellWatchtowerIcon },
    { type: 'WEIRWOOD_GROVE', icon: WeirwoodGroveIcon },
    { type: 'NORTHERN_BARRACKS', icon: NorthernBarracksIcon },
    { type: 'SIEGE_WORKSHOP', icon: SiegeWorkshopIcon },
];

export const TowerMenu: React.FC<TowerMenuProps> = ({ position, onBuild, onClose, gold }) => {
  const radius = 100; 
  const buttonSize = 90;

  return (
    <div
      className="absolute inset-0 z-50"
      onMouseDown={onClose} 
      onTouchStart={onClose}
    >
        <div className="relative" style={{left: position.x, top: position.y - 30}}>
            {towerOptions.map((option, index) => {
                const angle = (index / towerOptions.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const stats = TOWER_STATS[option.type][0];
                const canAfford = gold >= stats.cost;
                const Icon = option.icon;

                return (
                    <button
                        key={option.type}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            if(canAfford) onBuild(option.type);
                        }}
                        onTouchStart={(e) => {
                            e.stopPropagation();
                            if(canAfford) onBuild(option.type);
                        }}
                        disabled={!canAfford}
                        className={`absolute flex flex-col items-center justify-center p-2 text-white transition-transform transform hover:scale-110
                        ${canAfford ? 'cursor-pointer' : 'cursor-not-allowed grayscale'}`}
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                        }}
                    >
                        <UIPanel className="absolute inset-0 w-full h-full" />
                        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <Icon level={1}/>
                            </div>
                            <div className={`flex items-center text-sm mt-1 ${canAfford ? 'text-yellow-400' : 'text-gray-500'}`} style={{textShadow: '1px 1px #000'}}>
                                <CoinIcon className="w-4 h-4 mr-1" />
                                {stats.cost}
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    </div>
  );
};


interface TowerControlMenuProps {
    tower: Tower;
    gold: number;
    onUpgrade: (id: number) => void;
    onSell: (id: number) => void;
    onClose: () => void;
}

export const TowerControlMenu: React.FC<TowerControlMenuProps> = ({ tower, gold, onUpgrade, onSell, onClose }) => {
    const towerStats = TOWER_STATS[tower.type][tower.level - 1];
    const screenPos = gameToScreen(tower.position);
    
    const menuStyle: React.CSSProperties = {
        position: 'absolute',
        left: screenPos.x,
        top: screenPos.y - 120, 
        transform: 'translateX(-50%)',
        zIndex: 51,
        pointerEvents: 'auto',
    };

    return (
        <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            onMouseDown={onClose}
            onTouchStart={onClose}
        >
            <div 
                style={menuStyle} 
                className="relative w-64 p-2"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            >
                <UIPanel className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 text-white p-2">
                    <h3 className="text-lg text-center" style={{ textShadow: '2px 2px #000' }}>{towerStats.name} (Lvl {tower.level})</h3>
                    <div className="flex justify-around my-2 text-sm" style={{ textShadow: '1px 1px #000' }}>
                        <span>DMG: {towerStats.damage > 0 ? towerStats.damage : 'N/A'}</span>
                        <span>RNG: {towerStats.range}</span>
                        <span>SPD: {towerStats.fireRate > 0 ? `${towerStats.fireRate / 1000}s` : 'N/A'}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {tower.level < 3 && towerStats.upgradeCost > 0 && (
                            <button 
                                onClick={() => onUpgrade(tower.id)}
                                disabled={gold < towerStats.upgradeCost}
                                className="relative flex-grow h-10 px-2 disabled:grayscale disabled:cursor-not-allowed transition-transform transform hover:scale-105"
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
                            onClick={() => onSell(tower.id)}
                            className="relative flex-shrink-0 h-10 px-4 transition-transform transform hover:scale-105"
                        >
                            <UIButton/>
                            <div className="absolute inset-0 flex items-center justify-center gap-1 z-10 text-xs">
                                <SellIcon className="w-5 h-5"/>
                                <span>{towerStats.sellValue}</span>
                                <CoinIcon className="w-4 h-4"/>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
