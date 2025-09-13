
import React, { useState, useEffect, useRef } from 'react';
import type { Vector2D, PlayerSpell, EnemyType, EnemyAnimationState, GroundUnitAnimationState } from '../types';
import { RAIN_OF_FIRE_STATS, MAP_PATH } from '../constants';
import { gameToScreen } from '../utils';

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
        <defs>
            <radialGradient id="gold-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#ffee58'}} />
                <stop offset="100%" style={{stopColor: '#f57f17'}} />
            </radialGradient>
        </defs>
        <circle cx="8" cy="8" r="7" fill="url(#gold-grad)" stroke="#b38f00" strokeWidth="1"/>
        <text x="8" y="11" textAnchor="middle" fontSize="8" fill="#fff" style={{fontWeight: 'bold', textShadow: '1px 1px #4d3d00'}}>$</text>
    </svg>
);

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 16 16">
        <defs>
            <linearGradient id="heart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#e57373'}} />
                <stop offset="100%" style={{stopColor: '#c62828'}} />
            </linearGradient>
        </defs>
        <path d="M8 14.5 L7 13.5 C3 10, 1 8, 1 5.5 C1 3.5, 2.5 2, 4.5 2 C6 2, 7.5 3, 8 4 C8.5 3, 10 2, 11.5 2 C13.5 2, 15 3.5, 15 5.5 C15 8, 13 10, 9 13.5 L8 14.5 Z" fill="url(#heart-grad)" stroke="#b71c1c" strokeWidth="1"/>
    </svg>
);

export const SkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 16 16">
    <defs>
      <linearGradient id="skull-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fafafa" />
        <stop offset="100%" stopColor="#bdbdbd" />
      </linearGradient>
    </defs>
    <path d="M4,2 A6,6 0 0,1 12,2 L13,5 A4,4 0 0,1 13,10 L11,14 L5,14 L3,10 A4,4 0 0,1 3,5 Z" fill="url(#skull-grad)" stroke="#424242" />
    <circle cx="6" cy="7" r="1.5" fill="#212121" />
    <circle cx="10" cy="7" r="1.5" fill="#212121" />
    <rect x="7" y="10" width="2" height="1" fill="#212121" />
  </svg>
);

export const SoundOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg> );
export const SoundOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg> );
export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> );
export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> );
export const UpgradeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 8l-6 6h12l-6-6zm-6 8h12v-2H6v2z"/></svg>);
export const SellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="22"
            fontWeight="bold"
            fontFamily="'Press Start 2P', cursive"
            fill="currentColor"
            dy=".1em"
        >
            $
        </text>
    </svg>
);
export const ReinforcementsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z"/></svg>);
export const RainOfFireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-7.5 16.5A10 10 0 0 0 12 22a10 10 0 0 0 7.5-3.5A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="m14.47 13.5-1.41-1.41L15 10.17l-1.91-1.91-1.41 1.41-2.12-2.12 1.41-1.41L12.87 5.5 15 3.38l2.12 2.12-1.41 1.41L17.62 9l1.41-1.41L21.15 9.7l-2.12 2.12-1.41-1.41L15.71 12l1.91 1.91-2.15 2.15zM8.5 14.5l-1-1L9.41 11.5l-1.91-1.91-1 1-2.12-2.12 1-1L7.29 5.5 9.5 3.38l2.12 2.12-1 1L8.71 8.41l1.91 1.91-2.12 2.13z"/></svg>);
export const OathkeeperStandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>);

export const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <g transform="translate(0, -1)">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9ca3af" fill="#4b5563" />
    <path d="M12 5 V 22 M 4 12 H 20" stroke="#be123c" strokeWidth="1.5"/>
    <path d="M12 5 C 15 7 18 10 20 12 C 18 14 15 17 12 22" fill="#ef4444" stroke="none" />
    <path d="M12 5 C 9 7 6 10 4 12 C 6 14 9 17 12 22" fill="#f3f4f6" stroke="none" />
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#f3f4f6" fill="none" strokeWidth="1.5" />
    </g>
  </svg>
);

export const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24">
    <defs>
      <radialGradient id="flameGradient" cx="50%" cy="70%" r="60%" fx="50%" fy="80%">
        <stop offset="0%" stopColor="#FFF9C4" /> 
        <stop offset="40%" stopColor="#FFB74D" /> 
        <stop offset="80%" stopColor="#F4511E" /> 
        <stop offset="100%" stopColor="#BF360C" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
      </filter>
    </defs>
    {/* Background glow shape */}
    <path 
      d="M12,2A9.13,9.13,0,0,0,5,8.28C5,13.2,12,22,12,22S19,13.2,19,8.28A9.13,9.13,0,0,0,12,2Z"
      fill="#F57C00"
      filter="url(#glow)"
    />
    {/* Main flame shape with gradient */}
    <path 
      d="M12,2A9.13,9.13,0,0,0,5,8.28C5,13.2,12,22,12,22S19,13.2,19,8.28A9.13,9.13,0,0,0,12,2Z"
      fill="url(#flameGradient)"
    />
  </svg>
);

export const SwordsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none">
    {/* Sword 1 (background): Rotated 45 degrees */}
    <g transform="rotate(45 12 12)">
      {/* Blade */}
      <path d="M12 3 v11" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 4 v9" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
      {/* Hilt */}
      <path d="M9 14 h6" stroke="#52525b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 14 v4" stroke="#52525b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.5" fill="#52525b" />
    </g>
    {/* Sword 2 (foreground): Rotated -45 degrees */}
    <g transform="rotate(-45 12 12)">
      {/* Blade */}
      <path d="M12 3 v11" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 4 v9" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
      {/* Hilt */}
      <path d="M9 14 h6" stroke="#52525b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 14 v4" stroke="#52525b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.5" fill="#52525b" />
    </g>
  </svg>
);


