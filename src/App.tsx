import { useState, useEffect, useMemo } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useCarreraData, type Publicacion, type Autoridad, type Video } from './lib/api';
import { useThemeColors } from './hooks/useThemeColors';
import { useInteractiveEffects } from './hooks/useInteractiveEffects';

import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

import HeroSection from './components/Home/HeroSection';
import ExploraSection from './components/Home/ExploraSection';
import AutoridadesSection from './components/Home/AutoridadesSection';
import SobreNosotrosSection from './components/Home/SobreNosotrosSection';
import PublicacionesSection from './components/Home/PublicacionesSection';
import ContactoSection from './components/Home/ContactoSection';

function App() {
  // 1. Obtener la data centralizada de la API
  const { institucion, recursos, contenido, loading, error } = useCarreraData();
  
  // 2. Obtener los colores dinámicos de la institución
  const colors = useThemeColors(institucion);

  // 3. Activar efectos visuales interactivos (chispas, quemaduras)
  useInteractiveEffects();

  const [minLoadingTime, setMinLoadingTime] = useState(false);

  // Tiempo mínimo del loading screen (2 segundos)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTime(true);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  // Ordenar publicaciones de más reciente a más antigua
  const publicacionesOrdenadas: Publicacion[] = useMemo(() => {
    const lista = recursos?.upea_publicaciones ?? [];
    return [...lista].sort(
      (a, b) => new Date(b.publicaciones_fecha).getTime() - new Date(a.publicaciones_fecha).getTime()
    );
  }, [recursos?.upea_publicaciones]);

  const autoridades: Autoridad[] = contenido?.autoridad ?? [];

  // -------------------------------------------------------------
  // MANEJADOR DE ERRORES GLOBALES
  // -------------------------------------------------------------
  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: '#555' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '0.75rem 2rem', background: colors.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '1rem' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PANTALLA DE CARGA INICIAL
  // -------------------------------------------------------------
  if (loading || !minLoadingTime) {
    return (
      <LoadingScreen
        institucion={institucion}
        text="Cargando"
        duration={2000}
        onFinish={() => {}}
        tubeSize={280}
        gearSize={80}
        gearPosition={{ bottom: '-5%', right: '25%' }}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDERIZADO PRINCIPAL (DOM ORQUESTADO)
  // -------------------------------------------------------------
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* CABECERA PRINCIPAL */}
      <Header data={institucion} />

      {/* SECCIÓN 1: HERO / PORTADAS */}
      <HeroSection 
        institucion={institucion} 
        portadas={contenido?.portada} 
        colors={colors} 
      />

      {/* SECCIÓN 2: EXPLORA NUESTRA INSTITUCIÓN */}
      <ExploraSection 
        links={recursos?.linksExternoInterno} 
        colors={colors} 
      />

      {/* SECCIÓN 3: AUTORIDADES */}
      <AutoridadesSection 
        autoridades={autoridades} 
        colors={colors} 
      />

      {/* SECCIÓN 4: SOBRE NOSOTROS (Misión / Visión) */}
      <SobreNosotrosSection 
        institucion={institucion} 
        colors={colors} 
      />

      {/* SECCIÓN 5: PUBLICACIONES Y NOTICIAS */}
      <PublicacionesSection 
        publicacionesOrdenadas={publicacionesOrdenadas} 
        colors={colors} 
      />

      {/* SECCIÓN 6: FORMULARIO Y CONTACTO */}
      <ContactoSection 
        institucion={institucion} 
        colors={colors} 
      />

      {/* PIE DE PÁGINA */}
      <Footer data={institucion} />
      
    </div>
  );
}

export default App;