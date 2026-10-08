import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configurar el worker de PDF.js
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
  title, documentUrl, dateStr, tag = 'DOCUMENTO', colors, index = 0
}: DocumentCardProps) {
  const [hovered, setHovered] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const [pdfError, setPdfError] = useState(false);

  let formattedDate = '';
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) formattedDate = d.toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(false);
  }

  function onDocumentLoadError() {
    setPdfError(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 10) * 0.1 }}
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: hovered ? `0 15px 30px rgba(0,0,0,0.15)` : `0 5px 15px rgba(0,0,0,0.05)`,
          borderLeft: `5px solid ${colors?.secondary || '#dc2626'}`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ 
          flexShrink: 0, width: '70px', height: '90px', borderRadius: '8px', 
          background: `${colors?.secondary || '#dc2626'}15`, display: 'flex', 
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'
        }}>
          {!pdfError && documentUrl && documentUrl.endsWith('.pdf') ? (
            <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
              <Document
                file={documentUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<FaFilePdf size={24} color={colors?.secondary || '#dc2626'} style={{ margin: 'auto', marginTop: '30px', display: 'block' }} />}
              >
                <Page 
                  pageNumber={1} 
                  width={70} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false} 
                />
              </Document>
            </div>
          ) : (
            <FaFilePdf size={28} color={colors?.secondary || '#dc2626'} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: colors?.primary || '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>{tag} • {formattedDate}</span>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.4rem 0 0', color: '#1e293b', lineHeight: 1.4 }}>{title}</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          {documentUrl && (
            <>
              <a href={documentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: `${colors?.primary}15`, color: colors?.primary, textDecoration: 'none', transition: 'all 0.2s' }}>
                 <FaEye size={16} />
              </a>
              <a href={documentUrl} download target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: colors?.secondary, color: '#fff', textDecoration: 'none', transition: 'all 0.2s' }}>
                 <FaDownload size={14} />
              </a>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
