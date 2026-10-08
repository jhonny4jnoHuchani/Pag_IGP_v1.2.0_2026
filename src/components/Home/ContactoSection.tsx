import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import FadeIn from './FadeIn';
import type { InstitucionPrincipal } from '../../lib/api';

interface ContactoSectionProps {
  institucion: InstitucionPrincipal | null;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

/**
 * -------------------------------------------------------------------
 * Componente ContactoSection
 * Renderiza la información de contacto de la institución.
 * -------------------------------------------------------------------
 */
const ContactoSection = ({ institucion, colors }: ContactoSectionProps) => {
  const whatsappNumber =
    institucion?.institucion_celular1 && institucion.institucion_celular1 !== 2147483647
      ? institucion.institucion_celular1
      : null;

  return (
    <section
      id="contacto"
      style={{
        padding: 'clamp(2.5rem, 7vw, 5rem) 0',
        background: `linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at 20% 20%, ${colors.primary}90 0%, transparent 70%), radial-gradient(ellipse at 80% 80%, ${colors.secondary}90 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0,
        }}
      ></div>

      {/* Formas de fondo (manchas difuminadas) */}
      <div style={{ position: 'absolute', top: '-140px', right: '-120px', width: 'clamp(220px, 32vw, 380px)', height: 'clamp(220px, 32vw, 380px)', borderRadius: '50%', background: `${colors.primary}22`, filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-160px', left: '-100px', width: 'clamp(240px, 34vw, 400px)', height: 'clamp(240px, 34vw, 400px)', borderRadius: '50%', background: `${colors.secondary}22`, filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* DECORADORES ESTÁTICOS ANIMADOS */}
      <style>{`
        .decorador-contacto { position: absolute; pointer-events: none; z-index: 1; }
        @media (max-width: 768px) { .decorador-contacto { opacity: 0.2 !important; } .decorador-hide-mobile { display: none; } }
        .contacto-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 640px) { .contacto-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
        @media (min-width: 1024px) { .contacto-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }
        .contacto-card { transition: box-shadow 0.3s ease, transform 0.3s ease; }
        .contacto-card:hover { box-shadow: 0 18px 45px rgba(0,0,0,0.35) !important; }
      `}</style>

      {/* ... decoradores de contacto ... */}
      <motion.img src="/decoradores/decor_static/tuerca_2.png" alt="" className="decorador-contacto" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 0.5, rotate: 360 }} transition={{ opacity: { duration: 0.8 }, rotate: { duration: 22, repeat: Infinity, ease: 'linear' } }} style={{ top: '-8%', right: '-6%', width: 'clamp(150px, 20vw, 350px)' }} />
      <motion.img src="/decoradores/decor_static/circulo_azuul.png" alt="" className="decorador-contacto" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 1, rotate: -360 }} transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, rotate: { duration: 18, repeat: Infinity, ease: 'linear' } }} style={{ top: '3%', left: '2%', width: 'clamp(90px, 12vw, 200px)' }} />
      <motion.img src="/decoradores/decor_static/redondo_con_forma.png" alt="" className="decorador-contacto" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.45, scale: 1, rotate: 360 }} transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }} style={{ top: '35%', left: '-3%', width: 'clamp(100px, 14vw, 220px)' }} />
      <motion.img src="/decoradores/decor_static/redondo_form2.png" alt="" className="decorador-contacto decorador-hide-mobile" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.45, scale: 1, rotate: -360 }} transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }} style={{ top: '30%', right: '-3%', width: 'clamp(90px, 12vw, 200px)' }} />
      <motion.img src="/decoradores/decor_static/decoracion1.png" alt="" className="decorador-contacto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 0.4, y: [0, -15, 0] }} transition={{ opacity: { duration: 0.8, delay: 0.3 }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } }} style={{ bottom: '3%', left: '3%', width: 'clamp(80px, 10vw, 160px)' }} />
      <motion.img src="/decoradores/decor_static/decoracion2.png" alt="" className="decorador-contacto decorador-hide-mobile" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 0.4, y: [0, -12, 0] }} transition={{ opacity: { duration: 0.8, delay: 0.4 }, y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' } }} style={{ bottom: '5%', right: '3%', width: 'clamp(70px, 9vw, 140px)' }} />
      <motion.img src="/decoradores/decor_static/3_lineas_siksak.png" alt="" className="decorador-contacto decorador-hide-mobile" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 0.3, y: [0, -10, 0] }} transition={{ opacity: { duration: 0.8, delay: 0.5 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }} style={{ top: '1%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(100px, 14vw, 220px)' }} />
      <motion.img src="/decoradores/decor_static/redondo_puteado.png" alt="" className="decorador-contacto" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.4, scale: 1, rotate: 360 }} transition={{ opacity: { duration: 0.8, delay: 0.6 }, scale: { duration: 0.8, delay: 0.6 }, rotate: { duration: 26, repeat: Infinity, ease: 'linear' } }} style={{ bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(70px, 9vw, 150px)' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: `${colors.primary}20`, color: '#fff', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Contáctanos
            </span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              ¿Listo para comenzar?
            </h2>
            <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
              Estamos aquí para resolver tus dudas. Encuentra toda nuestra información de contacto a continuación.
            </p>
          </div>
        </FadeIn>

        <div className="contacto-grid" style={{ marginBottom: '2.25rem' }}>
          {[
            institucion?.institucion_direccion ? { icon: <FiMapPin size={24} />, label: 'Dirección', value: institucion.institucion_direccion, href: undefined } : null,
            whatsappNumber ? { icon: <FiPhone size={24} />, label: 'Teléfono', value: String(whatsappNumber), href: `tel:${whatsappNumber}` } : null,
            institucion?.institucion_correo1 ? { icon: <FiMail size={24} />, label: 'Correo', value: institucion.institucion_correo1, href: `mailto:${institucion.institucion_correo1}` } : null,
            { icon: <FiClock size={24} />, label: 'Horario', value: 'Lun a Vie: 8:00–12:00 y 14:00–18:00', href: undefined },
          ]
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .map((item, index) => {
              const accent = index % 2 === 0 ? colors.primary : colors.secondary;
              const CardInner = (
                <div className="contacto-card" style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 12px 35px rgba(0,0,0,0.25)' }}>
                  <div style={{ height: '4px', background: `linear-gradient(90deg, ${accent}, ${accent}80)` }}></div>
                  <div style={{ padding: '1.85rem 1.4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.9rem', flex: 1 }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}22, ${accent}10)`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${accent}30` }}>
                      {item.icon}
                    </div>
                    <div style={{ width: '100%' }}>
                      <strong style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                        {item.label}
                      </strong>
                      <p style={{ margin: 0, color: '#1e293b', fontSize: 'clamp(0.85rem, 2vw, 0.98rem)', lineHeight: 1.5, fontWeight: 600, wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              );

              return (
                <FadeIn key={item.label} delay={index * 0.08}>
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.03} transitionSpeed={1000} style={{ height: '100%' }}>
                    {item.href ? (
                      <a href={item.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                        {CardInner}
                      </a>
                    ) : (
                      CardInner
                    )}
                  </Tilt>
                </FadeIn>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ContactoSection;
