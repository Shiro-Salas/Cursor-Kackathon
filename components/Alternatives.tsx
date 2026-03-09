"use client";

import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface Props {
  productData: any;
  originalProduct?: { nombre?: string; precio_estimado?: number };
  marketplaces?: string[];
  alternatives: any[];
  onSelect: (product: any) => void;
  onCheckout: () => void;
}

const MARKETPLACE_INFO: Record<string, { vendedor: string; envio: string; garantia: string; confiabilidad: string; rating: number; descripcion: string }> = {
  'MercadoLibre': { vendedor: 'Vendedores verificados MercadoLibre', envio: 'Varía por vendedor', garantia: 'Garantía MercadoLibre', confiabilidad: 'alta', rating: 4.5, descripcion: 'Disponible en MercadoLibre Guatemala. Revisa la reputación del vendedor antes de comprar.' },
  'Amazon': { vendedor: 'Sellers Amazon', envio: 'Envío internacional', garantia: 'Garantía del vendedor', confiabilidad: 'alta', rating: 4.6, descripcion: 'Importación desde Amazon. Considera costos de envío y aduana.' },
  'Kirolos': { vendedor: 'Kirolos Guatemala', envio: 'Gratis en compras mayores', garantia: '12 meses', confiabilidad: 'alta', rating: 4.7, descripcion: 'Tienda especializada en Guatemala. Productos con garantía oficial.' },
  'Walmart': { vendedor: 'Walmart Guatemala', envio: 'Gratis en tienda', garantia: 'Política de devolución', confiabilidad: 'alta', rating: 4.5, descripcion: 'Disponible en Walmart Guatemala. Recoge en tienda o envío.' },
  'La Curacao': { vendedor: 'La Curacao', envio: 'A domicilio', garantia: 'Garantía La Curacao', confiabilidad: 'alta', rating: 4.4, descripcion: 'Crédito disponible. Cuotas sin interés en promociones.' },
  'Elektra': { vendedor: 'Elektra Guatemala', envio: 'A domicilio', garantia: 'Garantía Elektra', confiabilidad: 'alta', rating: 4.4, descripcion: 'Financiamiento disponible. Promociones frecuentes.' },
  'PriceSmart': { vendedor: 'PriceSmart', envio: 'Recoge en club', garantia: 'Garantía del fabricante', confiabilidad: 'alta', rating: 4.6, descripcion: 'Membresía requerida. Precios mayoristas.' },
  'Gessa': { vendedor: 'Gessa', envio: 'Envío nacional', garantia: 'Varía por producto', confiabilidad: 'alta', rating: 4.5, descripcion: 'Tienda de tecnología en Guatemala.' },
  'Intelec': { vendedor: 'Intelec', envio: 'Envío nacional', garantia: 'Garantía oficial', confiabilidad: 'alta', rating: 4.5, descripcion: 'Especialistas en tecnología. Servicio técnico disponible.' },
  'Max': { vendedor: 'Max', envio: 'A domicilio', garantia: 'Política del fabricante', confiabilidad: 'media', rating: 4.3, descripcion: 'Electrónica y electrodomésticos en Guatemala.' },
};

