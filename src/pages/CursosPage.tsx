import { useState, useMemo, useEffect } from "react";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import StandardGrid from "../components/grids/StandardGrid";
import ImageCard from "../components/cards/ImageCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGraduationCap } from "react-icons/fa";

export default function CursosPage() {
  const { institucion, recursos, loading, contenido } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [filtroActivo, setFiltroActivo] = useState("TODOS");
  const [cursoModal, setCursoModal] = useState<any>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCursoModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const todosLosCursos = useMemo(() => {
    return (recursos?.cursos || [])
      .filter((curso) => {
        const tipoCurso =
          curso.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || "";
        const titulo = curso.det_titulo?.toUpperCase() || "";
        return (
          (tipoCurso === "CURSOS" ||
            tipoCurso === "DIPLOMADO" ||
            titulo.includes("CURSO")) &&
          curso.det_estado === "1"
        );
      })
      .sort(
        (a, b) =>
          new Date(b.det_fecha_ini).getTime() -
          new Date(a.det_fecha_ini).getTime(),
      );
  }, [recursos]);

  const categorias = useMemo(() => {
    return [
      "TODOS",
      ...Array.from(
        new Set(
          todosLosCursos
            .map((c) => c.tipo_curso_otro?.tipo_conv_curso_nombre || "CURSO")
            .filter((t) => t !== "SEMINARIOS")
            .filter(Boolean),
        ),
      ),
    ];
  }, [todosLosCursos]);

  const cursosFiltrados = useMemo(() => {
    return filtroActivo === "TODOS"
      ? todosLosCursos
      : todosLosCursos.filter((c) => {
          const tipo =
            c.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || "";
          return tipo === filtroActivo.toUpperCase();
        });
  }, [filtroActivo, todosLosCursos]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Cursos"
        description={
          institucion?.institucion_nombre || "Desarrollo académico continuo"
        }
        colors={colors}
        portadas={contenido?.portada}
        logo={institucion?.institucion_logo}
      />

      <section
        className="page-background"
        style={{
          padding: "3rem 1.5rem",
          minHeight: "600px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* DECORADORES EXTERNOS ANIMADOS */}
        <motion.img
          src="/decoradores/decor_static/cometa.png"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "120px",
            zIndex: 1,
            opacity: 0.6,
          }}
        />
        <motion.img
          src="/Decoradores_gas_petroqumica/decoradoresestaticos/cuadrado_punteado_rojo.png"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "15%",
            right: "8%",
            width: "100px",
            mixBlendMode: "screen",
            zIndex: 1,
            opacity: 0.5,
          }}
        />
        <motion.img
          src="/decoradores/decor_static/3_lineas_siksak.png"
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: "80px",
            zIndex: 1,
            opacity: 0.6,
          }}
        />
        <motion.img
          src="/Decoradores_gas_petroqumica/decoradoresestaticos/objeto_combinado.png"
          animate={{ y: [0, 20, 0], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "140px",
            mixBlendMode: "screen",
            zIndex: 1,
            opacity: 0.6,
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            position: "relative",
            zIndex: 2,
            margin: "0 auto",
          }}
        >
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

          <StandardGrid
            isEmpty={cursosFiltrados.length === 0}
            emptyMessage="No hay cursos disponibles actualmente."
            colors={colors}
          >
            {cursosFiltrados.map((curso, idx) => (
              <ImageCard
                key={curso.iddetalle_cursos_academicos}
                title={curso.det_titulo}
                description={
                  curso.det_descripcion +
                  `<br/><br/><b>Costo:</b> ${curso.det_costo ? "Bs. " + curso.det_costo : "Gratuito"} <br/> <b>Modalidad:</b> ${curso.det_modalidad || "N/A"}`
                }
                imageUrl={
                  curso.det_img_portada
                    ? getImageUrl(curso.det_img_portada)
                    : null
                }
                dateStr={curso.det_fecha_ini}
                tag={curso.tipo_curso_otro?.tipo_conv_curso_nombre || "CURSO"}
                colors={colors}
                index={idx}
                onClick={() => setCursoModal(curso)}
              />
            ))}
          </StandardGrid>
        </div>
      </section>

      {/* MODAL LIGERO */}
      <AnimatePresence>
        {cursoModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.92)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              cursor: "zoom-out",
            }}
            onClick={() => setCursoModal(null)}
          >
            <motion.button
              onClick={() => setCursoModal(null)}
              style={{
                position: "fixed",
                top: "1.5rem",
                right: "1.5rem",
                zIndex: 10000,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaTimes />
            </motion.button>

            {cursoModal.det_img_portada ? (
              <motion.img
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                src={getImageUrl(cursoModal.det_img_portada)}
                alt="Curso"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  borderRadius: "12px",
                  cursor: "default",
                }}
              />
            ) : (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "320px",
                  height: "320px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#333",
                  borderRadius: "12px",
                  color: "#555",
                  fontSize: "4rem",
                }}
              >
                <FaGraduationCap />
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
