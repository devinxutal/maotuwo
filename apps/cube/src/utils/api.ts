// API base URL — in production, relative path works via Nginx reverse proxy
const API_BASE = import.meta.env.DEV ? 'http://localhost:8003/api' : '/api';

export interface ProfileData {
  version: number;
  timestamp: string;
  data: Record<string, {
    mainFormulaId: string | null;
    formulas: any[];
  }>;
}

export async function listProfiles(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/profiles`);
  if (!res.ok) throw new Error('Failed to list profiles');
  const json = await res.json();
  return json.profiles;
}

export async function fetchProfile(name: string): Promise<ProfileData> {
  const res = await fetch(`${API_BASE}/profiles/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Failed to fetch profile: ${name}`);
  return res.json();
}

export async function saveProfile(name: string, data: ProfileData): Promise<void> {
  const res = await fetch(`${API_BASE}/profiles/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to save profile: ${name}`);
}

export async function patchCase(
  profileName: string,
  caseId: string,
  mainFormulaId: string | null,
  formulas: any[]
): Promise<void> {
  const res = await fetch(`${API_BASE}/profiles/${encodeURIComponent(profileName)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseId, mainFormulaId, formulas })
  });
  if (!res.ok) throw new Error(`Failed to patch case: ${caseId}`);
}