// Game Board Elements
export const GameBackground: React.FC<React.SVGProps<HTMLDivElement>> = (props) => {
    // Generate SVG path data from MAP_PATH constants
    const pathData = MAP_PATH
        .map(p => gameToScreen(p))
        .map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`)
        .join(' ');

    return (
        <div {...props}>
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `url('https://i.imgur.com/bzKGLSf.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <defs>
                    <filter id="path-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
                    </filter>
                </defs>
                <path
                    d={pathData}
                    fill="none"
                    stroke="#5d4037" // Darker brown for the 'edge'
                    strokeWidth="70"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'url(#path-shadow)' }}
                />
                <path
                    d={pathData}
                    fill="none"
                    stroke="#8d6e63" // Lighter brown for the main path
                    strokeWidth="60"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
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
            <defs>
                <linearGradient id="wood-pole-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8d6e63" />
                    <stop offset="50%" stopColor="#6d4c41" />
                    <stop offset="100%" stopColor="#8d6e63" />
                </linearGradient>
            </defs>
            <rect x="1" y="0" width="3" height="36" fill="url(#wood-pole-grad)" />
            <path d="M4 2 L22 6 L4 10 Z" fill="#cfd8dc" stroke="#455a64" strokeWidth="0.5"/>
            <path d="M8 5 L 10 5 L 9 6 L 10 7 L 8 7 L 7 6 Z" fill="#263238" />
        </svg>
    </div>
);

// ===================================================================================
// Towers (House Stark) - Redesigned & Animated
// ===================================================================================
interface TowerProps extends React.SVGProps<SVGSVGElement> { 
    isAttacking?: boolean; 
    level: number; 
    spawnCounter?: number;
}

const towerIdleAnim = `
    @keyframes tower-idle {
        0%, 100% { transform: translateY(0) scale(1.0); }
        50% { transform: translateY(-1px) scale(1.01); }
    }
    .idle {
        animation: tower-idle 5s infinite ease-in-out;
        transform-origin: bottom center;
    }
`;

export const WinterfellWatchtowerIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="64" height="96" viewBox="0 0 32 48" {...props}>
        <defs>
            <linearGradient id="stone-grad-1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#616161"/><stop offset="50%" stopColor="#9e9e9e"/><stop offset="100%" stopColor="#757575"/></linearGradient>
            <linearGradient id="stone-grad-2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#78909c"/><stop offset="50%" stopColor="#bdbdbd"/><stop offset="100%" stopColor="#9e9e9e"/></linearGradient>
            <linearGradient id="roof-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#455a64"/><stop offset="50%" stopColor="#78909c"/><stop offset="100%" stopColor="#546e7a"/></linearGradient>
        </defs>
        <style>{`
            ${towerIdleAnim}
            @keyframes wave { 0%, 100% { d: "M17 22 C 19 21, 23 21, 25 22 L 25 28 C 23 29, 19 29, 17 28 Z"; } 50% { d: "M17 22 C 19 23, 23 23, 25 22 L 25 28 C 23 27, 19 27, 17 28 Z"; } }
            .banner { animation: wave 3s infinite ease-in-out; filter: drop-shadow(1px 1px 1px #212121); }
        `}</style>
        <g className="idle">
            <path d="M6 48 L 26 48 L 28 32 L 4 32 Z" fill="url(#stone-grad-1)" />
            <path d="M4 32 L 28 32 L 30 16 L 2 16 Z" fill="url(#stone-grad-2)" />
            <rect x="0" y="4" width="32" height="12" fill="url(#roof-grad)" />
            <path d="M0,4 L32,4 L32,6 L0,6 Z" fill="#37474f" />
            <rect x="0" y="0" width="4" height="4" fill="#424242"/><rect x="8" y="0" width="4" height="4" fill="#424242"/><rect x="20" y="0" width="4" height="4" fill="#424242"/><rect x="28" y="0" width="4" height="4" fill="#424242"/>
            <rect x="15" y="18" width="2" height="12" fill="#455a64" />
            <path className="banner" fill="#eceff1" d="M17 22 C 19 21, 23 21, 25 22 L 25 28 C 23 29, 19 29, 17 28 Z" />
            <path d="M19 24.5 L 21 23 L 23 24.5 L 21 26 Z" fill="#455a64"/>
            {level > 1 && <rect x="14" y="14" width="4" height="2" fill="#ffd700" />}
            {level > 2 && <><rect x="2" y="12" width="28" height="2" fill="#03a9f4" /><rect x="2" y="13" width="28" height="1" fill="#0288d1" /></>}
            {isAttacking && <circle cx="16" cy="8" r="4" fill="#81d4fa"><animate attributeName="r" values="0;4;0" dur="0.3s" /></circle>}
        </g>
    </svg>
);

export const WeirwoodGroveIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="80" height="80" viewBox="0 0 40 40" {...props}>
        <defs>
             <linearGradient id="weir-trunk" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#d7ccc8"/><stop offset="50%" stopColor="#fafafa"/><stop offset="100%" stopColor="#e0e0e0"/></linearGradient>
             <radialGradient id="weir-leaves" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff8a65"/><stop offset="100%" stopColor="#d84315"/></radialGradient>
        </defs>
        <style>{`
            @keyframes pulse-glow { 0%, 100% { opacity: 0.7; transform: scale(1.0); } 50% { opacity: 1; transform: scale(1.15); } }
            @keyframes leaves-rustle { 0%, 100% { transform: skewX(0) rotate(0); } 25% { transform: skewX(2deg) rotate(-1.5deg); } 75% { transform: skewX(-2deg) rotate(1.5deg); } }
            .leaves { animation: leaves-rustle 7s infinite ease-in-out; transform-origin: center bottom; }
        `}</style>
        <g className="leaves">
            <circle cx="20" cy="12" r={8 + level*2} fill="url(#weir-leaves)" />
            <circle cx="12" cy="14" r={4 + level} fill="url(#weir-leaves)" />
            <circle cx="28" cy="14" r={4 + level} fill="url(#weir-leaves)" />
        </g>
        <path d="M20 40 C 16 35, 16 20, 18 15 L 22 15 C 24 20, 24 35, 20 40 Z" fill="url(#weir-trunk)" />
        <g style={{ animation: 'pulse-glow 2.5s infinite ease-in-out', filter: 'drop-shadow(0 0 3px #e65100)', transformOrigin: '20px 22px' }}>
            <path d="M19 20 L21 20 M18 22 L22 22 M19 24 Q 20 25 21 24" stroke="#c62828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>
        {isAttacking && <circle cx="20" cy="22" r="5" fill="#ffcdd2"><animate attributeName="r" values="0;5;0" dur="0.4s" /></circle>}
    </svg>
);

