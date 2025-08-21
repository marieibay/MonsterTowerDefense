import React from 'react';
import type { Vector2D, PlayerSpell, EnemyType } from '../types';
import { RAIN_OF_FIRE_STATS, MAP_PATH, GAME_CONFIG } from '../constants';
import { gameToScreen } from '../utils';

// Helper for creating pixel art with rects
const P: React.FC<{ C: string; X: number; Y: number; S?: number; W?: number; H?: number }> = ({ C, X, Y, S = 1, W, H }) => (
  <rect fill={C} x={X} y={Y} width={W ?? S} height={H ?? S} />
);

// ===================================================================================
// UI Elements
// ===================================================================================

const PixelBorder: React.FC<{ width: number; height: number }> = ({ width, height }) => (
    <>
        <path d={`M 0 2 V 0 H 2 V 2 H 0 M ${width-2} 0 H ${width} V 2 H ${width-2} V 0 M 0 ${height-2} H 2 V ${height} H 0 V ${height-2} M ${width-2} ${height} V ${height-2} H ${width} V ${height} H ${width-2}`} fill="#fff" />
        <path d={`M 2 0 H ${width-2} V 2 H 2 V 0 M 0 2 V ${height-2} H 2 V 2 H 0 M ${width-2} 2 H ${width} V ${height-2} H ${width-2} V 2 M 2 ${height-2} H ${width-2} V ${height} H 2 V ${height-2}`} fill="#c2c2c2" />
        <path d={`M 2 2 H ${width-2} V 4 H 2 V 2 M 2 4 V ${height-4} H 4 V 4 H 2 M ${width-4} 4 H ${width-2} V ${height-4} H ${width-4} V 4 M 4 ${height-4} H ${width-4} V ${height-2} H 4 V ${height-4}`} fill="#000" />
    </>
);


export const UIPanel: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="50" fill="#455a64" />
    <PixelBorder width={100} height={50} />
  </svg>
);

export const UIButton: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="50" fill="#607d8b" />
    <PixelBorder width={100} height={50} />
  </svg>
);


export const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 16 16">
        <P C="#ffcc00" X={4} Y={1} S={8} /><P C="#ffcc00" X={3} Y={2} S={10} /><P C="#ffcc00" X={2} Y={3} S={12} /><P C="#ffcc00" X={1} Y={4} S={14} /><P C="#ffcc00" X={1} Y={11} S={14} />
        <P C="#ffe680" X={4} Y={2} S={8} /><P C="#ffe680" X={3} Y={3} S={10} /><P C="#ffe680" X={2} Y={4} S={12} />
        <P C="#b38f00" X={4} Y={12} S={8} /><P C="#b38f00" X={3} Y={13} S={10} /><P C="#b38f00" X={2} Y={14} S={12} />
        <P C="#4d3d00" X={6} Y={5} S={4} /><P C="#4d3d00" X={5} Y={6} S={6} /><P C="#4d3d00" X={5} Y={9} S={6} />
    </svg>
);

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 16 16">
        <P C="#d32f2f" X={2} Y={2} S={4} /><P C="#d32f2f" X={10} Y={2} S={4} /><P C="#d32f2f" X={1} Y={3} S={14} /><P C="#d32f2f" X={2} Y={9} S={12} /><P C="#d32f2f" X={4} Y={11} S={8} /><P C="#d32f2f" X={6} Y={13} S={4} />
        <P C="#ffcdd2" X={3} Y={3} S={2} /><P C="#ffcdd2" X={11} Y={3} S={2} />
    </svg>
);

export const SkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 16 16">
    <P C="#fff" X={4} Y={2} S={8} /><P C="#fff" X={3} Y={4} S={10} /><P C="#fff" X={4} Y={11} S={8} />
    <P C="#000" X={5} Y={5} S={2} /><P C="#000" X={9} Y={5} S={2} /><P C="#000" X={7} Y={8} S={2} />
  </svg>
);

