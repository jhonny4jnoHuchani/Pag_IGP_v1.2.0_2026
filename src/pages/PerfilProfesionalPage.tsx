import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import InfoBlock from "../components/cards/InfoBlock";
import {
  FaUserGraduate,
  FaChevronLeft,
  FaChevronRight,
  FaBriefcase,
  FaCheck,
} from "react-icons/fa";

export default function PerfilProfesionalPage() {
  const { institucion, loading , contenido} = useCarreraData();
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
        colors={colors} portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />

      <section style={{
          padding: "4rem 0",
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
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

        <div
          style={{ maxWidth: '1200px', position: 'relative', zIndex: 2, margin: "0 auto", padding: "0 2rem" }}
        >
          {institucion?.institucion_sobre_ins && (
            <InfoBlock
              id="perfil-profesional"
              label="Perfil del Profesional"
              icon={<FaUserGraduate size={32} />}
              content={institucion.institucion_sobre_ins}
              color={colors.primary}
            />
          )}
        </div>

        {/* CAMPO DE TRABAJO CAROUSEL */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "80vh",
            overflow: "hidden",
            marginTop: "4rem",
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
                      "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.8) 100%)",
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
                      textShadow: "0 4px 10px rgba(0,0,0,0.5)",
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
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                  width: carouselIndex === idx ? "30px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  background:
                    carouselIndex === idx
                      ? colors.primary
                      : "rgba(255,255,255,0.5)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
