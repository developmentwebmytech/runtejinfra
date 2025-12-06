'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function MemberTeam() {
    const members = [
        { name: 'Abhishek Rao', image: '/memberteam/1.jpg' },
        { name: 'Pawan Chadda', image: '/memberteam/2.jpg' },
        { name: 'Amit Singh', image: '/memberteam/3.jpg' },
        { name: 'Rana Tomar', image: '/memberteam/4.jpg' },
    ];

    const cardsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        cardsRef.current.forEach((card, index) => {
            gsap.from(card, {
                x: -100,
                opacity: 0,
                duration: 1,
                delay: index * 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });
        });
    }, []);

    return (
        <div className='bg-gray-100'>
            <div className="container mx-auto py-12 px-4 ">
                <h2 className="text-4xl py-6 mb-4 text-center font-semibold">TEAM MEMBERS</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 ">

                    {members.map((member, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                cardsRef.current[index] = el!;
                            }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative w-full h-90">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            {/* Name */}
                            <div className="p-4 text-center">
                                <p className="text-xl font-semibold">{member.name}</p>
                            </div>
                        </div>
                    ))}


                </div>
            </div>
        </div>
    );
}

export default MemberTeam;
