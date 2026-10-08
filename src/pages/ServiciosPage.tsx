import { useState, useEffect } from "react";
import { sanitizeHtml } from '../utils/sanitize';
import { motion, AnimatePresence } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import StandardGrid from "../components/grids/StandardGrid";
import ImageCard from "../components/cards/ImageCard";
import { FaPhone, FaWhatsapp, FaTimes } from "react-icons/fa";

export default function ServiciosPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);
  const [servicioModal, setServicioModal] = useState<any>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicioModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const servicios =
    recursos?.serviciosCarrera
      ?.filter((serv) => serv.serv_active === "1")
      .sort((a, b) => a.serv_id - b.serv_id) || [];

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Servicios"
        description={
          institucion?.institucion_nombre ||
          "Servicios que ofrecemos a la comunidad"
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
          style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 2rem" }}
        >
          <StandardGrid
            isEmpty={servicios.length === 0}
            emptyMessage="No hay servicios disponibles."
            colors={colors}
          >
            {servicios.map((servicio, idx) => (
              <ImageCard
                key={servicio.serv_id}
                title={servicio.serv_nombre}
                description={servicio.serv_descripcion}
                imageUrl={
                  servicio.serv_imagen
                    ? getImageUrl(servicio.serv_imagen)
                    : null
                }
                tag="SERVICIO"
                colors={colors}
                index={idx}
                onClick={() => setServicioModal(servicio)}
              >
                {servicio.serv_nro_celular && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: "#FFD700",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "1rem",
                      background: "rgba(255,255,255,0.05)",
                      marginTop: "auto",
                    }}
                  >
                    <FaPhone size={11} /> {servicio.serv_nro_celular}
                  </div>
                )}
              </ImageCard>
            ))}
          </StandardGrid>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {servicioModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.9)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              overflow: "auto",
            }}
            onClick={() => setServicioModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "#fff",
                borderRadius: "16px",
                maxWidth: "700px",
                width: "100%",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: "1.5rem",
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  color: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
                  {servicioModal.serv_nombre}
                </h2>
                <button
                  onClick={() => setServicioModal(null)}
                  style={{
                    background: "transparent",
                    color: "#fff",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {servicioModal.serv_imagen && (
                <div
                  style={{ width: "100%", height: "280px", overflow: "hidden" }}
                >
                  <img
                    src={getImageUrl(servicioModal.serv_imagen)}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <div style={{ padding: "2rem" }}>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    marginBottom: "2rem",
                  }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(servicioModal.serv_descripcion,) }}
                />

                {servicioModal.serv_nro_celular && (
                  <a
                    href={`https://wa.me/591${servicioModal.serv_nro_celular.toString().replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      padding: "1.1rem 2rem",
                      background: "#25D366",
                      color: "#fff",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    <FaWhatsapp size={20} /> Contactar por WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
