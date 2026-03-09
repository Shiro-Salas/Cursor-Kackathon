import React from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';

interface Props {
  data: any;
  onNext: () => void;
}

export default function Recommendations({ data, onNext }: Props) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-center text-gray-700">No hay datos disponibles</p>
      </div>
    );
  }

  const financialRecommendation = data?.financialData?.recommendation || "Analizando tu compra...";
  const productName = data?.nombre || data?.productInfo?.nombre || "Producto";
  const price = data?.precio_estimado || data?.productInfo?.precio_estimado || 0;
  const risks = data?.riesgos_detectados || [];

  const getRecommendationStyle = () => {
    if (risks.length > 0) {
      return {
        icon: AlertCircle,
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800',
        textColor: 'text-red-700',
        title: '⚠️ Compra con precaución'
      };
    }
    
    if (data?.confiabilidad_vendedor === 'alta' && data?.precio_justo) {
      return {
        icon: ThumbsUp,
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        titleColor: 'text-green-800',
        textColor: 'text-green-700',
        title: '✅ ¡Excelente opción!'
      };
    }
    
    return {
      icon: ThumbsDown,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
      title: '📊 Evalúa otras opciones'
    };
  };

  const style = getRecommendationStyle();
  const Icon = style.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Recomendación de Compra</h2>
      
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 text-lg mb-2">{productName}</h3>
        <p className="text-2xl font-bold text-blue-700">Q{price.toLocaleString()}</p>
      </div>

      <div className={`mb-6 p-6 rounded-lg border ${style.bg} ${style.border}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${style.iconBg}`}>
            <Icon className={style.iconColor} size={32} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${style.titleColor} mb-2`}>
              {style.title}
            </h3>
            <p className={style.textColor}>
              {style.title === '✅ ¡Excelente opción!' 
                ? 'Producto confiable con precio justo.' 
                : style.title === '⚠️ Compra con precaución'
                ? 'Se detectaron algunos riesgos. Revisa las advertencias.'
                : 'Podrías encontrar mejores alternativas.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Análisis Financiero</h3>
        <p className="text-blue-800">{financialRecommendation}</p>
      </div>

      {risks.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Puntos a considerar</h3>
          <ul className="list-disc list-inside text-red-700">
            {risks.map((riesgo: string, index: number) => (
              <li key={index} className="text-red-700">{riesgo}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
      >
        Ver alternativas disponibles
      </button>
    </div>
  );
}