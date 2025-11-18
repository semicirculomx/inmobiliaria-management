import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, FileText, FileSignature, Building2, Image } from 'lucide-react';
import logo from '../assets/images/Group-122.png';

type LayoutProps = {
  children: ReactNode;
  currentPage: 'home' | 'budgets' | 'contracts' | 'plans' | 'gallery';
  onNavigate: (page: 'home' | 'budgets' | 'contracts' | 'plans' | 'gallery') => void;
};

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { client, signOut } = useAuth();

  const menuItems = [
    { id: 'home' as const, label: 'Inicio', icon: Home },
    { id: 'budgets' as const, label: 'Presupuestos', icon: FileText },
    { id: 'contracts' as const, label: 'Contratos', icon: FileSignature },
    { id: 'plans' as const, label: 'Planos', icon: Building2 },
    { id: 'gallery' as const, label: 'Galería Proyecto', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Grupo Gersan" className="h-10 w-auto" />
              <span className="text-xl font-bold text-[#000]">grupogersan</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-[#000] font-medium">{client?.full_name}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-[#000] hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-8">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#004040] text-white shadow-md'
                          : 'text-[#000] hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
