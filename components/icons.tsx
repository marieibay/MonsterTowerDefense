
import React from 'react';
import type { Vector2D, PlayerSpell, EnemyType } from '../types';
import { RAIN_OF_FIRE_STATS, MAP_PATH, GAME_CONFIG } from '../constants';
import { gameToScreen } from '../utils';

// Helper for creating pixel art with rects
const P: React.FC<{ C: string; X: number; Y: number; S?: number }> = ({ C, X, Y, S = 1 }) => (
  <rect fill={C} x={X} y={Y} width={S} height={S} />
);

// ===================================================================================
// UI Elements (16-bit style)
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
    <rect width="100" height="50" fill="#6586c5" />
    <PixelBorder width={100} height={50} />
  </svg>
);

export const UIButton: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="50" fill="#6586c5" />
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
export const HeroAbilityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L9 4h6l-3-3zM3 5v2h18V5H3zm2 4l-2 8h2.5l.75-2h3.5l.75 2H13l-2-8H9zm1.5 4.5L11.25 10h.5l.75 3.5h-2zM15 9l-2 8h2.5l.75-2h3.5l.75 2H23l-2-8h-2zm1.5 4.5l.75-3.5h.5l.75 3.5h-2z"/></svg>);

// Portraits
export { ArcherTowerIcon as ArcherTowerPortrait } from './icons';
export { MageTowerIcon as MageTowerPortrait } from './icons';
export { BarracksTowerIcon as BarracksTowerPortrait } from './icons';
export { ArtilleryTowerIcon as ArtilleryTowerPortrait } from './icons';
export { SoldierIcon as SoldierPortrait } from './icons';
export { HeroIcon as HeroPortrait } from './icons';
export { EnemyIcon as EnemyPortrait } from './icons';


// Game Board Elements
export const GameBackground: React.FC<React.SVGProps<HTMLDivElement>> = (props) => {
    const pathPoints = MAP_PATH.map(p => gameToScreen(p));
    const pathString = "M" + pathPoints.map(p => `${p.x},${p.y}`).join(" L");

    return (
        <div {...props}>
             <svg width={GAME_CONFIG.width} height={GAME_CONFIG.height} className="absolute inset-0">
                <rect width="100%" height="100%" fill="#6586c5" />
                <rect width="100%" height="45%" fill="#81d4fa" />
                 {/* Mountains */}
                <path d="M 0 440 L 200 300 L 400 440 Z" fill="#c2c2c2"/>
                <path d="M 300 440 L 550 250 L 800 440 Z" fill="#a2a2a2"/>
                <path d="M 1100 440 L 1400 200 L 1700 440 Z" fill="#c2c2c2"/>
                <path d="M 1600 440 L 1800 350 L 2000 440 Z" fill="#a2a2a2"/>
                
                <path d={pathString} fill="none" stroke="#dcb46a" strokeWidth="70" strokeLinejoin="round" strokeLinecap="round" />
                <path d={pathString} fill="none" stroke="#b98a3e" strokeWidth="60" strokeLinejoin="round" strokeLinecap="round" />
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
            <ellipse cx="60" cy="30" rx="55" ry="28" fill="none" stroke="#FFF" strokeWidth="2">
                <animate attributeName="stroke-dasharray" values="0,10;5,5;10,0" dur="0.5s" repeatCount="indefinite" />
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
        <svg width="20" height="30" viewBox="0 0 20 30">
            <rect x="1" y="0" width="2" height="30" fill="#6d4c41" />
            <polygon points="3,2 18,7 3,12" fill="#ef5350"/>
        </svg>
    </div>
);

// ===================================================================================
// Towers
// ===================================================================================
interface TowerProps extends React.SVGProps<SVGSVGElement> { 
    isAttacking?: boolean; 
    level: number; 
}

export const ArcherTowerIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="64" height="80" viewBox="0 0 32 40" {...props}>
        <rect x="6" y="12" width="20" height="28" fill="#a1887f" />
        <rect x="4" y="8" width="24" height="4" fill="#8d6e63" />
        <rect x="0" y="4" width="32" height="4" fill="#6d4c41" />
        <rect x={16-level} y={40-level*4} width={level*2} height={level*4} fill="#6d4c41" />
        {isAttacking && <rect x="15" y="0" width="2" height="8" fill="yellow" />}
    </svg>
);

