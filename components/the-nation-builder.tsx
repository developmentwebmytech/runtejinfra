"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import Link from "next/link";

export default function FirstSection() {
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.from(imageRef.current, {
      y: 60,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 90%",
      },
    });

    gsap.from(contentRef.current, {
      y: 40,
      opacity: 0,
      delay: 0.1,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 90%",
      },
    });


  }, []);

  return (
    <div className="bg-white relative">
      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-30 items-center">
          {/* Left Image */}
          <div
            ref={imageRef}
            className="relative group hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <Image
              src="/first.jpg"
              alt="Building"
              width={900}
              height={700}
              className="w-full h-auto rounded-md shadow-md"
            />

            {/* Hover Logo (Same style as upper code) */}
            <div className="absolute rounded bg-white top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Image src="/tlogo.png" alt="logo" width={30} height={30} />
            </div>
          </div>

          {/* Right Content */}
          <div ref={contentRef} className=" text-justify xl:px-16">
            <p className="text-green-600 font-semibold text-2xl">OUR PROMISE</p>
            <h2 className="text-3xl md:text-4xl font-light leading-snug">
              THE NATION BUILDER
            </h2>
            <p className="text-black my-5 text-base md:text-lg">
              We are a fast-growing construction organization, aiming to build unique and eco-friendly structures for India. Ranked among the fastest developing in the construction industry, we help shape the image of India globally by executing large industrial and infrastructure projects.
            </p>

            <Link href="/projectlist">
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-6 py-2 rounded transition">
              Read More...
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
