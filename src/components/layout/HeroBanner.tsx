import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface HeroBannerProps {
  title: string;
  description?: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
    gradientPrimary?: string;
  };
  portadas?: any[];
  logo?: string;
}

export default function HeroBanner({
  title,
  description,
  colors,
  portadas = [],
  logo,
}: HeroBannerProps) {
  const [variant] = useState(() => Math.floor(Math.random() * 3) + 1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [glowColor] = useState(
    () =>
      ["var(--primary)", "var(--secondary)", "var(--tertiary)"][
        Math.floor(Math.random() * 3)
      ],
  );
  const totalSlides = portadas.length;

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [totalSlides, nextSlide]);

  // ANIMACIÓN LETRA POR LETRA (Para efecto saltarín)
  const letterContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const letterAnim: Variants = {
    hidden: { y: 50, opacity: 0, scale: 0.5 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as any, damping: 10, stiffness: 200 },
    },
  };

  if (totalSlides === 0) {
    return (
      <section
        style={{
          padding: "6rem 0 3rem",
          background: "#0f172a",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "3rem" }}>{title}</h1>
      </section>
    );
  }

  // ==========================================
  // VARIANTE 1: TITULO REBOTANTE & IMAGEN DESLIZANTE GIGANTE
  // ==========================================
  if (variant === 1) {
    return (
      <section
        style={{
          position: "relative",
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Imágenes que se "corren a la derecha" violentamente */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <AnimatePresence mode="sync">
            {portadas.map((p, idx) =>
              idx === currentSlide ? (
                <motion.div
                  key={p.portada_id}
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "0%", opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 15,
                    mass: 1,
                  }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <img
                    src={getImageUrl(p.portada_imagen)}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.6,
                    }}
                  />
                </motion.div>
              ) : null,
            )}
          </AnimatePresence>
          {/* Overlay oscuro para leer el texto */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.2) 100%)",
            }}
          ></div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0 2rem",
            width: "100%",
            maxWidth: "1400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              padding: "0.5rem 1.5rem",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: 800,
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              borderRadius: "50px",
              marginBottom: "1.5rem",
              display: "inline-flex",
              boxShadow: "0 10px 20px var(--primary-medium)",
            }}
          >
            Sello de Excelencia Académica
          </motion.div>

          <motion.h1
            variants={letterContainer}
            initial="hidden"
            animate="visible"
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "0 0 1rem",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 900,
              color: "#fff",
              textTransform: "uppercase",
              lineHeight: 1.1,
              textShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            {title.split(" ").map((word, wordIdx) => (
              <span
                key={wordIdx}
                style={{
                  display: "inline-flex",
                  overflow: "hidden",
                  marginRight: "1rem",
                }}
              >
                {word.split("").map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    variants={letterAnim}
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              width: "200px",
              height: "8px",
              background: "var(--secondary)",
              transformOrigin: "left",
              borderRadius: "4px",
              marginBottom: "2rem",
            }}
          />

          {description && (
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{
                color: "#e2e8f0",
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                maxWidth: "600px",
                lineHeight: 1.6,
                borderLeft: "4px solid var(--primary)",
                paddingLeft: "1rem",
              }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </section>
    );
  }

  // ==========================================
  // VARIANTE 2: TEXTO "OUTLINE" DESLIZANTE, LOGO GIGANTE E IMAGENES 3D
  // ==========================================
  if (variant === 2) {
    return (
      <section
        style={{
          position: "relative",
          minHeight: "70vh",
          background: `radial-gradient(circle at 75% 50%, ${glowColor} 0%, #0a0a0a 50%, #000000 100%)`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Fondo de texto gigante dinámico (Marquesina Infinita) */}
        <div
          style={{
            position: "absolute",
            top: "70%",
            transform: "translateY(-50%)",
            width: "100%",
            overflow: "hidden",
            zIndex: 0,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            style={{
              display: "inline-flex",
              whiteSpace: "nowrap",
              paddingLeft: "100vw",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: "16vw",
                  fontWeight: 900,
                  color: "transparent",
                  WebkitTextStroke: "2px var(--secondary)",
                  opacity: 0.1,
                  paddingRight: "8rem",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </span>
            ))}
          </motion.div>
        </div>

        {/* LOGO EN EL MEDIO ENCIMA DE TODO */}
        {logo && (
          <motion.img
            src={logo.startsWith("http") ? logo : `${logo}`}
            alt="Logo centro"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
            style={{
              position: "absolute",
              top: "10%",
              left: "33%",
              transform: "translate(-50%, -50%)",
              width: "450px",
              height: "450px",
              objectFit: "contain",
              zIndex: 50,
              pointerEvents: "none",
              filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.5)) drop-shadow(0 0 20px ${glowColor})`,
            }}
          />
        )}

        {/* GIFs FLOTANTES (Átomo y Química) ENCIMA DE TODO */}
        <motion.img
          src="/gif/atomo.gif"
          alt="Atomo"
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "15%",
            right: "5%",
            width: "180px",
            height: "180px",
            objectFit: "contain",
            zIndex: 45,
            mixBlendMode: "screen",
            pointerEvents: "none",
            opacity: 0.85,
          }}
        />

        <motion.img
          src="/gif/quimica1.gif"
          alt="Quimica"
          animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "8%",
            width: "160px",
            height: "160px",
            objectFit: "contain",
            zIndex: 45,
            mixBlendMode: "screen",
            pointerEvents: "none",
            opacity: 0.85,
          }}
        />

        <motion.img
          src="/Decoradores_gas_petroqumica/decaradores_animado/tubos_ensayo.gif"
          alt="Tubos"
          animate={{ y: [0, -15, 0], rotate: [0, -5, 5, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            position: "absolute",
            top: "8%",
            left: "12%",
            width: "140px",
            height: "140px",
            objectFit: "contain",
            zIndex: 45,
            mixBlendMode: "screen",
            pointerEvents: "none",
            opacity: 0.7,
          }}
        />

        {/* BURBUJAS FLOTANTES DISPERSAS */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {portadas.slice(0, 5).map((p, idx) => {
            const positions = [
              { top: "12%", left: "8%", size: 140, delay: 0 },
              { top: "75%", left: "15%", size: 100, delay: 1 },
              { top: "20%", left: "85%", size: 150, delay: 0.5 },
              { top: "80%", left: "75%", size: 110, delay: 1.5 },
              { top: "45%", left: "4%", size: 80, delay: 2 },
            ];
            const pos = positions[idx % positions.length];
            return (
              <motion.div
                key={`bubble-${p.portada_id}`}
                onClick={() => setCurrentSlide(idx)}
                whileHover={{ scale: 1.15, zIndex: 50 }}
                title="Ver esta portada"
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6 + idx,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: pos.delay,
                }}
                style={{
                  position: "absolute",
                  top: pos.top,
                  left: pos.left,
                  width: pos.size,
                  height: pos.size,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `3px solid ${glowColor}`,
                  boxShadow: `0 10px 20px rgba(0,0,0,0.5), 0 0 15px ${glowColor}`,
                  opacity: currentSlide === idx ? 1 : 0.6,
                  cursor: "pointer",
                }}
              >
                <img
                  src={getImageUrl(p.portada_imagen)}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </motion.div>
            );
          })}
        </div>

        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            padding: "0 2rem",
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              style={{
                fontSize: "clamp(3rem, 5vw, 4.5rem)",
                color: "var(--secondary)",
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 1.1,
                margin: "0 0 1.5rem",
                position: "relative",
              }}
            >
              {title}
              <span
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: 0,
                  width: "100px",
                  height: "8px",
                  background: "var(--primary)",
                  borderRadius: "4px",
                }}
              ></span>
            </h1>
            {description && (
              <p
                style={{
                  color: "#a1a1aa",
                  fontSize: "1.2rem",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                }}
              >
                {description}
              </p>
            )}

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "var(--secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-on-secondary)",
                  fontWeight: "bold",
                }}
              >
                G&P
              </div>
              <span
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                INGENIERÍA DE GAS Y PETROQUÍMICA
              </span>
            </div>
          </motion.div>

          {/* Slider 3D a la derecha */}
          <div
            style={{
              perspective: "1500px",
              position: "relative",
              height: "500px",
            }}
          >
            <AnimatePresence mode="popLayout">
              {portadas.map((p, idx) =>
                idx === currentSlide ? (
                  <motion.div
                    key={p.portada_id}
                    initial={{ opacity: 0, rotateY: 90, scale: 0.8, x: 100 }}
                    animate={{ opacity: 1, rotateY: -15, scale: 1, x: 0 }}
                    exit={{ opacity: 0, rotateY: -90, scale: 0.8, x: -100 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "24px",
                      boxShadow: `-20px 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1), 0 0 80px ${glowColor}`,
                      transformOrigin: "left center",
                      overflow: "hidden",
                      border: `2px solid ${glowColor}`,
                    }}
                  >
                    <img
                      src={getImageUrl(p.portada_imagen)}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "contrast(1.05) saturate(1.1)",
                      }}
                    />
                  </motion.div>
                ) : null,
              )}
            </AnimatePresence>

            {/* PREVIEW SIGUIENTE PORTADA */}
            {totalSlides > 1 && (
              <motion.div
                onClick={nextSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "-30px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: `4px solid ${glowColor}`,
                  overflow: "hidden",
                  zIndex: 20,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${glowColor}`,
                  cursor: "pointer",
                }}
                title="Siguiente imagen"
              >
                <img
                  src={getImageUrl(
                    portadas[(currentSlide + 1) % totalSlides]?.portada_imagen,
                  )}
                  alt="Siguiente"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // VARIANTE 3: GLOW RADIAL, CONTENEDOR FLOTANTE Y ROTACIÓN DE CLIPPINGS
  // ==========================================
  return (
    <section
      style={{
        position: "relative",
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#050505",
      }}
    >
      {/* Fondo con Imágenes y Transiciones Suaves */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <AnimatePresence mode="sync">
          {portadas.map((p, idx) =>
            idx === currentSlide ? (
              <motion.div
                key={p.portada_id}
                initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0, filter: "blur(20px)" }}
                animate={{ clipPath: "circle(150% at 50% 50%)", opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                style={{ position: "absolute", inset: 0 }}
              >
                <img
                  src={getImageUrl(p.portada_imagen)}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.05)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.6) 80%, #050505 100%), linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(5,5,5,0.9) 100%)`,
                  }}
                ></div>
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>

      {/* PORTADAS FLOTANTES (FOTOS ORBITANDO EL CENTRO) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
        {portadas.slice(0, 6).map((p, idx) => {
          const positions = [
            { top: "10%", left: "5%", size: 150, delay: 0 },
            { top: "65%", left: "2%", size: 120, delay: 1 },
            { top: "15%", left: "85%", size: 160, delay: 0.5 },
            { top: "70%", left: "82%", size: 130, delay: 1.5 },
            { top: "40%", left: "90%", size: 100, delay: 2 },
            { top: "45%", left: "-2%", size: 110, delay: 0.8 },
          ];
          const pos = positions[idx % positions.length];
          return (
            <motion.div
              key={`float-${p.portada_id}`}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, -15, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 8 + idx,
                repeat: Infinity,
                ease: "easeInOut",
                delay: pos.delay,
              }}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                width: pos.size,
                height: pos.size,
                borderRadius: "50%",
                overflow: "hidden",
                border: `3px solid ${glowColor}`,
                boxShadow: `0 15px 30px rgba(0,0,0,0.6), 0 0 20px ${glowColor}`,
                pointerEvents: "auto",
                cursor: "pointer",
                opacity: currentSlide === idx ? 1 : 0.5,
              }}
              onClick={() => setCurrentSlide(idx)}
              whileHover={{ scale: 1.15, zIndex: 10, opacity: 1 }}
            >
              <img
                src={getImageUrl(p.portada_imagen)}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        style={{
          zIndex: 2,
          position: "relative",
          margin: "0 2rem",
          width: "100%",
          maxWidth: "650px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "transparent",
            padding: "3rem 2rem",
            textAlign: "center",
            width: "100%",
            position: "relative",
            overflow: "visible",
          }}
        >


                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            {/* BATALLA DE COLORES DETRÁS DEL LOGO */}
            <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto 2rem" }}>
              {/* AURORA DE COLORES (BATALLA SUTIL) */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], x: [0, 20, -15, 0], y: [0, -20, 15, 0], rotate: [0, 90, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", top: "0%", left: "0%", width: "100%", height: "100%", background: "var(--primary)", filter: "blur(40px)", borderRadius: "50%", zIndex: 0, opacity: 0.6 }}
              />
              <motion.div
                animate={{ scale: [1.2, 0.8, 1.2], x: [0, -20, 20, 0], y: [0, 20, -15, 0], rotate: [0, -90, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", top: "0%", right: "0%", width: "100%", height: "100%", background: "var(--secondary)", filter: "blur(40px)", borderRadius: "50%", zIndex: 0, opacity: 0.5 }}
              />
              <motion.div
                animate={{ scale: [0.8, 1.3, 0.8], x: [0, 15, -20, 0], y: [0, 15, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", bottom: "0%", left: "10%", width: "100%", height: "100%", background: colors.tertiary || "var(--primary-light)", filter: "blur(40px)", borderRadius: "50%", zIndex: 0, opacity: 0.5 }}
              />
              
              {logo ? (
                <motion.img
                  src={logo.startsWith("http") ? logo : `${logo}`}
                  alt="Logo"
                  initial={{ rotateY: -180, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
                  style={{
                    position: "absolute", inset: 0, margin: "auto",
                    width: "150px", height: "150px", objectFit: "contain",
                    filter: `drop-shadow(0 15px 25px rgba(0,0,0,0.5))`,
                    zIndex: 1
                  }}
                />
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                  style={{
                    position: "absolute", inset: 0, margin: "auto",
                    width: "90px", height: "90px", borderRadius: "24px",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: "var(--gradient-primary)", zIndex: 1,
                    boxShadow: "0 15px 30px var(--primary-medium)",
                  }}
                >
                  <div style={{ width: "40%", height: "40%", background: "#fff", borderRadius: "50%" }}></div>
                </motion.div>
              )}
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{
                fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "4px",
                margin: "0 0 1rem",
                lineHeight: 1.1,
                background: `linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, ${glowColor} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
              }}
            >
              {title}
            </motion.h1>
            
            {description && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                  color: "#a1a1aa",
                  fontSize: "1.3rem",
                  margin: "0 auto",
                  maxWidth: "800px",
                  lineHeight: 1.8,
                  letterSpacing: "1px",
                }}
              >
                {description}
              </motion.p>
            )}

            {/* Premium Slider indicators */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                marginTop: "4rem",
              }}
            >
              {portadas.map((_, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  animate={{
                    width: idx === currentSlide ? 50 : 12,
                    background:
                      idx === currentSlide
                        ? "var(--secondary)"
                        : "rgba(255,255,255,0.15)",
                  }}
                  whileHover={{ scale: 1.2, background: "rgba(255,255,255,0.5)" }}
                  style={{ 
                    height: "12px", 
                    borderRadius: "6px", 
                    cursor: "pointer",
                    boxShadow: idx === currentSlide ? `0 0 15px var(--secondary)` : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
