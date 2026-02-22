// ============================================================
// Project API — LocalStorage persistence for projects
// ============================================================

import { LogicProject, SavedProject } from '../types/circuit';
import { v4 as uuidv4 } from 'uuid';

const PROJECTS_KEY = 'logiclab_projects';
const PUBLISHED_KEY = 'logiclab_published_mock'; // Mocking "community" with local storage for now

/**
 * Fetch all projects from localStorage.
 */
export async function fetchUserProjects(_userId?: string): Promise<SavedProject[]> {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavedProject[];
  } catch (err) {
    console.error('Failed to fetch projects from localStorage:', err);
    return [];
  }
}

/**
 * Save a project (create or update) to localStorage.
 */
export async function saveProject(
  _userId: string,
  projectData: LogicProject,
  existingId?: string | null
): Promise<SavedProject | null> {
  try {
    const projects = await fetchUserProjects();
    const now = new Date().toISOString();

    if (existingId) {
      const index = projects.findIndex(p => p.id === existingId);
      if (index === -1) return null;

      const updatedProject: SavedProject = {
        ...projects[index],
        name: projectData.name,
        description: projectData.description,
        data: projectData,
        updated_at: now,
      };

      projects[index] = updatedProject;
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      return updatedProject;
    } else {
      const newProject: SavedProject = {
        id: uuidv4(),
        user_id: 'anonymous',
        name: projectData.name,
        description: projectData.description,
        data: projectData,
        created_at: now,
        updated_at: now,
      };

      projects.push(newProject);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      return newProject;
    }
  } catch (err) {
    console.error('Save project error:', err);
    return null;
  }
}

/**
 * Delete a project by ID from localStorage.
 */
export async function deleteProject(id: string, _userId?: string): Promise<boolean> {
  try {
    const projects = await fetchUserProjects();
    const updated = projects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Delete project error:', err);
    return false;
  }
}

/**
 * Publish a project (make it public/community).
 */
export async function publishProject(
  _userId: string,
  projectData: LogicProject,
  projectId: string
): Promise<boolean> {
  try {
    const published = await fetchPublishedCircuits();
    const entry = {
      id: uuidv4(),
      project_id: projectId,
      user_id: 'anonymous',
      name: projectData.name,
      description: projectData.description,
      data: projectData,
      published_at: new Date().toISOString(),
    };
    
    published.push(entry);
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published));
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
  try {
    const data = localStorage.getItem(PUBLISHED_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Fetch published error:', err);
    return [];
  }
}
