import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import InfoBlock from "../components/cards/InfoBlock";
import { FaBullseye, FaEye, FaTrophy } from "react-icons/fa";

export default function MisionPage() {
  const { institucion, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);

  const blocks = [
    {
      id: "mision",
      label: "Nuestra Misión",
      icon: <FaBullseye size={32} />,
      content: institucion?.institucion_mision,
      color: colors.primary,
    },
    {
      id: "vision",
      label: "Nuestra Visión",
      icon: <FaEye size={32} />,
      content: institucion?.institucion_vision,
      color: colors.secondary,
    },
    {
      id: "objetivos",
      label: "Objetivos de la Carrera",
      icon: <FaTrophy size={32} />,
      content: institucion?.institucion_objetivos,
      color: colors.tertiary || colors.primary,
    },
  ].filter((b) => b.content);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Misión y Visión"
        description={
          institucion?.institucion_nombre ||
          "Conoce el rumbo de nuestra institución"
        }
        colors={colors} portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />

      <section
        style={{
          padding: "6rem 0",
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
          minHeight: "600px",
        }}
      >
        <div
          style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}
        >
          {blocks.length > 0 ? (
            blocks.map((b, idx) => (
              <InfoBlock
                key={b.id}
                id={b.id}
                label={b.label}
                icon={b.icon}
                content={b.content!}
                color={b.color}
                index={idx}
              />
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              No hay información disponible.
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