export const MageTowerIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="64" height="80" viewBox="0 0 32 40" {...props}>
        <path d="M16 40 L8 28 H24 Z" fill="#673ab7"/>
        <rect x="12" y="20" width="8" height="8" fill="#7e57c2" />
        <path d="M4 20 L28 20 L20 12 H12 Z" fill="#512da8" />
        <circle cx="16" cy="8" r={3 + level} fill={isAttacking ? "cyan" : "magenta"} >
             <animate attributeName="r" values={`${3+level};${4+level};${3+level}`} dur="2s" repeatCount="indefinite" />
        </circle>
    </svg>
);

export const BarracksTowerIcon: React.FC<TowerProps> = ({level, ...props}) => (
    <svg width="80" height="64" viewBox="0 0 40 32" {...props}>
        <rect x="2" y="10" width="36" height="22" fill="#8d6e63" />
        <path d="M0 12 L20 2 L40 12" fill="#a1887f" stroke="#5d4037" strokeWidth="1" />
        <rect x="15" y="18" width="10" height="14" fill="#6d4c41" />
        {level >= 2 && <rect x="5" y="14" width="4" height="4" fill="black" />}
        {level >= 3 && <rect x="31" y="14" width="4" height="4" fill="black" />}
    </svg>
);

export const ArtilleryTowerIcon: React.FC<TowerProps> = ({level, isAttacking, ...props}) => (
    <svg width="80" height="64" viewBox="0 0 40 32" {...props}>
        <rect x="0" y="24" width="40" height="8" rx="1" fill="#795548"/>
        <path d="M8 24 L16 4 H24 L32 24" fill="none" stroke="#5d4037" strokeWidth={2 + level}/>
        <g transform={isAttacking ? 'rotate(-15 14 8)' : 'rotate(-10 14 8)'} style={{transition: 'transform 0.1s'}}>
          <path d="M14 8 L32 14" stroke="#5d4037" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="34" cy="13" r="4" fill="#424242"/>
        </g>
    </svg>
);

// Units
interface UnitProps extends React.SVGProps<SVGSVGElement> { 
    isAttacking?: boolean; 
}
export const SoldierIcon: React.FC<UnitProps> = ({ isAttacking, ...props }) => (
    <svg width="32" height="40" viewBox="0 0 16 20" {...props}>
        <rect x="5" y="1" width="6" height="6" fill="#c2c2c2"/>
        <rect x="3" y="7" width="10" height="8" fill="#a2a2a2"/>
        <rect x="3" y="15" width="4" height="4" fill="#6d4c41" />
        <rect x="9" y="15" width="4" height="4" fill="#6d4c41" />
        <g transform={isAttacking ? 'rotate(-60 12 10)' : ''} style={{transition:'transform 0.1s'}}>
            <rect x="12" y="6" width="2" height="8" fill="#c2c2c2" />
        </g>
    </svg>
);

export const HeroIcon: React.FC<UnitProps> = ({ isAttacking, ...props }) => (
    <svg width="32" height="40" viewBox="0 0 16 20" {...props}>
        <rect x="5" y="1" width="6" height="6" fill="#ffcc00"/>
        <rect x="3" y="7" width="10" height="8" fill="#ffe680"/>
        <rect x="3" y="15" width="4" height="4" fill="#d32f2f" />
        <rect x="9" y="15" width="4" height="4" fill="#d32f2f" />
        <g transform={isAttacking ? 'rotate(-60 12 10)' : ''} style={{transition:'transform 0.1s'}}>
            <rect x="12" y="6" width="2" height="8" fill="#c2c2c2" />
        </g>
    </svg>
);

export const MilitiaIcon: React.FC<UnitProps> = ({ isAttacking, ...props }) => (
     <svg width="32" height="40" viewBox="0 0 16 20" {...props}>
        <rect x="5" y="1" width="6" height="6" fill="#a1887f"/>
        <rect x="3" y="7" width="10" height="8" fill="#8d6e63"/>
        <rect x="3" y="15" width="4" height="4" fill="#6d4c41" />
        <rect x="9" y="15" width="4" height="4" fill="#6d4c41" />
        <g transform={isAttacking ? 'rotate(-90 8 10)' : ''} style={{transition:'transform 0.1s'}}>
            <rect x="12" y="9" width="4" height="2" fill="#c2c2c2" />
        </g>
    </svg>
);


