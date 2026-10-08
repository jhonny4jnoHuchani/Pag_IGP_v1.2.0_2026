import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import ProfileCard from "../components/cards/ProfileCard";

export default function AutoridadesPage() {
  const { institucion, contenido, loading } = useCarreraData();
  const colors = useThemeColors(institucion);

  const autoridades = contenido?.autoridad ?? [];

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Nuestras Autoridades"
        description={
          institucion?.institucion_nombre || "Ingeniería de Gas y Petroquímica"
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
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}
        >
          {autoridades.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2.5rem",
                maxWidth: "1100px",
                margin: "0 auto",
              }}
            >
              {autoridades.map((auth, idx) => (
                <ProfileCard
                  key={auth.id_autoridad}
                  id={auth.id_autoridad}
                  name={auth.nombre_autoridad}
                  role={auth.cargo_autoridad}
                  imageUrl={getImageUrl(auth.foto_autoridad)}
                  whatsapp={auth.celular_autoridad}
                  facebook={auth.facebook_autoridad}
                  colors={colors as any}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                color: "#94a3b8",
              }}
            >
              <p style={{ fontSize: "1.1rem" }}>
                Actualmente no hay autoridades registradas.
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
