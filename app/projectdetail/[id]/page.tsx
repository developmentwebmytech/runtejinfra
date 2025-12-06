'use client'

import React, { useEffect, useState } from "react"
import { useParams, notFound, useRouter } from "next/navigation"
import Image from "next/image"
import { FaMapMarkerAlt } from "react-icons/fa"

interface PlanImage {
  url: string
  altText?: string
}

interface PropertyType {
  name: string
}

interface Project {
  name: string
  address: string
  imageUrl: string
  planImage?: PlanImage[]
  description: string
  propertyType?: PropertyType
  sampleUnit: string
  floor: string
  basement: string
  totalBuiltUpArea: string
  yearOfCompletion: string
  locationLink: string
}

export default function ProjectPage() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/admin/projectdetails/${id}`, { cache: 'no-store' })
        if (!res.ok) return setProject(null)
        const data = await res.json()
        setProject(data)
      } catch (error) {
        console.error("❌ Error loading project:", error)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProject()
  }, [id])

  if (loading) return <p className="p-10 text-center">Loading...</p>
  if (!project) return <p className="p-10 text-center">Project Not Found</p>

  return (
    <div>
      <div
        className="relative h-[80vh] bg-cover bg-center px-4 md:px-16"
        style={{ backgroundImage: `url(${project.imageUrl})` }}
      >
        <div className="absolute top-5 left-5 bg-black text-white text-xs px-3 py-1 rounded">
          PROJECT SHOWCASE
        </div>

        <div className="absolute top-20 left-4 md:left-16 text-white text-sm flex gap-2 items-center">
          <span>Home</span> / <span>Projects</span> /{" "}
          <span className="font-semibold">{project.name}</span>
        </div>

        <div className="absolute bottom-10 left-4 md:left-16 text-white max-w-[90%]">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="flex items-center gap-2 mt-2 text-sm md:text-base">
            <FaMapMarkerAlt />
            {project.address}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-16 mt-10 mb-20">
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold">{project.propertyType?.name || "N/A"}</p>
                <p className="text-sm text-gray-500">Project Type</p>
              </div>
              <div>
                <p className="font-semibold">{project.sampleUnit}</p>
                <p className="text-sm text-gray-500">Sample Unit</p>
              </div>
              <div>
                <p className="font-semibold">{project.floor}</p>
                <p className="text-sm text-gray-500">Floors</p>
              </div>
              <div>
                <p className="font-semibold">{project.basement}</p>
                <p className="text-sm text-gray-500">Basements</p>
              </div>
              <div>
                <p className="font-semibold">{project.totalBuiltUpArea}</p>
                <p className="text-sm text-gray-500">Total Built-up Area</p>
              </div>
              <div>
                <p className="font-semibold">{project.yearOfCompletion}</p>
                <p className="text-sm text-gray-500">Year Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Project Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{project.description}</p>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white p-4 rounded shadow h-full flex flex-col justify-center">
            <div className="relative w-full aspect-square">
              <Image
                src={project.planImage?.[0]?.url || "/projectdetails/aboutdescription.jpg"}
                alt={project.planImage?.[0]?.altText || "Project Showcase"}
                fill
                className="rounded object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <TabsSection project={project} />
    </div>
  )
}

function TabsSection({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = React.useState("about")
  const tabs = ["about", "features", "location", "plans"]
  const tabClass = (tab: string) =>
    `capitalize pb-2 transition-all ${
      activeTab === tab ? "text-black-700 border-b-2 border-green-700" : "text-gray-500"
    }`

  return (
    <>
      <div className="flex gap-8 justify-center text-md font-medium px-4 md:px-16 py-4 sticky top-0 bg-white z-10">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`${tabClass(tab)} text-center`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4 md:px-16 mt-10 mb-20">
        {activeTab === "about" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>
        )}

        {activeTab === "location" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <iframe
              src={project.locationLink}
              className="w-full h-[500px] rounded"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {activeTab === "plans" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-8">Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {project.planImage?.map((img, idx) => (
                <div key={idx} className="relative w-full h-64">
                  <Image
                    src={img.url}
                    alt={img.altText || `Plan ${idx + 1}`}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
