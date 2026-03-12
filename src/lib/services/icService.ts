import { supabase, supabaseConfigured } from '../supabase';
import { ICDefinition } from '../../types/circuit';
import * as icApi from '../icApi';

async function getCurrentUserId(): Promise<string | null> {
  if (!supabaseConfigured || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function fetchUserICs(): Promise<ICDefinition[]> {
  const userId = await getCurrentUserId();

  if (userId && supabase) {
    try {
      const { data, error } = await supabase
        .from('ic_definitions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase rows to ICDefinition shape
      return (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        ...(row.data as object),
        createdAt: row.created_at,
      })) as ICDefinition[];
    } catch (err) {
      console.error('Supabase fetchUserICs failed, falling back to localStorage:', err);
    }
  }

  return icApi.fetchCustomICs();
}

export async function saveIC(ic: ICDefinition): Promise<void> {
  const userId = await getCurrentUserId();

  if (userId && supabase) {
    try {
      const { nodes, connections, inputPins, outputPins } = ic;
      const { error } = await supabase
        .from('ic_definitions')
        .upsert({
          id: ic.id,
          user_id: userId,
          name: ic.name,
          description: ic.description,
          data: { nodes, connections, inputPins, outputPins },
        });

      if (error) throw error;
      // Also cache locally
      icApi.saveICDefinition(ic);
      return;
    } catch (err) {
      console.error('Supabase saveIC failed, falling back to localStorage:', err);
    }
  }

  icApi.saveICDefinition(ic);
}

export async function deleteIC(id: string): Promise<void> {
  const userId = await getCurrentUserId();

  if (userId && supabase) {
    try {
      const { error } = await supabase
        .from('ic_definitions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      icApi.deleteICDefinition(id);
      return;
    } catch (err) {
      console.error('Supabase deleteIC failed, falling back to localStorage:', err);
    }
  }

  icApi.deleteICDefinition(id);
}
