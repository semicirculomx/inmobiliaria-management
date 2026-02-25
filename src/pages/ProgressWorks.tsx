import { useEffect, useState } from 'react';
import { strapiClient } from '../lib/strapi';
import { useAuth } from '../contexts/AuthContext';
import { Hammer, Calendar } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

type ObraProgreso = {
  id: number;
  documentId: string;
  titulo: string;
  porcentaje: number;
  descripcion?: string;
  createdAt: string;
};

export default function ProgressWorks() {
  const [obras, setObras] = useState<ObraProgreso[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadObras = async () => {
      try {
        const response = await strapiClient.get('progresos', {
          params: {
            'filters[clients][$eq]': user.id,
            'sort[0]': 'createdAt:desc',
          },
        });

        console.log('Obras progreso response:', response);

        if (response.data) {
          setObras(response.data);
        }
      } catch (error) {
        console.error('Error loading obras progreso:', error);
      } finally {
        setLoading(false);
      }
    };

    loadObras();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004040]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-2">
          <Hammer className="w-6 h-6 sm:w-8 sm:h-8 text-[#004040]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000]">Estado de Obras</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Sigue el progreso de tus obras en tiempo real
        </p>
      </div>

      {obras.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
          <Hammer className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-[#000] mb-2">
            No hay obras en progreso
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Cuando grupogersan inicie una obra, aparecerá aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {obras.map((obra) => (
            <div
              key={obra.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6"
            >
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#000] break-words">
                      {obra.titulo}
                    </h3>
                    {obra.descripcion && (
                      <p className="text-sm sm:text-base text-gray-600 mt-1">
                        {obra.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 flex-shrink-0">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>{new Date(obra.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>

                <ProgressBar percentage={obra.porcentaje} />
              </div>

              {/* Estado descriptivo */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Estado:</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#004040]">
                    {obra.porcentaje < 33
                      ? 'Iniciada'
                      : obra.porcentaje < 66
                      ? 'En progreso'
                      : obra.porcentaje < 100
                      ? 'Casi completada'
                      : 'Completada'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
