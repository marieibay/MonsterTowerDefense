import type { Vector2D } from './types';
import { GAME_CONFIG } from './constants';

export const getDistance = (p1: Vector2D, p2: Vector2D): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Converts grid coordinates to screen pixel coordinates for isometric view
export const gameToScreen = (gridPos: Vector2D): Vector2D => {
    // const yOffset = 250; // REMOVED: This was causing the "floating" issue. The new background is drawn to match the native coordinates.
    const screenX = (gridPos.x - gridPos.y) * (GAME_CONFIG.tileWidth / 2) + (GAME_CONFIG.width / 2) - GAME_CONFIG.tileWidth / 2;
    const screenY = (gridPos.x + gridPos.y) * (GAME_CONFIG.tileHeight / 2);
    return { x: screenX, y: screenY };
}


export class AudioManager {
  private audioContext: AudioContext;
  private isMuted: boolean = false;
  private musicSource: OscillatorNode | null = null;
  private musicGain: GainNode;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.musicGain = this.audioContext.createGain();
    this.musicGain.connect(this.audioContext.destination);
  }

  private playTone(freq: number, duration: number, type: OscillatorType | 'noise' = 'square', volume: number = 0.5) {
    if (this.isMuted || this.audioContext.state === 'suspended') return;

    const gainNode = this.audioContext.createGain();
    gainNode.connect(this.audioContext.destination);
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

    if (type === 'noise') {
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        source.start(this.audioContext.currentTime);
        source.stop(this.audioContext.currentTime + duration);
    } else {
        const oscillator = this.audioContext.createOscillator();
        oscillator.connect(gainNode);
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
  }
  
  public playSound(sound: 'ARROW' | 'MAGIC_BOLT' | 'CANNONBALL' | 'explosion' | 'build' | 'upgradeTower' | 'rainOfFire' | 'enemyDeath' | 'soldierAttack' | 'heroAttack' | 'heroAbility' | 'lifeLost' | 'gameOver' | 'victory') {
    if (this.isMuted) return;
    this.audioContext.resume();

    switch(sound) {
      case 'ARROW':
        this.playTone(880, 0.1, 'triangle', 0.2);
        this.playTone(1200, 0.1, 'noise', 0.05);
        break;
      case 'MAGIC_BOLT':
        this.playTone(600, 0.2, 'sine', 0.3);
        this.playTone(900, 0.2, 'sawtooth', 0.2);
        break;
      case 'CANNONBALL':
        this.playTone(100, 0.3, 'sawtooth', 0.5);
        this.playTone(50, 0.3, 'square', 0.4);
        break;
      case 'explosion':
        this.playTone(400, 0.2, 'noise', 0.6);
        this.playTone(80, 0.4, 'sawtooth', 0.5);
        break;
      case 'build':
        this.playTone(220, 0.1, 'square', 0.4);
        this.playTone(440, 0.15, 'square', 0.4);
        break;
      case 'upgradeTower':
        this.playTone(330, 0.1, 'sawtooth', 0.4);
        this.playTone(660, 0.15, 'sawtooth', 0.4);
        break;
      case 'rainOfFire':
        this.playTone(800, 0.1, 'noise', 0.8);
        this.playTone(100, 0.5, 'sawtooth', 0.6);
        break;
      case 'enemyDeath':
        this.playTone(200, 0.2, 'sawtooth', 0.3);
        this.playTone(100, 0.3, 'sawtooth', 0.3);
        break;
      case 'soldierAttack':
        this.playTone(300, 0.08, 'noise', 0.15);
        break;
      case 'heroAttack':
        this.playTone(440, 0.1, 'square', 0.2);
        this.playTone(220, 0.1, 'noise', 0.1);
        break;
      case 'heroAbility':
        this.playTone(660, 0.2, 'sawtooth', 0.4);
        this.playTone(880, 0.3, 'sawtooth', 0.5);
        break;
      case 'lifeLost':
        this.playTone(523, 0.15, 'triangle', 0.5);
        this.playTone(261, 0.25, 'triangle', 0.5);
        break;
      case 'gameOver':
         this.playTone(220, 0.5, 'sawtooth', 0.5);
         setTimeout(() => this.playTone(110, 0.8, 'sawtooth', 0.5), 500);
         break;
      case 'victory':
          this.playTone(523, 0.1, 'sine', 0.5);
          setTimeout(() => this.playTone(659, 0.1, 'sine', 0.5), 100);
          setTimeout(() => this.playTone(783, 0.1, 'sine', 0.5), 200);
          setTimeout(() => this.playTone(1046, 0.4, 'sine', 0.5), 300);
          break;
    }
  }

  public playMusic() {
    if (this.isMuted || this.musicSource) return;
    this.audioContext.resume();
    
    const notes = [220, 220, 293.66, 220, 220, 329.63, 220, 220];
    let noteIndex = 0;
    
    const playNote = () => {
        if (!this.musicSource) return;
        this.musicSource.frequency.setValueAtTime(notes[noteIndex % notes.length], this.audioContext.currentTime);
        noteIndex++;
    };

    this.musicSource = this.audioContext.createOscillator();
    this.musicSource.type = 'triangle';
    this.musicGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    this.musicSource.connect(this.musicGain);
    this.musicSource.start();

    setInterval(playNote, 500);
  }

  public stopMusic() {
      if (this.musicSource) {
          this.musicSource.stop();
          this.musicSource.disconnect();
          this.musicSource = null;
      }
  }

  public toggleMute(isMuted: boolean) {
    this.isMuted = isMuted;
    if (isMuted) {
        this.musicGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
    } else {
        this.audioContext.resume();
        this.musicGain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
    }
  }
}