#  Ingeniería de Gas y Petroquímica – UPEA

Plataforma web institucional desarrollada para la **Carrera de Ingeniería de Gas y Petroquímica** de la Universidad Pública de El Alto (UPEA). Sitio moderno, responsive y auditado bajo estándares de seguridad (OWASP), diseñado para difundir información académica, normativa, eventos y contacto institucional.

---

##  Tecnologías Utilizadas

##  Categoría        Herramientas                                                                 
**Frontend**         React 18, TypeScript, Vite                                                   
**Estilos**          CSS nativo + Inline Styles, Google Fonts (Playfair Display, Inter)           
**Animaciones**      Framer Motion                                                                
**Control**          Git & GitHub                                                                 
**Almacenamiento**   MinIO (`archivosminio.upea.bo`)                                          
**Backend/API**      REST API institucional (`apiadministrador.upea.bo`)                         
**Seguridad**        CSP, Headers anti-clickjacking, SRI, `rel="noopener noreferrer"`, OWASP ZAP  

---

## Características Principales

- **Diseño Dinámico:** Colores institucionales consumidos en tiempo real desde la API.
- **100% Responsive:** Adaptado para móviles, tablets y escritorio sin frameworks CSS pesados.
- **Visor de PDF Seguro:** Apertura controlada de gacetas y publicaciones con fallback de descarga.
- **Multimedia Integrada:** Reproductores de video (YouTube) y mapas interactivos (Google Maps) con políticas de embed seguras.
- **Auditoría OWASP ZAP:** Corrección de vulnerabilidades medias/bajas (CSP, headers, SRI, enlaces externos).
- **Rendimiento Optimizado:** Code-splitting, lazy loading y assets optimizados con Vite.
- **Despliegue Listo:** Configuración de producción, variables de entorno y headers de servidor.

---
## Lo que hace

