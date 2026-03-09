import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Props {
  data: any;
  onNext: () => void;
}

export default function ProductAnalysis({ data, onNext }: Props) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-center text-gray-700">No hay datos disponibles</p>
      </div>
    );
  }

  const nombre = typeof data.nombre === 'string' ? data.nombre : 'No especificado';
  const precioEstimado = typeof data.precio_estimado === 'number' ? data.precio_estimado : 0;
  const vendedor = typeof data.vendedor === 'string' ? data.vendedor : 'No especificado';
  const confiabilidad = typeof data.confiabilidad_vendedor === 'string' ? data.confiabilidad_vendedor : 'media';
  const precioJusto = typeof data.precio_justo === 'boolean' ? data.precio_justo : false;
  const riesgosDetectados = Array.isArray(data.riesgos_detectados) ? data.riesgos_detectados : [];
  const marketplaces = Array.isArray(data.marketplaces_disponibles) ? data.marketplaces_disponibles : [];

  const getReliabilityColor = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'alta': return 'text-green-700 bg-green-100';
      case 'media': return 'text-yellow-700 bg-yellow-100';
      case 'baja': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getReliabilityText = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'alta': return 'ALTA';
      case 'media': return 'MEDIA';
      case 'baja': return 'BAJA';
      default: return 'NO ESPECIFICADO';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Análisis del Producto</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Producto</label>
            <p className="text-xl font-semibold text-gray-800">{nombre}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600">Precio en mercado</label>
            <p className="text-2xl font-bold text-blue-700">
              Q{precioEstimado.toLocaleString()}
            </p>
            {data.precio_extraido && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✓ Precio extraído directamente de la página
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Vendedor</label>
            <p className="text-lg font-semibold text-gray-800">{vendedor}</p>
          </div>
          
          <div>
            <label className="text-sm text-gray-600">Confiabilidad</label>
            <span className={`inline-block px-3 py-1 rounded-full font-medium ${getReliabilityColor(confiabilidad)}`}>
              {getReliabilityText(confiabilidad)}
            </span>
          </div>

          <div>
            <label className="text-sm text-gray-600">Precio justo</label>
            <div className="flex items-center gap-2">
              {precioJusto ? (
                <>
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-green-700 font-medium">Sí, el precio es adecuado</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="text-yellow-600" size={20} />
                  <span className="text-yellow-700 font-medium">El precio no es justo</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {riesgosDetectados.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
            <AlertTriangle size={20} />
            Riesgos detectados
          </h3>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {riesgosDetectados.map((riesgo: string, index: number) => (
              <li key={index} className="text-red-700">{String(riesgo)}</li>
            ))}
          </ul>
        </div>
      )}

      {data.analisis && typeof data.analisis === 'string' && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info size={20} />
            Análisis detallado
          </h3>
          <p className="text-blue-800">{data.analisis}</p>
        </div>
      )}

      {marketplaces.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">Disponible en:</h3>
          <div className="flex flex-wrap gap-2">
            {marketplaces.map((mp: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {String(mp)}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Continuar al análisis financiero
      </button>
    </div>
  );
}