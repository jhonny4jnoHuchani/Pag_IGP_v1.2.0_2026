import { InstitucionPrincipal } from '../lib/api';
import { motion } from 'framer-motion';
import { useThemeColors } from '../hooks/useThemeColors';
import {
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
  FaWhatsapp,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
} from 'react-icons/fa6';

interface FooterProps {
  data: InstitucionPrincipal | null;
}

interface FooterLink {
  href: string;
  label: string;
}

// Sentinel usado por la API para indicar "sin número de celular"
const INVALID_PHONE_SENTINEL = 2147483647;

export default function Footer({ data }: FooterProps) {
  if (!data) return null;

  const colors = useThemeColors(data);
  const primaryColor = colors.primary;
  const secondaryColor = colors.secondary;
  const tertiaryColor = colors.tertiary ?? '#ffffff';
  const currentYear = new Date().getFullYear();

  const hasValidPhone =
    !!data.institucion_celular1 && data.institucion_celular1 !== INVALID_PHONE_SENTINEL;

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    return path.startsWith('http')
      ? path
      : `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  const navLinks: FooterLink[] = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#sobre', label: 'La Institución' },
    { href: '#plan', label: 'Plan de Estudios' },
    { href: '#perfil', label: 'Perfil Profesional' },
    { href: '#noticias', label: 'Noticias' },
    { href: '#videos', label: 'Videos' },
    { href: '#contacto', label: 'Contacto' },
  ];

  const servicios: FooterLink[] = [
    { href: '#inscripciones', label: 'Inscripciones' },
    { href: '#campus', label: 'Campus Virtual' },
    { href: '#biblioteca', label: 'Biblioteca' },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .footer-link { transition: all 0.3s ease; }
        .footer-link:hover { transform: translateX(5px) !important; color: ${secondaryColor} !important; }
        .footer-link:hover .footer-link-dot { opacity: 1 !important; }
        .social-btn { transition: all 0.3s ease; }
        .social-btn:hover { transform: translateY(-4px) !important; filter: brightness(1.15); }
        .footer-cta-btn { transition: all 0.3s ease; }
        .footer-cta-btn:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important; }
        @media (max-width: 992px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-top-content { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>

      <footer
        style={{
          background: '#0f172a',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1.6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradientes de fondo decorativos */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(ellipse at 20% 30%, ${primaryColor}90 0%, transparent 70%),
              radial-gradient(ellipse at 80% 70%, ${secondaryColor}90 0%, transparent 70%)
            `,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        ></div>

        {/* Barra superior CTA */}
                <div
          style={{
            position: 'relative',
            height: 'clamp(180px, 25vw, 280px)',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          {/* Imagen de fondo con efecto parallax (ventana) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url('/Decoradores_gas_petroqumica/Fondo_presentacion..jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              pointerEvents: 'none',
            }}
          ></div>
        </div>
        {/* Contenido principal del footer */}
        <div
          style={{
            background: `linear-gradient(180deg, #1e293b 0%, #0f172a 100%)`,
            padding: '4rem 0 2rem',
            borderTop: `1px solid ${primaryColor}30`,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div
              className="footer-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '3rem',
                alignItems: 'start',
              }}
            >
              {/* Columna 1: Información de la institución */}
              <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  {data.institucion_logo && (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        padding: '4px',
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        boxShadow: `0 4px 15px ${primaryColor}40`,
                      }}
                    >
                      <img
                        src={getImageUrl(data.institucion_logo)}
                        alt={data.institucion_nombre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          background: tertiaryColor,
                          borderRadius: '8px',
                          padding: '4px',
                        }}
                      />
                    </motion.div>
                  )}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: tertiaryColor, lineHeight: 1.3 }}>
                    {data.institucion_nombre}
                  </h3>
                </div>

                <p style={{ margin: '0 0 1rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {data.institucion_iniciales} - Universidad Pública de El Alto
                </p>

                {data.institucion_direccion && (
                  <p
                    style={{
                      margin: '0 0 1rem',
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <FaLocationDot style={{ color: primaryColor, fontSize: '1rem', marginTop: '0.2rem', flexShrink: 0 }} />
                    <span>{data.institucion_direccion}</span>
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {hasValidPhone && (
                    <a
                      href={`tel:${data.institucion_celular1}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: '#cbd5e1',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = secondaryColor;
                        e.currentTarget.style.background = `${primaryColor}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#cbd5e1';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <FaPhone style={{ color: primaryColor, fontSize: '1rem' }} />
                      <span>{data.institucion_celular1}</span>
                    </a>
                  )}
                  {data.institucion_correo1 && (
                    <a
                      href={`mailto:${data.institucion_correo1}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: '#cbd5e1',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = secondaryColor;
                        e.currentTarget.style.background = `${secondaryColor}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#cbd5e1';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <FaEnvelope style={{ color: secondaryColor, fontSize: '1rem' }} />
                      <span>{data.institucion_correo1}</span>
                    </a>
                  )}
                </div>

                <div>
                  <h4
                    style={{
                      margin: '0 0 0.75rem',
                      fontSize: '0.9rem',
                      color: tertiaryColor,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Síguenos
                  </h4>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {data.institucion_facebook && (
                      <motion.a
                        whileHover={{ scale: 1.15, y: -3 }}
                        href={data.institucion_facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: 'linear-gradient(135deg, #1877F2, #0d5bd4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', boxShadow: '0 4px 12px rgba(24,119,242,0.4)',
                        }}
                        title="Facebook"
                      >
                        <FaFacebookF size={16} />
                      </motion.a>
                    )}
                    {data.institucion_youtube && (
                      <motion.a
                        whileHover={{ scale: 1.15, y: -3 }}
                        href={data.institucion_youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: 'linear-gradient(135deg, #FF0000, #cc0000)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', boxShadow: '0 4px 12px rgba(255,0,0,0.4)',
                        }}
                        title="YouTube"
                      >
                        <FaYoutube size={16} />
                      </motion.a>
                    )}
                    {data.institucion_twitter && (
                      <motion.a
                        whileHover={{ scale: 1.15, y: -3 }}
                        href={data.institucion_twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: 'linear-gradient(135deg, #1DA1F2, #0d8bd9)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', boxShadow: '0 4px 12px rgba(29,161,242,0.4)',
                        }}
                        title="Twitter/X"
                      >
                        <FaXTwitter size={16} />
                      </motion.a>
                    )}
                    {hasValidPhone && (
                      <motion.a
                        whileHover={{ scale: 1.15, y: -3 }}
                        href={`https://wa.me/${data.institucion_celular1}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: 'linear-gradient(135deg, #25D366, #1ebc57)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', boxShadow: '0 4px 12px rgba(37,211,102,0.4)',
                        }}
                        title="WhatsApp"
                      >
                        <FaWhatsapp size={18} />
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>

              {/* Columna 2: Navegación */}
              <div style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
                <h4
                  style={{
                    margin: '0 0 1.25rem',
                    fontSize: '1rem',
                    color: tertiaryColor,
                    fontWeight: 700,
                    paddingBottom: '0.75rem',
                    borderBottom: `2px solid ${primaryColor}30`,
                  }}
                >
                  Navegación
                </h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="footer-link"
                        style={{
                          color: '#94a3b8',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.25rem 0',
                        }}
                      >
                        <span
                          className="footer-link-dot"
                          style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: secondaryColor, opacity: 0, transition: 'opacity 0.3s ease',
                          }}
                        ></span>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna 3: Servicios + Mapa (llena el espacio vacío que quedaba abajo) */}
              <div style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
                <h4
                  style={{
                    margin: '0 0 1.25rem',
                    fontSize: '1rem',
                    color: tertiaryColor,
                    fontWeight: 700,
                    paddingBottom: '0.75rem',
                    borderBottom: `2px solid ${secondaryColor}30`,
                  }}
                >
                  Servicios
                </h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {servicios.map((servicio) => (
                    <li key={servicio.href}>
                      <a
                        href={servicio.href}
                        className="footer-link"
                        style={{
                          color: '#94a3b8',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.25rem 0',
                        }}
                      >
                        <span
                          className="footer-link-dot"
                          style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: primaryColor, opacity: 0, transition: 'opacity 0.3s ease',
                          }}
                        ></span>
                        {servicio.label}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Mapa compacto, ahora debajo de Servicios */}
                {data.institucion_api_google_map && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{
                      marginTop: '1.5rem',
                      width: '100%',
                      background: tertiaryColor,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      border: `2px solid ${primaryColor}20`,
                    }}
                  >
                    <div
                      style={{
                        padding: '0.6rem 0.9rem',
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <FaLocationDot style={{ color: '#fff', fontSize: '0.85rem' }} />
                      <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>Ubicación</span>
                    </div>
                    <div style={{ position: 'relative', paddingBottom: '75%', height: 0 }}>
                      <iframe
                        src={data.institucion_api_google_map}
                        title="Ubicación de la carrera"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </motion.div>
                )}

                {!data.institucion_api_google_map && data.institucion_direccion && (
                  <p
                    style={{
                      marginTop: '1.5rem',
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '1rem',
                      borderRadius: '8px',
                    }}
                  >
                    <FaLocationDot style={{ color: primaryColor }} />
                    {data.institucion_direccion}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* NOTA: logos UTIC/UPEA removidos por el momento.
            Si luego quieres la versión "marca de agua" (grandes, uno al lado del otro,
            de fondo en alguna sección), dime y te la agrego con opacidad baja
            y position absolute para que no interfiera con el contenido. */}
{/* Copyright */}


{/* Copyright */}
<motion.div
  style={{
    background: `linear-gradient(180deg, #020617 0%, #0f172a 100%)`,
    padding: '1.25rem 2rem',
    borderTop: `1px solid ${primaryColor}20`,
  }}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
  }}>
    {/* Lado izquierdo: copyright */}
    <p style={{ 
      margin: 0, 
      color: 'rgba(255,255,255,0.7)', 
      fontSize: '0.8rem',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      flexWrap: 'wrap',
    }}>
      <span>© UPEA | {currentYear} - UTIC | Todos los derechos reservados</span>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>v1.1.0</span>
    </p>

    {/* Lado derecho: créditos */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap',
      fontSize: '0.75rem',
    }}>
      <span style={{ 
        padding: '0.2rem 0.6rem', 
        background: `${colors.primary}25`, 
        borderRadius: '50px', 
        fontWeight: 700,
        fontSize: '0.65rem',
        letterSpacing: '1px',
        color: colors.primary,
      }}>
        V1.0
      </span>
      <a 
        href="https://www.linkedin.com/in/albieri-laura-308686397/" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
          color: '#93c5fd', 
          textDecoration: 'none', 
          fontWeight: 600,
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fde047'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#93c5fd'}
      >
        <FaLinkedin size={11} />
        Albiery
      </a>

      <span style={{ 
        width: '2px', 
        height: '20px', 
        background: `linear-gradient(180deg, ${colors.primary}, ${colors.secondary})`, 
        borderRadius: '2px',
        boxShadow: `0 0 8px ${colors.primary}40`,
      }}></span>

      <span style={{ 
        padding: '0.2rem 0.6rem', 
        background: `${colors.secondary}25`, 
        borderRadius: '50px', 
        fontWeight: 700,
        fontSize: '0.65rem',
        letterSpacing: '1px',
        color: colors.secondary,
      }}>
        V1.1
      </span>
      <a 
        href="https://www.linkedin.com/in/jhonny-ajno-huchani-6545903a2" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
          color: '#93c5fd', 
          textDecoration: 'none', 
          fontWeight: 600,
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fde047'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#93c5fd'}
      >
        <FaLinkedin size={11} />
        JhonnyAH
      </a>
    </div>
  </div>
</motion.div>







      </footer>
    </>
  );
}