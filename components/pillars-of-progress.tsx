"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ThirdSection() {
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  // const floatingImage = useRef(null);

  useEffect(() => {
    gsap.from(imageRef.current, {
      x: -80,
      rotation: -15,
      opacity: 0,
      duration: 1.3,
      ease: "elastic.out(1, 0.7)",
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    gsap.from(contentRef.current, {
      rotationY: 90,
      scale: 0.6,
      opacity: 0,
      duration: 1.3,
      ease: "back.out(1.5)",
      transformOrigin: "right center",
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <div className="overflow-hidden relative bg-white">
      <div className="container mx-auto px-4 my-16 sm:my-20">
        {/* 👆 px and my responsive padding added */}

        {/* Left + Right layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* 👆 Mobile: stack, Large: side-by-side */}

          {/* Left - Image */}
          <div ref={imageRef} className="hover:scale-105 cursor-pointer">
            <Image
              src="/third1.jpg"
              alt="Building"
              width={900}
              height={700}
              className="w-full h-auto rounded-md shadow-md"
              // 👆 Responsive image scaling
            />
          </div>

          {/* Right - Text Content */}
          <div ref={contentRef} className="xl:px-16  ">
            <p className="text-green-600 font-semibold text-xl">OUR PROMISE</p>
            <h2 className="text-3xl md:text-4xl font-light leading-snug">
              PILLARS OF PROGRESS
            </h2>
            <p className="text-black my-5  font-regular text-base md:text-lg text-justify">
              {/* 👆 md:pr-16 for larger screens only, safe for small */}
             We create environment that nourishes the soul and enhances and upgrades daily life, where every moment is a celebration of living with purpose. We shape spaces and moments that elevate your lifestyle, making every day experiences extraordinary through Creative and thoughtful designs. 
            </p>

            <button className="border rounded px-6 py-2 text-sm text-white bg-green-600 hover:bg-green-700 transition cursor-pointer">
              Read More...
            </button>
          </div>
        </div>

        

      </div>
    </div>
  );
}
