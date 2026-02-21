// ============================================================
// Project API — Supabase CRUD for projects
// ============================================================

import { getSupabase, supabaseConfigured } from '../lib/supabase';
import { LogicProject, SavedProject } from '../types/circuit';

/**
 * Fetch all projects for a given user.
 */
export async function fetchUserProjects(userId: string): Promise<SavedProject[]> {
  if (!supabaseConfigured) return [];

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch projects:', error.message);
      return [];
    }

    return (data ?? []) as SavedProject[];
  } catch (err) {
    console.error('Fetch projects error:', err);
    return [];
  }
}

/**
 * Save a project (create or update).
 */
export async function saveProject(
  userId: string,
  projectData: LogicProject,
  existingId?: string | null
): Promise<SavedProject | null> {
  if (!supabaseConfigured) return null;

  try {
    const supabase = getSupabase();
    const now = new Date().toISOString();

    if (existingId) {
      // Update existing
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: projectData.name,
          description: projectData.description,
          data: projectData,
          updated_at: now,
        })
        .eq('id', existingId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Failed to update project:', error.message);
        return null;
      }

      return data as SavedProject;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: projectData.name,
          description: projectData.description,
          data: projectData,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save project:', error.message);
        return null;
      }

      return data as SavedProject;
    }
  } catch (err) {
    console.error('Save project error:', err);
    return null;
  }
}

/**
 * Delete a project by ID.
 */
export async function deleteProject(id: string, userId: string): Promise<boolean> {
  if (!supabaseConfigured) return false;

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to delete project:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete project error:', err);
    return false;
  }
}

/**
 * Publish a project (make it public).
 */
export async function publishProject(
  userId: string,
  projectData: LogicProject,
  projectId: string
): Promise<boolean> {
  if (!supabaseConfigured) return false;

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('published_circuits')
      .upsert({
        project_id: projectId,
        user_id: userId,
        name: projectData.name,
        description: projectData.description,
        data: projectData,
        published_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to publish:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Publish error:', err);
    return false;
  }
}

/**
 * Fetch community (public) circuits.
 */
export async function fetchPublishedCircuits(): Promise<any[]> {
  if (!supabaseConfigured) return [];

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('published_circuits')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Failed to fetch published circuits:', error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error('Fetch published error:', err);
    return [];
  }
}
