import { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';

type SignatureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  contractTitle: string;
};

export default function SignatureModal({ isOpen, onClose, onSave, contractTitle }: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas with transparency
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configure drawing style
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const signatureDataUrl = canvas.toDataURL('image/png');
    onSave(signatureDataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#000]">Firmar Contrato</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">{contractTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Por favor, firme en el recuadro de abajo usando su dedo o mouse
            </p>
          </div>

          <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ background: 'repeating-conic-gradient(#f3f4f6 0% 25%, white 0% 50%) 50% / 20px 20px' }}>
            <canvas
              ref={canvasRef}
              width={700}
              height={300}
              className="w-full cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mt-4 sm:mt-6">
            <button
              onClick={clearSignature}
              className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors order-2 sm:order-1"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Limpiar</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={saveSignature}
                disabled={!hasSignature}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                  hasSignature
                    ? 'bg-[#c08510] text-white hover:bg-[#a06d0d]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Firmar Contrato</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
