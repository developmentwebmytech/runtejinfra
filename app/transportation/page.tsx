"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

function TransportationPage() {
 const properties = [
  { type: "Footpaths", img: "/transport/footpath.jpg", count: 12 },
  { type: "Dividers", img: "/transport/dividers.jpg", count: 8 },
  { type: "Pathways", img: "/transport/pathways.jpg", count: 6 },
  { type: "Road Lighting and Pole Works", img: "/transport/lighting-poles.jpg", count: 10 },
  { type: "Major Connecting Roads", img: "/transport/connecting-roads.jpg", count: 7 },
  { type: "Ring Roads", img: "/transport/ring-road.jpg", count: 4 },
  { type: "State Highways", img: "/transport/state-highway.jpg", count: 5 },
  { type: "National Highways", img: "/transport/national-highway.jpg", count: 3 },
  { type: "Metro’s", img: "/transport/metro.jpg", count: 2 },
]


  return (
    <div>
      {/* Full-width Header */}
      <div className="w-full mt-20 bg-[#bceb9757] py-8 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold">Transportation</h2>
          <p className="text-sm text-gray-500 py-2">Home / Transportation</p>
          <p className="text-sm text-gray-600 mt-1">
            Explore a variety of transportation properties including apartments,
            villas, and single-family homes. Whether you’re looking to buy or
            rent, find the ideal space to suit your lifestyle and budget.
          </p>
        </div>
      </div>

      {/* Property Grid Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px] justify-items-center">
          {properties.map((property, index) => {
            const positionInBlock = index % 6;
            let colSpan = "md:col-span-1";

            if (positionInBlock === 0 || positionInBlock === 5) {
              colSpan = "md:col-span-2";
            }

            // const linkHref = `/transportation/${property.type.toLowerCase().replace(/\s+/g, "-")}`;

            return (
              <Link key={index} href="/projectcategory" className={`block w-full ${colSpan}`}>
                <div className="relative h-[300px] rounded-md overflow-hidden shadow-md">
                  <Image
                    src={property.img}
                    alt={property.type}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-end p-5 text-white">
                    <h3 className="text-lg sm:text-xl font-semibold">{property.type}</h3>
                    <p className="text-xs sm:text-sm">{property.count} Properties</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>

  );
}

export default TransportationPage;
