
import React from 'react';
import type { Vector2D, PlayerSpell, EnemyType } from '../types';
import { RAIN_OF_FIRE_STATS, MAP_PATH, GAME_CONFIG } from '../constants';
import { gameToScreen } from '../utils';

// ===================================================================================
// SVG Definitions for Re-use
// ===================================================================================
const SvgDefs: React.FC = () => (
    <defs>
        <linearGradient id="panelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#a1887f', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#795548', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#616161', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#424242', stopOpacity: 1}} />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feFlood floodColor="#000000" floodOpacity="0.5"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
         <radialGradient id="magicGlow">
            <stop offset="0%" stopColor="white" />
            <stop offset="70%" stopColor="cyan" />
            <stop offset="100%" stopColor="rgba(0,255,255,0)" />
        </radialGradient>
        <radialGradient id="fireGlow">
            <stop offset="0%" stopColor="#ffeb3b" />
            <stop offset="50%" stopColor="#f44336" />
            <stop offset="100%" stopColor="rgba(244,67,54,0)" />
        </radialGradient>
    </defs>
);

// ===================================================================================
// UI Elements
// ===================================================================================

export const UIPanel: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <SvgDefs />
    <rect width="100" height="50" rx="8" fill="url(#panelGradient)" />
    <path d="M 5 2 H 95 C 97.2 2 98 2.8 98 5 V 45 C 98 47.2 97.2 48 95 48 H 5 C 2.8 48 2 47.2 2 45 V 5 C 2 2.8 2.8 2 5 2 Z" fill="none" stroke="#5d4037" strokeWidth="2" />
    <path d="M 6 4 H 94 C 95.1 4 96 4.9 96 6 V 44 C 96 45.1 95.1 46 94 46 H 6 C 4.9 46 4 45.1 4 44 V 6 C 4 4.9 4.9 4 6 4 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
  </svg>
);

export const UIButton: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <SvgDefs />
    <rect width="100" height="50" rx="8" fill="url(#buttonGradient)" stroke="#212121" strokeWidth="2" />
    <path d="M 6 4 H 94 C 95.1 4 96 4.9 96 6 V 44 C 96 45.1 95.1 46 94 46 H 6 C 4.9 46 4 45.1 4 44 V 6 C 4 4.9 4.9 4 6 4 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
  </svg>
);

export const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" filter="url(#dropShadow)" xmlns="http://www.w3.org/2000/svg">
    <SvgDefs />
    <circle cx="12" cy="12" r="10" fill="#ffc107" stroke="#e65100" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="7" fill="none" stroke="#ff8f00" strokeWidth="1.5"/>
    <text x="12" y="17" fontSize="12" textAnchor="middle" fill="#e65100" className="font-sans font-bold">G</text>
  </svg>
);


export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" filter="url(#dropShadow)">
        <SvgDefs />
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#f44336" stroke="#c62828" strokeWidth="1.5"/>
    </svg>
);

export const SkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" filter="url(#dropShadow)">
        <SvgDefs />
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8M15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8M8,14V16H9V18H15V16H16V14H8Z" />
    </svg>
);

export const SoundOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg> );
export const SoundOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg> );
export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> );
export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> );

export const UpgradeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 8l-6 6h12l-6-6zm-6 8h12v-2H6v2z"/></svg>
);
export const SellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2V8zm0 8h2v-2h-2v2z"/></svg>
);

export const ReinforcementsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

export const RainOfFireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-7.5 16.5A10 10 0 0 0 12 22a10 10 0 0 0 7.5-3.5A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="m14.47 13.5-1.41-1.41L15 10.17l-1.91-1.91-1.41 1.41-2.12-2.12 1.41-1.41L12.87 5.5 15 3.38l2.12 2.12-1.41 1.41L17.62 9l1.41-1.41L21.15 9.7l-2.12 2.12-1.41-1.41L15.71 12l1.91 1.91-2.15 2.15zM8.5 14.5l-1-1L9.41 11.5l-1.91-1.91-1 1-2.12-2.12 1-1L7.29 5.5 9.5 3.38l2.12 2.12-1 1L8.71 8.41l1.91 1.91-2.12 2.13z"/>
  </svg>
);

