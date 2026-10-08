import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilePdf, FaDownload, FaEye, FaStar } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentCardProps {
  title: string;
  documentUrl: string | null;
  dateStr?: string;
  tag?: string;
  colors: any;
  index?: number;
}

export default function DocumentCard({
  title, documentUrl, dateStr, tag = 'GACETAS', colors, index = 0
}: DocumentCardProps) {
  const [hovered, setHovered] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  let formattedDate = '';
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 10) * 0.1 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <motion.div
        whileHover={{ y: -8 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 20px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        {/* PREVIEW DEL PDF (MITAD SUPERIOR) */}
        <div style={{ position: 'relative', width: '100%', height: '280px', background: '#e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Badge "GACETAS" en esquina superior izquierda */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#f59e0b', color: '#fff', padding: '0.2rem 0.8rem', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '4px', zIndex: 10, letterSpacing: '1px' }}>
            {tag.toUpperCase()}
          </div>

          {!pdfError && documentUrl && documentUrl.endsWith('.pdf') ? (
            <div style={{ width: '100%', pointerEvents: 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '1rem' }}>
              <Document
                file={documentUrl}
                onLoadError={() => setPdfError(true)}
                loading={<FaFilePdf size={40} color="#cbd5e1" />}
              >
                <Page 
                  pageNumber={1} 
                  width={350} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false}
                  className="pdf-preview-page"
                />
              </Document>
            </div>
          ) : (
            <FaFilePdf size={60} color="#cbd5e1" />
          )}

          {/* OVERLAY HOVER (Ver / Descargar) */}
          <AnimatePresence>
            {hovered && documentUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
                }}
              >
                <a href={documentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', background: '#fff', color: colors?.primary || '#3b82f6', textDecoration: 'none' }} title="Ver Documento">
                  <FaEye size={20} />
                </a>
                <a href={documentUrl} download target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', background: colors?.secondary || '#10b981', color: '#fff', textDecoration: 'none' }} title="Descargar PDF">
                  <FaDownload size={18} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENIDO TEXTUAL (MITAD INFERIOR) */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Badge "UPEA | GACETAS" */}
          <div style={{ display: 'inline-block', background: '#fce7f3', color: '#2563eb', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '1rem', alignSelf: 'flex-start' }}>
            UPEA | {tag.toUpperCase()}
          </div>

          {/* Título */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.3, marginBottom: '1rem', flex: 1 }}>
            {title}
          </h3>

          {/* Fecha */}
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {formattedDate}
          </p>

          {/* Estrellas (Estáticas como en el diseño) */}
          <div style={{ display: 'flex', gap: '4px', color: '#f59e0b' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar key={s} size={14} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