- Renderiza interfaz SPA (Single Page Application) con React 18 + TypeScript
- Consume endpoints REST de API administrativa (institución, recursos, contenido)
- Aplica temas dinámicos con colores desde `colorinstitucion` API
- Implementa routing por anclas (#inicio, #historia, #autoridades, etc.)
- Visualiza PDFs mediante apertura segura con `target="_blank"` 
- Integra iframes de YouTube y Google Maps con políticas CSP seguras otorgando permisos
- Procesa imágenes desde MinIO (`archivosminio.upea.bo`)
- Valida y sanitiza URLs con helper `getImageUrl()` y `getPdfUrl()`
- Gestiona estados con React Hooks (`useState`, `useEffect`, `useMemo`)
- Aplica animaciones con Framer Motion y CSS keyframes personalizados
- Auditoría de seguridad: corrige vulnerabilidades OWASP ZAP (medias/bajas)
- Genera build optimizado con Vite 
- Despliega en producción con headers de seguridad (X-Frame-Options, CSP, nosniff)

## Estructura del Proyecto

- src/
  - components/ (Header.tsx, Footer.tsx)
  - pages/ (AutoridadesPage.tsx, ComunicadosPage.tsx, GacetaPage.tsx, etc.)
  - lib/api.ts (Configuración de API)
  - App.tsx (Componente principal)
  - main.tsx (Punto de entrada)
  - index.css (Estilos globales)
- .env (Variables de entorno)
- index.html # HTML base con CSP, meta tags de seguridad y SRI
- vite.config.ts # Configuración de Vite, proxy y headers de seguridad
- package.json # Dependencias y scripts
- README.md # Documentación técnica del proyecto

## Variables de entorno

- `VITE_API_BASE_URL`
- `VITE_API_TOKEN`
- `VITE_INSTITUCION_ID`
- `VITE_UPLOADS_URL`

**Descripción de variables:**

`VITE_API_BASE_URL` → URL base de la API administrativa de la UPEA. Define el endpoint principal para consumir datos institucionales, carreras, autoridades, gacetas, eventos y demás contenido dinámico del sitio.

`VITE_API_TOKEN` → Token de autenticación para acceder a la API REST. Se utiliza en las cabeceras de las peticiones HTTP para validar el acceso a los recursos protegidos del backend.

`VITE_INSTITUCION_ID` → Identificador único de la institución/carrera en la base de datos. Permite filtrar y obtener específicamente los datos de Ingeniería de Gas y Petroquímica.

`VITE_UPLOADS_URL` → URL del servidor de almacenamiento MinIO. Define la ruta base para cargar y visualizar archivos estáticos como imágenes institucionales, logos, PDFs de gacetas, documentos de convocatorias y material multimedia.

## Formato base del proyecto

### Dependencias principales (`package.json`)

```json
{
  "name": "carrera-gasypetroquimica-landing",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.38.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^6.0.1",
    "typescript": "^5.0.2",
    "vite": "^8.0.9"
  }
}

## Endpoints Principales

La página consume **4 endpoints** de la API institucional (`https://apiadministrador.upea.bo/api/v2`) para obtener datos dinámicos de la carrera de Ingeniería de Gas y Petroquímica:

---

### 1. Institución Principal
- `GET /institucionesPrincipal/{id}` → Obtiene datos generales de la institución (nombre, logo, historia, misión, visión, colores, redes sociales, dirección, Google Maps)

### 2. Recursos
- `GET /institucion/{id}/recursos` → Obtiene publicaciones oficiales y enlaces de acceso rápido (inscripciones, campus virtual, página web)

### 3. Contenido
- `GET /institucion/{id}/contenido` → Obtiene contenido multimedia: autoridades, portadas del carrusel, videos de YouTube y ubicación con coordenadas GPS

### 4. Gacetas y Eventos
- `GET /institucion/{id}/gacetaEventos` → Obtiene gacetas universitarias (PDF), eventos, cursos, seminarios, convocatorias y ofertas académicas

---
## Ejemplos de Pruebas de Conexión

### Probar conexión al frontend (Vite)

curl http://localhost:5173/

# 1. Institución Principal
curl -X GET "http://localhost:5173/api/v2/institucionesPrincipal/39" \
  -H "Authorization: Bearer 7d1928851b4717000bd8ca8b1b2b8dd2b15779c8779432bbe65227831727688a"

# 2. Recursos Institucionales
curl -X GET "http://localhost:5173/api/v2/institucion/32/recursos" \
  -H "Authorization: Bearer 7d1928851b4717000bd8ca8b1b2b8dd2b15779c8779432bbe65227831727688a"

# 3. Contenido Dinámico
curl -X GET "http://localhost:5173/api/v2/institucion/19/contenido" \
  -H "Authorization: Bearer 7d1928851b4717000bd8ca8b1b2b8dd2b15779c8779432bbe65227831727688a"

# 4. Gacetas y Eventos
curl -X GET "http://localhost:5173/api/v2/institucion/19/gacetaEventos" \
  -H "Authorization: Bearer 7d1928851b4717000bd8ca8b1b2b8dd2b15779c8779432bbe65227831727688a"

# Verificar conexión con MinIO (imágenes)
curl -I "https://archivosminio.upea.bo/archivospaginasnode/imagenes/instituciones/institucion_logo-1783102723031-922896964.webp"

# Verificar conexión con MinIO (PDFs)
curl -I "https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas/gaceta-1782798943129-521426666.pdf"

## Notas Operativas

- Si la página muestra **"Error al cargar datos"**, normalmente es problema de conexión con la API o el token expiró.
- Si las **imágenes no se visualizan**, verificar que `VITE_UPLOADS_URL` apunte correctamente a MinIO.
- Si los **PDFs no abren**, revisar que el CSP incluya `frame-src` y `object-src` para MinIO.
- Usar `npm run build` solo cuando el sistema esté estable y todas las pruebas pasen.
- Para cambios de colores, modificar directamente en el panel administrativo de la API (no en el frontend).
- El endpoint de `/institucionesPrincipal` cachea colores; si no cambian, limpiar caché del navegador.
- Si Vite muestra **"failed to load"**, verificar que el puerto 5173 no esté ocupado.
- Las variables de entorno `.env` NO se suben a Git; cada desarrollador debe crear su propio archivo.
- Si OWASP ZAP reporta vulnerabilidades, actualizar headers en `vite.config.ts` y redeploy.
- CORS solo debe habilitarse si un frontend externo necesita consumir esta API.

## Recomendación Final

Te recomiendo dejar este repo exactamente con esta responsabilidad:

- Frontend React + TypeScript para visualización de datos institucionales
- Nada de lógica de negocio compleja en el cliente
- Nada de almacenamiento local sensible (solo caché de imágenes)
- Nada de conexión directa a base de datos
- Todo el consumo vía API REST con token de autenticación

## Documentos Complementarios:

- README.md - Documentación técnica completa
- Formulario UTIC - Requerimientos de la pagina web de la carrera de gas y petroquimica
- Reporte OWASP ZAP - Auditoría de seguridad

##  Instalación

1. `npm install`
2. Crear `.env` con variables
3. `npm run dev`
4. `npm run build`

