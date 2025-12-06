"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Fourth() {
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    useEffect(() => {
        gsap.from(leftRef.current, {
            opacity: 0,
            x: -100,
            duration: 1,
            scrollTrigger: {
                trigger: leftRef.current,
                start: "top 80%",
            },
        });

        gsap.from(rightRef.current, {
            opacity: 0,
            x: 100,
            duration: 1,
            scrollTrigger: {
                trigger: rightRef.current,
                start: "top 80%",
            },
        });
    }, []);

    return (
        <div className="bg-white py-8">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 min-h-screen text-black">

                    {/* Left Text Section */}
                    <div ref={leftRef} className="text-center lg:text-left">
                        <h5 className="uppercase text-green-600 font-semibold text-xl mb-2">
                            Our Purpose
                        </h5>
                        <h1 className="text-3xl md:text-4xl font-light leading-snug mb-4">
                            Build Better. Live Brighter.
                        </h1>
                        <p className="text-base md:text-lg leading-relaxed text-gray-700">
                            Runtej Infra is driven by a vision to redefine urban, Rural, Industrial and Commercial living. —<br />
                            Delivering excellence through innovation, and Modern Ideas.<br /> creating spaces that leave a lasting, positive impact on people and the planet. 
                            that leave a lasting, positive impact on people and the planet.
                        </p>
                    </div>

                    {/* Right Image Section */}
                    <div ref={rightRef} className="flex justify-center lg:justify-end -mx-4 lg:pr-0">
                        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                            {/* Main Image */}
                            <div
                                className="w-full h-[70vh] sm:h-[75vh] bg-cover bg-center rounded-2xl shadow-xl"
                                style={{
                                    backgroundImage: 'url("/fourth1.jpg")',
                                    zIndex: 8,
                                }}
                            />
                            {/* Overlapping Floating Image */}
                            <div
                                className="absolute hidden sm:block bg-cover  bg-center rounded-2xl shadow-2xl border-4 border-white"
                                style={{
                                    backgroundImage: 'url("/fourth2.jpg")',
                                    width: '60%',
                                    height: '70%',
                                    bottom: '5%',
                                    left: '-35%',
                                    zIndex: 10,
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>


    );
}

export default Fourth;
