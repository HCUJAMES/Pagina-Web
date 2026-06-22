import { Crown, LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminAccountBar({ onBackToPanel, onLogout }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-accent text-white">
      <div className="container-fluid">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <Crown className="w-3.5 h-3.5 text-primary-light" />
            <span className="text-[11px] font-medium tracking-wide opacity-80">
              Modo administrador
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToPanel}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-[11px] font-medium"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Panel de administración</span>
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
              title="Cerrar sesión"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
