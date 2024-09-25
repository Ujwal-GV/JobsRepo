import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const AdvancedSwiper = () => {
  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay, EffectCoverflow]}  // Importing modules
      spaceBetween={30}
      slidesPerView={1}
      navigation={true}  // Enable navigation arrows
      pagination={{ clickable: true }}  // Enable clickable pagination dots
      autoplay={{ delay: 3000, disableOnInteraction: false }}  // Enable autoplay with a 3-second delay
      loop={true}  // Enable looping
      effect="coverflow"  // Use the coverflow effect for a 3D slide effect
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
    >
      <SwiperSlide>
        <div className="slide-content">
          <h2>Slide 1</h2>
          <p>This is the first slide.</p>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="slide-content">
          <h2>Slide 2</h2>
          <p>This is the second slide.</p>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="slide-content">
          <h2>Slide 3</h2>
          <p>This is the third slide.</p>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default AdvancedSwiper;
