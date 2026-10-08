import { motion, type Variants } from "framer-motion";
import { sanitizeHtml } from '../../utils/sanitize';
import { FaHourglassHalf, FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import Tilt from "react-parallax-tilt";

interface OfertaCardProps {
  titulo: string;
  descripcion: string;
  imageUrl: string | null;
  fechaInicio: string;
  fechaFin: string;
  colors: { primary: string; primaryDark: string; secondary: string };
  index: number;
  onClick: () => void;
}

export default function OfertaCard({
  titulo,
  descripcion,
  imageUrl,
  fechaInicio,
  fechaFin,
  colors,
  index,
  onClick,
}: OfertaCardProps) {
  const fallFromTopVariants = (idx: number): Variants => ({
    hidden: { opacity: 0, y: -300, rotate: -5, scale: 0.7 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        delay: idx * 0.12,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  });

  const diasRestantes = (fin: string) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dFin = new Date(fin);
    dFin.setHours(0, 0, 0, 0);
    return Math.ceil((dFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  };

  const progresoInscripcion = (ini: string, fin: string) => {
    const start = new Date(ini).getTime();
    const end = new Date(fin).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const estadoBadge = (dias: number) => {
    if (dias < 0) return { label: "Cerrada", color: "#64748B" };
    if (dias === 0) return { label: "Cierra hoy", color: "#DC2626" };
    if (dias <= 3) return { label: `${dias} días restantes`, color: "#DC2626" };
    if (dias <= 7) return { label: `${dias} días restantes`, color: "#F59E0B" };
    return { label: `${dias} días restantes`, color: "#22C55E" };
  };

  const dias = diasRestantes(fechaFin);
  const badge = estadoBadge(dias);
  const progreso = progresoInscripcion(fechaInicio, fechaFin);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fallFromTopVariants(index)}
      className="oferta-card-shell"
      style={{ position: "relative", height: "100%" }}
    >
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        glareEnable={false}
        scale={1.01}
        transitionSpeed={1200}
        style={{ height: "100%" }}
      >
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={onClick}
          style={{
            background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
            borderRadius: "16px",
            overflow: "hidden",
            position: "relative",
            borderLeft: "5px solid #FFD700",
            boxShadow: `0 10px 30px ${colors.primary}30`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #FFD700, transparent)",
            }}
          ></div>

          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              zIndex: 2,
              padding: "0.35rem 0.8rem",
              background: badge.color,
              color: "#fff",
              borderRadius: "50px",
              fontSize: "0.68rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            <FaHourglassHalf size={10} /> {badge.label}
          </div>

          <div
            style={{
              position: "relative",
              height: "180px",
              overflow: "hidden",
              background: "rgba(0,0,0,0.15)",
            }}
          >
            {imageUrl ? (
              <motion.img
                src={imageUrl}
                alt={titulo}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.6 }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                <FaBriefcase />
              </div>
            )}
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                padding: "0.4rem 1rem",
                background: "#FFD700",
                color: "#1a1a2e",
                borderRadius: "50px",
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Oferta
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 0.5rem",
                lineHeight: 1.3,
                minHeight: "2.5em",
              }}
            >
              {titulo}
            </h3>
            <div
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.8rem",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginBottom: "1rem",
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(descripcion) }}
            />

            <div style={{ marginBottom: "0.75rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "0.3rem",
                }}
              >
                <span>Inscripciones</span>
                <span>{progreso}%</span>
              </div>
              <div
                style={{
                  height: "5px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progreso}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #FFD700, #FFA500)",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.72rem",
                marginTop: "auto",
              }}
            >
              <FaCalendarAlt size={11} />{" "}
              <span>Hasta {new Date(fechaFin).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      </Tilt>
    </motion.div>
  );
}