export const SoundOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg> );
export const SoundOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg> );
export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> );
export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> );
export const UpgradeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 8l-6 6h12l-6-6zm-6 8h12v-2H6v2z"/></svg>);
export const SellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2V8zm0 8h2v-2h-2v2z"/></svg>);
export const ReinforcementsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z"/></svg>);
export const RainOfFireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-7.5 16.5A10 10 0 0 0 12 22a10 10 0 0 0 7.5-3.5A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="m14.47 13.5-1.41-1.41L15 10.17l-1.91-1.91-1.41 1.41-2.12-2.12 1.41-1.41L12.87 5.5 15 3.38l2.12 2.12-1.41 1.41L17.62 9l1.41-1.41L21.15 9.7l-2.12 2.12-1.41-1.41L15.71 12l1.91 1.91-2.15 2.15zM8.5 14.5l-1-1L9.41 11.5l-1.91-1.91-1 1-2.12-2.12 1-1L7.29 5.5 9.5 3.38l2.12 2.12-1 1L8.71 8.41l1.91 1.91-2.12 2.13z"/></svg>);
export const OathkeeperStandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>);

// Game Board Elements
export const GameBackground: React.FC<React.SVGProps<HTMLDivElement>> = (props) => {
    const pathPoints = MAP_PATH.map(p => gameToScreen(p));
    const pathString = "M" + pathPoints.map(p => `${p.x},${p.y}`).join(" L");

    return (
        <div {...props}>
             <svg width={GAME_CONFIG.width} height={GAME_CONFIG.height} className="absolute inset-0">
                <defs>
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
                    </filter>
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#607d8b', stopOpacity: 1}} />
                        <stop offset="50%" style={{stopColor: '#90a4ae', stopOpacity: 1}} />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#skyGradient)" />
                <rect y="440" width="100%" height="100%" fill="#616161" />
                <rect y="440" width="100%" height="100%" fill="url(#noise)" opacity="0.05" />

                <path d="M 0 440 C 300 480, 600 420, 900 450 S 1500 500, 1920 460 V 880 H 0 Z" fill="#eeeeee" />
                <path d="M 0 440 C 300 480, 600 420, 900 450 S 1500 500, 1920 460 V 880 H 0 Z" fill="url(#noise)" opacity="0.1" />

                <path d="M -100 440 L 200 250 L 500 440 Z" fill="#90a4ae"/>
                <path d="M 100 440 L 250 200 L 400 440 Z" fill="#cfd8dc"/>
                <path d="M 1300 440 L 1600 150 L 1900 440 Z" fill="#90a4ae"/>
                <path d="M 1500 440 L 1750 250 L 2000 440 Z" fill="#cfd8dc"/>
                
                <path d={pathString} fill="none" stroke="#a1887f" strokeWidth="70" strokeLinejoin="round" strokeLinecap="round" />
                <path d={pathString} fill="none" stroke="#8d6e63" strokeWidth="60" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
        </div>
    )
};

export const TowerSpotIcon: React.FC<{ isOccupied: boolean }> = ({ isOccupied }) => (
    <svg className="w-24 h-12" viewBox="0 0 100 50">
        <style>{`
            @keyframes pulse-rune {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
            .pulsing-rune {
                animation: pulse-rune 3s infinite ease-in-out;
            }
        `}</style>
         <defs>
            <filter id="rune-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g className={isOccupied ? 'opacity-10' : 'pulsing-rune'} filter="url(#rune-glow)">
            <ellipse cx="50" cy="25" rx="40" ry="20" fill="none" stroke="#4dd0e1" strokeWidth="2" />
            <text x="50" y="30" fontFamily="serif" fontSize="24" fill="#4dd0e1" textAnchor="middle" >ᛒ</text>
        </g>
    </svg>
);

export const SelectionCircle: React.FC<{ position: Vector2D }> = ({ position }) => (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: position.x, top: position.y + 40, zIndex: 1 }}>
        <svg width="120" height="60" viewBox="0 0 120 60">
             <defs>
                <filter id="selection-glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                </filter>
            </defs>
            <ellipse cx="60" cy="30" rx="55" ry="28" fill="none" stroke="#FFF" strokeWidth="2" filter="url(#selection-glow)">
                <animateTransform attributeName="transform" type="rotate" from="0 60 30" to="360 60 30" dur="4s" repeatCount="indefinite" />
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
                <ellipse cx={range} cy={height / 2} rx={range - 2} ry={(height / 2) - 2} fill="rgba(207, 216, 220, 0.1)" stroke="#eceff1" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
        </div>
    );
};

