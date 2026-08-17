// src/lib/api.ts
import { useState, useEffect } from 'react';

// ==================== TIPOS/INTERFACES ====================
export interface ColorInstitucion {
  id_color: number;
  color_primario: string;
  color_secundario: string;
  color_terciario: string;
}

export interface InstitucionPrincipal {
  institucion_id: number;
  institucion_nombre: string;
  institucion_iniciales: string;
  institucion_nombre_iniciales: string;
  institucion_logo: string;
  institucion_historia: string;
  institucion_mision: string;
  institucion_vision: string;
  institucion_facebook: string;
  institucion_youtube: string;
  institucion_twitter: string;
  institucion_direccion: string;
  institucion_celular1: number;
  institucion_celular2: number;
  institucion_telefono1: number;
  institucion_telefono2: number;
  institucion_correo1: string;
  institucion_correo2: string;
  institucion_api_google_map: string;
  institucion_objetivos: string;
  institucion_sobre_ins: string;
  institucion_link_video_vision: string;
  colorinstitucion: ColorInstitucion[];
}

export interface Publicacion {
  publicaciones_id: number;
  publicaciones_titulo: string;
  publicaciones_imagen: string;
  publicaciones_descripcion: string;
  publicaciones_documento: string;
  publicaciones_fecha: string;
  publicaciones_autor: string;
  publicaciones_tipo: string;
}

export interface LinkExterno {
  id_link: number;
  imagen: string;
  nombre: string;
  url_link: string;
  estado: number;
  tipo: string;
}

// ✅ INTERFAZ ACTUALIZADA con campos de gacetaEventos
export interface RecursosResponse {
  upea_publicaciones: Publicacion[];
  linksExternoInterno: LinkExterno[];
  links: any[];
  // Campos del endpoint gacetaEventos (opcionales):
  convocatorias?: {
    idconvocatorias: number;
    con_foto_portada: string;
    con_titulo: string;
    con_descripcion: string;
    con_estado: string;
    con_fecha_inicio: string;
    con_fecha_fin: string;
    tipo_conv_comun?: {
      idtipo_conv_comun: number;
      tipo_conv_comun_titulo: string;
      tipo_conv_comun_estado: string;
    };
  }[];
  upea_gaceta_universitaria?: {
    gaceta_id: number; 
    gaceta_titulo: string;
    gaceta_fecha: string;
    gaceta_documento: string;
    gaceta_tipo: string;
  }[];
  upea_evento?: any[];
  cursos?: any[];
  serviciosCarrera?: any[];
  ofertasAcademicas?: any[];
}

export interface Autoridad {
  id_autoridad: number;
  foto_autoridad: string;
  nombre_autoridad: string;
  cargo_autoridad: string;
  facebook_autoridad: string;
  celular_autoridad: string;
  twiter_autoridad: string;
}

export interface Portada {
  portada_id: number;
  portada_imagen: string;
  portada_titulo: string;
  portada_subtitulo: string;
}

export interface Ubicacion {
  id_ubicacion: number;
  ubicacion_imagen: string;
  ubicacion_titulo: string;
  ubicacion_descripcion: string;
  ubicacion_latitud: string;
  ubicacion_longitud: string;
  ubicacion_estado: string;
}

export interface Video {
  video_id: number;
  video_enlace: string;
  video_titulo: string;
  video_breve_descripcion: string;
  video_estado: number;
  video_tipo: string;
}

export interface ContenidoResponse {
  autoridad: Autoridad[];
  portada: Portada[];
  ubicacion: Ubicacion[];
  upea_videos: Video[];
}

export interface GacetaEventosResponse {
  convocatorias?: any[];
  upea_gaceta_universitaria?: any[];
  upea_evento?: any[];
  cursos?: any[];
  serviciosCarrera?: any[];
  ofertasAcademicas?: any[];
}

