// ============================================================
// IC API — LocalStorage persistence for custom IC definitions
// ============================================================

import { ICDefinition } from '../types/circuit';

const IC_STORAGE_KEY = 'logiclab_custom_ics';

/**
 * Fetch all custom ICs from localStorage.
 */
export function fetchCustomICs(): ICDefinition[] {
  try {
    const data = localStorage.getItem(IC_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ICDefinition[];
  } catch (err) {
    console.error('Failed to fetch ICs from localStorage:', err);
    return [];
  }
}

/**
 * Save an IC definition to localStorage.
 */
export function saveICDefinition(ic: ICDefinition): void {
  try {
    const existing = fetchCustomICs();
    const updated = [...existing.filter(item => item.id !== ic.id), ic];
    localStorage.setItem(IC_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save IC to localStorage:', err);
  }
}

/**
 * Delete an IC definition by ID.
 */
export function deleteICDefinition(id: string): void {
  try {
    const existing = fetchCustomICs();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(IC_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete IC from localStorage:', err);
  }
}

/**
 * Get all local ICs synchronously (for migration).
 */
export function getAllLocalICs(): ICDefinition[] {
  return fetchCustomICs();
}

/**
 * Clear all local IC definitions (after migration).
 */
export function clearLocalICs(): void {
  localStorage.removeItem(IC_STORAGE_KEY);
}
