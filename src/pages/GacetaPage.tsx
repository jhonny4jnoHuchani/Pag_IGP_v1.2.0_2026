import { useCarreraData } from '../lib/api';
import { motion } from 'framer-motion';
import { useThemeColors } from '../hooks/useThemeColors';
import MainLayout from '../components/layout/MainLayout';
import HeroBanner from '../components/layout/HeroBanner';
import StandardGrid from '../components/grids/StandardGrid';
import DocumentCard from '../components/cards/DocumentCard';

export default function GacetaPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);

  const gacetas = (recursos?.upea_gaceta_universitaria || [])
    .filter(gac => gac.gaceta_documento)
    .sort((a, b) => new Date(b.gaceta_fecha).getTime() - new Date(a.gaceta_fecha).getTime());

  const getPdfUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas/${path}`;
  };

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner 
        title="Gaceta Universitaria" 
        description="Documentación oficial, resoluciones y normativas de la carrera."
        colors={colors} portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />
      
      <section style={{ padding: '4rem 1.5rem', background: '#f8fafc' , position: 'relative', overflow: 'hidden'}}>

        {/* DECORADORES EXTERNOS ANIMADOS */}
        <motion.img 
          src="/decoradores/decor_static/cometa.png"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "10%", left: "5%", width: "120px", zIndex: 1, opacity: 0.6 }}
        />
        <motion.img 
          src="/Decoradores_gas_petroqumica/decoradoresestaticos/cuadrado_punteado_rojo.png"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "15%", right: "8%", width: "100px", mixBlendMode: "screen", zIndex: 1, opacity: 0.5 }}
        />
        <motion.img 
          src="/decoradores/decor_static/3_lineas_siksak.png"
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "20%", left: "5%", width: "80px", zIndex: 1, opacity: 0.6 }}
        />
        <motion.img 
          src="/Decoradores_gas_petroqumica/decoradoresestaticos/objeto_combinado.png"
          animate={{ y: [0, 20, 0], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "10%", right: "5%", width: "140px", mixBlendMode: "screen", zIndex: 1, opacity: 0.6 }}
        />

        <div style={{ maxWidth: '1200px', position: 'relative', zIndex: 2, margin: '0 auto' }}>
          <StandardGrid isEmpty={gacetas.length === 0} emptyMessage="No hay gacetas disponibles." colors={colors}>
            {gacetas.map((g, idx) => (
              <DocumentCard 
                key={g.gaceta_id}
                title={g.gaceta_titulo}
                dateStr={g.gaceta_fecha}
                documentUrl={getPdfUrl(g.gaceta_documento)}
                tag={g.gaceta_tipo || 'GACETA'}
                colors={colors}
                index={idx}
              />
            ))}
          </StandardGrid>
        </div>
      </section>
    </MainLayout>
  );
}