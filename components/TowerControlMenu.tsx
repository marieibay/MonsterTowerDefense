import React, { useState, useEffect } from 'react';
import type { Tower } from '../types';
import { TOWER_STATS, GAME_CONFIG } from '../constants';
import { gameToScreen } from '../utils';
import { 
    CoinIcon, 
    WinterfellWatchtowerPortrait, WeirwoodGrovePortrait, NorthernBarracksPortrait, SiegeWorkshopPortrait,
    UpgradeIcon, SellIcon
} from './icons';

interface TowerControlMenuProps {
  tower: Tower;
  gold: number;
  onUpgrade: (id: number) => void;
  onSell: (id: number) => void;
}

const getUnitPortrait = (unit: Tower) => {
    switch (unit.type) {
        case 'WINTERFELL_WATCHTOWER': return <WinterfellWatchtowerPortrait className="w-full h-full" level={unit.level}/>;
        case 'WEIRWOOD_GROVE': return <WeirwoodGrovePortrait className="w-full h-full" level={unit.level}/>;
        case 'NORTHERN_BARRACKS': return <NorthernBarracksPortrait className="w-full h-full" level={unit.level}/>;
        case 'SIEGE_WORKSHOP': return <SiegeWorkshopPortrait className="w-full h-full" level={unit.level}/>;
    }
}

export const TowerControlMenu: React.FC<TowerControlMenuProps> = ({ tower, gold, onUpgrade, onSell }) => {
    const [confirmUpgrade, setConfirmUpgrade] = useState(false);

    useEffect(() => {
        setConfirmUpgrade(false);
        const reset = () => setConfirmUpgrade(false);
        document.addEventListener('mousedown', reset);
        return () => document.removeEventListener('mousedown', reset);
    }, [tower.id]);

    const screenPos = gameToScreen(tower.position);
    const menuWidth = 450;
    const menuHeight = 144;
    const horizontalOffset = 120; 

    let x, y;

    y = screenPos.y - menuHeight / 2 - 40; 

    const spaceOnRight = GAME_CONFIG.width - (screenPos.x + horizontalOffset + menuWidth);
    const spaceOnLeft = screenPos.x - menuWidth - horizontalOffset;

    if (spaceOnRight >= 0 || spaceOnRight > spaceOnLeft) {
        x = screenPos.x + horizontalOffset;
    } else {
        x = screenPos.x - menuWidth - horizontalOffset;
    }
    
    x = Math.max(10, Math.min(x, GAME_CONFIG.width - menuWidth - 10));
    y = Math.max(10, Math.min(y, GAME_CONFIG.height - menuHeight - 10));

    const towerStats = TOWER_STATS[tower.type][tower.level - 1];
    
    const handleUpgradeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirmUpgrade) {
            onUpgrade(tower.id);
            setConfirmUpgrade(false);
        } else {
            setConfirmUpgrade(true);
        }
    };

    const handleSellClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSell(tower.id);
    }

    return (
        <div 
            className="absolute w-[450px] h-36 flex flex-row items-center p-3 gap-3 bg-gray-800/90 border border-gray-600 rounded-lg shadow-lg"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                zIndex: 16000,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
             <div className="relative z-10 w-28 h-full bg-gray-900 overflow-hidden border-2 border-gray-500 rounded-md flex-shrink-0 p-1">
                {getUnitPortrait(tower)}
             </div>
             <div className="relative z-10 flex flex-col justify-center text-left text-white flex-grow h-full w-full text-sm pb-0">
                <h3 className="text-xl -mt-2">{towerStats.name}</h3>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                   {towerStats.damage > 0 && <span>DMG: {towerStats.damage}</span>}
                   {towerStats.range > 0 && <span>RNG: {towerStats.range}</span>}
                   {towerStats.fireRate > 0 && <span>SPD: {`${towerStats.fireRate / 1000}s`}</span>}
                   {towerStats.damage === 0 && <span>DMG: N/A</span>}
                </div>
                <div className="flex gap-4 mt-2">
                    {tower.level < 3 && (
                        <button 
                            onMouseDown={handleUpgradeClick}
                            disabled={gold < towerStats.upgradeCost}
                            className="h-10 px-4 disabled:grayscale disabled:cursor-not-allowed transition-transform transform hover:scale-105 bg-blue-600 text-white rounded-lg border border-blue-800 hover:bg-blue-700"
                        >
                            <div className="flex items-center justify-center gap-2 z-10 text-xs">
                                {confirmUpgrade ? (
                                    <span className="text-yellow-300">Confirm?</span>
                                ) : (
                                    <>
                                        <UpgradeIcon className="w-5 h-5"/>
                                        <div className="flex flex-col items-start leading-tight -space-y-1">
                                            <span>Upgrade</span>
                                            <div className="flex items-center gap-1">
                                                <span>{towerStats.upgradeCost}</span>
                                                <CoinIcon className="w-3 h-3"/>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </button>
                    )}
                    <button 
                        onMouseDown={handleSellClick}
                        className="h-10 px-4 transition-transform transform hover:scale-105 bg-blue-600 text-white rounded-lg border border-blue-800 hover:bg-blue-700"
                    >
                        <div className="flex items-center justify-center gap-2 z-10 text-xs">
                             <SellIcon className="w-5 h-5"/>
                             <div className="flex flex-col items-start leading-tight -space-y-1">
                                <span>Sell</span>
                                <div className="flex items-center gap-1">
                                    <span>{towerStats.sellValue}</span>
                                    <CoinIcon className="w-3 h-3"/>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
             </div>
        </div>
    );
};
