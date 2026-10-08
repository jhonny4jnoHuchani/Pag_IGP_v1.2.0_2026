import { useCarreraData } from "../lib/api";
import { motion } from 'framer-motion';
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

      <section style={{
          padding: "6rem 0",
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
          minHeight: "600px",
          position: 'relative', overflow: 'hidden'}}
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
          style={{ maxWidth: '1200px', position: 'relative', zIndex: 2, margin: "0 auto", padding: "0 2rem" }}
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
