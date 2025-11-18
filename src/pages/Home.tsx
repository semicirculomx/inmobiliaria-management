import { useAuth } from '../contexts/AuthContext';
import { FileText, FileSignature, Building2, Image } from 'lucide-react';

type HomeProps = {
  onNavigate: (page: 'budgets' | 'contracts' | 'plans' | 'gallery') => void;
};

export default function Home({ onNavigate }: HomeProps) {
  const { client } = useAuth();

  const sections = [
    {
      id: 'budgets' as const,
      title: 'Presupuestos',
      description: 'Consulta tus presupuestos y descárgalos en PDF',
      icon: FileText,
      color: 'from-[#004040] to-[#006060]',
    },
    {
      id: 'contracts' as const,
      title: 'Contratos',
      description: 'Accede a tus contratos y documentos legales',
      icon: FileSignature,
      color: 'from-[#c08510] to-[#d09520]',
    },
    {
      id: 'plans' as const,
      title: 'Planos',
      description: 'Visualiza y descarga los planos de tu proyecto',
      icon: Building2,
      color: 'from-[#004040] to-[#006060]',
    },
    {
      id: 'gallery' as const,
      title: 'Galería Proyecto',
      description: 'Sigue el progreso de tu proyecto con fotos actualizadas',
      icon: Image,
      color: 'from-[#c08510] to-[#d09520]',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-[#000] mb-2">
          Bienvenido, {client?.full_name}
        </h1>
        <p className="text-lg text-gray-600">
          Accede a toda la documentación y el progreso de tu proyecto desde aquí
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8 text-left transform hover:-translate-y-1 duration-300"
            >
              <div className={`bg-gradient-to-br ${section.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#000] mb-2">{section.title}</h2>
              <p className="text-gray-600">{section.description}</p>
              <div className="mt-4 flex items-center text-[#004040] font-semibold group-hover:translate-x-2 transition-transform">
                Acceder
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
