import { useAuth } from '../contexts/AuthContext';
import { FileText, FileSignature, Building2, Image, Award, Receipt, Table } from 'lucide-react';

type HomeProps = {
  onNavigate: (page: 'valoraciones' | 'planes' | 'contratos' | 'certificaciones' | 'facturas' | 'presupuestos' | 'gallery') => void;
};

export default function Home({ onNavigate }: HomeProps) {
  const { client } = useAuth();

  const sections = [
    {
      id: 'valoraciones' as const,
      title: 'Valoraciones',
      description: 'Consulta tus valoraciones y descárgalas en PDF',
      icon: FileText,
      color: 'from-[#004040] to-[#006060]',
    },
    {
      id: 'planes' as const,
      title: 'Planos y proyectos',
      description: 'Visualiza y descarga los planos de tu proyecto',
      icon: Building2,
      color: 'from-[#c08510] to-[#d09520]',
    },
    {
      id: 'contratos' as const,
      title: 'Contrato y anexos',
      description: 'Accede a tus contratos y documentos legales',
      icon: FileSignature,
      color: 'from-[#004040] to-[#006060]',
    },
    {
      id: 'certificaciones' as const,
      title: 'Certificaciones',
      description: 'Consulta todas las certificaciones del proyecto',
      icon: Award,
      color: 'from-[#c08510] to-[#d09520]',
    },
    {
      id: 'facturas' as const,
      title: 'Facturas',
      description: 'Accede y descarga tus facturas',
      icon: Receipt,
      color: 'from-[#004040] to-[#006060]',
    },
    {
      id: 'presupuestos' as const,
      title: 'Presupuestos',
      description: 'Consulta y descarga tus presupuestos',
      icon: Table,
      color: 'from-[#c08510] to-[#d09520]',
    },
    {
      id: 'gallery' as const,
      title: 'Galería proyecto',
      description: 'Sigue el progreso de tu proyecto con fotos actualizadas',
      icon: Image,
      color: 'from-[#c08510] to-[#d09520]',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000] mb-2">
          Bienvenido, {client?.full_name}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Accede a toda la documentación y el progreso de tu proyecto desde aquí
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all p-6 sm:p-8 text-left transform hover:-translate-y-1 duration-300"
            >
              <div className={`bg-gradient-to-br ${section.color} w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#000] mb-2">{section.title}</h2>
              <p className="text-sm sm:text-base text-gray-600">{section.description}</p>
              <div className="mt-3 sm:mt-4 flex items-center text-[#004040] font-semibold group-hover:translate-x-2 transition-transform">
                <span className="text-sm sm:text-base">Acceder</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
