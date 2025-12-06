// "use client";
// import React from "react";
// import Image from "next/image";
// import Link from "next/link";

// function ResidentialPage() {
//   const properties = [
//     { type: "Row Houses", img: "/residential/row-houses.jpg", count: 10 },
//     { type: "Apartments", img: "/residential/apartment-complexes.jpg", count: 20 },
//     { type: "Duplex", img: "/residential/pent-houses.jpg", count: 5 },
//     { type: "Bungalows", img: "/residential/bungalow.jpg", count: 6 },
//     { type: "Farmhouses", img: "/residential/farm-houses.jpg", count: 7 },
//     { type: "Societies", img: "/residential/eco-friendly.jpg", count: 9 },
//     { type: "Colonial Development", img: "/residential/colony.jpg", count: 2 },
//   ];


//   return (
//     <div>
//       {/* Full-width Header */}
//       <div className="w-full mt-20 bg-[#bceb9757] py-8 px-4 sm:px-6 md:px-10">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-2xl sm:text-3xl font-semibold">Residential</h2>
//           <p className="text-sm text-gray-500 py-2">Home / Residential</p>
//           <p className="text-sm text-gray-600 mt-1">
//             Explore a variety of residential properties including apartments,
//             villas, and single-family homes. Whether you’re looking to buy or
//             rent, find the ideal space to suit your lifestyle and budget.
//           </p>
//         </div>
//       </div>

//       {/* Property Grid Section */}
//       <div className="container mx-auto px-4 py-10">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px] justify-items-center">
//           {properties.map((property, index) => {
//             const positionInBlock = index % 6;
//             let colSpan = "md:col-span-1";

//             if (positionInBlock === 0 || positionInBlock === 5) {
//               colSpan = "md:col-span-2";
//             }

//             const linkHref = `/residential/${property.type.toLowerCase().replace(/\s+/g, "-")}`;

//             return (
//               <Link key={index} href="/projectcategory" className={`block w-full ${colSpan}`}>
//                 <div className="relative h-[300px] rounded-md overflow-hidden shadow-md">
//                   <Image
//                     src={property.img}
//                     alt={property.type}
//                     fill
//                     className="object-cover rounded-md"
//                   />
//                   <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-end p-5 text-white">
//                     <h3 className="text-lg sm:text-xl font-semibold">{property.type}</h3>
//                     <p className="text-xs sm:text-sm">{property.count} Properties</p>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </div>

//   );
// }

// export default ResidentialPage;


"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"

interface Property {
  _id: string
  type: string
  img: string
  count: number
}

function ResidentialPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/api/categories/") // Adjust API path if needed
        setProperties(res.data || [])
      } catch (error) {
        console.error("Failed to fetch properties", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div>
      {/* Header Section */}
      <div className="w-full mt-20 bg-[#bceb9757] py-8 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold">Residential</h2>
          <p className="text-sm text-gray-500 py-2">Home / Residential</p>
          <p className="text-sm text-gray-600 mt-1">
            Explore a variety of residential properties including apartments,
            villas, and single-family homes. Whether you’re looking to buy or
            rent, find the ideal space to suit your lifestyle and budget.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px] justify-items-center">
            {properties.map((property, index) => {
              const positionInBlock = index % 6
              const colSpan = (positionInBlock === 0 || positionInBlock === 5)
                ? "md:col-span-2"
                : "md:col-span-1"

              const linkHref = `/residential/${property.type.toLowerCase().replace(/\s+/g, "-")}`

              return (
                <Link key={property._id} href={linkHref} className={`block w-full ${colSpan}`}>
                  <div className="relative h-[300px] rounded-md overflow-hidden shadow-md">
                    <Image
                      src={property.img}
                      alt={property.type}
                      fill
                      className="object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-5 text-white">
                      <h3 className="text-lg sm:text-xl font-semibold">{property.type}</h3>
                      <p className="text-xs sm:text-sm">{property.count} Properties</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResidentialPage

