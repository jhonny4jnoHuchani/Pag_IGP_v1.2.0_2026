import { motion, type Variants } from "framer-motion";
import { sanitizeHtml } from '../../utils/sanitize';
import Tilt from "react-parallax-tilt";
import { TypeAnimation } from "react-type-animation";
import React from "react";

interface InfoBlockProps {
  id: string;
  label: string;
  content: string;
  icon?: React.ReactNode;
  color: string;
  border?: string;
  index?: number;
  useTypewriter?: boolean;
}

const PuzzleText = ({ text }: { text: string }) => {
  const characters = text.split("");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      style={{ display: "inline-block", textAlign: "justify" }}
    >
      {characters.map((char, idx) => {
        if (char === "\n") {
          return <br key={idx} />;
        }
        if (char === " ") {
          return <span key={idx} style={{ display: "inline-block", width: "0.25em" }}>&nbsp;</span>;
        }
        const randomX = (Math.random() - 0.5) * 800;
        const randomY = (Math.random() - 0.5) * 800;
        const randomRotate = (Math.random() - 0.5) * 360;
        const randomDelay = Math.random() * 2.5;
        return (
          <motion.span
            key={idx}
            variants={{
              hidden: { opacity: 0, x: randomX, y: randomY, rotate: randomRotate, scale: 0.2 },
              visible: { 
                opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, 
                transition: { duration: 1.5, delay: randomDelay, type: "spring", bounce: 0.4 } 
              }
            }}
            style={{ display: "inline-block" }}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

export default function InfoBlock({
  id,
  label,
  content,
  icon,
  color,
  border,
  index = 0,
  useTypewriter = false,
}: InfoBlockProps) {
  const sectionFadeIn: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: index * 0.1 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionFadeIn}
      style={{ marginBottom: "4rem" }}
    >
      <Tilt
        tiltMaxAngleX={4}
        tiltMaxAngleY={4}
        scale={1.01}
        transitionSpeed={1000}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#ffffff"
        glarePosition="all"
      >
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            padding: "3rem",
            borderRadius: "24px",
            border: `2px solid ${border || `${color}40`}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            boxShadow: `0 20px 50px rgba(0,0,0,0.3), inset 0 0 40px ${color}10`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />

                    {/* DECORADORES INTERNOS DEL CARD */}
          <motion.img src="/decoradores/decor_static/cometa.png" alt="" animate={{ y: [0, -10, 0], rotate: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "5%", right: "5%", width: "80px", zIndex: 0, opacity: 1 }} />
          <motion.img src="/decoradores/decor_static/circulo_azuul.png" alt="" animate={{ scale: [1, 1.1, 1], rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", bottom: "5%", left: "5%", width: "100px", zIndex: 0, opacity: 1 }} />
          <motion.img src="/decoradores/decor_static/3_lineas_siksak.png" alt="" animate={{ x: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "50%", left: "2%", width: "60px", zIndex: 0, opacity: 1 }} />
          
          <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {icon && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 1.5rem",
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: `0 10px 30px ${color}50`,
                transform: "rotate(-5deg)",
              }}
            >
              <div style={{ transform: "rotate(5deg)" }}>{icon}</div>
            </motion.div>
          )}

          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "1.5rem",
              textTransform: "uppercase",
              letterSpacing: "2px",
              textShadow: `0 0 20px ${color}50`,
            }}
          >
            {label}
          </h2>

          <div
            style={{
              width: "60px",
              height: "4px",
              background: color,
              margin: "0 auto 2rem",
              borderRadius: "2px",
            }}
          />

          <div
            style={{
              color: "#e2e8f0",
              fontSize: "1.15rem",
              lineHeight: 1.8,
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {useTypewriter ? (
              <PuzzleText text={content} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
            )}
          </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}