export const NorthernBarracksIcon: React.FC<TowerProps> = ({level, spawnCounter, ...props}) => {
    const [animateDoor, setAnimateDoor] = useState(false);
    const prevSpawnCounter = useRef(spawnCounter);

    useEffect(() => {
        if (spawnCounter !== undefined && prevSpawnCounter.current !== spawnCounter) {
            setAnimateDoor(true);
            const timer = setTimeout(() => {
                setAnimateDoor(false);
            }, 2000); // Animation duration
            prevSpawnCounter.current = spawnCounter;
            return () => clearTimeout(timer);
        }
    }, [spawnCounter]);

    return (
        <svg width="80" height="64" viewBox="0 0 40 32" {...props}>
            <defs>
                 <linearGradient id="wood-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a1887f"/><stop offset="100%" stopColor="#5d4037"/></linearGradient>
                 <linearGradient id="wood-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#795548"/><stop offset="100%" stopColor="#4e342e"/></linearGradient>
                 <linearGradient id="stone-grad-1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#616161"/><stop offset="50%" stopColor="#9e9e9e"/><stop offset="100%" stopColor="#757575"/></linearGradient>
            </defs>
            <style>{`
                @keyframes open-close-door-once {
                    0%, 100% { transform: perspective(50px) rotateY(0deg); }
                    20%, 60% { transform: perspective(50px) rotateY(-70deg); }
                }
                .door.animate {
                    animation: open-close-door-once 2s ease-in-out;
                    transform-origin: left center;
                }
            `}</style>
            <g>
                {/* Base Ground */}
                <path d="M0 28 L40 28 L40 32 L0 32 Z" fill="#78909c" />
                {/* Level 3 additions */}
                {level > 2 && <>
                    <path d="M0 30 L40 30 L38 24 L2 24 Z" fill="url(#stone-grad-1)" />
                    <rect x="36" y="0" width="2" height="16" fill="#5d4037"/>
                    <path d="M38 2 L 30 5 L 38 8 Z" fill="#eceff1" stroke="#455a64" strokeWidth="0.5"/>
                    <path d="M34 4 L33 5 L35 5 Z" fill="#455a64" />
                </>}

                {/* Main Building */}
                <path d="M2 14 L38 14 L38 28 L2 28 Z" fill="url(#wood-wall)" />
                <path d="M0 14 L20 2 L40 14 Z" fill="url(#wood-roof)" />
                
                {/* Level 2 additions */}
                {level > 1 && <>
                    <rect x="5" y="6" width="30" height="8" fill="url(#wood-wall)" stroke="#4e342e" strokeWidth="1" />
                    <rect x="7" y="8" width="8" height="4" fill="#212121" />
                    <rect x="25" y="8" width="8" height="4" fill="#212121" />
                </>}

                {/* Level 1 Sigil */}
                {level === 1 && <>
                    <circle cx="20" cy="21" r="5" fill="#cfd8dc" stroke="#455a64" strokeWidth="0.5"/>
                    <path d="M18 19 L 20 18 L 22 19 L 20 21 M 19 22 L 21 22 L 20 24 Z" fill="#455a64" />
                </>}
                
                {/* Doorway */}
                <path d="M17 20 v8 h6 v-8 Z" fill="#212121" />
                {/* Animated Door with original details */}
                <g className={`door ${animateDoor ? 'animate' : ''}`}>
                    <path d="M17 20 v8 h6 v-8 Z" fill="#4e342e" />
                    <rect x="21" y="23" width="1" height="2" fill="#3e2723" />
                </g>
            </g>
        </svg>
    );
};

export const SiegeWorkshopIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="80" height="64" viewBox="0 0 40 32" {...props}>
         <defs>
            <linearGradient id="wood-grad-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6d4c41"/><stop offset="100%" stopColor="#4e342e"/></linearGradient>
            <linearGradient id="wood-grad-light" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a1887f"/><stop offset="100%" stopColor="#6d4c41"/></linearGradient>
            <radialGradient id="wheel-grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6d4c41"/><stop offset="100%" stopColor="#3e2723"/></radialGradient>
        </defs>
        <style>{`
            .arm { transition: transform 0.1s linear; }
            .attacking .arm { animation: catapult-fire 0.4s ease-out; }
            @keyframes catapult-fire {
                0% { transform: rotate(10deg); }
                70% { transform: rotate(-60deg); }
                100% { transform: rotate(10deg); }
            }
            @keyframes siege-idle-rock { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(0.5deg); } }
            .idle-rock { animation: siege-idle-rock 6s infinite ease-in-out; transform-origin: bottom center; }
        `}</style>
        <g className={isAttacking ? 'attacking' : 'idle-rock'}>
            <rect x="0" y="26" width="40" height="6" fill="url(#wood-grad-dark)" />
            <circle cx="8" cy="24" r="6" fill="url(#wheel-grad)" stroke="#3e2723" strokeWidth="1"/><circle cx="32" cy="24" r="6" fill="url(#wheel-grad)" stroke="#3e2723" strokeWidth="1"/>
            <path d="M6 22 L16 4 H24 L34 22" stroke="url(#wood-grad-dark)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <g className="arm" transform="rotate(10 20 8)" style={{transformOrigin: '20px 8px'}}>
                <rect x="8" y="6" width="24" height="4" fill="url(#wood-grad-light)" />
                <path d="M28 4 C 34 4, 34 12, 28 12 Z" fill="url(#wood-grad-light)" />
                <circle cx="30" cy="8" r="3" fill="#9e9e9e" stroke="#616161"/>
            </g>
            <rect x="2" y="10" width={8 + level} height={6+level*2} fill="#9e9e9e" stroke="#616161" />
        </g>
    </svg>
);


