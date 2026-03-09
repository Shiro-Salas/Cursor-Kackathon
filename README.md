# 🛒 SmartBuy GT

<div align="center">

![SmartBuy GT Logo](public/next.svg)

**Plataforma Inteligente de Compras Seguras para Guatemala**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![Mistral AI](https://img.shields.io/badge/Mistral-AI-orange)](https://mistral.ai/)

</div>

---

## 📋 Descripción

**SmartBuy GT** es una plataforma web que utiliza inteligencia artificial para ayudar a los usuarios a tomar decisiones de compra más seguras y financieramente inteligentes en el comercio digital. 

La aplicación analiza productos encontrados en distintos mercados en línea, evalúa su impacto financiero mediante principios de ingeniería económica y ofrece alternativas de compra más convenientes, además de permitir realizar transacciones seguras dentro de la misma plataforma.

### 🎯 Objetivo Principal

Resolver problemas comunes en el comercio electrónico, especialmente en Guatemala:
- 🚫 **Estafas en marketplaces** - Detección de vendedores fraudulentos
- 📊 **Falta de comparación de precios** - Análisis inteligente del mercado
- 💭 **Decisiones financieras sin información** - Evaluación de impacto económico

SmartBuy GT funciona como un **asistente inteligente** que guía al usuario antes de realizar una compra.

---

## ✨ Características Principales

### 1. 🔍 Análisis del Producto
El usuario introduce el nombre del producto o un enlace de un marketplace. La inteligencia artificial analiza:
- Precio del producto
- Valor promedio del mercado
- Inconsistencias o riesgos asociados al vendedor
- Detección de posibles estafas

### 2. 💰 Impacto Financiero
La plataforma aplica principios de ingeniería económica para calcular:
- Costo total de la compra
- Comparación de escenarios (efectivo vs financiamiento)
- Estimación de intereses
- Cálculo de ahorros potenciales
- Costo real del producto

### 3. 📊 Recomendación Económica
Con base en el análisis del mercado y el impacto financiero, la IA genera:
- Recomendación personalizada
- Indicación de conveniencia de compra
- Sugerencia de esperar o buscar mejores opciones

### 4. 🔄 Mejores Alternativas
El sistema sugiere:
- Productos similares en mercados confiables
- Precios estimados en diferentes plataformas
- Reputación de vendedores alternativos
- Ahorros potenciales

### 5. 🔒 Compra Segura
Sistema de pago protegido integrado:
- El dinero se retiene hasta confirmar recepción
- Reducción significativa del riesgo de estafas
- Transacciones seguras desde la plataforma

---

## 🚀 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16.1.6 | Framework principal |
| **React** | 19.2.3 | UI Components |
| **TypeScript** | 5.0 | Tipado seguro |
| **Tailwind CSS** | 4.0 | Estilos y diseño |
| **Mistral AI** | 1.14.1 | Análisis con IA |
| **Axios** | 1.13.6 | Peticiones HTTP |
| **Cheerio** | 1.2.0 | Scraping de URLs |
| **Lucide React** | 0.577.0 | Iconos |
| **Cursor** | - | Programación asistida por IA |

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Cuenta en [Mistral AI](https://console.mistral.ai/) para obtener API Key

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/smartbuy-gt.git
   cd smartbuy-gt
2. **Instalar dependencias**
   ```bash
   npm install
3. **Configurar variables de entorno**
   ```bash
    # Copiar el archivo de ejemplo
    cp .env.example .env.local
    
    # Editar .env.local con tu API key de Mistral
    # MISTRAL_API_KEY=tu_api_key_aqui
4. **Ejecutar en desarrollo**
   ```bash
     npm run dev
5. **Abrir el navegador**
   ```bash
     http://localhost:3000
     
