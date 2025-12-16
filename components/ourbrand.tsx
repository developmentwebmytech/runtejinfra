"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Spinner } from "@/components/ui/spinner"

gsap.registerPlugin(ScrollTrigger);

interface Firm {
  _id: string;
  name: string;
  image: string;
}

function OurBrand() {
  const [firms, setFirms] = useState<Firm[]>([]);
    const [loading, setLoading] = useState(true)

  // ✅ fetch firms from API
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const res = await fetch("/api/our-firms");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setFirms(data);
      } catch (error) {
        console.error("Failed to load firms");
      }finally {
        setLoading(false)
      }
    };

    fetchFirms();
  }, []);

  // ✅ animation
  useEffect(() => {
    if (firms.length === 0) return;

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
      },
    });
  }, [firms]);

  if (loading) {
      return (
        <div className="container mx-auto py-12 flex justify-center">
          <Spinner />
        </div>
      )
    }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-15">
      <div className="text-center">
        <button className="text-black text-4xl font-semibold px-4 mb-12">
          OUR FIRMS
        </button>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          loop
          autoplay={{ delay: 3000, reverseDirection: true, disableOnInteraction: false }}
          
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {firms.map((firm) => (
            <SwiperSlide key={firm._id}>
              <div className="transition duration-300 hover:scale-105">
                <Image
                  src={firm.image}
                  alt={firm.name}
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
