import React from 'react';
import type { Vector2D, TowerType } from '../types';
import { TOWER_STATS } from '../constants';
import { 
    WinterfellWatchtowerIcon,
    WeirwoodGroveIcon,
    NorthernBarracksIcon,
    SiegeWorkshopIcon,
    CoinIcon, 
    UIPanel
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