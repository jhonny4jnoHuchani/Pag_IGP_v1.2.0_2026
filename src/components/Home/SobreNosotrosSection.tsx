import { motion } from 'framer-motion';
import { FaIndustry, FaCogs } from 'react-icons/fa';
import FadeIn from './FadeIn';
import type { InstitucionPrincipal } from '../../lib/api';

const getImageUrl = (filename: string | null | undefined): string => {
  return filename || '';
};

const PuzzleText = ({ text }: { text: string }) => {
  const cleanText = (text || "").replace(/<[^>]*>?/gm, '');
  const characters = cleanText.split("");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      style={{ display: "inline-block", textAlign: "justify", fontSize: 'clamp(0.9rem, 2vw, 1.02rem)', color: '#334155', lineHeight: '1.9' }}
    >
      {characters.map((char, idx) => {
        if (char === "\n") {
          return <br key={idx} />;
        }
        if (char === " ") {
          return <span key={idx} style={{ display: "inline-block", width: "0.25em" }}>&nbsp;</span>;
        }
        const randomX = (Math.random() - 0.5) * 1500;
        const randomY = (Math.random() - 0.5) * 1500;
        const randomRotate = (Math.random() - 0.5) * 720;
        const randomDelay = Math.random() * 2.5;
        return (
          <motion.span
            key={idx}
            variants={{
              hidden: { opacity: 0, x: randomX, y: randomY, rotate: randomRotate, scale: 0.2 },
              visible: { 
                opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, 
                transition: { duration: 2, delay: randomDelay, type: "spring", bounce: 0.4 } 
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

interface SobreNosotrosSectionProps {
  institucion: InstitucionPrincipal | null;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

/**
 * -------------------------------------------------------------------
 * Componente SobreNosotrosSection
 * Renderiza la sección de historia y descripción de la institución (Sobre Nosotros).
 * -------------------------------------------------------------------
 */
const SobreNosotrosSection = ({ institucion, colors }: SobreNosotrosSectionProps) => {
  return (
    <section
      id="sobre-nosotros"
      style={{
        padding: 'clamp(3rem, 8vw, 6rem) 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 50%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fondo complejo petrolero al pie de la sección */}
      <div style={{
        position: 'absolute', bottom: '-13px', left: 0, right: 0, height: 'clamp(150px, 25vw, 300px)',
        background: `url('/Decoradores_gas_petroqumica/fondo_complejo_petrolero.png')`,
        backgroundSize: 'cover', backgroundPosition: 'center bottom', opacity: 0.80, pointerEvents: 'none', zIndex: 0,
        maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
      }}></div>

      {/* Iconos decorativos de fondo */}
      <div style={{ position: 'absolute', top: '8%', right: '4%', color: colors.primary, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
        <FaIndustry size={280} />
      </div>
      <div style={{ position: 'absolute', bottom: '6%', left: '4%', color: colors.secondary, opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
        <FaCogs size={200} />
      </div>

      {/* DECORADORES ANIMADOS */}
      <motion.img src="/Decoradores_gas_petroqumica/decaradores_animado/petroleria.gif" alt="" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 0.3, x: 0, y: [0, -15, 0] }} transition={{ opacity: { duration: 0.8, delay: 0.3 }, x: { duration: 0.8, delay: 0.3 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }} style={{ position: 'absolute', top: '10%', right: '-2%', width: 'clamp(120px, 18vw, 300px)', height: 'auto', pointerEvents: 'none', zIndex: 1 }} />
      <motion.img src="/Decoradores_gas_petroqumica/decaradores_animado/decor_mov.gif" alt="" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 0.35, y: [0, -10, 0] }} transition={{ opacity: { duration: 0.8, delay: 0.7 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }} style={{ position: 'absolute', top: '3%', left: '3%', width: 'clamp(50px, 7vw, 120px)', height: 'auto', pointerEvents: 'none', zIndex: 1 }} />
      <motion.img src="/Decoradores_gas_petroqumica/decaradores_animado/tuerca_girando.gif" alt="" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.35, scale: 1 }} transition={{ opacity: { duration: 0.8, delay: 0.9 }, scale: { duration: 0.8, delay: 0.9 } }} style={{ position: 'absolute', bottom: '5%', right: '5%', width: 'clamp(50px, 6vw, 100px)', height: 'auto', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">
          <FadeIn>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ perspective: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }} whileHover={{ rotateY: 360 }} style={{ width: 'clamp(220px, 60vw, 380px)', height: 'clamp(220px, 60vw, 380px)', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: `8px solid ${colors.primary}`, background: '#fff', position: 'relative', transformStyle: 'preserve-3d' }}>
                  {institucion?.institucion_logo ? (
                    <img src={getImageUrl(institucion.institucion_logo)} alt={institucion.institucion_nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`, fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, color: colors.primary }}>
                      IGP
                    </div>
                  )}
                  {/* Anillo decorativo girando */}
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-8px', left: '-8px', right: '-8px', bottom: '-8px', borderRadius: '50%', border: `2px dashed ${colors.secondary}40`, pointerEvents: 'none' }}></motion.div>
                </motion.div>
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#0f172a', marginBottom: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Sobre Nosotros
              </h2>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ background: '#fff', borderRadius: '20px', padding: 'clamp(1.5rem, 3vw, 2rem)', boxShadow: '0 15px 45px rgba(15,23,42,0.08)', borderLeft: `5px solid ${colors.primary}`, marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '60px', height: '60px', borderRadius: '50%', background: `${colors.secondary}15`, pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: '-15px', left: '-15px', width: '40px', height: '40px', borderRadius: '50%', background: `${colors.primary}10`, pointerEvents: 'none' }}></div>

                <PuzzleText text={institucion?.institucion_historia || 'La Carrera de Ingeniería de Gas y Petroquímica de la Universidad Pública de El Alto (UPEA) ha sido un pilar en la formación de profesionales competentes para el desarrollo del país.'} />
              </motion.div>

              <motion.a href="#contacto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block', padding: '1rem 2.5rem', background: colors.primary, color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '1rem', boxShadow: `0 8px 25px ${colors.primary}40`, transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                Contáctanos →
              </motion.a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotrosSection;
