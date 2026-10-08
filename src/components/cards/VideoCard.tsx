import { motion } from 'framer-motion';
import { sanitizeHtml } from '../../utils/sanitize';

interface VideoCardProps {
  title: string;
  description?: string;
  videoUrl: string;
  dateStr?: string;
  colors: any;
  index?: number;
}

export default function VideoCard({
  title, description, videoUrl, dateStr, colors, index = 0
}: VideoCardProps) {
  let formattedDate = '';
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) formattedDate = d.toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Convert regular youtube links to embed links if necessary
  const embedUrl = videoUrl.replace('watch?v=', 'embed/').split('&')[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 10) * 0.1 }}
      style={{
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: `0 10px 30px ${colors?.primary || '#000'}30`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderBottom: `6px solid ${colors?.secondary || '#000'}`
      }}
    >
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem', lineHeight: 1.4 }}>{title}</h3>
        {formattedDate && <span style={{ fontSize: '0.8rem', color: colors?.primary || '#555', fontWeight: 700, marginBottom: '0.8rem', display: 'block' }}>{formattedDate}</span>}
        <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, flex: 1 }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(description || '') }} />
      </div>
    </motion.div>
  );
}