export const RallyPointFlag: React.FC<{ position: Vector2D }> = ({ position }) => (
    <div className="absolute transform -translate-x-1/2 -translate-y-full" style={{ left: position.x, top: position.y, zIndex: Math.floor(position.y) }}>
        <svg width="24" height="36" viewBox="0 0 24 36">
            <rect x="1" y="0" width="3" height="36" fill="#6d4c41" />
            <path d="M4 2 L22 6 L4 10 Z" fill="#cfd8dc"/>
             <path d="M8 5 L10 5 L9 6 L10 7 L8 7 L7 6 Z" fill="#263238" />
        </svg>
    </div>
);

// ===================================================================================
// Towers (House Stark) - Redesigned & Animated
// ===================================================================================
interface TowerProps extends React.SVGProps<SVGSVGElement> { 
    isAttacking?: boolean; 
    level: number; 
}

const towerIdleAnim = `
    @keyframes tower-idle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-1px); }
    }
    .idle {
        animation: tower-idle 5s infinite ease-in-out;
    }
`;

export const WinterfellWatchtowerIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="64" height="96" viewBox="0 0 32 48" {...props}>
        <style>{`
            ${towerIdleAnim}
            @keyframes wave { 0% { d: "M17 22 C 19 21, 23 21, 25 22 L 25 28 C 23 29, 19 29, 17 28 Z"; } 50% { d: "M17 22 C 19 23, 23 23, 25 22 L 25 28 C 23 27, 19 27, 17 28 Z"; } 100% { d: "M17 22 C 19 21, 23 21, 25 22 L 25 28 C 23 29, 19 29, 17 28 Z"; } }
        `}</style>
        <g className="idle">
            <path d="M6 48 L 26 48 L 28 32 L 4 32 Z" fill="#757575" />
            <path d="M4 32 L 28 32 L 30 16 L 2 16 Z" fill="#9e9e9e" />
            <rect x="0" y="4" width="32" height="12" fill="#616161" />
            <rect x="0" y="0" width="4" height="4" fill="#424242"/><rect x="8" y="0" width="4" height="4" fill="#424242"/><rect x="20" y="0" width="4" height="4" fill="#424242"/><rect x="28" y="0" width="4" height="4" fill="#424242"/>
            <rect x="15" y="18" width="2" height="12" fill="#455a64" />
            <path fill="#eceff1" style={{ animation: 'wave 3s infinite ease-in-out' }} d="M17 22 C 19 21, 23 21, 25 22 L 25 28 C 23 29, 19 29, 17 28 Z" />
            <path d="M19 24.5 L 21 23 L 23 24.5 L 21 26 Z" fill="#455a64"/>
            {level > 1 && <rect x="14" y="14" width="4" height="2" fill="#ffd700" />}
            {level > 2 && <><rect x="2" y="12" width="28" height="2" fill="#03a9f4" /><rect x="2" y="13" width="28" height="1" fill="#0288d1" /></>}
            {isAttacking && <circle cx="16" cy="8" r="4" fill="#81d4fa"><animate attributeName="r" values="0;4;0" dur="0.3s" /></circle>}
        </g>
    </svg>
);

export const WeirwoodGroveIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="80" height="80" viewBox="0 0 40 40" {...props}>
        <style>{`
            @keyframes pulse-glow { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            @keyframes leaves-rustle { 0%, 100% { transform: skewX(0); } 50% { transform: skewX(2deg); } }
        `}</style>
        <g style={{ animation: 'leaves-rustle 4s infinite ease-in-out', transformOrigin: 'center' }}>
            <circle cx="20" cy="12" r={8 + level*2} fill="#e53935" />
            <circle cx="12" cy="14" r={4 + level} fill="#f44336" />
            <circle cx="28" cy="14" r={4 + level} fill="#f44336" />
        </g>
        <path d="M20 40 C 16 35, 16 20, 18 15 L 22 15 C 24 20, 24 35, 20 40 Z" fill="#f5f5f5" />
        <g style={{ animation: 'pulse-glow 2s infinite ease-in-out', filter: 'drop-shadow(0 0 2px #c62828)'}}>
            <path d="M19 20 L21 20 M18 22 L22 22 M19 24 Q 20 25 21 24" stroke="#c62828" strokeWidth="1" fill="none"/>
        </g>
        {isAttacking && <circle cx="20" cy="22" r="4" fill="#ffcdd2"><animate attributeName="r" values="0;4;0" dur="0.4s" /></circle>}
    </svg>
);

