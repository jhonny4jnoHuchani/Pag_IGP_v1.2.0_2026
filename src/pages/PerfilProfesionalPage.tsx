import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import {
  FaUserGraduate,
  FaChevronLeft,
  FaChevronRight,
  FaBriefcase,
  FaCheck,
  FaCogs,
  FaHardHat,
} from "react-icons/fa";

// ==================== COMPONENTE SPOTLIGHT CARD ====================
const SpotlightCard = ({ children, colors, delay = 0, style = {} }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "2.5rem",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      <motion.div
        animate={{
          x: position.x - 250,
          y: position.y - 250,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "500px",
          height: "500px",
          background: `radial-gradient(circle, ${colors.primary}25 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
};

export default function PerfilProfesionalPage() {
  const { institucion, loading, contenido } = useCarreraData();
  const colors = useThemeColors(institucion);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const campoTrabajoImages = [
    {
      title: "Plantas de procesamiento de gas natural",
      img: "/plantas de procesamiento.jpg",
    },
    { title: "Refinerías de petróleo", img: "./refinierias de petroleo.jpg" },
    {
      title: "Industrias petroquímicas",
      img: "./industrias petroquimicas.jpg",
    },
    {
      title: "Empresas de hidrocarburos",
      img: "/empresa de hidrocarburos.jpg",
    },
    {
      title: "Organismos de regulación y control",
      img: "/organismos de regulacion.jpg",
    },
  ];

  const nextCampo = useCallback(
    () =>
      setCarouselIndex((prev) =>
        prev === campoTrabajoImages.length - 1 ? 0 : prev + 1,
      ),
    [campoTrabajoImages.length],
  );
  const prevCampo = useCallback(
    () =>
      setCarouselIndex((prev) =>
        prev === 0 ? campoTrabajoImages.length - 1 : prev - 1,
      ),
    [campoTrabajoImages.length],
  );

  useEffect(() => {
    const timer = setInterval(nextCampo, 4000);
    return () => clearInterval(timer);
  }, [nextCampo]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Perfil Profesional"
        description={
          institucion?.institucion_nombre || "Ingeniería de Gas y Petroquímica"
        }
        colors={colors}
        portadas={contenido?.portada}
        logo={institucion?.institucion_logo}
      />

      <section
        style={{
          padding: "5rem 0",
          background: "#050505",
          minHeight: "800px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ==================== 1. PARALLAX GIANT TYPOGRAPHY (Brutalismo Elegante) ==================== */}
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-30%" }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
          style={{
            position: "absolute",
            top: "5%",
            left: "0",
            whiteSpace: "nowrap",
            fontSize: "clamp(10rem, 25vw, 25rem)",
            fontWeight: 900,
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.03)",
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
            lineHeight: 1
          }}
        >
          PERFIL PROFESIONAL GAS Y PETROQUÍMICA
        </motion.div>

        {/* ==================== 2. DECORADORES LUMÍNICOS (Glow Orbs) ==================== */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            width: "40vw",
            height: "40vw",
            background: `radial-gradient(circle, ${colors.primary}50 0%, transparent 70%)`,
            filter: "blur(80px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "20%",
            right: "-10%",
            width: "50vw",
            height: "50vw",
            background: `radial-gradient(circle, ${colors.secondary}50 0%, transparent 70%)`,
            filter: "blur(100px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* DECORADORES EXTERNOS ANIMADOS (Estilos Anteriores) */}
        <motion.img
          src="/decoradores/decor_static/cometa.png"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "10%", right: "10%", width: "120px", zIndex: 1, opacity: 0.6 }}
        />
        <motion.img
          src="/decoradores/decor_static/3_lineas_siksak.png"
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: "30%", left: "5%", width: "80px", zIndex: 1, opacity: 0.6 }}
        />

        {/* ==================== 3. HOLOGRAPHIC BENTO GRID ==================== */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10, padding: "0 1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", width: "100%" }}>
            
            {/* Main Holographic Card */}
            <SpotlightCard colors={colors} delay={0.1} style={{ flex: "1 1 60%", minWidth: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "2rem" }}>
                <div
                  style={{
                    padding: "1.2rem",
                    background: `linear-gradient(135deg, ${colors.primary}30, transparent)`,
                    border: `1px solid ${colors.primary}50`,
                    borderRadius: "16px",
                    color: colors.primary,
                    boxShadow: `0 0 20px ${colors.primary}20`
                  }}
                >
                  <FaUserGraduate size={36} />
                </div>
                <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#fff", margin: 0, fontWeight: 800, letterSpacing: "-1px" }}>
                  Perfil del Profesional
                </h2>
              </div>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  whiteSpace: "pre-line",
                  fontWeight: 300,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                {institucion?.institucion_sobre_ins || "Cargando perfil profesional..."}
              </p>
            </SpotlightCard>

            {/* Smaller Bento Cards */}
            <div style={{ flex: "1 1 30%", minWidth: "300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <SpotlightCard colors={colors} delay={0.3} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <FaCogs size={32} color={colors.secondary} />
                  <h3 style={{ color: "#fff", fontSize: "1.3rem", margin: 0, fontWeight: 700 }}>Innovación Técnica</h3>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "1rem", margin: 0, lineHeight: 1.6 }}>
                  Aplicación de tecnología de punta en procesos industriales y control de calidad.
                </p>
              </SpotlightCard>

              <SpotlightCard colors={colors} delay={0.5} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <FaHardHat size={32} color={colors.primary} />
                  <h3 style={{ color: "#fff", fontSize: "1.3rem", margin: 0, fontWeight: 700 }}>Seguridad Industrial</h3>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "1rem", margin: 0, lineHeight: 1.6 }}>
                  Alto rigor en estándares internacionales de seguridad y protección al medio ambiente.
                </p>
              </SpotlightCard>
            </div>

          </div>
        </div>

        {/* ==================== CAMPO DE TRABAJO CAROUSEL ==================== */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "80vh",
            overflow: "hidden",
            marginTop: "6rem",
            borderTop: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 2rem",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              color: colors.secondary,
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
              border: `2px solid ${colors.secondary}60`,
            }}
          >
            <FaBriefcase size={18} /> Campo de Trabajo
          </div>

          <div
            style={{
              display: "flex",
              height: "100%",
              transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `translateX(-${carouselIndex * 100}%)`,
            }}
          >
            {campoTrabajoImages.map((item, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.1) 40%, #050505 100%)",
                  }}
                ></div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    textAlign: "center",
                    width: "90%",
                    maxWidth: "800px",
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background:
                        idx % 2 === 0 ? colors.primary : colors.secondary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.5rem",
                      margin: "0 auto 1rem",
                      border: "3px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 0 20px rgba(0,0,0,0.5)"
                    }}
                  >
                    <FaCheck />
                  </div>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                      fontWeight: 800,
                      margin: "0 0 0.5rem",
                      textShadow: "0 4px 10px rgba(0,0,0,0.8)",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <motion.button
            onClick={prevCampo}
            whileHover={{ scale: 1.1, background: colors.primary }}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "2rem",
              zIndex: 20,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(5px)"
            }}
          >
            <FaChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={nextCampo}
            whileHover={{ scale: 1.1, background: colors.secondary }}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: "2rem",
              zIndex: 20,
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(5px)"
            }}
          >
            <FaChevronRight size={20} />
          </motion.button>

          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "0.75rem",
              zIndex: 20,
            }}
          >
            {campoTrabajoImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                style={{
                  width: carouselIndex === idx ? "40px" : "12px",
                  height: "12px",
                  borderRadius: "6px",
                  background:
                    carouselIndex === idx
                      ? colors.primary
                      : "rgba(255,255,255,0.3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
