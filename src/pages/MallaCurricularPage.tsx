import { useCarreraData } from "../lib/api";
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

      <section
        style={{ padding: "4rem 0", background: "#f8fafc", minHeight: "600px" }}
      >
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
