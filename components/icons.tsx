
import React from 'react';
import type { Vector2D, PlayerSpell, EnemyType } from '../types';
import { RAIN_OF_FIRE_STATS, MAP_PATH, GAME_CONFIG } from '../constants';
import { gameToScreen } from '../utils';

// ===================================================================================
// UI Elements
// ===================================================================================

export const UIPanel: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="50" rx="8" fill="#8d6e63" />
    <rect x="2" y="2" width="96" height="46" rx="6" fill="#a1887f" />
    <rect width="100" height="50" rx="8" fill="none" stroke="#5d4037" strokeWidth="3" />
  </svg>
);

export const UIButton: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="50" rx="8" fill="#424242" stroke="#212121" strokeWidth="2" />
    <rect x="4" y="2" width="92" height="42" rx="6" fill="#616161" />
  </svg>
);

export const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#ffc107" stroke="#e65100" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="7" fill="none" stroke="#ff8f00" strokeWidth="1.5"/>
    <text x="12" y="16" fontSize="10" textAnchor="middle" fill="#e65100" className="font-sans font-bold">C</text>
  </svg>
);

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

export const SkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-2-4h8v2h-8V7zm2 8h4v2h-4v-2z"/>
        <circle cx="9" cy="11.5" r="1.5" />
        <circle cx="15" cy="11.5" r="1.5" />
        <path d="M12 14c-1.66 0-3 1.34-3 3h6c0-1.66-1.34-3-3-3z"/>
    </svg>
);

export const SoundOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
);

export const SoundOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
);

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z"/>
    </svg>
);

export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
);

export const UpgradeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8l-6 6h12l-6-6zm-6 8h12v-2H6v2z"/>
    </svg>
);

export const SellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2V8zm0 8h2v-2h-2v2z"/>
    </svg>
);

export const ReinforcementsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z"/>
    </svg>
);

export const RainOfFireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.25Q10.75 4.5 9.5 6.75 8.25 9 7 11.25 5.75 13.5 4.5 15.75 3.25 18 2 20.25H22Q20.75 18 19.5 15.75 18.25 13.5 17 11.25 15.75 9 14.5 6.75 13.25 4.5 12 2.25Z"/>
    </svg>
);

export const HeroAbilityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21h6v-2H9v2zm6.5-10.75L12 6.5 8.5 10.25l1.42 1.42L12 9.33l2.08 2.34 1.42-1.42zM18 3H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H6V5h12v12z"/>
    </svg>
);


// ===================================================================================
// Portraits
// ===================================================================================

export const ArcherTowerPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="#a1887f"/><rect x="40" y="20" width="20" height="60" fill="#5d4037"/><polygon points="30,20 70,20 50,0" fill="#3e2723"/></svg>
);
export const MageTowerPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="#7e57c2"/><circle cx="50" cy="50" r="30" fill="#4527a0"/><circle cx="50" cy="50" r="15" fill="#e1bee7"/></svg>
);
export const BarracksTowerPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 100 100"><rect x="10" y="30" width="80" height="60" fill="#bcaaa4"/><rect x="20" y="40" width="60" height="40" fill="#795548"/><polygon points="5,30 95,30 50,10" fill="#d32f2f"/></svg>
);
export const ArtilleryTowerPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 100 100"><rect x="15" y="50" width="70" height="30" fill="#607d8b"/><circle cx="50" cy="70" r="25" fill="#455a64"/><rect x="45" y="20" width="10" height="50" fill="#37474f"/></svg>
);
export const SoldierPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 100 100"><rect x="20" y="10" width="60" height="80" fill="#cfd8dc"/><circle cx="50" cy="30" r="15" fill="#ffccbc"/><rect x="45" y="50" width="10" height="40" fill="#795548"/></svg>
);
export const HeroPortrait: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 100 100"><rect x="20" y="10" width="60" height="80" fill="#ffd54f"/><circle cx="50" cy="30" r="15" fill="#ffecb3"/><rect x="45" y="50" width="10" height="40" fill="#8d6e63"/></svg>
);
export const EnemyPortrait: React.FC<{type: EnemyType} & React.SVGProps<SVGSVGElement>> = ({type, ...props}) => {
    const color = type === 'GOBLIN' ? '#4caf50' : type === 'ORC' ? '#795548' : '#607d8b';
    return <svg {...props} viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill={color}/><circle cx="40" cy="40" r="5" fill="red"/><circle cx="60" cy="40" r="5" fill="red"/></svg>;
};