export const HeroAbilityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L9 4h6l-3-3zM3 5v2h18V5H3zm2 4l-2 8h2.5l.75-2h3.5l.75 2H13l-2-8H9zm1.5 4.5L11.25 10h.5l.75 3.5h-2zM15 9l-2 8h2.5l.75-2h3.5l.75 2H23l-2-8h-2zm1.5 4.5l.75-3.5h.5l.75 3.5h-2z"/>
  </svg>
);


// ===================================================================================
// Portraits
// ===================================================================================
export const ArcherTowerPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 100 100"><g transform="translate(10 10) scale(0.8)"><path d="M45 90 H55 V70 H45 V90 M40 70 H60 V65 H40 V70 M30 65 H70 V40 H30 V65 M50 35 L60 25 H40 L50 35 M20 40 H80 V35 H20 V40" fill="#a1887f" stroke="#5d4037" strokeWidth="3"/></g></svg> );
export const MageTowerPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 100 100"><g transform="translate(10 10) scale(0.8)"><path d="M50 90 L30 70 H70 L50 90 M40 70 V50 H60 V70 M30 50 H70 V40 H30 V50" fill="#673ab7" stroke="#311b92" strokeWidth="3"/><circle cx="50" cy="25" r="15" fill="url(#magicGlow)" stroke="#00bcd4" strokeWidth="3"/></g></svg> );
export const BarracksTowerPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 100 100"><g transform="translate(10 10) scale(0.8)"><rect x="20" y="40" width="60" height="50" fill="#795548" stroke="#3e2723" strokeWidth="3"/><path d="M15 45 L50 20 L85 45" fill="#a1887f" stroke="#5d4037" strokeWidth="3"/><rect x="40" y="60" width="20" height="30" fill="#5d4037"/></g></svg> );
export const ArtilleryTowerPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 100 100"><g transform="translate(10 10) scale(0.8)"><rect x="10" y="70" width="80" height="20" rx="5" fill="#795548" stroke="#3e2723" strokeWidth="3"/><path d="M20 70 L40 30 H60 L80 70" fill="none" stroke="#5d4037" strokeWidth="5"/><path d="M35 35 L80 50" stroke="#5d4037" strokeWidth="8" strokeLinecap="round"/><circle cx="85" cy="45" r="10" fill="#424242"/></g></svg> );
export const SoldierPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 100 100"><g transform="translate(10 10) scale(0.8)"><path d="M50 10 C 40 10 35 20 35 25 V45 H65 V25 C65 20 60 10 50 10 M40 30 H60" fill="#bdbdbd" stroke="#616161" strokeWidth="3"/><rect x="30" y="45" width="40" height="30" fill="#e0e0e0" stroke="#616161" strokeWidth="3"/><path d="M50 45 L50 75" stroke="#616161" strokeWidth="2"/></g></svg> );
export const HeroPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 100 100"><g transform="translate(10 10) scale(0.8)"><path d="M50 10 C 40 10 35 20 35 25 V45 H65 V25 C65 20 60 10 50 10 M40 30 H60" fill="#ffca28" stroke="#e65100" strokeWidth="3"/><rect x="30" y="45" width="40" height="30" fill="#ffe082" stroke="#e65100" strokeWidth="3"/><path d="M50 45 L50 75" stroke="#e65100" strokeWidth="2"/><path d="M20 40 L30 50 L20 60" fill="#c62828"/></g></svg> );
export const EnemyPortrait: React.FC<{type: EnemyType} & React.SVGProps<SVGSVGElement>> = ({type, ...props}) => {
    const colors = {
        GOBLIN: {fill: '#4caf50', stroke: '#2e7d32'},
        ORC: {fill: '#9e9e9e', stroke: '#424242'},
        TROLL: {fill: '#795548', stroke: '#3e2723'},
    };
    const {fill, stroke} = colors[type];
    return (
        <svg {...props} viewBox="0 0 100 100">
            <g transform="translate(10 10) scale(0.8)">
                <circle cx="50" cy="50" r="35" fill={fill} stroke={stroke} strokeWidth="4"/>
                <circle cx="38" cy="40" r="5" fill="red"/>
                <circle cx="62" cy="40" r="5" fill="red"/>
                <path d="M35 65 Q50 55 65 65" fill="none" stroke="#212121" strokeWidth="4"/>
            </g>
        </svg>
    )
};


// ===================================================================================
// Game Board Elements
// ===================================================================================

