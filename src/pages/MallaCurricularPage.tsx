import { useCarreraData } from "../lib/api";
import { motion } from 'framer-motion';
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import StandardGrid from "../components/grids/StandardGrid";
import DocumentCard from "../components/cards/DocumentCard";

export default function MallaCurricularPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);

  const getPdfUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas/${path}`;
  };

  const mallas = (recursos?.upea_gaceta_universitaria || [])
    .filter(
      (gac) =>
        gac.gaceta_tipo?.toUpperCase() === "MALLA CURRICULAR" &&
        gac.gaceta_documento,
    )
    .sort(
      (a, b) =>
        new Date(b.gaceta_fecha).getTime() - new Date(a.gaceta_fecha).getTime(),
    );

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Malla Curricular"
        description={institucion?.institucion_nombre || "Documentos Académicos"}
        colors={colors} portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />

      <section className="page-background" style={{ padding: "4rem 0", minHeight: "600px" , position: 'relative', overflow: 'hidden'}}
      >

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

        <div
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}
        >
          <StandardGrid
            isEmpty={mallas.length === 0}
            emptyMessage="No hay malla curricular disponible."
            colors={colors}
          >
            {mallas.map((malla, idx) => (
              <DocumentCard
                key={malla.gaceta_id}
                title={malla.gaceta_titulo}
                documentUrl={getPdfUrl(malla.gaceta_documento)}
                dateStr={malla.gaceta_fecha}
                tag="MALLA CURRICULAR"
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
