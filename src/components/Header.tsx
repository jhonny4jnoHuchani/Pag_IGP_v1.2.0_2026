import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaUniversity, 
  FaBullhorn, 
  FaBook, 
  FaEllipsisH, 
  FaLock, 
  FaBars, 
  FaTimes, 
  FaChevronDown,
  FaHistory,
  FaEye,
  FaUserGraduate,
  FaUsers,
  FaFileAlt,
  FaNewspaper,
  FaScroll,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaConciergeBell,
  FaBriefcase,
  FaCalendarAlt,
  FaVideo,
  FaClipboardList,
  FaBookOpen
} from 'react-icons/fa';
import { useThemeColors } from '../hooks/useThemeColors';
import { InstitucionPrincipal } from '../lib/api';

interface HeaderProps {
  data: InstitucionPrincipal | null;
}

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env
// =============================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apiadministrador.upea.bo';

// =============================================
// UTILIDAD: Construir URL del logo
// =============================================
const buildLogoUrl = (logoPath: string | null | undefined): string => {
  if (!logoPath) return '';
  const cleanPath = logoPath.trim();
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) return cleanPath;
  if (cleanPath.startsWith('/storage/')) return `${API_BASE_URL}${cleanPath}`;
  return `${API_BASE_URL}/storage/imagenes/logos/${cleanPath}`;
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
export default function Header({ data }: HeaderProps) {
  if (!data) return null;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  const colors = useThemeColors(data);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrolled(scrollTop > 50);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoUrl = buildLogoUrl(data.institucion_logo);

  const handleMouseEnter = useCallback((menu: string) => setActiveDropdown(menu), []);
  const handleMouseLeave = useCallback(() => setActiveDropdown(null), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setOpenMobileAccordion(null);
  }, []);

  // Menú items con iconos - href con #/ para el Router
