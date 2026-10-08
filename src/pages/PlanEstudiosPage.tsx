import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import StandardGrid from "../components/grids/StandardGrid";
import DocumentCard from "../components/cards/DocumentCard";

export default function PlanEstudiosPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);

  const getPdfUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas/${path}`;
  };

  const planes = (recursos?.upea_gaceta_universitaria || [])
    .filter(
      (gac) =>
        gac.gaceta_tipo?.toUpperCase() === "PLAN" && gac.gaceta_documento,
    )
    .sort(
      (a, b) =>
        new Date(b.gaceta_fecha).getTime() - new Date(a.gaceta_fecha).getTime(),
    );

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Plan de Estudios"
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
            isEmpty={planes.length === 0}
            emptyMessage="No hay plan de estudios disponible."
            colors={colors}
          >
            {planes.map((plan, idx) => (
              <DocumentCard
                key={plan.gaceta_id}
                title={plan.gaceta_titulo}
                documentUrl={getPdfUrl(plan.gaceta_documento)}
                dateStr={plan.gaceta_fecha}
                tag="PLAN DE ESTUDIOS"
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
