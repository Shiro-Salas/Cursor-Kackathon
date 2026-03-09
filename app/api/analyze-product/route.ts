import { NextResponse } from "next/server";
import axios from 'axios';
import * as cheerio from 'cheerio';

// Función para detectar marketplace desde una URL
function detectMarketplaceFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes('mercadolibre') || host.includes('mercadolibre.com')) return 'MercadoLibre';
    if (host.includes('amazon')) return 'Amazon';
    if (host.includes('walmart')) return 'Walmart';
    if (host.includes('lacuracao')) return 'La Curacao';
    if (host.includes('elektra')) return 'Elektra';
    if (host.includes('kirolos')) return 'Kirolos';
    if (host.includes('pricesmart')) return 'PriceSmart';
    if (host.includes('gessa')) return 'Gessa';
    if (host.includes('intelec')) return 'Intelec';
    if (host.includes('max')) return 'Max';
    return null;
  } catch {
    return null;
  }
}

// Función para extraer precio de una URL
async function extractPriceFromUrl(url: string): Promise<{ price: number | null; title: string | null }> {
  try {
    console.log("Extrayendo información de URL:", url);
    
    // Hacer la petición a la URL
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    let price: number | null = null;
    let title: string | null = null;

    // Buscar el título del producto
    title = $('h1').first().text().trim() || 
            $('meta[property="og:title"]').attr('content') || 
            $('title').text().trim() || 
            null;

    // Buscar precio en diferentes formatos comunes
    const priceSelectors = [
      // Precio con descuento (precio actual)
      '.price .amount',
      '.price ins .amount',
      '.product-price',
      '.sale-price',
      '[itemprop="price"]',
      '.current-price',
      '.offer-price',
      // Precio normal
      '.regular-price',
      '.price',
      '.product__price',
      // Meta tags
      'meta[property="product:price:amount"]',
      'meta[itemprop="price"]',
      // Clases comunes en marketplaces
      '.andes-money-amount__fraction', // MercadoLibre
      '.a-price-whole', // Amazon
      '.css-1d0jf8e', // Kirolos
    ];

    // Intentar cada selector
    for (const selector of priceSelectors) {
      const element = $(selector);
      if (element.length) {
        let priceText = '';
        
        if (selector.startsWith('meta')) {
          priceText = element.attr('content') || '';
        } else {
          priceText = element.text().trim();
        }
        
        // Limpiar el texto del precio
        priceText = priceText.replace(/[^0-9.,]/g, '').replace(',', '');
        const parsedPrice = parseFloat(priceText);
        
        if (!isNaN(parsedPrice) && parsedPrice > 0) {
          price = parsedPrice;
          console.log(`Precio encontrado con selector ${selector}: Q${price}`);
          break;
        }
      }
    }

    // Si no encontró precio con selectores, buscar patrones en el texto
    if (!price) {
      const bodyText = $('body').text();
      const pricePatterns = [
        /Q\s*(\d{1,3}(?:[,.]\d{3})*(?:[,.]\d{2})?)/,
        /GTQ\s*(\d{1,3}(?:[,.]\d{3})*(?:[,.]\d{2})?)/,
        /precio:?\s*Q?\s*(\d{1,3}(?:[,.]\d{3})*(?:[,.]\d{2})?)/i,
        /\$\s*(\d{1,3}(?:[,.]\d{3})*(?:[,.]\d{2})?)/,
      ];

      for (const pattern of pricePatterns) {
        const match = bodyText.match(pattern);
        if (match) {
          const parsedPrice = parseFloat(match[1].replace(/[,]/g, ''));
          if (!isNaN(parsedPrice) && parsedPrice > 0) {
            price = parsedPrice;
            console.log(`Precio encontrado con patrón: Q${price}`);
            break;
          }
        }
      }
    }

    return { price, title };
  } catch (error) {
    console.error("Error extrayendo información de la URL:", error);
    return { price: null, title: null };
  }
}

