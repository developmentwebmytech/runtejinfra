"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

gsap.registerPlugin(ScrollTrigger);

function OurBrand() {
  const brands = [
    { src: "/ourbrand1.png", alt: "Runtej Infra" },
    { src: "/ourbrand3.png", alt: "Lodha Luxury" },
    { src: "/ourbrand2.png", alt: "Palava" },
    { src: "/ourbrand4.png", alt: "Palava" },
    { src: "/ourbrand5.jpg", alt: "Palava" },
    { src: "/ourbrand7.jpg", alt: "Palava" },
  ];

  useEffect(() => {
    gsap.from(".swiper-slide", {
      opacity: 0,
      scale: 0.8,
      y: 30,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".swiper",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 sm:py-15">
      <div className=" text-center">
        <button className="text-black text-4xl font-semibold px-4  mb-12">
         OUR FIRMS
        </button>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          loop={true}
          autoplay={{ delay: 2000 }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className=""
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={index}>
              <div className="transition duration-300 hover:scale-105">
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  width={170}
                  height={74}
                  className="object-contain mx-auto"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default OurBrand;
