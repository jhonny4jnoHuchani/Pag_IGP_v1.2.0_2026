import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import MasonryGrid from "../components/grids/MasonryGrid";
import ImageCard from "../components/cards/ImageCard";
import { FaTimes } from "react-icons/fa";

export default function ConvocatoriasPage() {
  const { institucion, recursos, loading, contenido } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [filtroActivo, setFiltroActivo] = useState("TODOS");
  const [imagenModal, setImagenModal] = useState<string | null>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://apiadministrador.upea.bo/storage/imagenes/convocatorias/${path}`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setImagenModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const convocatoriasItems = useMemo(() => {
    const list = recursos?.convocatorias || [];
    return list
      .filter((item) => {
        const type = (item.tipo_conv_comun?.tipo_conv_comun_titulo || "").toUpperCase();
        return (type.includes("CONVOCATORIA") || type === "CONVOCATORIAS" || type === "") && item.con_estado === "1"; 
      })
      .map((item) => ({
        id: item.idconvocatorias,
        titulo: item.con_titulo,
        descripcion: item.con_descripcion,
        fecha: item.con_fecha_inicio,
        imagen: item.con_foto_portada,
        tipo: item.tipo_conv_comun?.tipo_conv_comun_titulo || "CONVOCATORIA",
        autor: "Institución",
        enlace: "#",
      }))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [recursos]);

  const categorias = useMemo(() => {
    return [
      "TODOS",
      ...Array.from(new Set(convocatoriasItems.map((a) => a.tipo || "CONVOCATORIA"))),
    ];
  }, [convocatoriasItems]);

  const itemsFiltrados = useMemo(() => {
    return filtroActivo === "TODOS"
      ? convocatoriasItems
      : convocatoriasItems.filter(
          (a) => (a.tipo?.toUpperCase() || "") === filtroActivo.toUpperCase()
        );
  }, [filtroActivo, convocatoriasItems]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Convocatorias"
        description="Convocatorias abiertas y finalizadas de nuestra institución."
        colors={colors} 
        portadas={contenido?.portada} 
        logo={institucion?.institucion_logo}
      />

      <section style={{
          padding: "3rem 1.5rem",
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
            isEmpty={itemsFiltrados.length === 0}
            emptyMessage="No hay convocatorias disponibles en este momento."
            colors={colors}
          >
            {itemsFiltrados.map((aviso, idx) => (
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
                maxWidth: '1200px', position: 'relative', zIndex: 2,
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
