import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaDownload, FaEye } from 'react-icons/fa';

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

  let formattedDate = '';
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) formattedDate = d.toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });
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
        <div style={{ flexShrink: 0, width: '60px', height: '60px', borderRadius: '12px', background: `${colors?.secondary || '#dc2626'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaFilePdf size={28} color={colors?.secondary || '#dc2626'} />
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
