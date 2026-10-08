import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import MasonryGrid from "../components/grids/MasonryGrid";
import ImageCard from "../components/cards/ImageCard";
import { FaTimes } from "react-icons/fa";

export default function AvisosPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);
  const [filtroActivo, setFiltroActivo] = useState("TODOS");
  const [imagenModal, setImagenModal] = useState<string | null>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setImagenModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const todosLosAvisos = useMemo(() => {
    return (recursos?.upea_publicaciones || [])
      .filter((pub) => {
        const titulo = pub.publicaciones_titulo?.toUpperCase() || "";
        const tipo = pub.publicaciones_tipo?.toUpperCase() || "";
        return (
          titulo.includes("AVISO") ||
          titulo.includes("COMUNICADO") ||
          tipo.includes("AVISO") ||
          tipo.includes("COMUNICADO") ||
          tipo.includes("GACETA") ||
          titulo.includes("GACETA")
        );
      })
      .map((pub) => ({
        id: pub.publicaciones_id,
        titulo: pub.publicaciones_titulo,
        descripcion: pub.publicaciones_descripcion,
        fecha: pub.publicaciones_fecha,
        imagen: pub.publicaciones_imagen,
        tipo: pub.publicaciones_tipo || "AVISO",
        autor: pub.publicaciones_autor,
        enlace: pub.publicaciones_documento || "#",
      }))
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
  }, [recursos]);

  const categorias = useMemo(() => {
    return [
      "TODOS",
      ...Array.from(new Set(todosLosAvisos.map((a) => a.tipo || "AVISO"))),
    ];
  }, [todosLosAvisos]);

  const avisosFiltrados = useMemo(() => {
    return filtroActivo === "TODOS"
      ? todosLosAvisos
      : todosLosAvisos.filter(
          (a) =>
            (a.tipo?.toUpperCase() || "") === filtroActivo.toUpperCase() ||
            (a.titulo?.toUpperCase() || "").includes(
              filtroActivo.toUpperCase(),
            ),
        );
  }, [filtroActivo, todosLosAvisos]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Avisos y Comunicados"
        description="Información de interés general para la comunidad académica."
        colors={colors} portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />

      <section
        style={{
          padding: "3rem 1.5rem",
          background: "#f8fafc",
          minHeight: "600px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "3rem",
            }}
          >
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroActivo(cat)}
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "50px",
                  border: "none",
                  background: filtroActivo === cat ? colors.primary : "#e2e8f0",
                  color: filtroActivo === cat ? "#fff" : "#475569",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <MasonryGrid
            isEmpty={avisosFiltrados.length === 0}
            emptyMessage="No hay avisos disponibles en esta categoría."
            colors={colors}
          >
            {avisosFiltrados.map((aviso, idx) => (
              <ImageCard
                key={aviso.id}
                title={aviso.titulo}
                description={aviso.descripcion}
                imageUrl={aviso.imagen ? getImageUrl(aviso.imagen) : null}
                dateStr={aviso.fecha}
                tag={aviso.tipo}
                colors={colors}
                author={aviso.autor}
                linkUrl={aviso.enlace !== "#" ? aviso.enlace : undefined}
                index={idx}
                onImageClick={
                  aviso.imagen
                    ? () => setImagenModal(getImageUrl(aviso.imagen))
                    : undefined
                }
              />
            ))}
          </MasonryGrid>
        </div>
      </section>

      {/* Modal de Imagen */}
      <AnimatePresence>
        {imagenModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.95)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              cursor: "zoom-out",
            }}
            onClick={() => setImagenModal(null)}
          >
            <button
              onClick={() => setImagenModal(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
                fontSize: "1.2rem",
                cursor: "pointer",
                zIndex: 10000,
              }}
            >
              <FaTimes />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "1200px",
                maxHeight: "85vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={imagenModal}
                alt="Vista ampliada"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
