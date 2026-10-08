import { useState, useEffect } from "react";
import { sanitizeHtml } from '../utils/sanitize';
import { motion, AnimatePresence } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import StandardGrid from "../components/grids/StandardGrid";
import OfertaCard from "../components/cards/OfertaCard";
import {
  FaTimes,
  FaCalendarAlt,
  FaClipboardList,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function OfertasAcademicasPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);
  const [ofertaModal, setOfertaModal] = useState<any>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOfertaModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const ofertas =
    recursos?.ofertasAcademicas
      ?.filter((o) => o.ofertas_estado === 1)
      .sort(
        (a, b) =>
          new Date(b.ofertas_inscripciones_ini).getTime() -
          new Date(a.ofertas_inscripciones_ini).getTime(),
      ) || [];

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Ofertas Académicas"
        description="Convocatorias, pasantías y oportunidades laborales."
        colors={colors} portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />

      <section style={{
          padding: "4rem 1.5rem",
          background: "#f8fafc",
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

        <div style={{ maxWidth: '1200px', position: 'relative', zIndex: 2, margin: "0 auto" }}>
          <StandardGrid
            isEmpty={ofertas.length === 0}
            emptyMessage="No hay ofertas académicas disponibles."
            colors={colors}
          >
            {ofertas.map((oferta, idx) => (
              <OfertaCard
                key={oferta.ofertas_id}
                titulo={oferta.ofertas_titulo}
                descripcion={oferta.ofertas_descripcion}
                imageUrl={
                  oferta.ofertas_imagen
                    ? getImageUrl(oferta.ofertas_imagen)
                    : null
                }
                fechaInicio={oferta.ofertas_inscripciones_ini}
                fechaFin={oferta.ofertas_inscripciones_fin}
                colors={colors}
                index={idx}
                onClick={() => setOfertaModal(oferta)}
              />
            ))}
          </StandardGrid>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {ofertaModal && (
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
            onClick={() => setOfertaModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "#fff",
                borderRadius: "16px",
                maxWidth: "800px",
                width: "100%",
                padding: "2rem",
                cursor: "default",
                position: "relative",
                overflow: "auto",
                maxHeight: "90vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOfertaModal(null)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  zIndex: 10,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTimes />
              </button>

              {ofertaModal.ofertas_imagen && (
                <div
                  style={{
                    width: "100%",
                    height: "280px",
                    marginBottom: "1.5rem",
                    overflow: "hidden",
                    borderRadius: "12px",
                  }}
                >
                  <img
                    src={getImageUrl(ofertaModal.ofertas_imagen)}
                    alt="Img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      background: "#000",
                    }}
                  />
                </div>
              )}

              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  marginBottom: "1rem",
                }}
              >
                {ofertaModal.ofertas_titulo}
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "12px",
                }}
              >
                <div>
                  <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    <FaCalendarAlt /> Inscripciones Inicio
                  </span>
                  <br />
                  <b>
                    {new Date(
                      ofertaModal.ofertas_inscripciones_ini,
                    ).toLocaleDateString()}
                  </b>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    <FaCalendarAlt /> Inscripciones Fin
                  </span>
                  <br />
                  <b>
                    {new Date(
                      ofertaModal.ofertas_inscripciones_fin,
                    ).toLocaleDateString()}
                  </b>
                </div>
                {ofertaModal.ofertas_fecha_examen && (
                  <div>
                    <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                      <FaClipboardList /> Fecha Examen
                    </span>
                    <br />
                    <b>
                      {new Date(
                        ofertaModal.ofertas_fecha_examen,
                      ).toLocaleDateString()}
                    </b>
                  </div>
                )}
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(ofertaModal.ofertas_descripcion,) }}
                style={{
                  lineHeight: 1.6,
                  color: "#334155",
                  marginBottom: "2rem",
                }}
              />

              {ofertaModal.ofertas_referencia && (
                <div
                  style={{
                    padding: "1rem",
                    background: "#fef3c7",
                    borderRadius: "12px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      color: "#d97706",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    <FaMapMarkerAlt /> Referencia/Contacto
                  </span>
                  <p style={{ margin: 0, fontWeight: 700 }}>
                    {ofertaModal.ofertas_referencia}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
