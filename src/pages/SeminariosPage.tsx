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
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaWhatsapp,
  FaLaptop,
  FaBuilding,
  FaUsers,
} from "react-icons/fa";

export default function SeminariosPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);
  const [filtroActivo, setFiltroActivo] = useState("TODOS");
  const [seminarioModal, setSeminarioModal] = useState<any>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSeminarioModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const todosLosSeminarios = useMemo(() => {
    return (recursos?.cursos || [])
      .filter((curso) => {
        const tipoCurso =
          curso.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || "";
        const titulo = curso.det_titulo?.toUpperCase() || "";
        return (
          (tipoCurso === "SEMINARIOS" || titulo.includes("SEMINARIO")) &&
          curso.det_estado === "1"
        );
      })
      .sort(
        (a, b) =>
          new Date(b.det_fecha_ini).getTime() -
          new Date(a.det_fecha_ini).getTime(),
      );
  }, [recursos]);

  const seminariosFiltrados = useMemo(() => {
    return filtroActivo === "TODOS"
      ? todosLosSeminarios
      : todosLosSeminarios.filter((s) => {
          const tipo =
            s.tipo_curso_otro?.tipo_conv_curso_nombre?.toUpperCase() || "";
          const titulo = s.det_titulo?.toUpperCase() || "";
          return (
            tipo === filtroActivo.toUpperCase() ||
            titulo.includes(filtroActivo.toUpperCase())
          );
        });
  }, [filtroActivo, todosLosSeminarios]);

  const categorias = useMemo(() => {
    return [
      "TODOS",
      ...Array.from(
        new Set(
          todosLosSeminarios
            .map((s) =>
              s.tipo_curso_otro?.tipo_conv_curso_nombre === "CURSOS"
                ? "SEMINARIO"
                : s.tipo_curso_otro?.tipo_conv_curso_nombre || "SEMINARIO",
            )
            .filter(Boolean),
        ),
      ),
    ];
  }, [todosLosSeminarios]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Seminarios"
        description={
          institucion?.institucion_nombre ||
          "Desarrollo académico y conferencias"
        }
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
                  border: `2px solid ${filtroActivo === cat ? colors.primary : "#e2e8f0"}`,
                  background:
                    filtroActivo === cat ? colors.primary : "transparent",
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
            isEmpty={seminariosFiltrados.length === 0}
            emptyMessage="No hay seminarios disponibles."
            colors={colors}
          >
            {seminariosFiltrados.map((seminario, idx) => (
              <ImageCard
                key={seminario.iddetalle_cursos_academicos}
                title={seminario.det_titulo}
                description={seminario.det_descripcion}
                imageUrl={
                  seminario.det_img_portada
                    ? getImageUrl(seminario.det_img_portada)
                    : null
                }
                dateStr={seminario.det_fecha_ini}
                tag={
                  seminario.tipo_curso_otro?.tipo_conv_curso_nombre ||
                  "SEMINARIO"
                }
                colors={colors}
                index={idx}
                onClick={() => setSeminarioModal(seminario)}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "1rem",
                    flexWrap: "wrap",
                    fontSize: "0.7rem",
                    color: "#cbd5e1",
                  }}
                >
                  {seminario.det_carga_horaria > 0 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <FaClock /> {seminario.det_carga_horaria}h
                    </span>
                  )}
                  {seminario.det_modalidad && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      {seminario.det_modalidad === "VIRTUAL" ? (
                        <FaLaptop />
                      ) : (
                        <FaBuilding />
                      )}{" "}
                      {seminario.det_modalidad}
                    </span>
                  )}
                  {seminario.det_costo > 0 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        color: "#FFD700",
                        fontWeight: "bold",
                      }}
                    >
                      <FaMoneyBillWave /> Bs. {seminario.det_costo}
                    </span>
                  )}
                </div>
              </ImageCard>
            ))}
          </MasonryGrid>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {seminarioModal && (
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
            onClick={() => setSeminarioModal(null)}
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
                onClick={() => setSeminarioModal(null)}
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

              {seminarioModal.det_img_portada && (
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
                    src={getImageUrl(seminarioModal.det_img_portada)}
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
                {seminarioModal.det_titulo}
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
                    <FaCalendarAlt /> Inicio
                  </span>
                  <br />
                  <b>
                    {new Date(
                      seminarioModal.det_fecha_ini,
                    ).toLocaleDateString()}
                  </b>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    <FaClock /> Duración
                  </span>
                  <br />
                  <b>{seminarioModal.det_carga_horaria} horas</b>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {seminarioModal.det_modalidad === "VIRTUAL" ? (
                      <FaLaptop />
                    ) : (
                      <FaBuilding />
                    )}{" "}
                    Modalidad
                  </span>
                  <br />
                  <b>{seminarioModal.det_modalidad}</b>
                </div>
                {seminarioModal.det_costo > 0 && (
                  <div>
                    <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                      <FaMoneyBillWave /> Costo
                    </span>
                    <br />
                    <b style={{ color: colors.primary }}>
                      Bs. {seminarioModal.det_costo}
                    </b>
                  </div>
                )}
                {seminarioModal.det_cupo_max > 0 && (
                  <div>
                    <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                      <FaUsers /> Cupos
                    </span>
                    <br />
                    <b>{seminarioModal.det_cupo_max}</b>
                  </div>
                )}
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(seminarioModal.det_descripcion,) }}
                style={{
                  lineHeight: 1.6,
                  color: "#334155",
                  marginBottom: "2rem",
                }}
              />

              {seminarioModal.det_grupo_whatssap && (
                <a
                  href={
                    seminarioModal.det_grupo_whatssap.startsWith("http")
                      ? seminarioModal.det_grupo_whatssap
                      : `https://${seminarioModal.det_grupo_whatssap}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem",
                    background: "#25D366",
                    color: "#fff",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  <FaWhatsapp size={18} /> Contactar por WhatsApp
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