export const NorthernBarracksIcon: React.FC<TowerProps> = ({level, ...props}) => (
    <svg width="80" height="64" viewBox="0 0 40 32" {...props}>
        <style>{towerIdleAnim}</style>
        <g className="idle">
            <path d="M0 28 L40 28 L40 32 L0 32 Z" fill="#757575" />
            <path d="M2 14 L38 14 L38 28 L2 28 Z" fill="#a1887f" />
            <path d="M0 14 L20 2 L40 14 Z" fill="#6d4c41" />
            <rect x="17" y="20" width="6" height="8" fill="#5d4037" />
            {level > 1 && <path d="M28 16 L34 16 L34 22 L28 22 Z" stroke="#f5f5f5" strokeWidth="1" fill="none"/>}
            {level > 2 && <path d="M4 16 L10 16 L10 22 L4 22 Z" stroke="#f5f5f5" strokeWidth="1" fill="none"/>}
        </g>
    </svg>
);

export const SiegeWorkshopIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="80" height="64" viewBox="0 0 40 32" {...props}>
        <style>{`${towerIdleAnim}`}</style>
        <g className="idle">
            <rect x="0" y="26" width="40" height="6" fill="#6d4c41" />
            <circle cx="8" cy="24" r="6" fill="#5d4037" /><circle cx="32" cy="24" r="6" fill="#5d4037" />
            <path d="M6 22 L16 4 H24 L34 22" stroke="#6d4c41" strokeWidth="4" fill="none" strokeLinecap="round" />
            <g transform={isAttacking ? `rotate(-45 20 8)` : `rotate(10 20 8)`} style={{transition: 'transform 0.1s linear'}}>
                <rect x="8" y="6" width="24" height="4" fill="#8d6e63" />
                <path d="M28 4 C 34 4, 34 12, 28 12 Z" fill="#a1887f" />
                <circle cx="30" cy="8" r="3" fill="#9e9e9e" />
            </g>
            <rect x="2" y="10" width={8 + level} height={6+level*2} fill="#757575" />
        </g>
    </svg>
);


// ===================================================================================
// Environment
// ===================================================================================
export const TreeIcon1: React.FC = () => <svg width="64" height="80" viewBox="0 0 32 40"><path d="M15 40 L17 40 L17 25 L15 25 Z" fill="#5d4037" /><path d="M16 28 C 8 28, 0 20, 16 0 C 32 20, 24 28, 16 28 Z" fill="#2e7d32" /></svg>;
export const TreeIcon2: React.FC = () => <svg width="64" height="80" viewBox="0 0 32 40"><path d="M15 40 L17 40 L17 30 L15 30 Z" fill="#6d4c41" /><path d="M16 32 C 4 32, 2 15, 16 0 C 30 15, 28 32, 16 32 Z" fill="#388e3c" /></svg>;
export const RockIcon1: React.FC = () => <svg width="40" height="32" viewBox="0 0 20 16"><path d="M2 14 L 18 14 L 16 6 L 4 6 Z" fill="#9e9e9e" /></svg>;
export const RockIcon2: React.FC = () => <svg width="40" height="32" viewBox="0 0 20 16"><path d="M1 14 H 19 L 17 8 L 14 4 L 5 8 Z" fill="#bdbdbd" /></svg>;

// ===================================================================================
// Units - Redesigned & Animated
// ===================================================================================
interface UnitProps extends React.SVGProps<SVGSVGElement> { 
    isAttacking?: boolean; 
}
const unitIdleAnim = `
    @keyframes unit-idle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-1px); }
    }
    .idle {
        animation: unit-idle 2.5s infinite ease-in-out;
    }
`;