// ===================================================================================
// Game Elements
// ===================================================================================

const TowerBase: React.FC = () => <polygon points="0,0 80,0 60,20 20,20" fill="#a1887f" stroke="#5d4037" strokeWidth="2" />;

export const ArcherTowerIcon: React.FC<{level: number, isAttacking?: boolean}> = ({level, isAttacking}) => (
  <svg width="80" height="100" viewBox="0 0 80 100">
    <g transform="translate(0, 80)">
      <TowerBase />
    </g>
    <rect x="30" y="20" width="20" height="60" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
    <polygon points="20,20 60,20 40,0" fill={level > 1 ? "#c62828" : "#f44336"} stroke="#3e2723" strokeWidth="2" />
    {level > 2 && <circle cx="40" cy="10" r="4" fill="yellow" />}
    {isAttacking && <line x1="40" y1="25" x2="40" y2="10" stroke="yellow" strokeWidth="4" />}
  </svg>
);

export const MageTowerIcon: React.FC<{level: number, isAttacking?: boolean}> = ({level, isAttacking}) => (
  <svg width="80" height="100" viewBox="0 0 80 100">
     <g transform="translate(0, 80)">
      <TowerBase />
    </g>
    <rect x="25" y="50" width="30" height="30" fill="#ab47bc" stroke="#4a148c" strokeWidth="2" />
    <polygon points="15,50 65,50 40,30" fill={level > 1 ? "#7b1fa2" : "#9c27b0"} stroke="#4a148c" strokeWidth="2" />
    <circle cx="40" cy="20" r={level * 4 + 4} fill={isAttacking ? "cyan" : "magenta"} stroke="#4a148c" strokeWidth="2">
        {isAttacking && <animate attributeName="r" values="8;16;8" dur="0.5s" repeatCount="indefinite" />}
    </circle>
  </svg>
);

export const BarracksTowerIcon: React.FC<{level: number}> = ({level}) => (
  <svg width="80" height="60" viewBox="0 0 80 60">
    <rect x="5" y="10" width="70" height="50" fill="#bcaaa4" stroke="#795548" strokeWidth="2" />
    <rect x="30" y="30" width="20" height="30" fill="#795548"/>
    <polygon points="0,10 80,10 40,0" fill={level > 1 ? "#c62828" : "#f44336"} stroke="#b71c1c" strokeWidth="2" />
    {level > 2 && <rect x="35" y="5" width="10" height="10" fill="gold" />}
  </svg>
);

export const ArtilleryTowerIcon: React.FC<{level: number, isAttacking?: boolean}> = ({level, isAttacking}) => (
  <svg width="100" height="80" viewBox="0 0 100 80">
    <rect x="5" y="40" width="90" height="40" rx="5" fill="#78909c" stroke="#37474f" strokeWidth="2"/>
    <circle cx="30" cy="40" r="15" fill="#546e7a" />
    <circle cx="70" cy="40" r="15" fill="#546e7a" />
    <g style={{ transformOrigin: '20px 60px', transition: 'transform 0.2s' }} transform={isAttacking ? 'rotate(-45)' : 'rotate(-25)'}>
       <rect x="15" y="0" width={level * 5 + 25} height="15" fill="#455a64" />
       <circle cx="15" cy="8" r="8" fill="#37474f" />
    </g>
  </svg>
);

