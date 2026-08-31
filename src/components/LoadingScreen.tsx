import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useThemeColors } from '../hooks/useThemeColors';
import { InstitucionPrincipal } from '../lib/api';

interface LoadingScreenProps {
  institucion: InstitucionPrincipal | null;
  text?: string;
  onFinish?: () => void;
  duration?: number;
  gearPosition?: {
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
  };
  tubeSize?: number;
  gearSize?: number;
}

export default function LoadingScreen({ 
  institucion, 
  text = 'Cargando...', 
  onFinish,
  duration = 3000,
  gearPosition = { bottom: '-5%', right: '25%' },
  tubeSize = 280,
  gearSize = 80,
}: LoadingScreenProps) {
  const colors = useThemeColors(institucion);
  const [exit, setExit] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Timer para la animación de salida
    const mainTimer = setTimeout(() => {
      setExit(true);
    }, duration);
    
    // Timer para llamar onFinish después de la animación
    const exitTimer = setTimeout(() => {
      onFinish?.();
    }, duration + 800); // duration + duración de la animación
    
    timeoutsRef.current.push(mainTimer, exitTimer);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [duration, onFinish]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={text}
      initial={{ y: 0, opacity: 1 }}
      animate={exit ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        overflow: 'hidden',
        padding: '1rem',
      }}
    >
      {/* Difuminaciones de fondo */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: 'min(400px, 60vw)',
        height: 'min(400px, 60vw)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: 'min(350px, 50vw)',
        height: 'min(350px, 50vw)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`,
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }}></div>

      {/* Contenedor principal con tubo de ensayo y engranaje superpuesto */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'clamp(1rem, 3vh, 2rem)',
        width: '100%',
        maxWidth: '550px',
      }}>
        {/* Tubo de ensayo - responsive */}
        <motion.img
          src="/Decoradores_gas_petroqumica/decaradores_animado/tubos_ensayo.gif"
          alt="Tubos de ensayo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            width: `min(${tubeSize}px, 90vw)`,
            height: 'auto',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
          }}
        />

        {/* Engranaje superpuesto - responsive */}
        <motion.img
          src="/Decoradores_gas_petroqumica/decaradores_animado/tuerca_girando.gif"
          alt="Engranaje giratorio"
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ 
            opacity: { duration: 0.4, delay: 0.5 },
            scale: { duration: 0.4, delay: 0.5 },
            rotate: { duration: 3, repeat: Infinity, ease: 'linear' }
          }}          
          style={{
            position: 'absolute',
            bottom: typeof gearPosition.bottom === 'number' 
              ? gearPosition.bottom 
              : gearPosition.bottom || '-5%',
            right: typeof gearPosition.right === 'number' 
              ? gearPosition.right 
              : gearPosition.right || '25%',
            width: `min(${gearSize}px, 25vw)`,
            height: 'auto',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
            zIndex: 2,
          }}
        />
      </div>

      {/* Texto animado - responsive */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          color: colors.tertiary,
          fontSize: 'clamp(0.875rem, 2vw, 1.1rem)',
          fontWeight: 600,
          letterSpacing: 'clamp(2px, 0.5vw, 3px)',
          textTransform: 'uppercase',
          textAlign: 'center',
          padding: '0 1rem',
        }}
      >
        {text}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ...
        </motion.span>
      </motion.p>

      {/* Línea de progreso - responsive */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 'min(180px, 60vw)' }}
        transition={{ duration: Math.min(duration / 1000, 3), ease: 'easeInOut' }}
        style={{
          height: '3px',
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: '2px',
          marginTop: 'clamp(0.5rem, 2vh, 1rem)',
          boxShadow: `0 0 10px ${colors.secondary}40`,
        }}
      />
    </motion.div>
  );
}