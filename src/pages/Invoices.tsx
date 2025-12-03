import { useEffect, useState } from 'react';
import { strapiClient, StrapiBudget } from '../lib/strapi';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Download, Calendar } from 'lucide-react';

export default function Valoraciones() {
  const [valoraciones, setValoraciones] = useState<StrapiBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadValoraciones = async () => {
      try {
        const response = await strapiClient.get('facturas', {
          params: {
            'filters[clients][$eq]': user.id,
            'populate': 'pdf',
            'sort[0]': 'createdAt:desc',
          },
        });

        console.log('Facturas response:', response);

        if (response.data) {
          setValoraciones(response.data);
        }
      } catch (error) {
        console.error('Error loading facturas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadValoraciones();
  }, [user]);  const handleDownload = async (valoracion: StrapiBudget) => {
    try {
      const pdfUrl = valoracion.pdf?.url || valoracion.pdf_url;
      
      if (!pdfUrl) {
        alert('No hay PDF disponible para descargar');
        return;
      }

      const fullUrl = pdfUrl.startsWith('http') 
        ? pdfUrl 
        : `https://dashboard.grupogersan360.com${pdfUrl}`;

      const a = document.createElement('a');
      a.href = fullUrl;
      a.download = `${valoracion.title}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading valoracion:', error);
      alert('Error al descargar el archivo');
    }
  };

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
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#004040]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000]">Valoraciones</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Todas tus valoraciones disponibles para consulta y descarga
        </p>
      </div>

      {valoraciones.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#000] mb-2">
            No hay valoraciones disponibles
          </h3>
          <p className="text-gray-600">
            Cuando grupogersan suba valoraciones, aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {valoraciones.map((valoracion) => (
            <div
              key={valoracion.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                  <div className="bg-[#004040]/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#004040]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#000] mb-1 sm:mb-2 break-words">
                      {valoracion.title}
                    </h3>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(valoracion.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(valoracion)}
                  className="flex items-center justify-center space-x-2 bg-[#c08510] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#a06d0d] transition-colors font-semibold text-sm sm:text-base w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Descargar PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
