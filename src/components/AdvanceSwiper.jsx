import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  FreeMode,
  Scrollbar,
  A11y,
  Navigation,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import JobCard from "./JobCard";

const AdvancedSwiper = ({children}) => {
  return (
    <>
      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        freeMode={true}
        breakpoints={{
          0: {
            slidesPerView: 1.5,
          },
          520: {
            slidesPerView: 2,
          },
          760: {
            slidesPerView: 3,
          },
          1080: {
            slidesPerView: 5,
          },
          1300: {
            slidesPerView: 6,
          },
        }}
        pagination={{ clickable: true, el: ".custom-pagination" }}
        modules={[FreeMode, Pagination]}
        className="w-full"
      >
        {
          children
        }

      </Swiper>
      <div className="w-full custom-pagination flex center justify-center gap-1 h-10"></div>
    </>
  );
};

export default AdvancedSwiper;