export const SoldierIcon: React.FC<{isFighting?: boolean}> = ({isFighting}) => (
    <svg width="40" height="50" viewBox="0 0 40 50">
        <rect x="10" y="15" width="20" height="35" fill="#90a4ae"/>
        <circle cx="20" cy="10" r="8" fill="#eceff1" />
        <g transform={isFighting ? "translate(5, 5) rotate(45 25 35)" : "translate(0,0)"} style={{transition: 'transform 0.2s'}}>
            <rect x="25" y="15" width="5" height="25" fill="#607d8b" />
        </g>
    </svg>
);

export const HeroIcon: React.FC<{isAttacking?: boolean}> = ({isAttacking}) => (
    <svg width="50" height="60" viewBox="0 0 50 60">
        <rect x="10" y="15" width="30" height="45" fill="#ffd54f" stroke="#ff8f00" strokeWidth="2" />
        <circle cx="25" cy="10" r="8" fill="#ffecb3" />
        <polygon points="0,15 50,15 25,0" fill="#e65100" />
        <g transform={isAttacking ? "rotate(-45 40 40)" : "rotate(0)"} style={{transition: 'transform 0.2s'}}>
            <rect x="35" y="15" width="8" height="35" fill="#795548" />
        </g>
    </svg>
);

export const MilitiaIcon: React.FC<{isFighting?: boolean}> = ({isFighting}) => (
    <svg width="40" height="50" viewBox="0 0 40 50">
        <rect x="10" y="15" width="20" height="35" fill="#a1887f"/>
        <circle cx="20" cy="10" r="8" fill="#d7ccc8" />
        <g transform={isFighting ? "translate(5, 5) rotate(45 25 35)" : "translate(0,0)"} style={{transition: 'transform 0.2s'}}>
            <rect x="25" y="15" width="5" height="25" fill="#5d4037" />
        </g>
    </svg>
);

export const EnemyIcon: React.FC<{type: EnemyType, isDamaged?: boolean}> = ({type, isDamaged}) => {
    const color = type === 'GOBLIN' ? '#81c784' : type === 'ORC' ? '#a1887f' : '#90a4ae';
    const eyeColor = isDamaged ? 'yellow' : 'red';
    const size = type === 'GOBLIN' ? {w: 35, h: 35} : type === 'ORC' ? {w: 45, h: 45} : {w: 55, h: 55};
    return (
        <svg width={size.w} height={size.h} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill={color} stroke="#333" strokeWidth="4"/>
            <circle cx="35" cy="40" r="8" fill={eyeColor}/>
            <circle cx="65" cy="40" r="8" fill={eyeColor}/>
            <rect x="30" y="65" width="40" height="10" fill="#333"/>
        </svg>
    );
};

export const ArrowProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} viewBox="0 0 24 10"><polygon points="0,5 20,0 20,2 24,5 20,8 20,10" fill="#8d6e63"/></svg>;
export const MagicBoltProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="cyan" /><circle cx="12" cy="12" r="4" fill="white" /></svg>;
export const CannonballProjectileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#424242" /></svg>;

export const TowerSpotIcon: React.FC<{isOccupied: boolean}> = ({isOccupied}) => (
    <div className={`w-20 h-20 border-4 ${isOccupied ? 'border-transparent' : 'border-dashed border-white/30'} rounded-full group-hover:border-white/50 transition-colors`}></div>
);

// ===================================================================================
// Visual Effects
// ===================================================================================

