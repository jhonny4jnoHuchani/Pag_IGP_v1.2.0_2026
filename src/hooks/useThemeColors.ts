// =============================================
// HOOK: useThemeColors - Sistema centralizado de colores dinámicos
// =============================================
// Este hook extrae, valida y genera variantes de los colores
// institucionales que vienen de la API.
// =============================================

import { useMemo } from 'react';
import { InstitucionPrincipal } from '../lib/api';

// Interface para los colores de la API
interface ColorInstitucion {
  id_color?: number;
  color_primario?: string;
  color_secundario?: string;
  color_terciario?: string;
}

// =============================================
// INTERFACES
// =============================================
export interface ThemeColors {
  // Colores base (validados)
  primary: string;
  secondary: string;
  tertiary: string;
  
  // Variantes con opacidad (formato hex + alpha)
  primaryLight: string;    // 12% opacidad
  primaryMedium: string;   // 50% opacidad
  primaryDark: string;     // 87% opacidad
  secondaryLight: string;  // 12% opacidad
  secondaryMedium: string; // 50% opacidad
  secondaryDark: string;   // 87% opacidad
  tertiaryLight: string;   // 12% opacidad
  tertiaryDark: string;    // 87% opacidad
  
  // Gradientes predefinidos
  gradientPrimary: string;   // primary → secondary
  gradientDark: string;      // primaryDark → secondaryDark
  gradientLight: string;     // primaryLight → secondaryLight
  gradientHero: string;      // primary → secondary (con más contraste)
  
  // Colores de texto sobre fondo primary
  textOnPrimary: string;
  textOnSecondary: string;
  textOnTertiary: string;
}

// =============================================
// COLORES DE RESPALDO (FALLBACKS)
// =============================================
const FALLBACK_COLORS = {
  primary: '#349433',    // Verde institucional
  secondary: '#00B9D1',  // Celeste institucional
  tertiary: '#FFFFFF',   // Blanco
};

// =============================================
// UTILIDADES DE VALIDACIÓN
// =============================================
/**
 * Valida si un string es un color hexadecimal válido
 * Acepta formatos: #RGB, #RRGGBB, #RRGGBBAA
 */
const isValidHexColor = (color: string | null | undefined): boolean => {
  if (!color) return false;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color);
};

/**
 * Normaliza un color hex de 3 dígitos a 6 dígitos
 * Ejemplo: #abc → #aabbcc
 */
const normalizeHex = (color: string): string => {
  if (/^#([0-9A-Fa-f]{3})$/.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  return color;
};

/**
 * Convierte un color hex a formato con opacidad (alpha)
 * Ejemplo: hexToAlpha('#349433', 0.12) → '#34943320'
 */
const hexToAlpha = (color: string, alpha: number): string => {
  const normalized = normalizeHex(color).replace('#', '');
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `#${normalized}${alphaHex}`;
};

/**
 * Obtiene el mejor color de texto (negro o blanco) para un fondo dado
 * Basado en el contraste de luminancia
 */
const getContrastText = (backgroundColor: string): string => {
  const normalized = normalizeHex(backgroundColor).replace('#', '');
  
  // Si es color de 8 dígitos, tomar solo los primeros 6
  const hex = normalized.length === 8 ? normalized.slice(0, 6) : normalized;
  
  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calcular luminancia relativa (WCAG 2.0)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminancia es alta (fondo claro), usar texto oscuro
  // Si es baja (fondo oscuro), usar texto blanco
  return luminance > 0.5 ? '#1a1a2e' : '#FFFFFF';
};

/**
 * Valida y retorna un color seguro
 * Si el color es inválido, retorna el fallback
 */
const getSafeColor = (
  color: string | null | undefined,
  fallback: string
): string => {
  if (isValidHexColor(color)) {
    return normalizeHex(color!.toUpperCase());
  }
  return fallback;
};

// =============================================
// HOOK PRINCIPAL
// =============================================
/**
 * Hook que centraliza la extracción y validación de colores institucionales
 * 
 * @param institucion - Datos de la institución desde la API
 * @returns ThemeColors - Objeto con todos los colores y variantes
 * 
 * @example
 * const colors = useThemeColors(institucion);
 * // colors.primary → '#349433'
 * // colors.gradientPrimary → 'linear-gradient(135deg, #349433 0%, #00B9D1 100%)'
 */
export const useThemeColors = (
  institucion: InstitucionPrincipal | null
): ThemeColors => {
  return useMemo(() => {
    // Extraer colores de la API (si existen)
    const apiColors: ColorInstitucion = institucion?.colorinstitucion?.[0] || {} as ColorInstitucion;
    
    // Validar y normalizar cada color
    const primary = getSafeColor(apiColors.color_primario, FALLBACK_COLORS.primary);
    const secondary = getSafeColor(apiColors.color_secundario, FALLBACK_COLORS.secondary);
    const tertiary = getSafeColor(apiColors.color_terciario, FALLBACK_COLORS.tertiary);
    
    // Generar variantes con opacidad
    const primaryLight = hexToAlpha(primary, 0.12);
    const primaryMedium = hexToAlpha(primary, 0.50);
    const primaryDark = hexToAlpha(primary, 0.87);
    
    const secondaryLight = hexToAlpha(secondary, 0.12);
    const secondaryMedium = hexToAlpha(secondary, 0.50);
    const secondaryDark = hexToAlpha(secondary, 0.87);
    
    const tertiaryLight = hexToAlpha(tertiary, 0.12);
    const tertiaryDark = hexToAlpha(tertiary, 0.87);
    
    // Generar gradientes
    const gradientPrimary = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
    const gradientDark = `linear-gradient(135deg, ${primaryDark} 0%, ${secondaryDark} 100%)`;
    const gradientLight = `linear-gradient(135deg, ${primaryLight} 0%, ${secondaryLight} 100%)`;
    const gradientHero = `linear-gradient(135deg, ${primary}cc 0%, ${secondary}bb 100%)`;
    
    // Colores de texto para contraste
    const textOnPrimary = getContrastText(primary);
    const textOnSecondary = getContrastText(secondary);
    const textOnTertiary = getContrastText(tertiary);
    
    return {
      // Colores base
      primary,
      secondary,
      tertiary,
      
      // Variantes con opacidad
      primaryLight,
      primaryMedium,
      primaryDark,
      secondaryLight,
      secondaryMedium,
      secondaryDark,
      tertiaryLight,
      tertiaryDark,
      
      // Gradientes
      gradientPrimary,
      gradientDark,
      gradientLight,
      gradientHero,
      
      // Texto de contraste
      textOnPrimary,
      textOnSecondary,
      textOnTertiary,
    };
  }, [institucion]);
};

// =============================================
// EXPORTACIÓN DEFAULT (para facilitar importación)
// =============================================
export default useThemeColors;