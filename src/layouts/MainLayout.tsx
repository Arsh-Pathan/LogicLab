import { Outlet } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';

export default function MainLayout() {
  const theme = useUIStore((s: any) => s.theme);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#02040a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Outlet />
    </div>
  );
}