export const EnemyIcon: React.FC<{type: EnemyType} & UnitProps> = ({ type, isAttacking, ...props }) => {
    const [walkFrame, setWalkFrame] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => setWalkFrame(f => (f + 1) % 2), 300);
        return () => clearInterval(interval);
    }, []);

    const legY = walkFrame === 0 ? 15 : 16;

    switch (type) {
        case 'GOBLIN': return <svg width="24" height="32" viewBox="0 0 12 16" {...props}><rect x="3" y="1" width="6" height="6" fill="#4caf50"/><rect x="1" y="7" width="10" height="8" fill="#66bb6a"/><rect x="2" y={legY} width="3" height="4" fill="#5d4037" /><rect x="7" y={19 - legY} width="3" height="4" fill="#5d4037" /><g transform={isAttacking ? 'translate(2,0)' : ''}><rect x="9" y="6" width="2" height="4" fill="#c2c2c2" /></g></svg>
        case 'ORC': return <svg width="32" height="40" viewBox="0 0 16 20" {...props}><rect x="4" y="1" width="8" height="8" fill="#9e9e9e"/><rect x="2" y="9" width="12" height="8" fill="#a2a2a2"/><rect x="3" y={legY+1} width="4" height="4" fill="#424242" /><rect x="9" y={20 - legY} width="4" height="4" fill="#424242" /><g transform={isAttacking ? 'rotate(-45 13 8)' : ''}><rect x="13" y="4" width="3" height="8" fill="#6d4c41" /></g></svg>
        case 'TROLL': return <svg width="40" height="48" viewBox="0 0 20 24" {...props}><rect x="2" y="1" width="16" height="12" fill="#795548"/><rect x="0" y="13" width="20" height="8" fill="#8d6e63"/><rect x="3" y={legY+3} width="6" height="5" fill="#5d4037" /><rect x="11" y={22 - legY} width="6" height="5" fill="#5d4037" /><g transform={isAttacking ? 'translate(0, -4)' : ''}><rect x="14" y="6" width="6" height="6" fill="#5d4037" /></g></svg>
    }
};

// Projectiles
export const ArrowProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="20" height="4" viewBox="0 0 20 4"><rect x="0" y="1" width="18" height="2" fill="#8d6e63" /><polygon points="16,0 20,2 16,4" fill="#fff" /></svg>
);
export const MagicBoltProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16"><rect x="4" y="0" width="8" height="16" fill="cyan" /><rect x="0" y="4" width="16" height="8" fill="cyan" /><rect x="4" y="4" width="8" height="8" fill="#fff" /></svg>
);
export const CannonballProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#424242" /><circle cx="7" cy="7" r="2" fill="#fff" /></svg>
);

// Special Effects
export const Explosion: React.FC<{ position: Vector2D, radius: number }> = ({ position, radius }) => (
  <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: position.x, top: position.y, zIndex: 15000 }}>
    <svg width={radius * 2} height={radius * 2} viewBox="0 0 100 100" className="animate-ping opacity-75">
        <circle cx="50" cy="50" r="40" fill="orange" />
        <circle cx="50" cy="50" r="20" fill="yellow" />
    </svg>
  </div>
);

export const TargetCursor: React.FC<{ position: Vector2D; spell: PlayerSpell }> = ({ position, spell }) => {
  const radius = spell === 'RAIN_OF_FIRE' ? RAIN_OF_FIRE_STATS.radius : 40;
  const color = spell === 'RAIN_OF_FIRE' ? '#f44336' : '#4caf50';
  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: position.x, top: position.y, zIndex: 20000 }}>
        <svg width={radius * 2} height={radius * 2} viewBox="0 0 200 200">
            <rect x="98" y="0" width="4" height="200" fill={color}/>
            <rect x="0" y="98" width="200" height="4" fill={color}/>
        </svg>
    </div>
  );
};

export const BuffEffect: React.FC<{size?: number}> = ({size = 60}) => {
    const height = size / 2;
    return (
        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 pointer-events-none">
            <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
                <ellipse cx={size/2} cy={height/2} rx={size/2 - 2} ry={height/2 - 2} fill="none" stroke="#FFFDE7" strokeWidth="2">
                     <animate attributeName="rx" values={`${size/2-2};${size/2-5};${size/2-2}`} dur="1s" repeatCount="indefinite" />
                     <animate attributeName="ry" values={`${height/2-2};${height/2-4};${height/2-2}`} dur="1s" repeatCount="indefinite" />
                </ellipse>
            </svg>
        </div>
    )
}
