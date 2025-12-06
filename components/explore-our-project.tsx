'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ✅ Import Link
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cardData = [
  {
    title: 'Commercial',
    subtitle: '100 PROPERTIES',
    image: '/category/commercial.jpg',
    link: '/projectdetail',
  },
  {
    title: 'Industrial',
    subtitle: '50 PROPERTIES',
    image: '/category/industrial.jpg',
    link: '/projectdetail',
  },
  {
    title: 'Residential',
    subtitle: '100 PROPERTIES',
    image: '/category/residential.jpg',
    link: '/projectdetail',
  },
];

function Fifth() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (

    <div className=" container mx-auto my-16 px-4">
      <h2 className="text-3xl md:text-4xl font-semibold text-center leading-snug mb-10">EXPLORE OUR PROJECT</h2>

      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cardData.map((card, index) => (
          <Link key={index} href={card.link}>
            <div className="relative group overflow-hidden rounded-lg shadow-lg w-full h-64 cursor-pointer">
              <Image
                src={card.image}
                alt={card.title}
                fill
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-[#0000009b] bg-opacity-10 flex flex-col items-center justify-center text-white text-center p-4">
                <h3 className="text-3xl font-semibold ">{card.title}</h3>
                <p className="text-md text-green font-semibold">{card.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default Fifth;