export const NorthernSoldierIcon: React.FC<UnitProps> = ({ isAttacking, ...props }) => (
    <svg width="32" height="40" viewBox="0 0 16 20" {...props}>
        <style>{unitIdleAnim}</style>
        <g className={isAttacking ? '' : 'idle'}>
            <g transform={isAttacking ? 'translateX(3px)' : ''} style={{transition: 'transform 0.1s'}}>
                <path d="M4 19 L 7 19 L 7 14 L 4 14 Z" fill="#546e7a" />
                <path d="M9 19 L 12 19 L 12 14 L 9 14 Z" fill="#546e7a" />
                <path d="M3 14 L 13 14 L 14 7 L 2 7 Z" fill="#b0bec5"/>
                <path d="M5 6 L 11 6 L 11 2 L 5 2 Z" fill="#cfd8dc"/>
                <path d="M6 4 L 10 4 L 10 5 L 6 5 Z" fill="#ffcc80" />
            </g>
            <g transform={isAttacking ? 'rotate(-30 14 4)' : 'rotate(-15 14 4)'} style={{transition:'transform 0.1s'}}>
                <rect x="13" y="0" width="1" height="16" fill="#a1887f"/>
                <path d="M13 0 L 14 2 L 13 4 Z" fill="#e0e0e0"/>
            </g>
        </g>
    </svg>
);

export const BrienneIcon: React.FC<UnitProps> = ({ isAttacking, ...props }) => (
    <svg width="48" height="52" viewBox="0 0 24 26" {...props}>
        <style>{unitIdleAnim}</style>
        <g className={isAttacking ? '' : 'idle'}>
            <path d="M14 8 L 22 10 L 22 24 L 14 22 Z" fill="#1565c0" />
            <g transform={isAttacking ? 'translateX(-2px)' : ''} style={{transition: 'transform 0.1s'}}>
                <path d="M7 25 L 11 25 L 11 18 L 7 18 Z" fill="#78909c" />
                <path d="M13 25 L 17 25 L 17 18 L 13 18 Z" fill="#78909c" />
                <path d="M6 18 L 18 18 L 18 9 L 6 9 Z" fill="#cfd8dc" />
                <path d="M8 9 L 16 9 L 16 2 L 8 2 Z" fill="#b0bec5" />
                <path d="M10 5 L 14 5 L 14 7 L 10 7 Z" fill="#ffb74d" />
            </g>
            <g transform={isAttacking ? 'translateX(2px)' : ''} style={{transition: 'transform 0.1s'}}>
                <path d="M0 9 L 8 9 L 4 21 Z" fill="#90a4ae" />
                <path d="M5 12 L 7 11 L 8 12 L 7 14 L 5 14 L 4 13 Z" fill="#eceff1"/>
            </g>
             <g transform={isAttacking ? 'rotate(-90 18 12)' : 'rotate(-20 18 12)'} style={{ transition: 'transform 0.1s ease-out', transformOrigin: '18px 12px' }}>
                <path d="M17 12 L 19 12 L 19 11 L 17 11 Z" fill="#d2691e"/>
                <path d="M18 11 L 18 0 L 19 0 L 19 11 Z" fill="#f5f5f5"/>
            </g>
        </g>
    </svg>
);

export const BannermanIcon: React.FC<UnitProps> = ({ isAttacking, ...props }) => (
     <svg width="32" height="40" viewBox="0 0 16 20" {...props}>
        <style>{`
            ${unitIdleAnim}
            @keyframes banner-wave { 0% { d: "M-2 1 C 0 0, 4 0, 6 1 L 6 7 C 4 8, 0 8, -2 7 Z"; } 50% { d: "M-2 1 C 0 2, 4 2, 6 1 L 6 7 C 4 6, 0 6, -2 7 Z"; } 100% { d: "M-2 1 C 0 0, 4 0, 6 1 L 6 7 C 4 8, 0 8, -2 7 Z"; } }
        `}</style>
        <g className="idle">
            <g transform={isAttacking ? 'translateX(1px)' : ''} style={{transition: 'transform 0.1s'}}>
                <path d="M4 19 L 7 19 L 7 14 L 4 14 Z" fill="#546e7a" />
                <path d="M9 19 L 12 19 L 12 14 L 9 14 Z" fill="#546e7a" />
                <path d="M3 14 L 13 14 L 14 7 L 2 7 Z" fill="#2e7d32"/>
                <path d="M5 6 L 11 6 L 11 2 L 5 2 Z" fill="#cfd8dc"/>
                <path d="M6 4 L 10 4 L 10 5 L 6 5 Z" fill="#ffcc80" />
            </g>
            <rect x="0" y="0" width="2" height="18" fill="#a1887f"/>
            <path fill="#eceff1" style={{ animation: 'banner-wave 3s infinite ease-in-out' }} d="M-2 1 C 0 0, 4 0, 6 1 L 6 7 C 4 8, 0 8, -2 7 Z" />
        </g>
    </svg>
);

