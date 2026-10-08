import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaInbox } from 'react-icons/fa';

interface StandardGridProps {
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  colors: any;
}

export default function StandardGrid({ children, isEmpty, emptyMessage = "No hay elementos disponibles.", colors }: StandardGridProps) {
  if (isEmpty) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200 }} style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111827', borderRadius: '20px', border: `2px dashed ${colors?.primary || '#555'}30`, maxWidth: '800px', margin: '0 auto' }}>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <FaInbox style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3, color: colors?.primary || '#fff' }} />
        </motion.div>
        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>{emptyMessage}</h3>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Pronto publicaremos nueva información oficial.</p>
      </motion.div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem', padding: '1rem 0' }}>
      {children}
    </div>
  );
}