const menuItems = [
  {
    id: 'institucion',
    label: 'LA INSTITUCIÓN',
    icon: <FaUniversity />,
    links: [
      { href: '#historia', label: 'Historia', icon: <FaHistory /> },
      { href: '#mision-vision', label: 'Misión y Visión', icon: <FaEye /> },
      { href: '#perfil', label: 'Perfil Profesional', icon: <FaUserGraduate /> },
      { href: '#autoridades', label: 'Autoridades', icon: <FaUsers /> },
    ]
  },
  {
    id: 'academico',
    label: 'ACADÉMICO',
    icon: <FaBookOpen />,
    links: [
      { href: '#malla-curricular', label: 'Malla Curricular', icon: <FaClipboardList /> },
      { href: '#plan-estudios', label: 'Plan de Estudios', icon: <FaFileAlt /> },
      { href: '#horarios', label: 'Horarios', icon: <FaCalendarAlt /> },
    ]
  },
    {
      id: 'convocatorias',
      label: 'CONVOCATORIAS',
      icon: <FaBullhorn />,
      links: [
        { href: '#convocatorias', label: 'Convocatorias', icon: <FaBullhorn /> },
        { href: '#avisos', label: 'Avisos', icon: <FaFileAlt /> },
        { href: '#comunicados', label: 'Comunicados', icon: <FaNewspaper /> },
        { href: '#gaceta', label: 'Gaceta', icon: <FaScroll /> },
      ]
    },
    {
      id: 'cursos',
      label: 'CURSOS',
      icon: <FaBook />,
      links: [
        { href: '#seminarios', label: 'Seminarios', icon: <FaChalkboardTeacher /> },
        { href: '#cursos', label: 'Cursos', icon: <FaGraduationCap /> },
      ]
    },
    {
      id: 'mas',
      label: 'MÁS',
      icon: <FaEllipsisH />,
      links: [
        { href: '#servicios', label: 'Servicios', icon: <FaConciergeBell /> },
        { href: '#ofertas-academicas', label: 'Ofertas Académicas', icon: <FaBriefcase /> },
        { href: '#publicaciones', label: 'Publicaciones', icon: <FaFileAlt /> },
        { href: '#eventos', label: 'Eventos', icon: <FaCalendarAlt /> },
        { href: '#videos', label: 'Videos', icon: <FaVideo /> },
      ]
    }
  ];

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .header-transparent {
          transition: all 0.3s ease;
        }
        .header-transparent.scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .nav-link-hover {
          transition: all 0.2s ease;
        }
        .nav-link-hover:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: translateY(-2px);
        }
        .dropdown-item-hover {
          transition: all 0.2s ease;
        }
        .dropdown-item-hover:hover {
          background: rgba(255,255,255,0.1) !important;
          padding-left: 1.5rem !important;
          color: ${colors.secondary} !important;
        }
        .btn-login-hover {
          transition: all 0.3s ease;
        }
        .btn-login-hover:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
        }
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
          .mobile-nav { display: none; }
          .mobile-nav.open { display: block !important; animation: slideDown 0.3s ease; }
        }
        @media (min-width: 1025px) {
          .mobile-toggle { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>

      {/* Barra de progreso de scroll */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: colors.gradientPrimary,
          transformOrigin: '0% 50%',
          zIndex: 1001,
        }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />

      {/* Header con animación de entrada */}
      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`header-transparent ${scrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled
            ? `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
          borderBottom: scrolled ? 'none' : `2px solid rgba(255,255,255,0.2)`,
          padding: scrolled ? '0.75rem 0' : '1rem 0',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '70px'
        }}>
          
          {/* Logo y Nombre */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            {logoUrl && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: '75px',
                  height: '75px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                }}
              >
                <img
                  src={logoUrl}
                  alt={data.institucion_nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  loading="eager"
                />
              </motion.div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: colors.tertiary,
                margin: 0,
                lineHeight: 1.2,
                textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                letterSpacing: '0.5px'
              }}>
                {data.institucion_nombre}
              </h1>
              <span style={{
                fontSize: '0.8rem',
                color: colors.tertiary,
                fontWeight: 500,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                opacity: 0.9
              }}>
                UPEA
              </span>
            </div>
          </motion.div>

          {/* Menú Desktop */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '0.25rem', alignItems: 'center' }}>
              <li style={{ position: 'relative' }}>
                <a
                  href="#/"
                  className="nav-link-hover"
                  style={{
                    color: colors.tertiary,
                    textDecoration: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  <FaHome style={{ fontSize: '1rem' }} />
                  INICIO
                </a>
              </li>

              {menuItems.map((item, itemIndex) => (
                <li
                  key={item.id}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + itemIndex * 0.05 }}
                    className="nav-link-hover"
                    style={{
                      color: colors.tertiary,
                      background: 'transparent',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {item.icon}
                    {item.label}
                    <motion.span
                      animate={{ rotate: activeDropdown === item.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <FaChevronDown style={{ fontSize: '0.7rem' }} />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {activeDropdown === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          minWidth: '260px',
                          background: 'rgba(0,0,0,0.95)',
                          backdropFilter: 'blur(15px)',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                          padding: '0.5rem 0',
                          marginTop: '0.5rem',
                          borderTop: `3px solid ${colors.secondary}`,
                          zIndex: 1001,
                        }}
                      >
                        {item.links.map((link, linkIndex) => (
                          <motion.a
                            key={linkIndex}
                            href={link.href}
                            className="dropdown-item-hover"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: linkIndex * 0.05 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.75rem 1.25rem',
                              color: colors.tertiary,
                              textDecoration: 'none',
                              fontWeight: 500,
                              fontSize: '0.95rem',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                            }}
                          >
                            <span style={{ color: colors.secondary, fontSize: '0.9rem' }}>
                              {link.icon}
                            </span>
                            {link.label}
                          </motion.a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}

              <li>
                <motion.a
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://servicioadministrador.upea.bo/sign-in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-login-hover"
                  style={{
                    background: colors.secondary,
                    color: colors.textOnSecondary,
                    padding: '0.75rem 1.75rem',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    marginLeft: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  }}
                >
                  <FaLock style={{ fontSize: '0.9rem' }} />
                  INICIAR SESIÓN
                </motion.a>
              </li>
            </ul>
          </nav>

          {/* Toggle Mobile */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              zIndex: 1002,
              color: colors.tertiary,
              fontSize: '1.8rem',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Menú Mobile - CORREGIDO */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="mobile-nav open"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`,
                backdropFilter: 'blur(20px)',
                padding: '1.5rem 2rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                zIndex: 999,
                overflow: 'hidden',
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li>
                  <a
                    href="#/"
                    onClick={closeMobileMenu}
                    style={{
                      color: colors.tertiary,
                      textDecoration: 'none',
                      padding: '0.75rem 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.75rem'
                    }}
                  >
                    <FaHome style={{ color: colors.secondary }} />
                    INICIO
                  </a>
                </li>

{menuItems.map((item) => (
  <li key={item.id}>
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      <button
        onClick={() => setOpenMobileAccordion(openMobileAccordion === item.id ? null : item.id)}
        style={{
          color: colors.tertiary,
          background: 'transparent',
          border: 'none',
          padding: '0.75rem 0',
          width: '100%',
          textAlign: 'left',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: colors.secondary }}>{item.icon}</span>
          {item.label}
        </span>
        <motion.span
          animate={{ rotate: openMobileAccordion === item.id ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown style={{ fontSize: '0.8rem' }} />
        </motion.span>
      </button>

      <AnimatePresence>
        {openMobileAccordion === item.id && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ listStyle: 'none', padding: '0 0 0 1.5rem', margin: '0', overflow: 'hidden' }}
          >
            {item.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  onClick={closeMobileMenu}
                  style={{
                    color: colors.tertiary,
                    textDecoration: 'none',
                    padding: '0.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.95rem',
                    opacity: 0.95,
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: colors.secondary }}>{link.icon}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  </li>
))}




                <li style={{ paddingTop: '1rem' }}>
                  <a
                    href="https://servicioadministrador.upea.bo/sign-in"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    style={{
                      background: colors.secondary,
                      color: colors.textOnSecondary,
                      padding: '0.875rem 1.5rem',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    }}
                  >
                    <FaLock />
                    INICIAR SESIÓN
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}