export const EnemyIcon: React.FC<{type: EnemyType} & UnitProps> = ({ type, isAttacking, ...props }) => {
    const attackTransform = isAttacking ? 'translateY(-2px)' : '';
    const attackStyle = { transition: 'transform 0.1s', transform: attackTransform };

    switch (type) {
        case 'ORC_GRUNT': return <svg width="28" height="36" viewBox="0 0 14 18" {...props}><g className={isAttacking ? '' : 'idle'} style={attackStyle}><path d="M2 17 L 5 17 L 5 12 L 2 12 Z" fill="#5d4037" /><path d="M9 17 L 12 17 L 12 12 L 9 12 Z" fill="#5d4037" /><path d="M1 12 L 13 12 L 12 6 L 2 6 Z" fill="#8d6e63" /><path d="M3 6 L 11 6 C 12 3, 9 0, 7 0 C 5 0, 2 3, 3 6 Z" fill="#7cb342" /><path d="M5 4 L 6 4" stroke="#212121" /><path d="M8 4 L 9 4" stroke="#212121" /><path d="M4 7 L 6 7" stroke="#FFF" /><path d="M8 7 L 10 7" stroke="#FFF" /><g transform={isAttacking ? 'rotate(30 10 10)' : ''} style={{transition:'transform 0.1s'}}><path d="M10 10 L 14 10 L 14 8 L 10 8 Z" fill="#a1887f" /><path d="M12 8 L 12 6 L 13 6 L 13 8 Z" fill="#757575" /></g></g></svg>
        case 'ORC_BERSERKER': return <svg width="32" height="40" viewBox="0 0 16 20" {...props}><g className={isAttacking ? '' : 'idle'} style={attackStyle}><path d="M2 19 L 6 19 L 5 13 L 1 13 Z" fill="#757575" /><path d="M10 19 L 14 19 L 15 13 L 11 13 Z" fill="#757575" /><path d="M1 13 L 15 13 L 14 5 L 2 5 Z" fill="#a1887f" /><path d="M4 5 L 12 5 C 14 2, 10 -1, 8 -1 C 6 -1, 2 2, 4 5 Z" fill="#558b2f" /><path d="M6 3 L 7 3" stroke="#212121" /><path d="M9 3 L 11 3" stroke="#d32f2f" strokeWidth="2" /><path d="M5 6 L 7 6" stroke="#FFF" /><g transform={isAttacking ? 'rotate(-45 13 8)' : ''} style={{transition:'transform 0.1s'}}><path d="M13 2 L 16 2 L 16 12 L 13 12 Z" fill="#757575" /><path d="M14 1 L 15 1 L 15 13 L 14 13 Z" fill="#9e9e9e" /></g></g></svg>
        case 'OGRE_BRUTE': return <svg width="40" height="48" viewBox="0 0 20 24" {...props}><g className={isAttacking ? '' : 'idle'} style={attackStyle}><path d="M3 23 L 9 23 L 9 17 L 3 17 Z" fill="#757575" /><path d="M11 23 L 17 23 L 17 17 L 11 17 Z" fill="#757575" /><path d="M2 17 L 18 17 C 20 12, 20 5, 18 2 L 2 2 C 0 5, 0 12, 2 17 Z" fill="#9e9e9e" /><path d="M5 7 L 8 7" stroke="#212121" strokeWidth="2" /><path d="M12 7 L 15 7" stroke="#212121" strokeWidth="2" /><path d="M6 12 L 14 12 L 12 14 L 8 14 Z" fill="#f5f5f5" /><g transform={isAttacking ? 'rotate(-30 18 10)' : ''} style={{transition:'transform 0.1s'}}><path d="M16 4 L 20 6 L 20 18 L 16 16 Z" fill="#8d6e63" /></g></g></svg>
    }
};

