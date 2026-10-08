import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import InfoBlock from "../components/cards/InfoBlock";
import { FaBullseye, FaEye, FaTrophy } from "react-icons/fa";

const stripHtml = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.querySelectorAll("p, br, div, li").forEach((el) => {
    el.insertAdjacentText("afterend", "\n\n");
  });
  return (div.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
};

export default function MisionPage() {
  const { institucion, loading, contenido } = useCarreraData();
  const colors = useThemeColors(institucion);

  const blocks = useMemo(() => {
    return [
      {
        id: "mision",
        label: "Nuestra Misión",
        icon: <FaBullseye size={32} />,
        content: institucion?.institucion_mision ? stripHtml(institucion.institucion_mision) : "",
        color: colors.primary,
      },
      {
        id: "vision",
        label: "Nuestra Visión",
        icon: <FaEye size={32} />,
        content: institucion?.institucion_vision ? stripHtml(institucion.institucion_vision) : "",
        color: colors.secondary,
      },
      {
        id: "objetivos",
        label: "Objetivos de la Carrera",
        icon: <FaTrophy size={32} />,
        content: institucion?.institucion_objetivos ? stripHtml(institucion.institucion_objetivos) : "",
        color: colors.tertiary || colors.primary,
      },
    ].filter((b) => b.content);
  }, [institucion, colors]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Misión y Visión"
        description={
          institucion?.institucion_nombre ||
          "Conoce el rumbo de nuestra institución"
        }
        colors={colors}
        portadas={contenido?.portada}
        logo={institucion?.institucion_logo}
      />

      <section
        style={{
          position: "relative",
          padding: "6rem 0",
          background: `linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)`,
          minHeight: "800px",
          overflow: "hidden",
        }}
      >
        {/* FONDOS DINÁMICOS BASADOS EN LOS COLORES DE LA INSTITUCIÓN */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            width: "500px",
            height: "500px",
            background: `radial-gradient(circle, ${colors.primary}33 0%, transparent 70%)`,
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-10%",
            width: "600px",
            height: "600px",
            background: `radial-gradient(circle, ${colors.secondary}33 0%, transparent 70%)`,
            filter: "blur(80px)",
            zIndex: 0,
          }}
        />

        {/* DECORADORES EXTERNOS ANIMADOS */}
        <motion.img 
          src="/Decoradores_gas_petroqumica/decaradores_animado/tuerca_girando.gif"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "15%", right: "8%", width: "130px", mixBlendMode: "screen", zIndex: 1, opacity: 0.8 }}
        />
        <motion.img 
          src="/Decoradores_gas_petroqumica/decaradores_animado/tubos_ensayo.gif"
          animate={{ y: [0, -25, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "15%", left: "8%", width: "180px", mixBlendMode: "screen", zIndex: 1, opacity: 0.9 }}
        />
        <motion.img 
          src="/decoradores/decor_static/redondo_con_forma.png"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "50%", left: "5%", width: "100px", zIndex: 1, opacity: 0.7 }}
        />
        <motion.img 
          src="/gif/atomo.gif"
          animate={{ y: [0, 20, 0], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "35%", right: "5%", width: "150px", mixBlendMode: "screen", zIndex: 1, opacity: 0.8 }}
        />

        <div
          style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 2 }}
        >
          {blocks.length > 0 ? (
            blocks.map((b, idx) => (
              <InfoBlock
                key={b.id}
                id={b.id}
                label={b.label}
                icon={b.icon}
                content={b.content!}
                color={b.color}
                index={idx}
                useTypewriter={true}
              />
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              No hay información disponible.
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
