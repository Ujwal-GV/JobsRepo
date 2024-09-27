import React from "react";
import { Swiper } from "swiper/react";
import {
  Pagination,
  FreeMode,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

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
        pagination={{ clickable: true, el:''}}
        modules={[FreeMode, Pagination]}
        className="w-full mb-5"
      >
        {
          children
        }

      </Swiper>
    </>
  );
};

export default AdvancedSwiper;
