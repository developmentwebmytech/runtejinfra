"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const partners = [
    { name: "Partner A", logo: "/ourworks/1.png" },
    { name: "Partner B", logo: "/ourworks/2.png" },
    { name: "Partner C", logo: "/ourworks/3.jpg" },
    { name: "Partner D", logo: "/ourworks/4.jpg" },
    { name: "Partner E", logo: "/ourworks/5.png" },
    { name: "Partner F", logo: "/ourworks/6.png" },
    { name: "Partner G", logo: "/ourworks/7.jpg" },
];

export default function OurWorkPartner() {
    return (
        <div className="container mx-auto ">
            <div className=" bg-white py-12">
                <h2 className="text-3xl md:text-4xl font-semibold text-center leading-snug mb-10">
                    MAJOR PROJECT PARTNER
                </h2>

                <Marquee speed={50} pauseOnHover gradient={false}>
                    <div className="flex gap-26 px-4">
                        {partners.map((partner, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <div className="relative w-32 h-25">
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-700 font-medium">
                                    {partner.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </Marquee>
            </div>
        </div>
    );
}
