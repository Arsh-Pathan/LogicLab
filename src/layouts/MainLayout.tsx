import { Outlet } from 'react-router-dom';

/**
 * MainLayout
 * High-Prestige Institutional Wrapper (v12)
 * Provides the global structural lattice for all academy terminal ports.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen bg-app text-main selection:bg-main selection:text-app">
      {/* 
          Lattice Container: 
          Individual pages manage their own overflow and navigation layers 
          to support cinematic transitions and technical overlays.
      */}
      <Outlet />
    </div>
  );
}
