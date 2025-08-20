import React from 'react';
import type { GameStatus } from '../types';
import { UIPanel, UIButton } from './icons';

interface ModalProps {
  status: GameStatus;
  onRestart: () => void;
}

export const Modal: React.FC<ModalProps> = ({ status, onRestart }) => {
  if (status !== 'GAME_OVER' && status !== 'VICTORY') return null;

  const isVictory = status === 'VICTORY';
  const title = isVictory ? 'VICTORY!' : 'GAME OVER';
  const message = isVictory
    ? 'You have successfully defended the kingdom!'
    : 'The enemy horde has broken through.';

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="relative p-2 text-center text-white w-full max-w-lg">
        <UIPanel 
          className="absolute inset-0 w-full h-full" 
        />
        <div className="relative z-10 p-10">
            <h2 className="text-5xl uppercase mb-4 tracking-wider" style={{ textShadow: '3px 3px #000' }}>{title}</h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed" style={{ textShadow: '2px 2px #000' }}>{message}</p>
            <button
            onClick={onRestart}
            className="relative px-8 py-4 text-white text-2xl uppercase transition-transform transform hover:scale-105 active:scale-95"
            >
             <UIButton className="absolute inset-0 w-full h-full" />
             <span className="relative z-10" style={{ textShadow: '2px 2px #000' }}>Play Again</span>
            </button>
        </div>
      </div>
    </div>
  );
};