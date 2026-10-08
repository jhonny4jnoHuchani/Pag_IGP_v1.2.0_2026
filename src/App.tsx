import { useState, useEffect, useMemo } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useCarreraData, type Publicacion, type Autoridad } from './lib/api';
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

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Fondo animado y gigante */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: 'clamp(10rem, 30vw, 40rem)', fontWeight: 900, color: '#dc2626', lineHeight: 0.8, letterSpacing: '-0.05em' }}>
            503
          </span>
        </div>

        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, #dc262640 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulse 4s infinite'
        }}></div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '30px',
          padding: 'clamp(2rem, 5vw, 4rem)',
          textAlign: 'center',
          maxWidth: '600px',
          width: '90%',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ 
            color: '#f87171', 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
            fontWeight: 800, 
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Servidor Inaccesible
          </h2>
          <p style={{ 
            color: '#cbd5e1', 
            fontSize: '1.2rem', 
            lineHeight: 1.6, 
            marginBottom: '2.5rem' 
          }}>
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '1rem 3rem', 
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50px', 
              cursor: 'pointer', 
              fontWeight: 700, 
              fontSize: '1.1rem',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.4)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(220, 38, 38, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(220, 38, 38, 0.4)';
            }}
          >
            Reintentar Conexión
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