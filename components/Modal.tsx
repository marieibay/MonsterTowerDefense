import React from 'react';
import type { GameStatus } from '../types';

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
    <div 
        className="absolute inset-0 bg-black/70 flex items-center justify-center p-4"
        style={{ zIndex: 25000 }}
    >
      <div className="bg-gray-800/95 border border-gray-600 rounded-xl p-8 text-center text-white w-full max-w-lg shadow-2xl">
        <h2 className="text-5xl uppercase mb-4 tracking-wider">{title}</h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">{message}</p>
        <button
          onClick={onRestart}
          className="bg-blue-600 text-white text-2xl uppercase py-3 px-8 rounded-lg border border-blue-800 hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};