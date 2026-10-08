import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaInbox } from 'react-icons/fa';

interface MasonryGridProps {
  children: ReactNode[];
  isEmpty?: boolean;
  emptyMessage?: string;
  colors: any;
}

export default function MasonryGrid({ children, isEmpty, emptyMessage = "No hay elementos disponibles.", colors }: MasonryGridProps) {
  if (isEmpty || !children || children.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111827', borderRadius: '20px', border: `2px dashed ${colors?.primary || '#555'}30`, maxWidth: '800px', margin: '0 auto' }}>
         <FaInbox style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3, color: colors?.primary || '#fff' }} />
        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>{emptyMessage}</h3>
      </motion.div>
    );
  }

  return (
    <>
      <style>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
          padding: 1rem 0;
        }
        @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
        @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 100%;
        }
      `}</style>

      <div className="masonry-grid">
        {children.map((child, index) => (
          <div key={index} className="masonry-item">
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
