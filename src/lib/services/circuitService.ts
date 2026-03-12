import { supabase, supabaseConfigured } from '../supabase';
import { LogicProject, SavedProject } from '../../types/circuit';
import * as projectApi from '../projectApi';

function isAuthenticated(): boolean {
  return !!(supabaseConfigured && supabase?.auth);
}

async function getCurrentUserId(): Promise<string | null> {
  if (!isAuthenticated() || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function fetchUserCircuits(): Promise<SavedProject[]> {
  const userId = await getCurrentUserId();

  if (userId && supabase) {
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as SavedProject[];
    } catch (err) {
      console.error('Supabase fetchUserCircuits failed, falling back to localStorage:', err);
    }
  }

  // Fallback to localStorage
  return projectApi.fetchUserProjects();
}

export async function fetchPublicCircuits(): Promise<SavedProject[]> {
  if (supabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('is_public', true)
        .order('stars_count', { ascending: false });

      if (error) throw error;
      return (data ?? []) as SavedProject[];
    } catch (err) {
      console.error('Supabase fetchPublicCircuits failed:', err);
    }
  }
  return [];
}

export async function fetchTemplates(): Promise<SavedProject[]> {
  if (supabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('is_template', true)
        .order('stars_count', { ascending: false });

      if (error) throw error;
      return (data ?? []) as SavedProject[];
    } catch (err) {
      console.error('Supabase fetchTemplates failed:', err);
    }
  }
  return [];
}

export async function saveCircuit(
  projectData: LogicProject,
  existingId?: string | null
): Promise<SavedProject | null> {
  const userId = await getCurrentUserId();

  if (userId && supabase) {
    try {
      if (existingId) {
        const { data, error } = await supabase
          .from('circuits')
          .update({
            name: projectData.name,
            description: projectData.description,
            data: projectData as unknown as Record<string, unknown>,
          })
          .eq('id', existingId)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        // Also cache locally
        await projectApi.saveProject('anonymous', projectData, existingId);
        return data as SavedProject;
      } else {
        const { data, error } = await supabase
          .from('circuits')
          .insert({
            user_id: userId,
            name: projectData.name,
            description: projectData.description,
            data: projectData as unknown as Record<string, unknown>,
          })
          .select()
          .single();

        if (error) throw error;
        // Also cache locally
        await projectApi.saveProject('anonymous', projectData);
        return data as SavedProject;
      }
    } catch (err) {
      console.error('Supabase saveCircuit failed, falling back to localStorage:', err);
    }
  }

  // Fallback to localStorage
  return projectApi.saveProject('anonymous', projectData, existingId);
}

export async function deleteCircuit(id: string): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (userId && supabase) {
    try {
      const { error } = await supabase
        .from('circuits')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      // Also remove from local cache
      await projectApi.deleteProject(id);
      return true;
    } catch (err) {
      console.error('Supabase deleteCircuit failed, falling back to localStorage:', err);
    }
  }

  // Fallback to localStorage
  return projectApi.deleteProject(id);
}

export async function duplicateCircuit(id: string): Promise<SavedProject | null> {
  const userId = await getCurrentUserId();

  if (userId && supabase) {
    try {
      const { data: original, error: fetchError } = await supabase
        .from('circuits')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!original) return null;

      const { data, error } = await supabase
        .from('circuits')
        .insert({
          user_id: userId,
          name: `${original.name} (Copy)`,
          description: original.description,
          data: original.data,
        })
        .select()
        .single();

      if (error) throw error;
      return data as SavedProject;
    } catch (err) {
      console.error('Supabase duplicateCircuit failed:', err);
    }
  }

  // localStorage fallback: load, re-save with new name
  const projects = await projectApi.fetchUserProjects();
  const original = projects.find(p => p.id === id);
  if (!original) return null;

  const copy = { ...original.data, name: `${original.data.name} (Copy)` };
  return projectApi.saveProject('anonymous', copy);
}

export async function getCircuit(id: string): Promise<SavedProject | null> {
  if (supabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as SavedProject;
    } catch (err) {
      console.error('Supabase getCircuit failed, falling back to localStorage:', err);
    }
  }

  // Fallback
  const projects = await projectApi.fetchUserProjects();
  return projects.find(p => p.id === id) ?? null;
}
