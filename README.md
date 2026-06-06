# SimCrisis — Simulador Económico Interactivo ⚡

**SimCrisis** es una aplicación web educativa e interactiva diseñada para representar, calcular y analizar de forma matemática tres problemáticas críticas del contexto macroeconómico actual: el desabastecimiento de carburantes, la inflación en la canasta familiar y los costos operativos del transporte ante desvíos o bloqueos.

Este proyecto ha sido desarrollado como el **Desafío Final para la materia de Programación Web I** en la **Universidad Mayor de San Andrés (UMSA)**.

---

## 🚀 Características del Proyecto

- **Estructura HTML5 Semántica:** Uso estricto de etiquetas nativas (`<header>`, `<main>`, `<section>`, `<article>`, `<fieldset>`) garantizando accesibilidad y SEO técnico.
- **Diseño Responsivo (Mobile-First):** Interfaz fluida y moderna optimizada mediante CSS Grid y Flexbox que se adapta perfectamente a celulares, tablets y computadoras de escritorio.
- **JavaScript Vanilla Puro (ES6+):** Lógica de simulación y manipulación dinámica del DOM sin el uso de librerías externas.
- **Casos de Estudio Integrados:** Botones automatizados que cargan los datos de prueba oficiales del PDF con un solo clic para facilitar la revisión de la cátedra.
- **Fallo Seguro (Fail-Safe):** Sistema robusto de validación que intercepta campos vacíos o valores incorrectos directamente en el cliente, mostrando alertas visuales dinámicas.

---

## 📊 Módulos del Simulador

### Módulo A: Simulador de Carburantes ⛽
Modela el comportamiento del inventario de una planta de almacenaje analizando la reserva inicial, el consumo y el reabastecimiento diario. Calcula el día exacto en que ocurrirá el desabastecimiento o si el sistema es estable.

### Módulo B: Matriz de Precios de Alimentos 🛒
Permite añadir productos de forma dinámica a una tabla interactiva para calcular el Índice de Precios e Inflación Percibida, comparando el gasto total previo frente al actual dentro de la canasta familiar.

### Módulo C: Costo de Transporte y Desvíos 🚛
Mide el impacto económico semanal y mensual que sufren los transportistas al verse obligados a tomar rutas alternativas con desvíos debido a eventos externos, proyectando las pérdidas directas.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructuración y accesibilidad avanzada (`aria-*` attributes).
- **CSS3:** Variables nativas (`:root`), tipografía moderna (*Space Grotesk*) y Media Queries para el control responsivo.
- **JavaScript Vanilla:** API del DOM, promesas e Intersection Observers para la navegación activa.

---

## 📂 Estructura del Directorio

```text
├── index.html          # Documento principal de la aplicación
├── css/
│   └── estilos.css     # Hoja de estilos (Estructura Mobile-First)
├── js/
│   └── script.js       # Lógica de programación y control del DOM
└── img/                # Carpeta de recursos visuales y capturas del sistema
    ├── Gemini_Generated_Image_7c3t9q7c3t9q7c3t.png
    └── Gemini_Generated_Image_p392spp392spp392.png
