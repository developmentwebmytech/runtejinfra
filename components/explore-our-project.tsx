'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Loader2 } from 'lucide-react';


gsap.registerPlugin(ScrollTrigger);

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  projectCount: number;
  link: string;
}

function Fifth() {
  const containerRef = useRef(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/home/categories-with-projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // GSAP animation
  useEffect(() => {
    if (containerRef.current && categories.length > 0 && !loading) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, [categories, loading]);

  if (error) {
    return (
      <div className="container mx-auto my-16 px-2">
        <h2 className="text-3xl md:text-4xl font-semibold text-center leading-snug mb-10">
          EXPLORE OUR PROJECT
        </h2>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

if (loading) {
  return (
    <div className="container mx-auto my-16 px-2">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
        EXPLORE OUR PROJECT
      </h2>

      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-gray-500">Loading categories...</p>
      </div>
    </div>
  );
}



  return (
    <div className="container mx-auto my-16 px-2">
      <h2 className="text-3xl md:text-4xl font-semibold text-center leading-snug mb-10">
        EXPLORE OUR PROJECT
      </h2>

      {categories.length === 0 ? (
        <div className="text-center">No categories available</div>
      ) : (
        <div ref={containerRef}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id}>
                <Link href={category.link}>
                  <div className="relative group overflow-hidden rounded-lg shadow-lg w-full h-64 cursor-pointer">
                    <Image
                      src={category.icon || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      priority
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[#0000009b] bg-opacity-10 flex flex-col items-center justify-center text-white text-center p-4">
                      <h3 className="text-3xl font-semibold">{category.name}</h3>
                      <p className="text-md text-green font-semibold">
                        {category.projectCount} PROPERTIES
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default Fifth;
