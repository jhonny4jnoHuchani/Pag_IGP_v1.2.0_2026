import { useState, useMemo, useEffect } from 'react';
import { sanitizeHtml } from '../utils/sanitize';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaImages } from 'react-icons/fa';
import { useCarreraData } from '../lib/api';
import { useThemeColors } from '../hooks/useThemeColors';
import MainLayout from '../components/layout/MainLayout';
import HeroBanner from '../components/layout/HeroBanner';
import MasonryGrid from '../components/grids/MasonryGrid';
import ImageCard from '../components/cards/ImageCard';

export default function EventosPage() {
  const { institucion, recursos, loading , contenido} = useCarreraData();
  const colors = useThemeColors(institucion);
  const [busqueda, setBusqueda] = useState('');
  const [eventoModal, setEventoModal] = useState<any>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `https://archivosminio.upea.bo/archivospaginasnode/imagenes/${path}`;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setEventoModal(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const todosLosEventos = recursos?.upea_evento
    ?.filter((evento) => evento.evento_id)
    .sort((a, b) => new Date(b.evento_fecha).getTime() - new Date(a.evento_fecha).getTime()) || [];

  const eventos = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return todosLosEventos;
    return todosLosEventos.filter((e) => {
      const titulo = e.evento_titulo?.toLowerCase() || '';
      const lugar = e.evento_lugar?.toLowerCase() || '';
      const tipo = e.tipo_evento?.toLowerCase() || '';
      return titulo.includes(termino) || lugar.includes(termino) || tipo.includes(termino);
    });
  }, [busqueda, todosLosEventos]);

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner 
        title="Eventos Institucionales" 
        description="Actividades académicas, seminarios, e interacciones sociales de la carrera."
        colors={colors} portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />
      
      <section style={{ padding: '3rem 1.5rem', background: '#f8fafc', minHeight: '600px' , position: 'relative', overflow: 'hidden'}}>

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

        <div style={{ maxWidth: '1200px', position: 'relative', zIndex: 2, margin: '0 auto' }}>
          
          {/* Buscador Simplificado */}
          <div style={{ maxWidth: '480px', margin: '0 auto 3rem', position: 'relative' }}>
            <FaSearch size={16} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar evento por título o lugar..."
              style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', borderRadius: '50px', border: `2px solid ${colors.primary}40`, background: '#fff', color: '#1e293b', fontSize: '0.95rem', outline: 'none' }}
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaTimes size={10} color="#64748b" />
              </button>
            )}
          </div>

          <MasonryGrid isEmpty={eventos.length === 0} emptyMessage={busqueda ? `No se encontraron eventos para "${busqueda}".` : "No hay eventos programados."} colors={colors}>
            {eventos.map((evento, idx) => (
              <ImageCard 
                key={evento.evento_id}
                title={evento.evento_titulo}
                description={evento.evento_descripcion}
                imageUrl={evento.evento_imagen ? getImageUrl(evento.evento_imagen) : null}
                dateStr={evento.evento_fecha}
                tag={evento.tipo_evento || 'Evento'}
                colors={colors}
                index={idx}
                onClick={() => setEventoModal(evento)}
              />
            ))}
          </MasonryGrid>

        </div>
      </section>

      {/* MODAL MANTENIDO MUY SIMILAR, PERO LIGERO */}
      <AnimatePresence>
        {eventoModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', cursor: 'pointer', overflow: 'auto' }} onClick={() => setEventoModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#fff', borderRadius: '16px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'auto', cursor: 'default', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              
              <button onClick={() => setEventoModal(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', zIndex: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaTimes />
              </button>

              {eventoModal.evento_imagen && (
                <div style={{ width: '100%', height: '280px' }}>
                  <img src={getImageUrl(eventoModal.evento_imagen)} alt="Evento" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>{eventoModal.evento_titulo}</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#64748b', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCalendarAlt /> {new Date(eventoModal.evento_fecha).toLocaleDateString()}</div>
                  {eventoModal.evento_hora && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaClock /> {eventoModal.evento_hora}</div>}
                  {eventoModal.evento_lugar && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaMapMarkerAlt /> {eventoModal.evento_lugar}</div>}
                </div>
                {eventoModal.evento_descripcion && (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(eventoModal.evento_descripcion) }} style={{ lineHeight: 1.6, color: '#334155' }} />
                )}
                
                {eventoModal.galeria && eventoModal.galeria.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><FaImages /> Galería</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                      {eventoModal.galeria.map((img: string, idx: number) => (
                         <img key={idx} src={getImageUrl(img)} alt={`Galeria ${idx}`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px' }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}