import { useEffect, useState } from 'react';
import { strapiClient, StrapiContract } from '../lib/strapi';
import { FileSignature, Download, Calendar } from 'lucide-react';

export default function Contracts() {
  const [contracts, setContracts] = useState<StrapiContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const response = await strapiClient.get('contratos', {
        params: {
          'populate[0]': 'client',
          'populate[1]': 'pdf',
          'sort[0]': 'createdAt:desc',
        },
      });

      console.log('Contracts response:', response);

      if (response.data) {
        setContracts(response.data);
      }
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (contract: StrapiContract) => {
    try {
      const pdfUrl = contract.pdf?.url || contract.pdf_url;
      
      if (!pdfUrl) {
        alert('No hay PDF disponible para descargar');
        return;
      }

      const fullUrl = pdfUrl.startsWith('http') 
        ? pdfUrl 
        : `https://dashboard.grupogersan360.com${pdfUrl}`;

      const a = document.createElement('a');
      a.href = fullUrl;
      a.download = `${contract.title}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading contract:', error);
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
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-2">
          <FileSignature className="w-8 h-8 text-[#004040]" />
          <h1 className="text-3xl font-bold text-[#000]">Contratos</h1>
        </div>
        <p className="text-gray-600">
          Todos tus contratos disponibles para consulta y descarga
        </p>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileSignature className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay contratos disponibles
          </h3>
          <p className="text-gray-600">
            Cuando la inmobiliaria suba contratos, aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-[#004040]/10 p-3 rounded-lg">
                    <FileSignature className="w-6 h-6 text-[#004040]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#000] mb-2">
                      {contract.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(contract.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(contract)}
                  className="flex items-center space-x-2 bg-[#c08510] text-white px-6 py-3 rounded-lg hover:bg-[#a06d0d] transition-colors font-semibold"
                >
                  <Download className="w-5 h-5" />
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
