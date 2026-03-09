import React, { useState } from 'react';
import { Calculator, CreditCard, Wallet } from 'lucide-react';

interface Props {
  productData: any;
  analysisData: any;
  onNext: (data: any) => void;
}

export default function FinancialImpact({ productData, analysisData, onNext }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'installments'>('cash');
  const [installments, setInstallments] = useState(3);
  const [interestRate, setInterestRate] = useState(2.5);

  const productInfo = productData || analysisData || {};
  const rawPrice = analysisData?.precio_estimado ?? productData?.precio_estimado ?? productInfo?.precio_estimado ?? productInfo?.productInfo?.precio_estimado;
  const price = typeof rawPrice === 'number' && rawPrice > 0
    ? rawPrice
    : (typeof rawPrice === 'string' ? parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0 : 0);
  
  const calculateFinancials = () => {
    let totalCost = price;
    let monthlyPayment = 0;
    let totalInterest = 0;

    if (paymentMethod === 'credit') {
      totalCost = price * 1.3;
      totalInterest = totalCost - price;
    } else if (paymentMethod === 'installments') {
      const monthlyRate = interestRate / 100;
      monthlyPayment = (price * monthlyRate * Math.pow(1 + monthlyRate, installments)) / 
                      (Math.pow(1 + monthlyRate, installments) - 1);
      totalCost = monthlyPayment * installments;
      totalInterest = totalCost - price;
    }

    return {
      basePrice: price,
      totalCost: Math.round(totalCost * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      paymentMethod,
      installments: paymentMethod === 'installments' ? installments : 0,
      interestRate: paymentMethod !== 'cash' ? interestRate : 0,
    };
  };

  const financials = calculateFinancials();

  const generateRecommendation = () => {
    if (paymentMethod === 'cash') {
      return '💰 Pagar en efectivo es la opción más económica. No pagarás intereses.';
    } else if (financials.totalInterest > price * 0.2) {
      return `⚠️ Los intereses son muy altos (Q${financials.totalInterest.toLocaleString()}). Considera pagar en efectivo o buscar financiamiento más barato.`;
    } else if (paymentMethod === 'installments' && installments <= 6) {
      return `✅ ${installments} cuotas son razonables. Pagarás Q${financials.monthlyPayment.toLocaleString()} mensuales.`;
    }
    return 'ℹ️ Evalúa si realmente necesitas financiar esta compra.';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <Calculator className="text-blue-600" />
        Impacto Financiero
      </h2>

      {price <= 0 && (
        <p className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          No se encontró un precio en el análisis. Vuelve al paso anterior para analizar el producto.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-1">Precio base (del análisis)</p>
          <p className="text-2xl font-bold text-blue-800">Q{price > 0 ? price.toLocaleString() : '—'}</p>
        </div>
        
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 mb-1">Costo total</p>
          <p className="text-2xl font-bold text-green-800">
            Q{financials.totalCost.toLocaleString()}
          </p>
        </div>
        
        {financials.totalInterest > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 mb-1">Intereses totales</p>
            <p className="text-2xl font-bold text-red-800">
              Q{financials.totalInterest.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Método de pago
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 cursor-pointer transition ${
                paymentMethod === 'cash'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              <Wallet className={paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-600'} size={24} />
              <span className={`font-medium ${paymentMethod === 'cash' ? 'text-blue-700' : 'text-gray-700'}`}>Efectivo</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('credit')}
              className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 cursor-pointer transition ${
                paymentMethod === 'credit'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              <CreditCard className={paymentMethod === 'credit' ? 'text-blue-600' : 'text-gray-600'} size={24} />
              <span className={`font-medium ${paymentMethod === 'credit' ? 'text-blue-700' : 'text-gray-700'}`}>Crédito</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('installments')}
              className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 cursor-pointer transition ${
                paymentMethod === 'installments'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              <Calculator className={paymentMethod === 'installments' ? 'text-blue-600' : 'text-gray-600'} size={24} />
              <span className={`font-medium ${paymentMethod === 'installments' ? 'text-blue-700' : 'text-gray-700'}`}>Cuotas</span>
            </button>
          </div>
        </div>

        {paymentMethod === 'installments' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de cuotas: {installments}
              </label>
              <input
                type="range"
                min="3"
                max="24"
                step="3"
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>3 cuotas</span>
                <span>12 cuotas</span>
                <span>24 cuotas</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de interés mensual: {interestRate}%
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>1%</span>
                <span>3%</span>
                <span>5%</span>
              </div>
            </div>

            {financials.monthlyPayment > 0 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700 mb-1">Pago mensual estimado</p>
                <p className="text-2xl font-bold text-purple-800">
                  Q{financials.monthlyPayment.toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Recomendación financiera</h3>
        <p className="text-yellow-800">{generateRecommendation()}</p>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          const financialData = {
            financials,
            recommendation: generateRecommendation(),
          };
          onNext(financialData);
        }}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer mt-6"
        type="button"
      >
        Continuar a la recomendación de compra
      </button>
    </div>
  );
}