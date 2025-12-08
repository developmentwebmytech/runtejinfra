"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Marquee from "react-fast-marquee"
import { Spinner } from "@/components/ui/spinner"

interface Partner {
  _id: string
  name: string
  titleName: string
  image: string
  slug: string
}

export default function OurWorkPartner() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/our-work-partner")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setPartners(data)
      } catch (error) {
        console.error("[v0] Failed to fetch partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white py-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-center leading-snug mb-10">MAJOR PROJECT PARTNER</h2>

        {partners.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No partners available</p>
        ) : (
          <Marquee speed={50} pauseOnHover gradient={false}>
            <div className="flex gap-26 px-4">
              {partners.map((partner) => (
                <div key={partner._id} className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-25">
                    <Image
                      src={partner.image || "/placeholder.svg"}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-700 font-medium">{partner.name}</p>
                  <p className="text-xs text-gray-500">{partner.titleName}</p>
                </div>
              ))}
            </div>
          </Marquee>
        )}
      </div>
    </div>
  )
}
