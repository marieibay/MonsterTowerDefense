import type { Vector2D } from './types';
import { GAME_CONFIG } from './constants';

export const getDistance = (p1: Vector2D, p2: Vector2D): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Converts grid coordinates to screen pixel coordinates for isometric view
export const gameToScreen = (gridPos: Vector2D): Vector2D => {
    const rawScreenX = (gridPos.x - gridPos.y) * (GAME_CONFIG.tileWidth / 2);
    const rawScreenY = (gridPos.x + gridPos.y) * (GAME_CONFIG.tileHeight / 2);

    // These offsets are calculated to center the game's content within the new, larger canvas size.
    const xOffset = 1220; 
    const yOffset = 160;

    return { x: rawScreenX + xOffset, y: rawScreenY + yOffset };
}


export class AudioManager {
  private audioContext: AudioContext;
  private isMuted: boolean = false;
  private sfxGain: GainNode;
  private musicGain: GainNode;
  private musicElement: HTMLAudioElement;
  private musicSource: MediaElementAudioSourceNode | null = null;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.sfxGain = this.audioContext.createGain();
    this.sfxGain.connect(this.audioContext.destination);
    
    this.musicGain = this.audioContext.createGain();
    this.musicGain.gain.value = 0.3; // Default music volume
    this.musicGain.connect(this.audioContext.destination);

    const musicEl = document.getElementById('bg-music');
    if (musicEl instanceof HTMLAudioElement) {
        this.musicElement = musicEl;
    } else {
        console.error("Background music element not found or is not an audio element.");
        // Create a dummy element to avoid errors
        this.musicElement = document.createElement('audio');
    }
  }

  public resumeContext() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
          // The context is unlocked, now we can create the MediaElementSource
          if (!this.musicSource && this.musicElement.src) {
              this.musicSource = this.audioContext.createMediaElementSource(this.musicElement);
              this.musicSource.connect(this.musicGain);
          }
      }).catch(e => console.error("AudioContext could not be resumed:", e));
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType | 'noise' = 'square', volume: number = 0.5, decay: boolean = true) {
    if (this.isMuted || this.audioContext.state !== 'running') return;

    const gainNode = this.audioContext.createGain();
    gainNode.connect(this.sfxGain);
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    if(decay) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);
    }

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
  
  public playSound(sound: 'ARROW' | 'MAGIC_BOLT' | 'CANNONBALL' | 'explosion' | 'build' | 'upgradeTower' | 'rainOfFire' | 'enemyDeath' | 'soldierAttack' | 'heroAttack' | 'heroAbility' | 'lifeLost' | 'gameOver' | 'victory' | 'enemyAttack' | 'uiClick' | 'waveStart') {
    if (this.isMuted) return;

    switch(sound) {
      case 'ARROW':
        this.playTone(1500, 0.15, 'noise', 0.1);
        break;
      case 'MAGIC_BOLT':
        this.playTone(800, 0.1, 'triangle', 0.2);
        this.playTone(1200, 0.1, 'triangle', 0.2);
        break;
      case 'CANNONBALL':
         this.playTone(100, 0.2, 'square', 0.3);
         this.playTone(200, 0.3, 'noise', 0.1);
        break;
      case 'explosion':
        this.playTone(400, 0.3, 'noise', 0.4);
        this.playTone(100, 0.4, 'square', 0.3);
        break;
      case 'build':
        this.playTone(220, 0.05, 'square', 0.3);
        this.playTone(440, 0.1, 'square', 0.3);
        break;
      case 'upgradeTower':
        this.playTone(330, 0.05, 'triangle', 0.3);
        this.playTone(660, 0.1, 'triangle', 0.3);
        break;
      case 'rainOfFire':
        this.playTone(200, 0.5, 'square', 0.3);
        this.playTone(100, 0.5, 'square', 0.3);
        break;
      case 'enemyDeath':
        this.playTone(150, 0.2, 'square', 0.2);
        break;
      case 'soldierAttack':
      case 'heroAttack':
        this.playTone(800, 0.1, 'noise', 0.05);
        break;
      case 'enemyAttack':
        this.playTone(400, 0.1, 'noise', 0.05);
        break;
      case 'heroAbility':
        this.playTone(880, 0.1, 'triangle', 0.4);
        setTimeout(() => this.playTone(1046, 0.1, 'triangle', 0.4), 100);
        setTimeout(() => this.playTone(1318, 0.2, 'triangle', 0.4), 200);
        break;
      case 'lifeLost':
        this.playTone(200, 0.1, 'sawtooth', 0.4);
        this.playTone(150, 0.2, 'sawtooth', 0.4);
        break;
      case 'gameOver':
         this.playTone(220, 0.2, 'sawtooth', 0.4);
         setTimeout(() => this.playTone(165, 0.2, 'sawtooth', 0.4), 200);
         setTimeout(() => this.playTone(110, 0.5, 'sawtooth', 0.4), 400);
         break;
      case 'victory':
          this.playTone(523, 0.1, 'square', 0.3);
          setTimeout(() => this.playTone(659, 0.1, 'square', 0.3), 120);
          setTimeout(() => this.playTone(783, 0.1, 'square', 0.3), 240);
          setTimeout(() => this.playTone(1046, 0.3, 'square', 0.3), 360);
          break;
      case 'uiClick':
        this.playTone(660, 0.05, 'triangle', 0.2);
        break;
      case 'waveStart':
        this.playTone(261, 0.1, 'triangle', 0.3);
        setTimeout(() => this.playTone(329, 0.1, 'triangle', 0.3), 100);
        setTimeout(() => this.playTone(392, 0.2, 'triangle', 0.3), 200);
        break;
    }
  }

  public playMusic() {
    if (this.isMuted) return;
    this.resumeContext();
    this.musicElement.play().catch(error => console.log("Music play was prevented. Requires user interaction.", error));
  }

  public stopMusic() {
      this.musicElement.pause();
      this.musicElement.currentTime = 0;
  }

  public toggleMute(isMuted: boolean) {
    this.isMuted = isMuted;
    const sfxGainValue = isMuted ? 0 : 1;
    const musicGainValue = isMuted ? 0 : 0.3;
    
    if (this.audioContext.state === 'running') {
        this.sfxGain.gain.setValueAtTime(sfxGainValue, this.audioContext.currentTime);
        this.musicGain.gain.setValueAtTime(musicGainValue, this.audioContext.currentTime);
    } else {
        // If context is not running, just set the value directly.
        // It will be applied when the context resumes.
        this.sfxGain.gain.value = sfxGainValue;
        this.musicGain.gain.value = musicGainValue;
    }
  }
}