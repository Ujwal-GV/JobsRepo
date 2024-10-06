import React, { useRef, useState } from "react";
import { Swiper } from "swiper/react";
import { Pagination, FreeMode, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const AdvancedSwiper = ({ children }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);


  return (
    <>
      <div className="swiper-container relative px-5">
        {/* Custom Navigation Buttons */}
        <div
          ref={prevRef}
          className={`custom-prev-btn flex center bg-white z-50 absolute left-2 top-[50%] translate-y-[-50%] cursor-pointer ${
            isBeginning ? " !hidden " : ""
          } shadow-sm shadow-black/50 rounded-full w-8 h-8`}
        >
          <FaChevronLeft />
        </div>
        <div
          ref={nextRef}
          className={`custom-next-btn flex center bg-white z-50 absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer ${
            isEnd ? " !hidden " : ""
          } shadow-sm shadow-black/50 rounded-full w-8 h-8`}
        >
          <FaChevronRight />
        </div>

        <Swiper
          slidesPerView={3}
          spaceBetween={15}
          freeMode={true}
          breakpoints={{
            0: {
              slidesPerView: 1.6,
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
          pagination={{ clickable: true, el: "" }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSwiper={(swiper) => {
            // Assign navigation buttons after the swiper is initialized
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          onSlideChange={(swiper) => {
            // Update the state when the swiper slide changes
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);

            console.log(swiper.isBeginning +"  "+swiper.isEnd)

          }}
          onInit={(swiper) => {
            // Set the initial state on load
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          modules={[FreeMode, Pagination, Navigation]}
          className="w-full mb-5"
        >
          {children}
        </Swiper>
      </div>
    </>
  );
};

export default AdvancedSwiper;
