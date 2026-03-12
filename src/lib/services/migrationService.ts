import { supabase, supabaseConfigured } from '../supabase';
import type { MigrationResult } from '../../types/circuit';
import { getAllLocalProjects, clearLocalProjects } from '../projectApi';
import { getAllLocalICs, clearLocalICs } from '../icApi';

export function getLocalStorageStats() {
  const projects = getAllLocalProjects();
  const ics = getAllLocalICs();
  return {
    projectCount: projects.length,
    icCount: ics.length,
    hasData: projects.length > 0 || ics.length > 0,
  };
}

export async function migrateLocalStorageToSupabase(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedCircuits: 0,
    migratedICs: 0,
    errors: [],
  };

  if (!supabaseConfigured || !supabase) {
    result.errors.push('Supabase is not configured');
    return result;
  }

  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;

  if (!userId) {
    result.errors.push('User is not authenticated');
    return result;
  }

  // Migrate circuits
  const localProjects = getAllLocalProjects();
  for (const project of localProjects) {
    try {
      const { error } = await supabase.from('circuits').insert({
        user_id: userId,
        name: project.name,
        description: project.description,
        data: project.data as unknown as Record<string, unknown>,
      });

      if (error) {
        result.errors.push(`Circuit "${project.name}": ${error.message}`);
      } else {
        result.migratedCircuits++;
      }
    } catch (err) {
      result.errors.push(`Circuit "${project.name}": ${String(err)}`);
    }
  }

  // Migrate IC definitions
  const localICs = getAllLocalICs();
  for (const ic of localICs) {
    try {
      const { nodes, connections, inputPins, outputPins } = ic;
      const { error } = await supabase.from('ic_definitions').insert({
        user_id: userId,
        name: ic.name,
        description: ic.description,
        data: { nodes, connections, inputPins, outputPins },
      });

      if (error) {
        result.errors.push(`IC "${ic.name}": ${error.message}`);
      } else {
        result.migratedICs++;
      }
    } catch (err) {
      result.errors.push(`IC "${ic.name}": ${String(err)}`);
    }
  }

  result.success = result.errors.length === 0;

  // Clear local data if everything migrated successfully
  if (result.success) {
    clearLocalProjects();
    clearLocalICs();
  }

  return result;
}
