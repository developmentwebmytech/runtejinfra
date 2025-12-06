'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

function SecondSection() {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(cardsRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "bounce.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }
  }, []);

  return (

    <div ref={containerRef} id='iconic' className="bg-gray-100" >
      <div className="container mx-auto px-4 py-12">
        <p className="text-green-600 uppercase tracking-widest font-semibold text-xl text-center mb-2">
          Our Pride
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-10">
          ICONIC PROJECTS
        </h2>


        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-14">
          {[
            { src: '/second1.jpg', title: 'Runtej Infra Altamount | Altamount', href: '/projects/altamount' },
            { src: '/second2.jpg', title: 'Runtej Infra World Towers | Worli', href: '/projects/world-towers' },
            { src: '/second3.jpg', title: 'Trump Tower | Worli', href: '/projects/trump-tower' },
            { src: '/second4.jpg', title: 'Runtej Infra Bellagio | Powai', href: '/projects/bellagio' },
          ].map((item, index) => (
            <Link
              href={item.href}
              key={index}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="w-full"
              >
                <div className="relative w-full pb-[133.33%] rounded-md overflow-hidden shadow-md ">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* 👇 This is the hover logo */}
                  <div className="absolute rounded bg-white bg-rounded top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Image src="/tlogo.png" alt="logo" width={30} height={30} />
                  </div>
                </div>

                <p className="mt-2 text-center text-sm md:text-base px-2 group-hover:text-green-600 transition-colors">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-6 py-2 border bg-green-600 text-white rounded hover:bg-green-700 transition">
            View All Projects
          </button>
        </div>
      </div>

    </div>

  );
}

export default SecondSection;
