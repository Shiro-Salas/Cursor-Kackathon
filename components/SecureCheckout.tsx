import React, { useState } from 'react';
import { Shield, Lock, CreditCard, Wallet } from 'lucide-react';

interface Props {
  productData: any;
  onComplete: () => void;
}

export default function SecureCheckout({ productData, onComplete }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onComplete();
    }, 2000);
  };

  // Asegurar que productData existe
  const productInfo = productData || {};
  const productName = productInfo.nombre || 'UPS Con Regulación De Tensión, 750VA, 6 Salidas, NT-751 Forza';
  const seller = productInfo.vendedor || 'ElectroShop';
  const price = productInfo.precio || productInfo.precio_estimado || 344.25;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-green-600" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Compra 100% Segura</h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lock className="text-green-600 flex-shrink-0" size={20} />
          <div>
            <p className="font-medium text-green-800">Pago protegido</p>
            <p className="text-sm text-green-700">
              Tu dinero está seguro. Solo lo liberaremos cuando confirmes que recibiste el producto.
            </p>
          </div>
        </div>
      </div>

      {/* Resumen de la compra */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Resumen de la compra</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Producto:</span>
            <span className="font-medium text-gray-800 text-right max-w-md">{productName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Vendedor:</span>
            <span className="font-medium text-gray-800">{seller}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Precio:</span>
            <span className="font-bold text-blue-700 text-xl">Q{price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Protección de compra:</span>
            <span className="text-green-700 font-medium">Incluida ✓</span>
          </div>
        </div>
      </div>

      {/* Método de pago */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Método de pago
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition ${
              paymentMethod === 'card'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <CreditCard className={paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-600'} size={24} />
            <span className={`font-medium ${paymentMethod === 'card' ? 'text-blue-700' : 'text-gray-700'}`}>
              Tarjeta
            </span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('wallet')}
            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition ${
              paymentMethod === 'wallet'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <Wallet className={paymentMethod === 'wallet' ? 'text-blue-600' : 'text-gray-600'} size={24} />
            <span className={`font-medium ${paymentMethod === 'wallet' ? 'text-blue-700' : 'text-gray-700'}`}>
              PAQ Wallet
            </span>
          </button>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de tarjeta
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vencimiento
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'wallet' && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-purple-800 text-center">
            Serás redirigido a PAQ Wallet para completar el pago de forma segura.
          </p>
        </div>
      )}

      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Acepto los términos y condiciones de compra segura. Entiendo que el pago se retendrá hasta confirmar la recepción del producto.
          </span>
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={!agreed || processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando...</span>
          </>
        ) : (
          'Pagar ahora'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Tus datos están protegidos con encriptación SSL. No guardamos información de tu tarjeta.
      </p>
    </div>
  );
}