// ===================================================================================
// Projectiles
// ===================================================================================
export const IceArrowProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="24" height="8" viewBox="0 0 24 8" style={{filter: 'drop-shadow(0 0 2px #81d4fa)'}}><path d="M0 3 H 20 L 24 4 L 20 5 H 0 Z" fill="#e1f5fe" /><path d="M0 3 H 10" stroke="#81d4fa" strokeWidth="1" fill="none"/></svg>
);
export const NatureBoltProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16" style={{filter: 'drop-shadow(0 0 2px #4caf50)'}}><circle cx="8" cy="8" r="8" fill="#a5d6a7"><animate attributeName="r" values="8;6;8" dur="0.5s" repeatCount="indefinite" /></circle><circle cx="8" cy="8" r="4" fill="#4caf50" /></svg>
);
export const CatapultRockProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16"><g><animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.5s" repeatCount="indefinite" /><circle cx="8" cy="8" r="7" fill="#795548" /><circle cx="7" cy="7" r="2" fill="#a1887f" /></g></svg>
);

// ===================================================================================
// Special Effects
// ===================================================================================
export const Explosion: React.FC<{ position: Vector2D, radius: number }> = ({ position, radius }) => (
  <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: position.x, top: position.y, zIndex: 15000 }}>
    <svg width={radius * 2} height={radius * 2} viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="yellow">
            <animate attributeName="r" values="0;50" dur="0.3s" begin="0s" fill="freeze" />
            <animate attributeName="opacity" values="1;0" dur="0.3s" begin="0s" fill="freeze" />
        </circle>
        <circle cx="50" cy="50" fill="orange">
            <animate attributeName="r" values="0;40" dur="0.4s" begin="0s" fill="freeze" />
            <animate attributeName="opacity" values="1;0" dur="0.4s" begin="0s" fill="freeze" />
        </circle>
    </svg>
  </div>
);

export const TargetCursor: React.FC<{ position: Vector2D; spell: PlayerSpell }> = ({ position, spell }) => {
  const radius = spell === 'RAIN_OF_FIRE' ? RAIN_OF_FIRE_STATS.radius : 40;
  const color = spell === 'RAIN_OF_FIRE' ? '#f44336' : '#4caf50';
  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: position.x, top: position.y, zIndex: 20000 }}>
        <svg width={radius * 2} height={radius * 2} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="98" fill="none" stroke={color} strokeWidth="4" strokeDasharray="10 10">
                 <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="5s" repeatCount="indefinite" />
            </circle>
        </svg>
    </div>
  );
};

export const BuffEffect: React.FC<{size?: number}> = ({size = 60}) => {
    return (
        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 pointer-events-none">
            <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
                <ellipse cx={size/2} cy={size/4} rx={size/2 - 2} ry={size/4 - 2} fill="none" stroke="#FFFDE7" strokeWidth="2">
                    <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                </ellipse>
            </svg>
        </div>
    )
}

export const SlowEffect: React.FC<{size?: number}> = ({size = 30}) => (
    <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 pointer-events-none opacity-75">
        <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
            <ellipse cx={size/2} cy={size/4} rx={size/2 - 1} ry={size/4 - 1} fill="#00e5ff" />
        </svg>
    </div>
);

export const TauntEffect: React.FC<{size?: number}> = ({size = 60}) => (
    <div className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 pointer-events-none">
        <svg width={size} height={size/2} viewBox={`0 0 ${size} ${size/2}`}>
            <ellipse cx={size/2} cy={size/4} rx={size/2 - 2} ry={size/4 - 2} fill="none" stroke="#f44336" strokeWidth="2">
                 <animate attributeName="stroke-dasharray" values="1,10;5,5;10,1" dur="1s" repeatCount="indefinite" />
            </ellipse>
        </svg>
    </div>
);

// ===================================================================================
// Portraits
// ===================================================================================
export const WinterfellWatchtowerPortrait = WinterfellWatchtowerIcon;
export const WeirwoodGrovePortrait = WeirwoodGroveIcon;
export const NorthernBarracksPortrait = NorthernBarracksIcon;
export const SiegeWorkshopPortrait = SiegeWorkshopIcon;
export const NorthernSoldierPortrait = NorthernSoldierIcon;
export const BriennePortrait = BrienneIcon;
export const EnemyPortrait = EnemyIcon;