export async function POST(req: Request) {
  try {
    const { input, inputType } = await req.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Entrada inválida', bloqueado: true },
        { status: 400 }
      );
    }

    let extractedPrice = null;
    let extractedTitle = null;
    let priceSource = "estimado";
    let marketplaceFromUrl: string | null = null;

    // Si es una URL, intentar extraer el precio y detectar marketplace
    if (inputType === "url") {
      console.log("Procesando URL:", input);
      marketplaceFromUrl = detectMarketplaceFromUrl(input);
      if (marketplaceFromUrl) {
        console.log(`📍 Marketplace detectado: ${marketplaceFromUrl}`);
      }
      const extracted = await extractPriceFromUrl(input);
      extractedPrice = extracted.price;
      extractedTitle = extracted.title;
      
      if (extractedPrice) {
        priceSource = "extraído de la página";
        console.log(`✅ Precio extraído: Q${extractedPrice}`);
      } else {
        console.log("❌ No se pudo extraer el precio de la URL");
      }
    }

    // Construir el prompt para la IA
    let promptMessage = "";
    if (inputType === "url") {
      promptMessage = `URL del producto: ${input}\n`;
      if (marketplaceFromUrl) {
        promptMessage += `Marketplace detectado en la URL: ${marketplaceFromUrl}\n`;
      }
      if (extractedTitle) {
        promptMessage += `Título encontrado: ${extractedTitle}\n`;
      }
      if (extractedPrice) {
        promptMessage += `Precio encontrado en la página: Q${extractedPrice}\n`;
      }
      promptMessage += `Por favor, analiza este producto para el mercado guatemalteco.`;
    } else {
      promptMessage = `Producto a analizar: ${input}\nProporciona un análisis detallado con precio estimado para Guatemala.`;
    }

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "system",
            content: `Eres SmartBuy GT, experto en precios de Guatemala.

FILTRO DE CONTENIDO (PRIORITARIO):
- Si el producto/búsqueda es contenido adulto (+18), sexual, pornográfico, ilegal (drogas, armas), o no apto para todo público: responde ÚNICAMENTE con este JSON: {"contenido_no_apto": true}
- Productos normales de tienda (electrónica, ropa, etc.) son aceptables aunque tengan palabras que en otro contexto serían inapropiadas.
- Sé estricto: bloquea solo contenido claramente inapropiado o ilegal.

INSTRUCCIONES IMPORTANTES:
1. Si el usuario proporciona un precio específico en la consulta, USA ESE PRECIO EXACTO
2. Si se extrajo un precio de la URL, USA ESE PRECIO como precio_estimado
3. Siempre indica en el análisis si el precio fue extraído de la página o es estimado
4. Precios siempre en quetzales (Q), solo números, sin comas

PRECIOS DE REFERENCIA (Guatemala):
- Audífonos Bluetooth: Q150 - Q3,000
- Celulares gama media: Q1,800 - Q3,500
- Celulares gama alta: Q4,000 - Q9,000
- Laptops: Q3,500 - Q15,000

FORMATO JSON REQUERIDO:
{
  "nombre": "nombre del producto",
  "precio_estimado": numero,
  "vendedor": "nombre del vendedor o 'No especificado'",
  "confiabilidad_vendedor": "alta" | "media" | "baja",
  "precio_justo": true | false,
  "riesgos_detectados": ["riesgo1", "riesgo2"],
  "analisis": "análisis detallado para Guatemala (incluir si el precio fue extraído de la URL)",
  "marketplaces_disponibles": ["lista de tiendas donde REALMENTE se puede encontrar este producto en Guatemala"]
}

IMPORTANTE para marketplaces_disponibles:
- Si la URL indica un marketplace (ej: MercadoLibre, Amazon), INCLUYE ESE como mínimo
- Sugiere otros marketplaces guatemaltecos donde típicamente se vende este tipo de producto (ej: MercadoLibre, Amazon, La Curacao, Elektra, Walmart, PriceSmart, Kirolos, Gessa, Intelec, etc.)
- NO uses una lista genérica fija. Adapta según el tipo de producto`,
          },
          {
            role: "user",
            content: promptMessage,
          },
        ],
        temperature: 0.2,
      }),
    });

    const data = await res.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Verificar si la IA detectó contenido no apto
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        if (analysis.contenido_no_apto === true) {
          return NextResponse.json(
            {
              error: 'No podemos analizar esta búsqueda. El contenido no es apto para todo público o no está permitido en nuestra plataforma.',
              bloqueado: true,
              codigo: 'contenido_no_permitido',
            },
            { status: 403 }
          );
        }
      } else {
        analysis = JSON.parse(content);
      }
    } catch (e) {
      console.error("Error parseando JSON:", content);
      
      const marketplacesFallback = marketplaceFromUrl 
        ? [marketplaceFromUrl, "MercadoLibre", "Amazon"] 
        : (inputType === "url" ? ["MercadoLibre", "Amazon"] : ["MercadoLibre", "Amazon", "La Curacao", "Elektra"]);
      
      if (extractedPrice) {
        analysis = {
          nombre: extractedTitle || "Producto desde enlace",
          precio_estimado: extractedPrice,
          vendedor: "Verificar en la página",
          confiabilidad_vendedor: "media",
          precio_justo: true,
          riesgos_detectados: ["Verificar autenticidad del producto con el vendedor"],
          analisis: `✅ Precio encontrado en la página: Q${extractedPrice}. Te recomendamos verificar la reputación del vendedor antes de comprar.`,
          marketplaces_disponibles: [...new Set(marketplacesFallback)],
        };
      } else {
        analysis = {
          nombre: inputType === "url" ? "Producto desde enlace" : input,
          precio_estimado: 1199,
          vendedor: "No especificado",
          confiabilidad_vendedor: "media",
          precio_justo: true,
          riesgos_detectados: ["No se pudo extraer el precio automáticamente"],
          analisis: "No se pudo extraer el precio de la página. Te recomendamos buscar el producto en marketplaces confiables para comparar precios.",
          marketplaces_disponibles: marketplacesFallback,
        };
      }
    }

    // Si tenemos precio extraído y la IA no lo usó, forzamos usarlo
    if (extractedPrice && (!analysis.precio_estimado || analysis.precio_estimado === 0)) {
      analysis.precio_estimado = extractedPrice;
      analysis.analisis = `✅ Precio encontrado en la página: Q${extractedPrice}. ${analysis.analisis || ''}`;
    }

    // Si tenemos título extraído y la IA no lo usó
    if (extractedTitle && (!analysis.nombre || analysis.nombre.includes("enlace"))) {
      analysis.nombre = extractedTitle;
    }

    // Asegurar que el marketplace detectado de la URL esté en la lista
    if (marketplaceFromUrl) {
      const marketplaces = Array.isArray(analysis.marketplaces_disponibles) 
        ? [...analysis.marketplaces_disponibles] 
        : [];
      if (!marketplaces.some((m: string) => m.toLowerCase().includes(marketplaceFromUrl!.toLowerCase()))) {
        marketplaces.unshift(marketplaceFromUrl);
      }
      analysis.marketplaces_disponibles = marketplaces;
    }

    const finalAnalysis = {
      ...analysis,
      precio_extraido: extractedPrice ? true : false,
      timestamp: new Date().toISOString(),
    };

    console.log("Respuesta final:", finalAnalysis);
    return NextResponse.json(finalAnalysis);

  } catch (error) {
    console.error("Error en analyze-product:", error);
    return NextResponse.json({
      nombre: "Error en el análisis",
      precio_estimado: 0,
      vendedor: "No disponible",
      confiabilidad_vendedor: "baja",
      precio_justo: false,
      riesgos_detectados: ["Error al conectar con el servicio"],
      analisis: "Hubo un error al analizar el producto. Por favor, intenta de nuevo.",
      marketplaces_disponibles: [],
      precio_extraido: false,
      timestamp: new Date().toISOString(),
    });
  }
}