export const GameBackground: React.FC<React.SVGProps<HTMLDivElement>> = (props) => {
    const pathPoints = MAP_PATH.map(p => gameToScreen(p));
    const pathString = "M" + pathPoints.map(p => `${p.x},${p.y}`).join(" L");

    return (
        <div {...props}>
             <svg width={GAME_CONFIG.width} height={GAME_CONFIG.height} className="absolute inset-0">
                <rect width="100%" height="100%" fill="#a5d6a7" />
                <rect width="100%" height="45%" fill="#81d4fa" />

                {/* Scenery */}
                <circle cx="300" cy="500" r="120" fill="#66bb6a" />
                <rect x="280" y="450" width="40" height="150" fill="#6d4c41" />
                <circle cx="1400" cy="650" r="150" fill="#4caf50" />
                <rect x="1380" y="600" width="40" height="180" fill="#6d4c41" />
                <ellipse cx="600" cy="350" rx="80" ry="30" fill="#4fc3f7" stroke="#1e88e5" strokeWidth="3" />
                
                <path d={pathString} fill="none" stroke="#a1887f" strokeWidth="70" strokeLinejoin="round" strokeLinecap="round" />
                <path d={pathString} fill="none" stroke="#795548" strokeWidth="60" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
        </div>
    )
};

export const TowerSpotIcon: React.FC<{ isOccupied: boolean }> = ({ isOccupied }) => (
    <svg className="w-24 h-12" viewBox="0 0 100 50">
        <ellipse cx="50" cy="25" rx="48" ry="24" fill={isOccupied ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"} stroke={isOccupied ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)"} strokeWidth="2" strokeDasharray="5 5"/>
    </svg>
);

export const SelectionCircle: React.FC<{ position: Vector2D }> = ({ position }) => (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: position.x, top: position.y + 40, zIndex: 1 }}>
        <svg width="120" height="60" viewBox="0 0 120 60">
            <ellipse cx="60" cy="30" rx="55" ry="28" fill="rgba(255, 235, 59, 0.2)" stroke="#FFFDE7" strokeWidth="2">
                <animate attributeName="stroke-width" values="2;4;2" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.7;1" dur="1s" repeatCount="indefinite" />
            </ellipse>
        </svg>
    </div>
);

export const RallyPointRangeCircle: React.FC<{ position: Vector2D, range: number }> = ({ position, range }) => {
    const diameter = range * 2;
    const height = diameter / 2; // Isometric ratio
    return (
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: position.x, top: position.y, zIndex: 1 }}>
            <svg width={diameter} height={height} viewBox={`0 0 ${diameter} ${height}`}>
                <ellipse cx={range} cy={height / 2} rx={range - 2} ry={(height / 2) - 2} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
        </div>
    );
};

export const RallyPointFlag: React.FC<{ position: Vector2D }> = ({ position }) => (
    <div className="absolute transform -translate-x-1/2 -translate-y-full" style={{ left: position.x, top: position.y, zIndex: Math.floor(position.y) }}>
        <svg width="40" height="60" viewBox="0 0 40 60">
            <line x1="5" y1="0" x2="5" y2="60" stroke="#6d4c41" strokeWidth="4" />
            <polygon points="5,5 35,20 5,35" fill="#ef5350" stroke="#c62828" strokeWidth="2" />
        </svg>
    </div>
);


// ===================================================================================
// Towers
// ===================================================================================
interface TowerProps { isAttacking?: boolean; level: number; }

export const ArcherTowerIcon: React.FC<TowerProps> = ({level}) => (
    <svg width="100" height="120" viewBox="0 0 100 120">
        <rect x="30" y="40" width="40" height="80" fill="#a1887f" stroke="#5d4037" strokeWidth="2" />
        <rect x="20" y="30" width="60" height="20" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
        <path d="M20 30 L15 20 H85 L80 30" fill="#795548" stroke="#5d4037" strokeWidth="2" />
        {level >= 2 && <rect x="45" y="0" width="10" height="20" fill="#6d4c41" />}
        {level >= 2 && <polygon points="55,5 75,10 55,15" fill={level === 3 ? "#fdd835" : "#ef5350"} stroke="#c62828" strokeWidth="1" />}
    </svg>
);

