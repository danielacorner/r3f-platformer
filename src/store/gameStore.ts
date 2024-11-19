import { create } from 'zustand';

interface GameState {
  currentLevel: number;
  timer: number;
  enemiesAlive: number;
  isSpawning: boolean;
  levelComplete: boolean;
  setCurrentLevel: (level: number) => void;
  setTimer: (time: number) => void;
  setEnemiesAlive: (count: number) => void;
  setIsSpawning: (spawning: boolean) => void;
  setLevelComplete: (complete: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentLevel: 1,
  timer: 60,
  enemiesAlive: 0,
  isSpawning: true,
  levelComplete: false,
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setTimer: (time) => set({ timer: time }),
  setEnemiesAlive: (count) => set({ enemiesAlive: count }),
  setIsSpawning: (spawning) => set({ isSpawning: spawning }),
  setLevelComplete: (complete) => set({ levelComplete: complete }),
}));