"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

type Project = {
  _id: string;
  name: string;
  imageUrl: string;
};

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/projectdetails");
        console.log("All ProjectsList:", res.data);

        setProjects(res.data); // ✅ set all projects
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <div className="w-full mt-20 bg-[#bceb9757] py-8 px-4 sm:px-6 md:px-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold">
            Our services – Industrial Construction & Development
          </h2>
          <p className="text-sm text-gray-500 mb-1 py-2">Home / Industrial</p>
          <p className="text-sm text-gray-600 mt-1 mb-2">
            Discover industrial construction services for factories, warehouses, and more.
          </p>
        </div>
      </div>

      <main className="container mx-auto mt-12 min-h-screen px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/projectdetails/${project._id}`}
                className="bg-white rounded shadow overflow-hidden block"
              >
                <div className="relative w-full h-64 sm:h-56">
                  {project?.imageUrl && (
                    <Image
                      src={project.imageUrl}
                      alt={project.name || "Project image"} // fallback alt text
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}

                  <span className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded bg-green-600">
                    FOR SALE
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default ProjectList;
