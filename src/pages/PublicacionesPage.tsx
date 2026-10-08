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
  const [imgLayout, setImgLayout] = useState<'horizontal' | 'vertical' | null>(null);

  useEffect(() => {
    if (publicacionModal) {
      setImgLayout(null);
    }
  }, [publicacionModal]);

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

      <section className="page-background" style={{
          padding: "4rem 1.5rem",
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
                maxWidth: imgLayout === 'vertical' ? "1200px" : "900px",
                width: "100%",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: imgLayout === 'vertical' ? "row" : "column",
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
                  zIndex: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.15)"
                }}
              >
                <FaTimes />
              </button>

              {publicacionModal.publicaciones_imagen && (
                <div
                  style={{
                    flex: imgLayout === 'vertical' ? "0 0 50%" : "none",
                    width: imgLayout === 'vertical' ? "50%" : "100%",
                    height: imgLayout === 'vertical' ? "100%" : "400px",
                    background: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={getImageUrl(publicacionModal.publicaciones_imagen)}
                    alt="Pub"
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      if (naturalHeight > naturalWidth) {
                        setImgLayout('vertical');
                      } else {
                        setImgLayout('horizontal');
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      maxHeight: imgLayout === 'vertical' ? "90vh" : "100%"
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  flex: "1",
                  padding: "2.5rem",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff"
                }}
              >
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 900,
                    color: "#1e293b",
                    marginBottom: "1rem",
                    lineHeight: 1.2
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
                    fontSize: "0.95rem",
                    color: "#64748b",
                    background: "#f8fafc",
                    padding: "1rem 1.5rem",
                    borderRadius: "12px",
                    borderLeft: `4px solid ${colors?.primary || '#3b82f6'}`
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
                    <FaCalendarAlt style={{ color: colors?.primary }} />{" "}
                    {new Date(publicacionModal.publicaciones_fecha).toLocaleDateString()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaClock style={{ color: colors?.primary }} />{" "}
                    {tiempoLectura(publicacionModal.publicaciones_descripcion || "")} min lectura
                  </div>
                  {publicacionModal.publicaciones_autor && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FaUserEdit style={{ color: colors?.primary }} /> {publicacionModal.publicaciones_autor}
                    </div>
                  )}
                </div>

                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(publicacionModal.publicaciones_descripcion) }}
                  style={{
                    lineHeight: 1.6,
                    color: "#334155",
                    marginBottom: "2rem",
                    fontSize: "1.05rem"
                  }}
                />

                {publicacionModal.publicaciones_documento && (
                  <a
                    href={publicacionModal.publicaciones_documento}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "1rem",
                      background: colors.secondary || '#10b981',
                      color: "#fff",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 700,
                      transition: "transform 0.2s",
                    }}
                  >
                    <FaFilePdf size={18} /> Descargar Documento PDF
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
