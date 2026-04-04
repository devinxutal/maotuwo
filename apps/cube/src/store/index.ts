import { create } from 'zustand';
import type { CFOPStep } from '../types';

interface CaseStore {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useCaseStore = create<CaseStore>((set, get) => ({
  favorites: [],
  addFavorite: (id) => set((state) => ({
    favorites: [...state.favorites, id],
  })),
  removeFavorite: (id) => set((state) => ({
    favorites: state.favorites.filter((f) => f !== id),
  })),
  toggleFavorite: (id) => {
    const { favorites, addFavorite, removeFavorite } = get();
    if (favorites.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  },
  isFavorite: (id) => get().favorites.includes(id),
}));

export const getStepPath = (step: CFOPStep): string => {
  return step.toLowerCase();
};

export const getStepFromPath = (path: string): CFOPStep | null => {
  const upper = path.toUpperCase();
  if (upper === 'F2L' || upper === 'OLL' || upper === 'PLL') {
    return upper as CFOPStep;
  }
  return null;
};
