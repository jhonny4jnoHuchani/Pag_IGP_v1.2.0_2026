import { useCarreraData } from "../lib/api";
import { useThemeColors } from "../hooks/useThemeColors";
import MainLayout from "../components/layout/MainLayout";
import HeroBanner from "../components/layout/HeroBanner";
import StandardGrid from "../components/grids/StandardGrid";
import VideoCard from "../components/cards/VideoCard";

export default function VideosPage() {
  const { institucion, contenido, loading } = useCarreraData();
  const colors = useThemeColors(institucion);

  const videos = contenido?.upea_videos || [];

  return (
    <MainLayout loadingData={loading}>
      <HeroBanner
        title="Material Audiovisual"
        description="Noticias, tutoriales y eventos en formato de video."
        colors={colors} portadas={contenido?.portada} logo={institucion?.institucion_logo}
      />

      <section
        style={{
          padding: "4rem 1.5rem",
          background: "#f8fafc",
          minHeight: "600px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <StandardGrid
            isEmpty={videos.length === 0}
            emptyMessage="No hay videos disponibles."
            colors={colors}
          >
            {videos.map((video, idx) => (
              <VideoCard
                key={video.video_id}
                title={video.video_titulo}
                description={video.video_breve_descripcion}
                videoUrl={video.video_enlace}
                colors={colors}
                index={idx}
              />
            ))}
          </StandardGrid>
        </div>
      </section>
    </MainLayout>
  );
}
