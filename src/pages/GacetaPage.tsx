import { useCarreraData } from '../lib/api';
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
      
      <section style={{ padding: '4rem 1.5rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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