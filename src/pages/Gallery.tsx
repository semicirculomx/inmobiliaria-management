import { useEffect, useState } from 'react';
import { strapiClient, StrapiProjectPhoto } from '../lib/strapi';
import { useAuth } from '../contexts/AuthContext';
import { Image as ImageIcon, Calendar } from 'lucide-react';

type GalleryCategory = 'estado-inicial' | 'avance-obra' | 'fotos-finales';

export default function Gallery() {
  const [photos, setPhotos] = useState<StrapiProjectPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<StrapiProjectPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('estado-inicial');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadPhotos = async () => {
      try {
        const response = await strapiClient.get('galerias', {
          params: {
            'filters[client][$eq]': user.id,
            'populate': '*',
            'sort[0]': 'createdAt:desc',
          },
        });

      console.log('Photos response:', response);

      if (response.data) {
        // Flatten galleries to individual photos
        type GalleryItem = {
          id: number;
          title?: string;
          category?: string;
          photos?: Array<{
            id: number;
            url: string;
            name: string;
            caption?: string;
            createdAt: string;
          }>;
          createdAt: string;
          client?: unknown;
        };

        const allPhotos: StrapiProjectPhoto[] = [];
        (response.data as GalleryItem[]).forEach((gallery) => {
          if (gallery.photos && Array.isArray(gallery.photos)) {
            gallery.photos.forEach((photo) => {
              allPhotos.push({
                ...photo,
                galleryId: gallery.id,
                galleryCategory: gallery.category || 'estado-inicial',
                galleryCreatedAt: gallery.createdAt,
                client: gallery.client,
              } as unknown as StrapiProjectPhoto);
            });
          }
        });
        setPhotos(allPhotos);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  loadPhotos();
}, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004040]"></div>
      </div>
    );
  }

  const categories = [
    { id: 'estado-inicial' as const, label: 'Estado inicial' },
    { id: 'avance-obra' as const, label: 'Avance Obra' },
    { id: 'fotos-finales' as const, label: 'Fotos Finales' },
  ];

  const filteredPhotos = photos.filter((photo) => {
    const photoData = photo as unknown as { galleryCategory?: string };
    return photoData.galleryCategory === selectedCategory;
  });

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-2">
            <ImageIcon className="w-8 h-8 text-[#004040]" />
            <h1 className="text-3xl font-bold text-[#000]">Galería del Proyecto</h1>
          </div>
          <p className="text-gray-600">
            Sigue el progreso de tu proyecto con las fotos más recientes
          </p>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#004040] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#000] mb-2">
              No hay fotos disponibles en esta categoría
            </h3>
            <p className="text-gray-600">
              Cuando grupogersan suba fotos de {categories.find(c => c.id === selectedCategory)?.label.toLowerCase()}, aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => {
              // Get image URL from photo object
              const photoData = photo as unknown as { url?: string; name?: string; caption?: string; createdAt: string; id: number };
              const imageUrl = photoData.url;
              const fullImageUrl = imageUrl?.startsWith('http') 
                ? imageUrl 
                : imageUrl 
                  ? `https://dashboard.grupogersan360.com${imageUrl}`
                  : '';
              
              return (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {fullImageUrl ? (
                      <img
                        src={fullImageUrl}
                        alt={photoData.name || 'Foto del proyecto'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {photoData.caption && (
                      <p className="text-[#000] font-medium mb-2">{photoData.caption}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(photoData.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPhoto && (() => {
        const photoData = selectedPhoto as unknown as { url?: string; name?: string; caption?: string; createdAt: string };
        const imageUrl = photoData.url;
        const fullImageUrl = imageUrl?.startsWith('http')
          ? imageUrl
          : imageUrl
            ? `https://dashboard.grupogersan360.com${imageUrl}`
            : '';
        
        return (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-6xl w-full">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl font-light"
              >
                ×
              </button>
              {fullImageUrl && (
                <img
                  src={fullImageUrl}
                  alt={photoData.name || 'Foto del proyecto'}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {photoData.caption && (
                <div className="mt-4 bg-white rounded-lg p-4">
                  <p className="text-[#000] font-medium">{photoData.caption}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(photoData.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}
