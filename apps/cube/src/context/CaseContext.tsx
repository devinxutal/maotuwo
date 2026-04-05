import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { CubeCase } from '../data/types';
import { defaultF2LCases } from '../data/f2l';
import { ollCases } from '../data/oll';
import { pllCases } from '../data/pll';
import defaultFormulasConfig from '../data/default_formulas.json';
import { fetchProfile, patchCase as apiPatchCase, saveProfile, ProfileData } from '../utils/api';

interface CaseContextValue {
  cases: CubeCase[];
  getCase: (id: string) => CubeCase | undefined;
  updateCase: (id: string, updatedCase: Partial<CubeCase>) => void;
  setCases: React.Dispatch<React.SetStateAction<CubeCase[]>>;
  activeProfile: string;
  setActiveProfile: (name: string) => void;
  syncStatus: 'idle' | 'syncing' | 'error';
  saveFullProfile: (data: ProfileData) => Promise<void>;
}

const CaseContext = createContext<CaseContextValue | undefined>(undefined);

const PROFILE_KEY = 'cube_active_profile';

function buildCasesFromConfig(configData: Record<string, any>): CubeCase[] {
  const bareCases = [...defaultF2LCases, ...ollCases, ...pllCases];
  return bareCases.map(c => {
    const cd = configData[c.id];
    return cd ? { ...c, mainFormulaId: cd.mainFormulaId, formulas: cd.formulas } : c;
  });
}

function getFactoryDefaults(): CubeCase[] {
  try {
    const configData = defaultFormulasConfig.data as Record<string, any>;
    return buildCasesFromConfig(configData);
  } catch {
    return [...defaultF2LCases, ...ollCases, ...pllCases];
  }
}

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<string>(
    () => localStorage.getItem(PROFILE_KEY) || 'public'
  );
  const [cases, setCases] = useState<CubeCase[]>(getFactoryDefaults);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const syncQueue = useRef<Promise<void>>(Promise.resolve());

  // Load profile from server
  const loadProfile = useCallback(async (profileName: string) => {
    setSyncStatus('syncing');
    try {
      const profileData = await fetchProfile(profileName);
      if (profileData && profileData.data) {
        setCases(buildCasesFromConfig(profileData.data));
      }
      setSyncStatus('idle');
    } catch (e) {
      console.error('[CaseContext] Failed to load profile:', e);
      setSyncStatus('error');
      // Fallback to factory defaults
      setCases(getFactoryDefaults());
    }
  }, []);

  // Load on mount and profile switch
  useEffect(() => {
    loadProfile(activeProfile);
  }, [activeProfile, loadProfile]);

  const setActiveProfile = useCallback((name: string) => {
    localStorage.setItem(PROFILE_KEY, name);
    setActiveProfileState(name);
  }, []);

  // Queue a sync operation to avoid race conditions
  const queueSync = useCallback((fn: () => Promise<void>) => {
    syncQueue.current = syncQueue.current.then(fn).catch(e => {
      console.error('[CaseContext] Sync error:', e);
      setSyncStatus('error');
    });
  }, []);

  // Patch a single case to the server
  const updateCase = useCallback((id: string, updatedCase: Partial<CubeCase>) => {
    setCases(prev => {
      const newCases = prev.map(c => c.id === id ? { ...c, ...updatedCase } : c);
      // Find the updated case to sync
      const target = newCases.find(c => c.id === id);
      if (target) {
        queueSync(async () => {
          setSyncStatus('syncing');
          await apiPatchCase(activeProfile, id, target.mainFormulaId, target.formulas);
          setSyncStatus('idle');
        });
      }
      return newCases;
    });
  }, [activeProfile, queueSync]);

  // Full profile save (for import / restore)
  const saveFullProfile = useCallback(async (data: ProfileData) => {
    setSyncStatus('syncing');
    try {
      await saveProfile(activeProfile, data);
      setCases(buildCasesFromConfig(data.data));
      setSyncStatus('idle');
    } catch (e) {
      console.error('[CaseContext] Failed to save profile:', e);
      setSyncStatus('error');
    }
  }, [activeProfile]);

  const getCase = useCallback((id: string) => cases.find(c => c.id === id), [cases]);

  return (
    <CaseContext.Provider value={{
      cases, getCase, updateCase, setCases,
      activeProfile, setActiveProfile,
      syncStatus, saveFullProfile
    }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error('useCase must be used within CaseProvider');
  return ctx;
}
