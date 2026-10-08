import { useState, useMemo } from "react";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import MasonryGrid from "../components/grids/MasonryGrid";
import ImageCard from "../components/cards/ImageCard";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function ComunicadosPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("TODOS");

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  const todosLosComunicados = useMemo(() => {
    const pubs = (recursos?.upea_publicaciones || [])
      .filter((pub) => {
        const titulo = pub.publicaciones_titulo?.toUpperCase() || "";
        const tipo = pub.publicaciones_tipo?.toUpperCase() || "";
        return titulo.includes("COMUNICADO") || tipo.includes("COMUNICADO");
      })
      .map((pub) => ({
        id: `pub-${pub.publicaciones_id}`,
        titulo: pub.publicaciones_titulo,
        descripcion: pub.publicaciones_descripcion,
        fecha: pub.publicaciones_fecha,
        imagen: pub.publicaciones_imagen,
        tipo: pub.publicaciones_tipo || "COMUNICADO",
        autor: pub.publicaciones_autor,
        enlace: pub.publicaciones_documento || "#",
        fuente: "publicaciones",
      }));

    const convs = (recursos?.convocatorias || [])
      .filter((conv) => {
        return (
          (conv.tipo_conv_comun?.tipo_conv_comun_titulo || "").toUpperCase() ===
            "COMUNICADOS" && conv.con_estado === "1"
        );
      })
      .map((conv) => ({
        id: `conv-${conv.idconvocatorias}`,
        titulo: conv.con_titulo,
        descripcion: conv.con_descripcion,
        fecha: conv.con_fecha_inicio,
        imagen: conv.con_foto_portada,
        tipo: conv.tipo_conv_comun?.tipo_conv_comun_titulo || "COMUNICADO",
        autor: "DIRECCIÓN",
        enlace: "#",
        fuente: "convocatorias",
      }));

    return [...pubs, ...convs].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );
  }, [recursos]);

  const comunicados = useMemo(() => {
    let result =
      filtroActivo === "TODOS"
        ? todosLosComunicados
        : todosLosComunicados.filter((c) => c.fuente === filtroActivo);
    const termino = busqueda.trim().toLowerCase();
    if (termino) {
      result = result.filter(
        (e) =>
          e.titulo?.toLowerCase().includes(termino) ||
          e.descripcion?.toLowerCase().includes(termino),
      );
    }
    return result;
  }, [busqueda, filtroActivo, todosLosComunicados]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Comunicados Oficiales"
        description="Información, noticias y avisos clasificados."
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
              flexDirection: "column",
              gap: "1rem",
              maxWidth: "600px",
              margin: "0 auto 3rem",
            }}
          >
            <div style={{ position: "relative" }}>
              <FaSearch
                style={{
                  position: "absolute",
                  left: "1.2rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar comunicado..."
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem 0.9rem 3rem",
                  borderRadius: "50px",
                  border: `2px solid ${colors.primary}40`,
                }}
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FaTimes color="#64748b" />
                </button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              {["TODOS", "publicaciones", "convocatorias"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltroActivo(cat)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    border: "none",
                    background:
                      filtroActivo === cat ? colors.primary : "#e2e8f0",
                    color: filtroActivo === cat ? "#fff" : "#475569",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                  }}
                >
                  {cat === "TODOS" ? "Todos" : cat}
                </button>
              ))}
            </div>
          </div>

          <MasonryGrid
            isEmpty={comunicados.length === 0}
            emptyMessage="No hay comunicados para mostrar."
            colors={colors}
          >
            {comunicados.map((item, idx) => (
              <ImageCard
                key={item.id}
                title={item.titulo}
                description={item.descripcion}
                imageUrl={getImageUrl(item.imagen)}
                dateStr={item.fecha}
                tag={item.tipo}
                tagColor={
                  item.fuente === "publicaciones" ? colors.primary : "#f59e0b"
                }
                colors={colors}
                author={item.autor}
                index={idx}
              />
            ))}
          </MasonryGrid>
        </div>
      </section>
    </MainLayout>
  );
}
