import { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselGridProps {
  children: ReactNode[];
  isEmpty?: boolean;
}

export default function CarouselGrid({ children, isEmpty }: CarouselGridProps) {
  if (isEmpty || !children || children.length === 0) return null;

  return (
    <div style={{ padding: '1rem 0' }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={25}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        style={{ paddingBottom: '3rem' }} // Space for pagination
      >
        {children.map((child, index) => (
          <SwiperSlide key={index} style={{ height: 'auto' }}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