// ===================================================================================
// Environment
// ===================================================================================
export const TreeIcon1: React.FC = () => <svg width="64" height="80" viewBox="0 0 32 40"><defs><linearGradient id="tree1-grad" x1="0" y1="0" x2="0" y2="100%"><stop offset="0%" stopColor="#4caf50"/><stop offset="100%" stopColor="#1b5e20"/></linearGradient></defs><path d="M15 40 L17 40 L17 25 L15 25 Z" fill="#5d4037" /><path d="M16 28 C 8 28, 0 20, 16 0 C 32 20, 24 28, 16 28 Z" fill="url(#tree1-grad)" /></svg>;
export const TreeIcon2: React.FC = () => <svg width="64" height="80" viewBox="0 0 32 40"><defs><linearGradient id="tree2-grad" x1="0" y1="0" x2="0" y2="100%"><stop offset="0%" stopColor="#66bb6a"/><stop offset="100%" stopColor="#2e7d32"/></linearGradient></defs><path d="M15 40 L17 40 L17 30 L15 30 Z" fill="#6d4c41" /><path d="M16 32 C 4 32, 2 15, 16 0 C 30 15, 28 32, 16 32 Z" fill="url(#tree2-grad)" /></svg>;
export const RockIcon1: React.FC = () => <svg width="40" height="32" viewBox="0 0 20 16"><defs><linearGradient id="rock1-grad" x1="0" y1="0" x2="0" y2="100%"><stop offset="0%" stopColor="#bdbdbd"/><stop offset="100%" stopColor="#757575"/></linearGradient></defs><path d="M2 14 L 18 14 L 16 6 L 4 6 Z" fill="url(#rock1-grad)" /></svg>;
export const RockIcon2: React.FC = () => <svg width="40" height="32" viewBox="0 0 20 16"><defs><linearGradient id="rock2-grad" x1="0" y1="0" x2="0" y2="100%"><stop offset="0%" stopColor="#e0e0e0"/><stop offset="100%" stopColor="#9e9e9e"/></linearGradient></defs><path d="M1 14 H 19 L 17 8 L 14 4 L 5 8 Z" fill="url(#rock2-grad)" /></svg>;

export const BushIcon1: React.FC = () => (
    <svg width="48" height="32" viewBox="0 0 24 16">
        <defs>
            <radialGradient id="bush-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#81c784" />
                <stop offset="100%" stopColor="#388e3c" />
            </radialGradient>
        </defs>
        <ellipse cx="12" cy="10" rx="10" ry="6" fill="url(#bush-grad)" />
        <ellipse cx="6" cy="12" rx="6" ry="4" fill="url(#bush-grad)" />
        <ellipse cx="18" cy="12" rx="6" ry="4" fill="url(#bush-grad)" />
    </svg>
);

// ===================================================================================
// Units - Redesigned & Animated
// ===================================================================================
interface UnitProps extends React.SVGProps<SVGSVGElement> { 
    isAttacking?: boolean; 
}

