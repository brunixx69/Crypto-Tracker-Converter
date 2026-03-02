# 🚀 Crypto-Tracker Pro

**Crypto-Tracker Pro** es una plataforma moderna y minimalista para el seguimiento de criptomonedas en tiempo real, construida exclusivamente con **Vanilla JavaScript (ES6+)**, **HTML5** y **CSS3**.

Esta aplicación demuestra cómo construir una herramienta de alto rendimiento y grado profesional sin dependencia de frameworks pesados, priorizando la velocidad, la arquitectura limpia y la experiencia de usuario (UX).

![Crypto-Tracker Preview](https://storage.googleapis.com/antigravity-artifacts/crypto-tracker-preview.png) *(Placeholder: Reemplazar con captura real si aplica)*

## ✨ Características Principales

- **💎 Diseño Glassmorphism:** Interfaz translúcida y moderna con efectos de desenfoque (`backdrop-filter`).
- **⚡ Performance Extremo:**
  - **Caché Inteligente:** Uso de `sessionStorage` con TTL de 5 minutos para cargas instantáneas.
  - **Optimización del DOM:** Renderizado por lotes mediante `DocumentFragment` para minimizar repintados.
  - **Skeleton Loaders:** Transición fluida con animaciones de carga tipo *shimmer*.
- **⭐ Favoritos Persistentes:** Marca tus monedas preferidas y mantenlas siempre al principio de la lista (`localStorage`).
- **🧮 Calculadora Integrada:** Conversor de cripto a USD en tiempo real dentro de cada tarjeta expandible.
- **🎨 Modo Oscuro/Claro:** Persistencia automática de tema según la preferencia del usuario.
- **📱 Mobile-First:** Totalmente responsivo mediante CSS Grid y Flexbox.

## 🛠️ Tecnologías Empleadas

- **Vanilla JavaScript (ES6+):** Arquitectura modular (ES Modules), Fetch API, Event Delegation y Template Literals.
- **CSS3:** Metodología **BEM** (Block Element Modifier), CSS Variables para temas dinámicos y animaciones de alto rendimiento.
- **HTML5 Semántico:** Estructura optimizada para accesibilidad y SEO.
- **API:** Integración con [CoinGecko API](https://www.coingecko.com/en/api).

## 📂 Estructura del Proyecto

```text
/
├── index.html        # Estructura semántica principal
├── css/
│   └── style.css     # Design System, BEM y Animaciones
└── js/
    ├── api.js        # Lógica de comunicación y caching
    ├── dom.js        # Manipulación eficiente del DOM
    └── app.js        # Orquestador y lógica de negocio
```

## 🚀 Cómo Ejecutar el Proyecto

Debido al uso de **Módulos de JavaScript (ESM)**, el navegador requiere un contexto de servidor para cargar los archivos `.js` por motivos de seguridad (CORS).

### Opción A: VS Code (Recomendado)

1. Abre la carpeta del proyecto en **VS Code**.
2. Instala la extensión **Live Server**.
3. Haz clic derecho en `index.html` y selecciona **"Open with Live Server"**.

### Opción B: Terminal (Simple)

Si tienes Node.js instalado, ejecuta:

```bash
npx serve .
```

---

Desarrollado con ❤️ por un Frontend Developer.
