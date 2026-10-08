import { useState, useMemo, useEffect } from "react";
import { sanitizeHtml } from '../utils/sanitize';
import { motion, AnimatePresence } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import MasonryGrid from "../components/grids/MasonryGrid";
import ImageCard from "../components/cards/ImageCard";
import {
  FaTimes,
  FaFilePdf,
  FaCalendarAlt,
  FaClock,
  FaUserEdit,
} from "react-icons/fa";

function tiempoLectura(html: string): number {
  const texto = html.replace(/<[^>]+>/g, " ");
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}

export default function PublicacionesPage() {
  const { institucion, recursos, contenido, loading } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [publicacionModal, setPublicacionModal] = useState<any>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPublicacionModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const publicaciones = useMemo(() => {
    return (recursos?.upea_publicaciones || [])
      .filter((pub) => pub.publicaciones_id)
      .sort(
        (a, b) =>
          new Date(b.publicaciones_fecha).getTime() -
          new Date(a.publicaciones_fecha).getTime(),
      );
  }, [recursos]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Publicaciones"
        description="Publicaciones y Producción Científica"
        colors={colors}
        portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />

      <section
        style={{
          padding: "4rem 1.5rem",
          background: "#f8fafc",
          minHeight: "600px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <MasonryGrid
            isEmpty={publicaciones.length === 0}
            emptyMessage="No hay publicaciones disponibles."
            colors={colors}
          >
            {publicaciones.map((pub, idx) => (
              <ImageCard
                key={pub.publicaciones_id}
                title={pub.publicaciones_titulo}
                description={pub.publicaciones_descripcion}
                imageUrl={
                  pub.publicaciones_imagen
                    ? getImageUrl(pub.publicaciones_imagen)
                    : null
                }
                dateStr={pub.publicaciones_fecha}
                tag={pub.publicaciones_tipo || "Publicación"}
                colors={colors}
                author={pub.publicaciones_autor}
                index={idx}
                onClick={() => setPublicacionModal(pub)}
              />
            ))}
          </MasonryGrid>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {publicacionModal && (
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
            onClick={() => setPublicacionModal(null)}
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
                onClick={() => setPublicacionModal(null)}
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

              {publicacionModal.publicaciones_imagen && (
                <div
                  style={{
                    width: "100%",
                    height: "300px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <img
                    src={getImageUrl(publicacionModal.publicaciones_imagen)}
                    alt="Pub"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      background: "#000",
                      borderRadius: "12px",
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
                {publicacionModal.publicaciones_titulo}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                  color: "#64748b",
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaCalendarAlt />{" "}
                  {new Date(
                    publicacionModal.publicaciones_fecha,
                  ).toLocaleDateString()}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaClock />{" "}
                  {tiempoLectura(
                    publicacionModal.publicaciones_descripcion || "",
                  )}{" "}
                  min lectura
                </div>
                {publicacionModal.publicaciones_autor && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FaUserEdit /> {publicacionModal.publicaciones_autor}
                  </div>
                )}
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(publicacionModal.publicaciones_descripcion,) }}
                style={{
                  lineHeight: 1.6,
                  color: "#334155",
                  marginBottom: "2rem",
                }}
              />

              {publicacionModal.publicaciones_documento && (
                <a
                  href={publicacionModal.publicaciones_documento}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem",
                    background: colors.secondary,
                    color: "#fff",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  <FaFilePdf size={18} /> Descargar Documento PDF
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