export const NorthernSoldierIcon: React.FC<{ animationState: GroundUnitAnimationState, direction: 'left' | 'right' }> = ({ animationState, direction }) => {
    const css = `
        .body, .arm, .leg { transition: transform 0.1s ease-in-out; }
        .idle .body { animation: unit-idle 3s infinite ease-in-out; }
        @keyframes unit-idle { 
            0%, 100% { transform: translateY(0) scale(1, 1); } 
            50% { transform: translateY(-1px) scale(1.02, 0.98); } 
        }

        .walk .body { animation: walk-bob 0.8s infinite ease-in-out; }
        @keyframes walk-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
        .walk .right-leg { animation: walk-front-soldier 0.8s infinite ease-in-out; }
        .walk .left-leg { animation: walk-back-soldier 0.8s infinite ease-in-out; }
        .walk .spear-arm { animation: walk-spear 0.8s infinite ease-in-out; }
        @keyframes walk-front-soldier { 0%, 100% { transform: rotate(5deg); } 50% { transform: rotate(20deg); } }
        @keyframes walk-back-soldier { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(-20deg); } }
        @keyframes walk-spear { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

        .attack .spear-arm { animation: spear-thrust 0.4s ease-in-out; }
        @keyframes spear-thrust { 
            0% { transform: translateX(0) rotate(0); } 
            25% { transform: translateX(-4px) rotate(-10deg); } /* anticipation */
            60% { transform: translateX(8px) rotate(5deg); } /* thrust */
            100% { transform: translateX(0) rotate(0); } /* follow-through */
        }

        .soldier-group { transition: transform 0.6s, opacity 0.6s; transform-origin: bottom center; }
        .die .soldier-group { transform: rotate(-80deg) translateY(15px); opacity: 0; }
    `;
    return (
        <svg width="40" height="48" viewBox="0 0 20 24">
            <defs>
                <linearGradient id="armor-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e0e0e0"/><stop offset="50%" stopColor="#fafafa"/><stop offset="100%" stopColor="#e0e0e0"/></linearGradient>
                <linearGradient id="armor-dark-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#b0bec5"/><stop offset="50%" stopColor="#e0e0e0"/><stop offset="100%" stopColor="#b0bec5"/></linearGradient>
                <linearGradient id="cloth-dark-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#546e7a"/><stop offset="100%" stopColor="#37474f"/></linearGradient>
                <linearGradient id="cloth-light-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#78909c"/><stop offset="100%" stopColor="#455a64"/></linearGradient>
            </defs>
            <style>{css}</style>
            <g className={animationState} transform={direction === 'left' ? 'scale(-1, 1) translate(-20, 0)' : ''}>
                <g className="soldier-group">
                    <g className="leg left-leg" style={{ transformOrigin: '8px 15px' }}><path d="M7 23 L9 23 L9 18 L7 17 Z" fill="url(#cloth-dark-grad)" /><rect x="7" y="22" width="2" height="2" fill="#263238" /></g>
                    <g className="leg right-leg" style={{ transformOrigin: '12px 15px' }}><path d="M11 23 L13 23 L13 17 L11 18 Z" fill="url(#cloth-light-grad)" /><rect x="11" y="22" width="2" height="2" fill="#455a64" /></g>
                    <g className="body" style={{ transformOrigin: '10px 22px' }}>
                        <path d="M6 18 L14 18 L15 9 L5 9 Z" fill="url(#armor-dark-grad)" />
                        <path d="M7 9 L13 9 L12 3 L8 3 Z" fill="url(#armor-grad)" />
                        <path d="M7 6 L13 6 L13 7 L7 7 Z" fill="#37474f" /><path d="M8 5 L12 5 L12 6 L8 6 Z" fill="#ffe0b2" />
                        <path d="M6 3 L14 3 L10 0 Z" fill="#03a9f4" stroke="#01579b" strokeWidth="0.5"/>
                        <g className="spear-arm arm" style={{ transformOrigin: '13px 11px' }}>
                            <path d="M13 10 L16 11 L16 14 L13 14 Z" fill="url(#armor-dark-grad)" />
                            <rect x="15" y="-2" width="2" height="20" fill="#a1887f" />
                            <path d="M15 -2 L17 -2 L16 -5 Z" fill="url(#armor-grad)" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export const ReinforcementSoldierIcon: React.FC<{ animationState: GroundUnitAnimationState, direction: 'left' | 'right' }> = ({ animationState, direction }) => {
    const css = `
        .body, .arm, .leg { transition: transform 0.1s ease-in-out; }
        .idle .body { animation: unit-idle 3s infinite ease-in-out; }
        @keyframes unit-idle { 
            0%, 100% { transform: translateY(0) scale(1, 1); } 
            50% { transform: translateY(-1px) scale(1.02, 0.98); } 
        }

        .walk .body { animation: walk-bob 0.8s infinite ease-in-out; }
        @keyframes walk-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
        .walk .right-leg { animation: walk-front-soldier 0.8s infinite ease-in-out; }
        .walk .left-leg { animation: walk-back-soldier 0.8s infinite ease-in-out; }
        .walk .spear-arm { animation: walk-spear 0.8s infinite ease-in-out; }
        @keyframes walk-front-soldier { 0%, 100% { transform: rotate(5deg); } 50% { transform: rotate(20deg); } }
        @keyframes walk-back-soldier { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(-20deg); } }
        @keyframes walk-spear { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

        .attack .spear-arm { animation: spear-thrust 0.4s ease-in-out; }
        @keyframes spear-thrust { 
            0% { transform: translateX(0) rotate(0); } 
            25% { transform: translateX(-4px) rotate(-10deg); } /* anticipation */
            60% { transform: translateX(8px) rotate(5deg); } /* thrust */
            100% { transform: translateX(0) rotate(0); } /* follow-through */
        }

        .soldier-group { transition: transform 0.6s, opacity 0.6s; transform-origin: bottom center; }
        .die .soldier-group { transform: rotate(-80deg) translateY(15px); opacity: 0; }
    `;
    return (
        <svg width="40" height="48" viewBox="0 0 20 24">
            <defs>
                <linearGradient id="armor-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e0e0e0"/><stop offset="50%" stopColor="#fafafa"/><stop offset="100%" stopColor="#e0e0e0"/></linearGradient>
                <linearGradient id="armor-dark-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#b0bec5"/><stop offset="50%" stopColor="#e0e0e0"/><stop offset="100%" stopColor="#b0bec5"/></linearGradient>
                <linearGradient id="reinforcement-cloth-dark-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#66bb6a"/><stop offset="100%" stopColor="#388e3c"/></linearGradient>
                <linearGradient id="reinforcement-cloth-light-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#81c784"/><stop offset="100%" stopColor="#4caf50"/></linearGradient>
            </defs>
            <style>{css}</style>
            <g className={animationState} transform={direction === 'left' ? 'scale(-1, 1) translate(-20, 0)' : ''}>
                <g className="soldier-group">
                    <g className="leg left-leg" style={{ transformOrigin: '8px 15px' }}><path d="M7 23 L9 23 L9 18 L7 17 Z" fill="url(#reinforcement-cloth-dark-grad)" /><rect x="7" y="22" width="2" height="2" fill="#212121" /></g>
                    <g className="leg right-leg" style={{ transformOrigin: '12px 15px' }}><path d="M11 23 L13 23 L13 17 L11 18 Z" fill="url(#reinforcement-cloth-light-grad)" /><rect x="11" y="22" width="2" height="2" fill="#424242" /></g>
                    <g className="body" style={{ transformOrigin: '10px 22px' }}>
                        <path d="M6 18 L14 18 L15 9 L5 9 Z" fill="url(#armor-dark-grad)" />
                        <path d="M7 9 L13 9 L12 3 L8 3 Z" fill="url(#armor-grad)" />
                        <path d="M7 6 L13 6 L13 7 L7 7 Z" fill="#37474f" /><path d="M8 5 L12 5 L12 6 L8 6 Z" fill="#ffcc80" />
                        <path d="M6 3 L14 3 L10 0 Z" fill="#4caf50" stroke="#1b5e20" strokeWidth="0.5"/>
                        <g className="spear-arm arm" style={{ transformOrigin: '13px 11px' }}>
                            <path d="M13 10 L16 11 L16 14 L13 14 Z" fill="url(#armor-dark-grad)" />
                            <rect x="15" y="-2" width="2" height="20" fill="#a1887f" />
                            <path d="M15 -2 L17 -2 L16 -5 Z" fill="url(#armor-grad)" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};


export const BrienneIcon: React.FC<{ animationState: GroundUnitAnimationState, direction: 'left' | 'right' }> = ({ animationState, direction }) => {
    const css = `
        .body { transition: transform 0.1s ease-in-out; }
        .idle .body { animation: hero-idle 3.5s infinite ease-in-out; }
        @keyframes hero-idle { 
            0%, 100% { transform: translateY(0) scale(1, 1); } 
            50% { transform: translateY(-1px) scale(1.02, 0.98); } 
        }

        .arm, .leg { transition: transform 0.1s ease-in-out; }
        .walk .body { animation: hero-walk-bob 0.8s infinite ease-in-out; }
        @keyframes hero-walk-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .walk .right-leg { animation: walk-front 0.8s infinite ease-in-out; }
        .walk .left-leg { animation: walk-back 0.8s infinite ease-in-out; }
        .walk .right-arm { animation: walk-back 0.8s infinite ease-in-out; }
        .walk .left-arm { animation: walk-front 0.8s infinite ease-in-out; }
        @keyframes walk-front { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(25deg); } }
        @keyframes walk-back { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-25deg); } }

        .attack .right-arm { animation: sword-swing 0.4s ease-in-out; }
        @keyframes sword-swing { 
            0% { transform: rotate(10deg); }
            30% { transform: rotate(-20deg); } /* anticipation */
            70% { transform: rotate(80deg); } /* swing */
            100% { transform: rotate(10deg); } /* follow-through */
        }

        .hero-group { transition: transform 0.6s, opacity 0.6s; transform-origin: bottom center; }
        .die .hero-group { transform: rotate(80deg) translateY(20px); opacity: 0; }
    `;

    return (
        <svg width="60" height="72" viewBox="0 0 30 36">
            <defs>
                <linearGradient id="hero-armor-light" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e0e0e0"/><stop offset="50%" stopColor="#ffffff"/><stop offset="100%" stopColor="#e0e0e0"/></linearGradient>
                <linearGradient id="hero-armor-dark" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#bdbdbd"/><stop offset="50%" stopColor="#f5f5f5"/><stop offset="100%" stopColor="#bdbdbd"/></linearGradient>
                <linearGradient id="hero-leg-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9e9e9e"/><stop offset="100%" stopColor="#546e7a"/></linearGradient>
                <linearGradient id="hero-leg-light" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bdbdbd"/><stop offset="100%" stopColor="#78909c"/></linearGradient>
                <linearGradient id="hero-skin" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f5c29c"/><stop offset="50%" stopColor="#fcd3b2"/><stop offset="100%" stopColor="#f5c29c"/></linearGradient>
                <linearGradient id="hero-hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff59d"/><stop offset="100%" stopColor="#fbc02d"/></linearGradient>
                <linearGradient id="hero-tunic" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#546e7a"/><stop offset="100%" stopColor="#263238"/></linearGradient>
                <linearGradient id="sword-blade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5f5f5"/><stop offset="100%" stopColor="#bdbdbd"/></linearGradient>
            </defs>
            <style>{css}</style>
            <g 
                className={animationState}
                transform={direction === 'left' ? 'scale(-1, 1) translate(-30, 0)' : ''}
            >
                <g className="hero-group">
                    {/* Legs */}
                    <g className="leg left-leg" style={{transformOrigin: '12px 23px'}}><path d="M11 35 L 14 35 L 14 27 L 11 25 Z" fill="url(#hero-leg-dark)" /><rect x="11" y="34" width="3" height="2" fill="#424242" /></g>
                    <g className="leg right-leg" style={{transformOrigin: '17px 23px'}}><path d="M16 35 L 19 35 L 19 25 L 16 27 Z" fill="url(#hero-leg-light)" /><rect x="16" y="34" width="3" height="2" fill="#616161" /></g>
                    
                    <g className="body" style={{transformOrigin: '15px 34px'}}>
                        {/* Shield Arm */}
                        <g className="arm left-arm" style={{transformOrigin: '12px 17px'}}>
                           <path d="M8 16 L 3 18 L 2 24 L 7 25 Z" fill="url(#hero-armor-dark)"/>
                           {/* Shield */}
                           <path d="M2 18 C -2 20, -2 30, 2 32 L 8 32 C 12 30, 12 20, 8 18 Z" fill="url(#hero-armor-dark)" stroke="#424242" strokeWidth="1"/>
                           {/* Direwolf sigil */}
                           <path d="M5 22 L 5 25 L 4 26 L 6 26 L 5 25 L 6 25 L 5 28 L 7 28 L 6 25 M7 23 L 6 22" stroke="#fafafa" strokeWidth="0.5" fill="none" />
                        </g>

                        {/* Tunic & Torso */}
                        <path d="M10 26 L 20 26 L 22 15 L 8 15 Z" fill="url(#hero-tunic)" />
                        <path d="M10 24 L 20 24 L 21 16 L 9 16 Z" fill="url(#hero-armor-dark)" />
                        <path d="M12 18 L 18 18 L 19 16 L 11 16 Z" fill="url(#hero-armor-light)" />

                        {/* Head and Hair */}
                        <path d="M12 15 L 18 15 L 17 9 L 13 9 Z" fill="url(#hero-skin)"/>
                        <path d="M12 9 L 18 9 Q 18 4, 15 4 Q 12 4, 12 9 Z" fill="url(#hero-hair)" />
                        <path d="M10 8 L 20 8 L 18 6 L 12 6 Z" fill="url(#hero-armor-light)" />
                        
                        {/* Sword Arm */}
                        <g className="arm right-arm" style={{transformOrigin: '18px 17px'}}>
                            <path d="M18 16 L 23 18 L 24 24 L 19 24 Z" fill="url(#hero-armor-dark)" />
                            {/* Sword */}
                            <g transform="rotate(15 25 19)">
                                <rect x="23" y="0" width="2" height="22" fill="url(#sword-blade)"/>
                                <rect x="21" y="20" width="6" height="2" fill="#795548"/>
                                <rect x="23" y="22" width="2" height="2" fill="#a1887f"/>
                            </g>
                        </g>

                        {/* Pauldrons */}
                        <ellipse cx="9" cy="16" rx="4" ry="3" fill="url(#hero-armor-light)"/>
                        <ellipse cx="21" cy="16" rx="4" ry="3" fill="url(#hero-armor-light)"/>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export const EnemyIcon: React.FC<{type: EnemyType, animationState: EnemyAnimationState}> = ({ type, animationState, ...props }) => {
    const defs = (
        <defs>
            <filter id="felt-texture">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="turbulence"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="0.5" />
            </filter>
            <filter id="fur-texture">
                <feTurbulence type="fractalNoise" baseFrequency="0.2 0.5" numOctaves="3" seed="10" result="turbulence"/>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="1.5" />
            </filter>
            <linearGradient id="wood-club-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8d6e63"/><stop offset="100%" stopColor="#5d4037"/></linearGradient>
            <linearGradient id="metal-axe-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e0e0e0"/><stop offset="100%" stopColor="#757575"/></linearGradient>
        </defs>
    );

    switch (type) {
        case 'ORC_GRUNT': return (
            <svg width="40" height="48" viewBox="0 0 20 24" {...props}>{defs}
                <style>{`
                    .grunt-body, .grunt-arm { transition: transform 0.1s; }
                    .idle .grunt-body { animation: grunt-idle 3s infinite ease-in-out; transform-origin: 10px 20px; }
                    @keyframes grunt-idle { 0%, 100% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-1px) rotate(-2deg); } 75% { transform: translateY(0px) rotate(2deg); } }
                    
                    .walk .grunt-body { animation: grunt-walk 0.8s infinite ease-in-out; transform-origin: 10px 20px; }
                    @keyframes grunt-walk { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-2px) rotate(2deg); } }
                    
                    .attack .grunt-arm { animation: grunt-attack 0.4s ease-in-out; transform-origin: 15px 15px; }
                    @keyframes grunt-attack { 0% { transform: rotate(0); } 50% { transform: rotate(-60deg); } 100% { transform: rotate(0); } }
                `}</style>
                <g className={animationState}>
                    <g className="grunt-body">
                        {/* Body */}
                        <path d="M5,23 C0,20 2,8 10,8 C18,8 20,20 15,23 Z" fill="#8bc34a" filter="url(#felt-texture)" />
                        {/* Ears */}
                        <path d="M6,8 C 2,0 10,2 10,8" fill="#aed581" filter="url(#felt-texture)" />
                        <path d="M14,8 C 18,0 10,2 10,8" fill="#aed581" filter="url(#felt-texture)" />
                        {/* Eyes */}
                        <circle cx="7" cy="11" r="2.5" fill="#e53935"/><circle cx="7" cy="11" r="1" fill="#c21807"/><path d="M6 10 l2 2 M8 10 l-2 2" stroke="#c21807" strokeWidth="0.5"/>
                        <circle cx="13" cy="12" r="1.5" fill="#212121"/><circle cx="13" cy="12" r="0.5" fill="#000"/><path d="M12.5 11.5 l1 1 M13.5 11.5 l-1 1" stroke="#000" strokeWidth="0.5"/>
                        {/* Mouth & Teeth */}
                        <path d="M6,18 C8,19 12,19 14,18 L13,16 L7,16 Z" fill="#424242"/>
                        <rect x="7" y="16" width="1" height="1.5" fill="#fafafa"/> <rect x="8.5" y="16" width="1" height="1.5" fill="#f5f5f5"/>
                        <rect x="10" y="16" width="1" height="1.5" fill="#fafafa"/> <rect x="11.5" y="16" width="1" height="1.5" fill="#f5f5f5"/>
                        {/* Arm */}
                        <g className="grunt-arm">
                            <path d="M15,15 L18,14 L18,17 L15,18 Z" fill="#8bc34a" filter="url(#felt-texture)"/>
                            <path d="M17,15 L19,14 L19,4 L17,5 Z" fill="url(#wood-club-grad)" />
                        </g>
                    </g>
                </g>
            </svg>
        );
        case 'ORC_BERSERKER': return (
            <svg width="48" height="56" viewBox="0 0 24 28" {...props}>{defs}
                <style>{`
                    .berserker-body, .berserker-arm { transition: transform 0.1s; }
                    .idle .berserker-body { animation: berserker-idle 3.5s infinite ease-in-out; transform-origin: 12px 22px; }
                    @keyframes berserker-idle { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(1.03, 0.97) translateY(-1px); } }

                    .walk .berserker-body { animation: berserker-walk 1s infinite ease-in-out; transform-origin: 12px 22px; }
                    @keyframes berserker-walk { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }

                    .attack .berserker-arm { animation: berserker-attack 0.4s ease-in-out; transform-origin: 18px 16px; }
                    @keyframes berserker-attack { 0%, 100% { transform: rotate(10deg) translateY(0); } 50% { transform: rotate(-50deg) translateY(2px); } }
                `}</style>
                <g className={animationState}>
                    <g className="berserker-body">
                        {/* Body */}
                        <path d="M4,27 C-2,20 4,8 12,8 C20,8 26,20 20,27 Z" fill="#64b5f6" filter="url(#fur-texture)" />
                        {/* Horns */}
                        <path d="M8,8 C 2,2 10,4 10,8" fill="#e0e0e0"/>
                        <path d="M16,8 C 22,2 14,4 14,8" fill="#e0e0e0"/>
                        {/* Eye */}
                        <circle cx="12" cy="13" r="3.5" fill="#ffeb3b"/><circle cx="12" cy="13" r="1.5" fill="#c8b900"/><path d="M11 12 l2 2 M13 12 l-2 2" stroke="#c8b900" strokeWidth="0.5"/>
                         {/* Mouth & Teeth */}
                        <path d="M8,20 C 10,22 14,22 16,20 V 18 H 8 Z" fill="#424242"/>
                        <rect x="8.5" y="18" width="1.5" height="2" fill="#fafafa"/><rect x="10.5" y="18" width="1.5" height="2" fill="#f5f5f5"/><rect x="12.5" y="18" width="1.5" height="2" fill="#fafafa"/>
                        <rect x="9.5" y="20" width="1.5" height="1" fill="#fafafa"/><rect x="11.5" y="20" width="1.5" height="1" fill="#f5f5f5"/>
                         {/* Arm & Axe */}
                        <g className="berserker-arm">
                           <path d="M18,16 L22,15 L22,19 L18,20 Z" fill="#64b5f6" filter="url(#fur-texture)" />
                           <rect x="20" y="2" width="3" height="14" fill="url(#wood-club-grad)" />
                           <path d="M19,2 L 24,2 L 26,6 L 17,6 Z" fill="url(#metal-axe-grad)" />
                        </g>
                    </g>
                </g>
            </svg>
        );
        case 'OGRE_BRUTE': return (
            <svg width="64" height="72" viewBox="0 0 32 36" {...props}>{defs}
                <style>{`
                    .ogre-body, .ogre-arm { transition: transform 0.1s; }
                    .idle .ogre-body { animation: ogre-idle 4s infinite ease-in-out; transform-origin: 16px 28px; }
                    @keyframes ogre-idle { 0%, 100% { transform: translateY(0) scale(1,1); } 50% { transform: translateY(-2px) scale(1.04, 0.96); } }
                    
                    .walk .ogre-body { animation: ogre-walk 1.2s infinite ease-in-out; transform-origin: 16px 28px; }
                    @keyframes ogre-walk { 0%, 100% { transform: translateY(0) rotate(-1deg) scaleX(1); } 50% { transform: translateY(-2px) rotate(1deg) scaleX(1.02); } }

                    .attack .ogre-arm { animation: ogre-attack 0.5s ease-in-out; transform-origin: 25px 22px; }
                    @keyframes ogre-attack { 0% { transform: rotate(0); } 40% { transform: rotate(-80deg); } 80% { transform: rotate(20deg); } 100% { transform: rotate(0); } }
                `}</style>
                <g className={animationState}>
                     <g className="ogre-body">
                        {/* Body */}
                        <path d="M4,35 C -4,25 4,10 16,10 C 28,10 36,25 28,35 Z" fill="#ba68c8" filter="url(#fur-texture)" />
                        {/* Eyes */}
                        <circle cx="12" cy="16" r="2" fill="#212121"/><circle cx="12" cy="16" r="0.7" fill="#000"/><path d="M11.5 15.5 l1 1 M12.5 15.5 l-1 1" stroke="#000" strokeWidth="0.5"/>
                        <circle cx="20" cy="16" r="2" fill="#212121"/><circle cx="20" cy="16" r="0.7" fill="#000"/><path d="M19.5 15.5 l1 1 M20.5 15.5 l-1 1" stroke="#000" strokeWidth="0.5"/>
                        {/* Mouth & Teeth */}
                        <path d="M8,26 C 12,28 20,28 24,26 L22,22 L10,22 Z" fill="#424242"/>
                        <rect x="8" y="22" width="4" height="4" fill="#fafafa"/><rect x="14" y="22" width="4" height="4" fill="#f5f5f5"/><rect x="20" y="22" width="4" height="4" fill="#fafafa"/>
                        {/* Arm & Club */}
                        <g className="ogre-arm">
                           <path d="M24,22 L29,20 L29,26 L24,28 Z" fill="#ba68c8" filter="url(#fur-texture)" />
                           <path d="M28,21 L32,20 L32,2 L28,3 Z" fill="url(#wood-club-grad)" />
                           <circle cx="31" cy="6" r="1.5" fill="#757575" /><circle cx="30" cy="12" r="1.5" fill="#757575" /><circle cx="31" cy="18" r="1.5" fill="#757575" />
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
};

// ===================================================================================
// Projectiles
// ===================================================================================
export const IceArrowProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="32" height="10" viewBox="0 0 32 10" style={{filter: 'drop-shadow(0 0 2px #81d4fa)'}}>
        <path d="M0 4 H 26 V 6 H 0 Z" fill="#a1887f" />
        <path d="M0 2 L 6 2 L 3 4 L 0 4 Z" fill="#eceff1" />
        <path d="M0 8 L 6 8 L 3 6 L 0 6 Z" fill="#cfd8dc" />
        <path d="M24 0 L 32 5 L 24 10 Z" fill="#b3e5fc" stroke="#4dd0e1" strokeWidth="0.5" />
    </svg>
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
    <svg width={radius * 2} height={radius} viewBox="0 0 100 50">
        <ellipse cx="50" cy="25" fill="yellow">
            <animate attributeName="rx" values="0;50" dur="0.3s" begin="0s" fill="freeze" />
            <animate attributeName="ry" values="0;25" dur="0.3s" begin="0s" fill="freeze" />
            <animate attributeName="opacity" values="1;0" dur="0.3s" begin="0s" fill="freeze" />
        </ellipse>
        <ellipse cx="50" cy="25" fill="orange">
            <animate attributeName="rx" values="0;40" dur="0.4s" begin="0s" fill="freeze" />
            <animate attributeName="ry" values="0;20" dur="0.4s" begin="0s" fill="freeze" />
            <animate attributeName="opacity" values="1;0" dur="0.4s" begin="0s" fill="freeze" />
        </ellipse>
    </svg>
  </div>
);

export const TargetCursor: React.FC<{ position: Vector2D; spell: PlayerSpell }> = ({ position, spell }) => {
  const radius = spell === 'RAIN_OF_FIRE' ? RAIN_OF_FIRE_STATS.radius : 40;
  const color = spell === 'RAIN_OF_FIRE' ? '#f44336' : '#4caf50';

  // Rain of Fire has an elliptical, ground-based cursor
  if (spell === 'RAIN_OF_FIRE') {
      return (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: position.x, top: position.y, zIndex: 20000 }}>
              <svg width={radius * 2} height={radius} viewBox="0 0 200 100">
                  <ellipse cx="100" cy="50" rx="98" ry="49" fill="none" stroke={color} strokeWidth="4" strokeDasharray="10 10">
                      <animateTransform attributeName="transform" type="rotate" from="0 100 50" to="360 100 50" dur="5s" repeatCount="indefinite" />
                  </ellipse>
              </svg>
          </div>
      );
  }

  // Other spells (Reinforcements) get a circular cursor
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
export const NorthernSoldierPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <NorthernSoldierIcon {...props} animationState="idle" direction="right" />
);

export const BriennePortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <BrienneIcon {...props} animationState="idle" direction="right" />
);
export const EnemyPortrait: React.FC<React.SVGProps<SVGSVGElement> & {type: EnemyType}> = ({type, ...props}) => (
    <EnemyIcon {...props} animationState="idle" type={type} />
);