export const MageTowerIcon: React.FC<TowerProps> = ({level}) => (
    <svg width="100" height="120" viewBox="0 0 100 120">
        <path d="M50 120 L30 80 H70 Z" fill="#673ab7" stroke="#311b92" strokeWidth="2"/>
        <rect x="40" y="50" width="20" height="30" fill="#7e57c2" stroke="#311b92" strokeWidth="2" />
        <path d="M20 50 L80 50 L60 30 H40 Z" fill="#512da8" stroke="#311b92" strokeWidth="2" />
        <circle cx="50" cy="20" r={8 + level * 2} fill="url(#magicGlow)" stroke="#00bcd4" strokeWidth="2" >
             <animate attributeName="r" values={`${8+level*2};${10+level*2};${8+level*2}`} dur="2s" repeatCount="indefinite" />
        </circle>
        {level >= 2 && <circle cx="25" cy="35" r="8" fill="url(#magicGlow)" />}
        {level >= 3 && <circle cx="75" cy="35" r="8" fill="url(#magicGlow)" />}
    </svg>
);

export const BarracksTowerIcon: React.FC<TowerProps> = ({level}) => (
    <svg width="120" height="100" viewBox="0 0 120 100">
        <rect x="10" y="40" width="100" height="60" rx="5" fill="#8d6e63" stroke="#4e342e" strokeWidth="2"/>
        <path d="M5 45 L60 10 L115 45" fill="#a1887f" stroke="#5d4037" strokeWidth="3" />
        <rect x="45" y="60" width="30" height="40" fill="#6d4c41" />
        {level >= 2 && <rect x="20" y="65" width="10" height="10" stroke="black" fill="none" />}
        {level >= 3 && <rect x="90" y="65" width="10" height="10" stroke="black" fill="none" />}
    </svg>
);

export const ArtilleryTowerIcon: React.FC<TowerProps> = ({level}) => (
    <svg width="120" height="100" viewBox="0 0 120 100">
        <rect x="0" y="80" width="120" height="20" rx="5" fill="#795548" stroke="#3e2723" strokeWidth="3"/>
        <path d="M20 80 L50 20 H70 L100 80" fill="none" stroke="#5d4037" strokeWidth={6 + level * 2}/>
        <path d="M40 30 L100 50" stroke="#5d4037" strokeWidth="10" strokeLinecap="round"/>
        <circle cx="105" cy="45" r="12" fill="#424242"/>
    </svg>
);

// ===================================================================================
// Units
// ===================================================================================
interface UnitProps { isFighting?: boolean; isAttacking?: boolean; isDamaged?: boolean; }
export const SoldierIcon: React.FC<UnitProps> = ({ isFighting }) => (
    <svg width="40" height="50" viewBox="0 0 40 50">
        <circle cx="20" cy="10" r="8" fill="#e0e0e0" stroke="#616161" strokeWidth="1.5" />
        <rect x="10" y="18" width="20" height="25" rx="5" fill="#bdbdbd" stroke="#616161" strokeWidth="1.5" />
        <rect x="5" y="43" width="30" height="5" fill="#757575" />
        <g transform={isFighting ? `rotate(-30 20 25)` : ''} style={{transition: 'transform 0.2s'}}>
            <rect x="2" y="15" width="5" height="25" fill="#8d6e63"/>
            <rect x="0" y="13" width="9" height="5" fill="#757575"/>
        </g>
    </svg>
);

export const HeroIcon: React.FC<UnitProps> = ({ isAttacking }) => (
    <svg width="50" height="60" viewBox="0 0 50 60">
        <polygon points="10,0 40,0 45,15 5,15" fill="#ffca28" stroke="#e65100" strokeWidth="1.5"/>
        <rect x="10" y="15" width="30" height="30" rx="5" fill="#ffe082" stroke="#e65100" strokeWidth="1.5"/>
        <rect x="5" y="45" width="40" height="10" fill="#c62828" />
         <g transform={isAttacking ? `rotate(-45 35 25)` : `rotate(-15 35 25)`} style={{transition: 'transform 0.1s'}}>
            <rect x="35" y="10" width="8" height="35" fill="#bcaaa4"/>
            <rect x="30" y="5" width="18" height="8" fill="#757575"/>
        </g>
    </svg>
);

export const MilitiaIcon: React.FC<UnitProps> = ({ isFighting }) => (
     <svg width="40" height="50" viewBox="0 0 40 50">
        <circle cx="20" cy="10" r="8" fill="#a1887f" stroke="#4e342e" strokeWidth="1.5" />
        <rect x="10" y="18" width="20" height="25" rx="5" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.5" />
        <g transform={isFighting ? 'rotate(-90 20 25)' : ''} style={{transition: 'transform 0.2s'}}>
            <polygon points="5,20 5,30 35,25" fill="#757575" stroke="#424242" strokeWidth="1"/>
        </g>
    </svg>
);