export interface CarreraData {
  institucion: InstitucionPrincipal | null;
  recursos: RecursosResponse | null;
  contenido: ContenidoResponse | null;
  loading: boolean;
  error: string | null;
}

// ==================== CONFIGURACIÓN API ====================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const INSTITUCION_ID = import.meta.env.VITE_INSTITUCION_ID;

export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`,
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// ==================== FUNCIONES API ====================

export const getInstitucionPrincipal = async (): Promise<InstitucionPrincipal> => {
  const response = await fetch(
    `${API_BASE_URL}/institucionesPrincipal/${INSTITUCION_ID}`,
    { headers: getHeaders() }
  );
  const data = await handleResponse<{ Descripcion: InstitucionPrincipal }>(response);
  return data.Descripcion;
};

// ✅ FUNCIÓN CORREGIDA: Combina recursos + gacetaEventos con ID dinámico
export const getRecursos = async (): Promise<RecursosResponse> => {
  try {
    // Fetch del endpoint principal de recursos
    const recursosResponse = await fetch(
      `${API_BASE_URL}/institucion/${INSTITUCION_ID}/recursos`,
      { headers: getHeaders() }
    );
    
    // Fetch del endpoint gacetaEventos con ID DINÁMICO (no hardcoded)
    const gacetaEventosResponse = await fetch(
      `${API_BASE_URL}/institucion/${INSTITUCION_ID}/gacetaEventos`,  // ✅ CORREGIDO: ${INSTITUCION_ID}
      { headers: getHeaders() }
    );
    
    // Ejecutar en paralelo y manejar errores individualmente
    const [recursos, gacetaEventos] = await Promise.all([
      handleResponse<RecursosResponse>(recursosResponse),
      handleResponse<GacetaEventosResponse>(gacetaEventosResponse).catch(() => ({}))
    ]);

    // ✅ Combinar ambos responses
// ✅ Combinar ambos responses
return {
  ...recursos,
  convocatorias: (gacetaEventos as any)?.convocatorias || [],
  upea_gaceta_universitaria: (gacetaEventos as any)?.upea_gaceta_universitaria || [],
  upea_evento: (gacetaEventos as any)?.upea_evento || [],
  cursos: (gacetaEventos as any)?.cursos || [],
  serviciosCarrera: (gacetaEventos as any)?.serviciosCarrera || [],
  ofertasAcademicas: (gacetaEventos as any)?.ofertasAcademicas || []
};
  } catch (error) {
    console.error('Error fetching recursos:', error);
    // Retornar estructura vacía en caso de error para evitar crashes
    return {
      upea_publicaciones: [],
      linksExternoInterno: [],
      links: [],
      convocatorias: [],
      upea_gaceta_universitaria: [],
      upea_evento: [],
      cursos: [],
      serviciosCarrera: [],
      ofertasAcademicas: []
    };
  }
};

export const getContenido = async (): Promise<ContenidoResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/institucion/${INSTITUCION_ID}/contenido`,
    { headers: getHeaders() }
  );
  return handleResponse<ContenidoResponse>(response);
};

// ==================== HOOK PERSONALIZADO ====================

export const useCarreraData = () => {
  const [data, setData] = useState<CarreraData>({
    institucion: null,
    recursos: null,
    contenido: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!API_BASE_URL || !API_TOKEN || !INSTITUCION_ID) {
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Variables de entorno (.env) no configuradas correctamente." 
      }));
      return;
    }

    const fetchData = async () => {
      try {
        // ✅ Ejecutar las 3 peticiones en paralelo
        const [institucion, recursos, contenido] = await Promise.all([
          getInstitucionPrincipal(),
          getRecursos(),  // ✅ Ya incluye gacetaEventos combinado
          getContenido(),
        ]);

        setData({
          institucion,
          recursos,  // ✅ Ahora tiene convocatorias, gacetas, eventos, etc.
          contenido,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error desconocido al conectar con la API de la UPEA',
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};