const PathLine: React.FC = () => {
  const pathData = MAP_PATH.map((p, i) => {
    const screenP = gameToScreen(p);
    return `${i === 0 ? 'M' : 'L'} ${screenP.x} ${screenP.y}`;
  }).join(' ');

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
        <path d={pathData} fill="none" stroke="#a1887f" strokeWidth="80" strokeLinejoin="round" strokeLinecap="round" />
        <path d={pathData} fill="none" stroke="#8d6e63" strokeWidth="70" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const Scenery: React.FC = () => (
    <>
      {/* Pond */}
      <div className="absolute w-24 h-12 bg-blue-300/80 rounded-full" style={{ left: '15%', top: '55%', zIndex: 0}}></div>
      {/* Tree 1 */}
      <div className="absolute" style={{ left: '48%', top: '25%', zIndex: 300 }}>
        <div className="w-48 h-48 bg-green-600 rounded-full"></div>
        <div className="absolute w-8 h-24 bg-yellow-900" style={{left: '50%', top: '50%', transform: 'translateX(-50%)'}}></div>
      </div>
       {/* Tree 2 */}
       <div className="absolute" style={{ left: '60%', top: '55%', zIndex: 600 }}>
        <div className="w-56 h-56 bg-green-700 rounded-full"></div>
        <div className="absolute w-10 h-32 bg-yellow-900" style={{left: '50%', top: '50%', transform: 'translateX(-50%)'}}></div>
      </div>
    </>
);

export const GameBackground: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
    <div {...props}>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200"></div>
        <div className="absolute inset-0 top-1/4 bg-gradient-to-b from-green-400 to-green-500"></div>
        <PathLine />
        <Scenery />
    </div>
);

export const SelectionCircle: React.FC<{position: Vector2D}> = ({position}) => (
    <div
        className="absolute border-4 border-yellow-400 rounded-full pointer-events-none animate-pulse"
        style={{
            left: position.x,
            top: position.y,
            width: 100,
            height: 50,
            transform: 'translate(-50%, -50%)',
            zIndex: 1
        }}
    />
);

export const RallyPointRangeCircle: React.FC<{position: Vector2D, range: number}> = ({position, range}) => (
    <div
        className="absolute border-2 border-dashed border-white/50 rounded-full pointer-events-none"
        style={{
            left: position.x,
            top: position.y,
            width: range * 2,
            height: range * 2,
            transform: 'translate(-50%, -50%)',
            zIndex: 0
        }}
    />
);

export const RallyPointFlag: React.FC<{position: Vector2D}> = ({position}) => (
    <div
        className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none"
        style={{ left: position.x, top: position.y, zIndex: Math.floor(position.y) + 1 }}
    >
        <div className="w-1 h-12 bg-gray-600"></div>
        <div className="w-8 h-6 bg-blue-500 absolute top-0 -right-8"></div>
    </div>
);


export const Explosion: React.FC<{position: Vector2D, radius: number}> = ({ position, radius }) => (
    <div
        className="absolute bg-orange-500 rounded-full pointer-events-none animate-ping"
        style={{
            left: position.x,
            top: position.y,
            width: radius,
            height: radius,
            transform: 'translate(-50%, -50%)',
            zIndex: 15000
        }}
    />
);

export const TargetCursor: React.FC<{position: Vector2D, spell: PlayerSpell}> = ({position, spell}) => {
    const radius = spell === 'RAIN_OF_FIRE' ? RAIN_OF_FIRE_STATS.radius : 40;
    const color = spell === 'RAIN_OF_FIRE' ? 'border-red-500' : 'border-blue-400';
    return (
        <div
            className={`absolute ${color} border-4 border-dashed rounded-full pointer-events-none`}
            style={{
                left: position.x,
                top: position.y,
                width: radius * 2,
                height: radius * 2,
                transform: 'translate(-50%, -50%)',
                zIndex: 20000
            }}
        />
    )
};

export const BuffEffect: React.FC<{size?: number}> = ({size = 60}) => (
    <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ zIndex: -1 }}
    >
        <path d="M50 0 L61.2 38.8 L100 38.8 L69.4 61.2 L80.9 100 L50 76.3 L19.1 100 L30.6 61.2 L0 38.8 L38.8 38.8 Z" fill="rgba(255, 235, 59, 0.7)"/>
    </svg>
);
