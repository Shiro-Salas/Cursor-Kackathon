"use client";

import { useState } from "react";
import ProductAnalysis from "@/components/ProductAnalysis";
import FinancialImpact from "@/components/FinancialImpact";
import Recommendations from "@/components/Recommendations";
import Alternatives from "@/components/Alternatives";
import SecureCheckout from "@/components/SecureCheckout";

export default function Page() {
  const [step, setStep] = useState(1);
  const [productData, setProductData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [productInput, setProductInput] = useState("");
  const [inputType, setInputType] = useState<"name" | "url">("name");

  const analyzeProduct = async () => {
    if (!productInput.trim()) return;

    setLoading(true);
    setStep(1);

    try {
      const res = await fetch("/api/analyze-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: productInput.trim(),
          inputType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.bloqueado || res.status === 403) {
          alert(data.error || "No podemos analizar esta búsqueda. El contenido no es apto para todo público.");
          setProductInput("");
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Error al analizar");
      }

      console.log("Datos del producto:", data);
      setAnalysisResult(data);
      setProductData(data);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Error al analizar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleFinancialAnalysis = (financialData: any) => {
    console.log("Recibiendo datos financieros en page:", financialData);
    const updatedResult = { 
      ...analysisResult, 
      financialData: financialData,
      productInfo: productData
    };
    setAnalysisResult(updatedResult);
    setStep(4);
  };

  const handleSelectAlternative = (alternative: any) => {
    console.log("Alternativa seleccionada:", alternative);
    setProductData(alternative);
    setStep(5);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-white">SmartBuy GT</h1>
          <p className="text-xl opacity-90 text-white">
            Tu asistente inteligente para compras seguras en Guatemala
          </p>
        </div>
      </header>

      {/* Progress Bar - step 1=input, step 2=Análisis, 3=Impacto, 4=Recomendación, 5=Alternativas, 6=Compra */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-start w-full">
          {[
            { num: 1, label: "Análisis" },
            { num: 2, label: "Impacto Financiero" },
            { num: 3, label: "Recomendación" },
            { num: 4, label: "Alternativas" },
            { num: 5, label: "Compra Segura" },
          ].map(({ num, label }) => {
            const barraStep = step <= 1 ? 0 : step - 1;
            const activo = barraStep >= num;
            const lineaIzqCompleta = num > 1 && barraStep >= num;
            const lineaDerCompleta = num < 5 && barraStep > num;
            return (
              <div key={num} className="flex-1 flex flex-col items-center min-w-0">
                <div className="flex items-center w-full">
                  <div className={`flex-1 h-1 min-w-0 ${num > 1 ? (lineaIzqCompleta ? "bg-blue-600" : "bg-gray-300") : "opacity-0"}`} aria-hidden />
                  <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    activo ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                  }`}>
                    {num}
                  </div>
                  <div className={`flex-1 h-1 min-w-0 ${num < 5 ? (lineaDerCompleta ? "bg-blue-600" : "bg-gray-300") : "opacity-0"}`} aria-hidden />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700 text-center w-full">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Input Section - Always visible on step 1 */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">¿Qué producto quieres analizar?</h2>
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setInputType("name")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  inputType === "name"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Nombre del producto
              </button>
              <button
                onClick={() => setInputType("url")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  inputType === "url"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                URL del producto
              </button>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder={
                  inputType === "name"
                    ? "Ej: iPhone 13, Laptop gaming, Zapatos deportivos..."
                    : "Ej: https://www.ejemplo.com/producto/123"
                }
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={analyzeProduct}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 text-lg transition duration-200"
              >
                {loading ? "Analizando..." : "Analizar"}
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Components based on step */}
        {analysisResult && (
          <>
            {step === 2 && (
              <ProductAnalysis 
                data={analysisResult}
                onNext={() => {
                  console.log("Avanzando a paso 3 desde ProductAnalysis");
                  setStep(3);
                }}
              />
            )}
            
            {step === 3 && (
              <FinancialImpact
                productData={productData}
                analysisData={analysisResult}
                onNext={handleFinancialAnalysis}
              />
            )}
            
            {step === 4 && (
              <Recommendations
                data={analysisResult}
                onNext={() => {
                  console.log("Avanzando a paso 5 desde Recommendations");
                  setStep(5);
                }}
              />
            )}
            
            {step === 5 && (
              <Alternatives
                productData={productData}
                originalProduct={{ nombre: analysisResult?.nombre, precio_estimado: analysisResult?.precio_estimado }}
                marketplaces={analysisResult?.marketplaces_disponibles || []}
                alternatives={analysisResult.alternatives || []}
                onSelect={handleSelectAlternative}
                onCheckout={() => {
                  console.log("Yendo a checkout");
                  setStep(6);
                }}
              />
            )}
            
            {step === 6 && (
              <SecureCheckout
                productData={productData}
                onComplete={() => {
                  alert("¡Compra completada con éxito! El pago se liberará cuando confirmes la recepción.");
                  setStep(1);
                  setProductInput("");
                  setAnalysisResult(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}