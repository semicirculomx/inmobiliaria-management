import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, FileText, FileSignature, Building2, Image, Award, Receipt, Mail, Phone, Globe, Table, Menu, X } from 'lucide-react';
import logo from '../assets/images/Group-122.png';

type LayoutProps = {
  children: ReactNode;
  currentPage: 'home' | 'valoraciones' | 'planes' | 'contratos' | 'certificaciones' | 'facturas' | 'presupuestos' | 'gallery';
  onNavigate: (page: 'home' | 'valoraciones' | 'planes' | 'contratos' | 'certificaciones' | 'facturas' | 'presupuestos' | 'gallery') => void;
};

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { client, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home' as const, label: 'Inicio', icon: Home },
    { id: 'valoraciones' as const, label: 'Valoraciones', icon: FileText },
    { id: 'planes' as const, label: 'Planos y proyectos', icon: Building2 },
    { id: 'contratos' as const, label: 'Contrato y anexos', icon: FileSignature },
    { id: 'certificaciones' as const, label: 'Certificaciones', icon: Award },
    { id: 'facturas' as const, label: 'Facturas', icon: Receipt },
    { id: 'presupuestos' as const, label: 'Presupuestos', icon: Table },
    { id: 'gallery' as const, label: 'Galería proyecto', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav style={{background: '#004040;'}} className="shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                style={{color: '#fff'}}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#000]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#000]" />
                )}
              </button>
              <img src={logo} alt="Grupo Gersan" className="h-8 sm:h-10 w-auto" />
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-[#fff] font-medium">{client?.full_name}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-[#fff] hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex gap-6">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-24 space-y-6">
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

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Contacto
                </h3>
                <div className="space-y-3">
                  <a 
                    href="mailto:info@grupogersan.es"
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#004040] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>info@grupogersan.es</span>
                  </a>
                  <a 
                    href="tel:+34965453369"
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#004040] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>965 453 369</span>
                  </a>
                  <a 
                    href="https://wa.me/34683438079"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#004040] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>683 438 079</span>
                  </a>
                  <a 
                    href="https://grupogersan.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#004040] transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>grupogersan.com</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Sidebar Mobile */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
              <aside 
                className="absolute left-0 top-16 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 space-y-6">
                  {/* User info en mobile */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Bienvenido</p>
                    <p className="font-semibold text-[#000]">{client?.full_name}</p>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            setIsMobileMenuOpen(false);
                          }}
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

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Contacto
                    </h3>
                    <div className="space-y-3">
                      <a 
                        href="mailto:info@grupogersan.es"
                        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#004040] transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>info@grupogersan.es</span>
                      </a>
                      <a 
                        href="tel:+34965453369"
                        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#004040] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>965 453 369</span>
                      </a>
                      <a 
                        href="https://wa.me/34683438079"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#004040] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>683 438 079</span>
                      </a>
                      <a 
                        href="https://grupogersan.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#004040] transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>grupogersan.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          <main className="flex-1 w-full min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
