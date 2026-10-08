import { motion, type Variants } from 'framer-motion';
import { type ReactNode, useEffect, useState } from 'react';

interface Props {
  colors: any;
  showSparkles?: boolean;
}

export default function PageDecorators({ colors, showSparkles = true }: Props) {
  // Posiciones para partículas de fondo (Estilo Chispas/Burbujas)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    if (showSparkles) {
      const initialParticles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (15 - 5) + 5,
        delay: Math.random() * 5,
        duration: Math.random() * (12 - 6) + 6,
      }));
      setParticles(initialParticles);
    }
  }, [showSparkles]);

  // Variantes para las esquinas (pulsación suave)
  const cornerVariants: Variants = {
    animate: {
      scale: [1, 1.03, 1],
      opacity: [0.15, 0.25, 0.15],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <>
      <style>{`
        .decorator-container {
          pointer-events: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 5;
          overflow: hidden;
        }
        .decorador-floating { 
          position: absolute; 
          pointer-events: none; 
          z-index: 5; 
        }
        @media (max-width: 768px) { 
          .decorador-floating { opacity: 0.1 !important; } 
          .decorador-hide-mobile { display: none !important; } 
        }
      `}</style>
      
      <div className="decorator-container">
        
        {/* Esquinas Superiores e Inferiores */}
        <motion.img 
          src="/decoradores/esquina-izquierda.png" 
          alt="" 
          variants={cornerVariants} animate="animate"
          className="decorador-floating"
          style={{ top: 0, left: 0, width: 'clamp(250px, 35vw, 500px)', opacity: 0.2, zIndex: 1 }} 
        />
        <motion.img 
          src="/decoradores/esquina-derecha.png" 
          alt="" 
          variants={cornerVariants} animate="animate"
          className="decorador-floating"
          style={{ bottom: 0, right: 0, width: 'clamp(250px, 35vw, 500px)', opacity: 0.2, zIndex: 1 }} 
        />

        {/* Engranajes / Tuercas Girando - Profundidad */}
        <motion.img 
          src="/decoradores/decor_static/tuerca_2.png" 
          alt="" 
          className="decorador-floating decorador-hide-mobile" 
          initial={{ opacity: 0, rotate: 0 }} 
          animate={{ opacity: 0.4, rotate: 360 }} 
          transition={{ opacity: { duration: 1 }, rotate: { duration: 35, repeat: Infinity, ease: 'linear' } }} 
          style={{ top: '15%', right: '-8%', width: 'clamp(200px, 25vw, 450px)', filter: `drop-shadow(0 0 15px ${colors?.primary}40)` }} 
        />
        <motion.img 
          src="/decoradores/decor_static/tuerca_2.png" 
          alt="" 
          className="decorador-floating decorador-hide-mobile" 
          initial={{ opacity: 0, rotate: 0 }} 
          animate={{ opacity: 0.3, rotate: -360 }} 
          transition={{ opacity: { duration: 1 }, rotate: { duration: 40, repeat: Infinity, ease: 'linear' } }} 
          style={{ bottom: '10%', left: '-8%', width: 'clamp(180px, 20vw, 350px)', filter: `drop-shadow(0 0 15px ${colors?.secondary}40)` }} 
        />

        {/* Elementos Geométricos Flotantes */}
        <motion.img 
          src="/Decoradores_gas_petroqumica/decoradoresestaticos/circulo.png" 
          alt="" 
          className="decorador-floating" 
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ opacity: 0.45, scale: 1, rotate: 360 }} 
          transition={{ opacity: { duration: 1, delay: 0.3 }, scale: { duration: 1, delay: 0.3 }, rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }} 
          style={{ top: '25%', left: '4%', width: 'clamp(60px, 8vw, 120px)' }} 
        />
        <motion.img 
          src="/decoradores/decor_static/redondo_con_forma.png" 
          alt="" 
          className="decorador-floating decorador-hide-mobile" 
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ opacity: 0.35, scale: 1, rotate: -360 }} 
          transition={{ opacity: { duration: 1, delay: 0.5 }, scale: { duration: 1, delay: 0.5 }, rotate: { duration: 28, repeat: Infinity, ease: 'linear' } }} 
          style={{ top: '40%', right: '3%', width: 'clamp(70px, 10vw, 150px)' }} 
        />
        <motion.img 
          src="/decoradores/decor_static/redondo_puteado.png" 
          alt="" 
          className="decorador-floating" 
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ opacity: 0.4, scale: 1, rotate: 360 }} 
          transition={{ opacity: { duration: 1, delay: 0.7 }, scale: { duration: 1, delay: 0.7 }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }} 
          style={{ bottom: '25%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(50px, 7vw, 100px)' }} 
        />
        
        {/* GIF Decorativo Superior */}
        <motion.img 
          src="/Decoradores_gas_petroqumica/decaradores_animado/decor_mov.gif" 
          alt="" 
          className="decorador-floating decorador-hide-mobile" 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 0.35, y: [0, -10, 0] }} 
          transition={{ opacity: { duration: 1, delay: 0.8 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }} 
          style={{ top: '7%', left: '15%', width: 'clamp(60px, 8vw, 130px)' }} 
        />

        {/* Partículas / Chispas Brillantes */}
        {showSparkles && particles.length > 0 && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0, scale: 0 }}
                animate={{
                  y: [`${p.y}vh`, `${Math.max(0, p.y - 25)}vh`],
                  x: [`${p.x}vw`, `${p.x + (Math.random() > 0.5 ? 8 : -8)}vw`],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  position: 'absolute',
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  background: colors?.primary || '#ffd700',
                  boxShadow: `0 0 ${p.size * 2}px ${colors?.primary || '#ffd700'}90, 0 0 ${p.size}px #ffffff`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