export const EnemyIcon: React.FC<{type: EnemyType} & UnitProps> = ({ type }) => {
    switch (type) {
        case 'GOBLIN': return <svg width="35" height="40" viewBox="0 0 35 40"><circle cx="17.5" cy="15" r="12" fill="#4caf50" stroke="#2e7d32" strokeWidth="2"/><rect x="10" y="25" width="15" height="15" fill="#66bb6a" stroke="#2e7d32" strokeWidth="2"/><line x1="30" y1="10" x2="35" y2="30" stroke="#8d6e63" strokeWidth="4"/></svg>
        case 'ORC': return <svg width="50" height="55" viewBox="0 0 50 55"><rect x="5" y="10" width="40" height="45" rx="10" fill="#9e9e9e" stroke="#424242" strokeWidth="2"/><circle cx="18" cy="15" r="4" fill="red"/><circle cx="32" cy="15" r="4" fill="red"/><line x1="0" y1="20" x2="20" y2="5" stroke="#6d4c41" strokeWidth="6"/><polygon points="18,5 25,0 20,10" fill="#616161" /></svg>
        case 'TROLL': return <svg width="70" height="80" viewBox="0 0 70 80"><rect x="0" y="10" width="70" height="70" rx="15" fill="#795548" stroke="#3e2723" strokeWidth="3"/><circle cx="25" cy="25" r="6" fill="yellow"/><circle cx="45" cy="25" r="6" fill="yellow"/></svg>
    }
};

// ===================================================================================
// Projectiles
// ===================================================================================
export const ArrowProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="30" height="10" viewBox="0 0 30 10">
        <line x1="0" y1="5" x2="25" y2="5" stroke="#8d6e63" strokeWidth="2" />
        <polygon points="20,0 30,5 20,10" fill="#d7ccc8" />
    </svg>
);

export const MagicBoltProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="url(#magicGlow)" />
    </svg>
);

export const CannonballProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="#424242" stroke="#212121" strokeWidth="2"/>
    </svg>
);

// ===================================================================================
// Special Effects
// ===================================================================================
export const Explosion: React.FC<{ position: Vector2D, radius: number }> = ({ position, radius }) => (
  <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: position.x, top: position.y, zIndex: 15000 }}>
    <svg width={radius * 2} height={radius * 2} viewBox="0 0 100 100" className="animate-ping">
        <circle cx="50" cy="50" r="40" fill="url(#fireGlow)" />
    </svg>
  </div>
);

export const TargetCursor: React.FC<{ position: Vector2D; spell: PlayerSpell }> = ({ position, spell }) => {
  const radius = spell === 'RAIN_OF_FIRE' ? RAIN_OF_FIRE_STATS.radius : 40;
  const color = spell === 'RAIN_OF_FIRE' ? '#f44336' : '#4caf50';

  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: position.x, top: position.y, zIndex: 20000 }}>
        <svg width={radius * 2} height={radius * 2} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} fill="none" stroke={color} strokeWidth="4" strokeDasharray="10, 10">
                <animate attributeName="stroke-dashoffset" from="0" to="20" dur="0.5s" repeatCount="indefinite" />
            </circle>
            <line x1="100" y1="0" x2="100" y2="200" stroke={color} strokeWidth="2"/>
            <line x1="0" y1="100" x2="200" y2="100" stroke={color} strokeWidth="2"/>
        </svg>
    </div>
  );
};


export const BuffEffect: React.FC<{size?: number}> = ({size = 60}) => {
    const height = size / 2;
    return (
        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 pointer-events-none">
            <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
                <ellipse cx={size/2} cy={height/2} rx={size/2 - 2} ry={height/2 - 2} fill="rgba(255, 235, 59, 0.3)" stroke="#FFFDE7" strokeWidth="2">
                     <animate attributeName="rx" values={`${size/2-2};${size/2-5};${size/2-2}`} dur="1s" repeatCount="indefinite" />
                     <animate attributeName="ry" values={`${height/2-2};${height/2-4};${height/2-2}`} dur="1s" repeatCount="indefinite" />
                </ellipse>
            </svg>
        </div>
    )
}