export default function Alternatives({ productData, originalProduct, marketplaces = [], alternatives = [], onSelect, onCheckout }: Props) {
  const baseNombre = originalProduct?.nombre || productData?.nombre || 'Producto';
  const basePrecio = originalProduct?.precio_estimado ?? productData?.precio_estimado ?? 1000;
  const [detalleAbierto, setDetalleAbierto] = useState<any>(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const marketplacesUnicos = [...new Set(marketplaces.map((m: string) => String(m).trim()))].filter(Boolean).slice(0, 6);
  const marketplacesParaAlternativas = marketplacesUnicos.length > 0 ? marketplacesUnicos : ['MercadoLibre', 'Amazon', 'Kirolos'];
  const preciosVariacion = [0.95, 0.92, 1.02, 0.88, 1.05, 0.97];

  const alternativasDesdeMarketplaces = marketplacesParaAlternativas.map((mp, index) => {
    const info = MARKETPLACE_INFO[mp] || {
      vendedor: mp,
      envio: 'Consultar',
      garantia: 'Varía',
      confiabilidad: 'media',
      rating: 4.2,
      descripcion: `Disponible en ${mp}. Verifica condiciones con el vendedor.`,
    };
    const factorPrecio = preciosVariacion[index % preciosVariacion.length];
    return {
      id: index + 1,
      nombre: `${baseNombre} - ${mp}`,
      precio: Math.round(basePrecio * factorPrecio),
      vendedor: info.vendedor,
      confiabilidad: info.confiabilidad,
      marketplace: mp,
      rating: info.rating,
      envio: info.envio,
      garantia: info.garantia,
      descripcion: info.descripcion,
    };
  });

  const isSelected = (alt: any) => {
    if (!productData) return false;
    return (alt.id && productData.id === alt.id) || productData.nombre === alt.nombre;
  };

  const baseAlternativas = alternatives.length > 0 ? alternatives : alternativasDesdeMarketplaces.slice(0, 3);
  const opcionesAdicionales = alternatives.length > 0 ? [] : alternativasDesdeMarketplaces.slice(3);
  const displayAlternatives = mostrarTodas || alternatives.length > 0 
    ? (alternatives.length > 0 ? alternatives : alternativasDesdeMarketplaces)
    : baseAlternativas;

  const getReliabilityBadge = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'alta':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Alta confianza</span>;
      case 'media':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Confianza media</span>;
      case 'baja':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Baja confianza</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Confianza no especificada</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Mejores Alternativas</h2>
      
      <div className="space-y-4 mb-8">
        {displayAlternatives.map((alt) => {
          const selected = isSelected(alt);
          return (
          <div
            key={alt.id}
            className={`rounded-lg p-4 transition ${
              selected
                ? 'border-2 border-green-500 bg-green-50/50 shadow-md'
                : 'border border-gray-200 hover:shadow-md bg-white'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg text-gray-900">{alt.nombre}</h3>
                  {selected && (
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                      Seleccionada
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{alt.marketplace} • {alt.vendedor}</p>
              </div>
              {getReliabilityBadge(alt.confiabilidad)}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-600 font-medium">Precio</p>
                <p className="text-xl font-bold text-blue-600">Q{alt.precio?.toLocaleString()}</p>
                {alt.precio < basePrecio && (
                  <p className="text-xs text-green-600">
                    Ahorras Q{(basePrecio - (alt.precio || 0)).toLocaleString()}
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-xs text-gray-600 font-medium">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                  <span className="text-gray-900 font-medium">{alt.rating}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 font-medium">Envío</p>
                <p className="text-sm text-gray-900">{alt.envio}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 font-medium">Garantía</p>
                <p className="text-sm text-gray-900">{alt.garantia}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => onSelect(alt)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Seleccionar esta opción
              </button>
              <button
                onClick={() => setDetalleAbierto(alt)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Ver detalles
              </button>
            </div>
          </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <button
          onClick={onCheckout}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
        >
          Proceder a la compra segura
        </button>
        {opcionesAdicionales.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => setMostrarTodas(!mostrarTodas)}
              className="px-6 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg font-medium"
            >
              {mostrarTodas ? 'Ver menos opciones' : `Ver más opciones (${opcionesAdicionales.length} adicionales)`}
            </button>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {detalleAbierto && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setDetalleAbierto(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{detalleAbierto.nombre}</h3>
              <button
                onClick={() => setDetalleAbierto(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Cerrar"
              >
                <X className="text-gray-600" size={20} />
              </button>
            </div>
            <div className="space-y-4 text-gray-900">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Precio</span>
                <span className="text-xl font-bold text-blue-600">Q{detalleAbierto.precio?.toLocaleString()}</span>
              </div>
              {detalleAbierto.precio < basePrecio && (
                <p className="text-sm text-green-600 font-medium">
                  Ahorras Q{(basePrecio - (detalleAbierto.precio || 0)).toLocaleString()} respecto al producto original
                </p>
              )}
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Vendedor</p>
                <p className="text-gray-900">{detalleAbierto.vendedor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Marketplace</p>
                <p className="text-gray-900">{detalleAbierto.marketplace}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={18} />
                <span className="font-medium">{detalleAbierto.rating} / 5</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Envío</p>
                  <p className="text-gray-900">{detalleAbierto.envio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Garantía</p>
                  <p className="text-gray-900">{detalleAbierto.garantia}</p>
                </div>
              </div>
              {detalleAbierto.descripcion && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Descripción</p>
                  <p className="text-gray-900">{detalleAbierto.descripcion}</p>
                </div>
              )}
              {getReliabilityBadge(detalleAbierto.confiabilidad)}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  onSelect(detalleAbierto);
                  setDetalleAbierto(null);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Seleccionar esta opción
              </button>
              <button
                onClick={() => setDetalleAbierto(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}