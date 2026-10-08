import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import StandardGrid from "../components/grids/StandardGrid";
import DocumentCard from "../components/cards/DocumentCard";
import { FaCalendarAlt } from "react-icons/fa";

export default function HorariosPage() {
  const { institucion, recursos, loading, contenido } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [filtroActivo, setFiltroActivo] = useState("TODOS");

  const getPdfUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/documentos/gacetas/${path}`;
  };

  const horariosItems = useMemo(() => {
    const list = recursos?.upea_gaceta_universitaria || [];
    return list
      .filter((gac) => {
        const tipo = gac.gaceta_tipo?.toUpperCase() || "";
        const titulo = gac.gaceta_titulo?.toUpperCase() || "";
        return tipo.includes("HORARIO") || titulo.includes("HORARIO");
      })
      .map((gac) => ({
        id: gac.gaceta_id,
        titulo: gac.gaceta_titulo,
        fecha: gac.gaceta_fecha,
        enlace: gac.gaceta_documento,
        tipo: gac.gaceta_tipo || "HORARIO",
      }))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [recursos]);

  const categorias = useMemo(() => {
    return [
      "TODOS",
      ...Array.from(new Set(horariosItems.map((a) => a.tipo || "HORARIO"))),
    ];
  }, [horariosItems]);

  const itemsFiltrados = useMemo(() => {
    return filtroActivo === "TODOS"
      ? horariosItems
      : horariosItems.filter(
          (a) => (a.tipo?.toUpperCase() || "") === filtroActivo.toUpperCase()
        );
  }, [filtroActivo, horariosItems]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Horarios Académicos"
        description="Consulta los horarios de clases para cada semestre de la carrera."
        colors={colors} 
        portadas={contenido?.portada} 
        logo={institucion?.institucion_logo}
      />

      <section className="page-background" style={{
          padding: "3rem 1.5rem",
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
          {horariosItems.length > 0 ? (
            <>
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
                isEmpty={itemsFiltrados.length === 0}
                emptyMessage="No hay horarios disponibles en esta categoría."
                colors={colors}
              >
                {itemsFiltrados.map((horario, idx) => (
                  <DocumentCard
                    key={horario.id}
                    title={horario.titulo}
                    dateStr={horario.fecha}
                    documentUrl={getPdfUrl(horario.enlace)}
                    tag={horario.tipo}
                    colors={colors}
                    index={idx}
                  />
                ))}
              </StandardGrid>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <FaCalendarAlt size={64} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
              <h3 style={{ color: "#475569", fontSize: "1.5rem" }}>Horarios en Actualización</h3>
              <p style={{ color: "#94a3b8", marginTop: "1rem" }}>
                Los horarios académicos están siendo actualizados. Por favor, vuelve a revisar más tarde.
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
