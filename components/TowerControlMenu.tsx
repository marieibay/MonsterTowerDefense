

import React, { useState, useEffect } from 'react';
import type { Tower } from '../types';
import { TOWER_STATS, GAME_CONFIG } from '../constants';
import { gameToScreen } from '../utils';
import { 
    CoinIcon, 
    UIPanel, 
    UIButton,
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
        // Reset confirmation state when a new tower is selected
        setConfirmUpgrade(false);
    }, [tower.id]);

    const screenPos = gameToScreen(tower.position);
    const menuWidth = 450;
    const menuHeight = 144;
    const horizontalOffset = 120; // Distance from tower center to the menu's edge

    let x, y;

    // Center vertically on the tower, but slightly higher to avoid the base
    y = screenPos.y - menuHeight / 2 - 40; 

    // Decide whether to place on the left or right based on available screen space
    const spaceOnRight = GAME_CONFIG.width - (screenPos.x + horizontalOffset + menuWidth);
    const spaceOnLeft = screenPos.x - horizontalOffset - menuWidth;

    if (spaceOnRight >= 0 || spaceOnRight > spaceOnLeft) {
        // Place on the right
        x = screenPos.x + horizontalOffset;
    } else {
        // Place on the left
        x = screenPos.x - menuWidth - horizontalOffset;
    }
    
    // Clamp position to be within screen bounds to prevent it from going off the edges
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
            className="absolute w-[450px] h-36 flex flex-row items-center p-2 gap-3"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                zIndex: 16000,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
             <UIPanel className="absolute inset-0 w-full h-full" />
             <div className="relative z-10 w-28 h-28 bg-gray-900 overflow-hidden border-2 border-gray-500 flex-shrink-0 p-1">
                {getUnitPortrait(tower)}
             </div>
             <div className="relative z-10 flex flex-col justify-center text-left text-white flex-grow h-full w-full text-sm pb-0">
                <h3 className="text-xl -mt-2" style={{ textShadow: '2px 2px #000' }}>{towerStats.name}</h3>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm" style={{ textShadow: '1px 1px #000' }}>
                   {towerStats.damage > 0 && <span>DMG: {towerStats.damage}</span>}
                   {towerStats.range > 0 && <span>RNG: {towerStats.range}</span>}
                   {towerStats.fireRate > 0 && <span>SPD: {`${towerStats.fireRate / 1000}s`}</span>}
                   {towerStats.damage === 0 && <span>DMG: N/A</span>}
                </div>
                <div className="flex gap-2 mt-2">
                    {tower.level < 3 && (
                        <button 
                            onMouseDown={handleUpgradeClick}
                            disabled={gold < towerStats.upgradeCost}
                            className="relative w-32 h-10 px-2 disabled:grayscale disabled:cursor-not-allowed transition-transform transform hover:scale-105"
                        >
                            <UIButton/>
                            <div className="absolute inset-0 flex items-center justify-center gap-1 z-10 text-xs">
                                {confirmUpgrade ? (
                                    <span className="text-yellow-300">Confirm?</span>
                                ) : (
                                    <>
                                        <UpgradeIcon className="w-5 h-5"/>
                                        <span>{towerStats.upgradeCost}</span>
                                        <CoinIcon className="w-4 h-4"/>
                                    </>
                                )}
                            </div>
                        </button>
                    )}
                    <button 
                        onMouseDown={handleSellClick}
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
    );
};