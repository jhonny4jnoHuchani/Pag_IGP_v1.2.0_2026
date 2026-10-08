import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import InfoBlock from "../components/cards/InfoBlock";
import { FaBook } from "react-icons/fa";

const stripHtml = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.querySelectorAll("p, br, div, li").forEach((el) => {
    el.insertAdjacentText("afterend", "\n\n");
  });
  return (div.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
};

export default function HistoriaPage() {
  const { institucion, loading, contenido } = useCarreraData();
  const colors = useThemeColors(institucion);

  const historiaPlainText = useMemo(() => {
    if (!institucion?.institucion_historia) return "";
    return stripHtml(institucion.institucion_historia);
  }, [institucion?.institucion_historia]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Historia"
        description={
          institucion?.institucion_nombre || "Nuestras Raíces y Trayectoria"
        }
        colors={colors}
        portadas={contenido?.portada}
        logo={institucion?.institucion_logo}
      />

            <section
        style={{
          position: "relative",
          padding: "6rem 0",
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
          minHeight: "600px",
          overflow: "hidden"
        }}
      >
        {/* DECORADORES EXTERNOS AL CARD */}
        <motion.img 
          src="/Decoradores_gas_petroqumica/decaradores_animado/tuerca_girando.gif"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "10%", left: "10%", width: "150px", mixBlendMode: "screen", zIndex: 1, opacity: 1 }}
        />
        <motion.img 
          src="/Decoradores_gas_petroqumica/decaradores_animado/tubos_ensayo.gif"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "10%", right: "10%", width: "200px", mixBlendMode: "screen", zIndex: 1, opacity: 1 }}
        />
        <motion.img 
          src="/decoradores/decor_static/redondo_con_forma.png"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "40%", right: "5%", width: "120px", zIndex: 1, opacity: 1 }}
        />
        <motion.img 
          src="/gif/atomo.gif"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "20%", left: "5%", width: "140px", mixBlendMode: "screen", zIndex: 1, opacity: 1 }}
        />

        <div
          style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 2 }}
        >
          {historiaPlainText ? (
            <InfoBlock
              id="historia"
              label="Nuestra Historia"
              icon={<FaBook size={32} />}
              content={historiaPlainText}
              color={colors.primary}
              useTypewriter={true}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              No hay historia registrada.
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
