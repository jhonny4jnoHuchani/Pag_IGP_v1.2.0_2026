import { ReactNode } from 'react';
import { useCarreraData } from '../../lib/api';
import { useThemeColors } from '../../hooks/useThemeColors';
import Header from '../Header';
import Footer from '../Footer';
import PageDecorators from '../PageDecorators';
import LoadingScreen from '../LoadingScreen';

interface MainLayoutProps {
  children: ReactNode;
  loadingData?: boolean;
}

export default function MainLayout({ children, loadingData = false }: MainLayoutProps) {
  const { institucion, loading: baseLoading, error } = useCarreraData();
  const colors = useThemeColors(institucion);

  // Considerar el loading de la data base + la data de la pagina
  const isLoading = baseLoading || loadingData;

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <p style={{ color: '#dc2626', fontWeight: 600 }}>Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingScreen
        institucion={institucion}
        text="Cargando..."
        duration={1200}
        onFinish={() => {}}
        tubeSize={200}
        gearSize={60}
      />
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header data={institucion} />
      
      <PageDecorators colors={colors} showSparkles={true} />

      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {children}
      </main>

      <Footer data={institucion} />
    </div>
  );
}
