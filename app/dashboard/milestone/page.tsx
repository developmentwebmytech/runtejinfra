"use client";

import { useEffect, useState } from "react";

export default function AdminMilestonePage() {
  const [form, setForm] = useState({
    projectsCompleted: "",
    buildingsConstructed: "",
    workersEmployed: "",
    yearsOfExperience: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestone = async () => {
      const res = await fetch("/api/milestone");
      const data = await res.json();
      if (res.ok) {
        setForm({
          projectsCompleted: data.projectsCompleted?.toString() || "",
          buildingsConstructed: data.buildingsConstructed?.toString() || "",
          workersEmployed: data.workersEmployed?.toString() || "",
          yearsOfExperience: data.yearsOfExperience?.toString() || "",
        });
      }
      setLoading(false);
    };
    fetchMilestone();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/milestone", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Milestone updated successfully!");
    } else {
      alert("Failed to update milestone.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mx-auto mt-12 p-8 shadow rounded bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Milestone</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Projects Completed", name: "projectsCompleted" },
          { label: "Buildings Constructed", name: "buildingsConstructed" },
          { label: "Workers Employed", name: "workersEmployed" },
          { label: "Years of Experience", name: "yearsOfExperience" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-semibold">{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Save Milestone
        </button>
      </form>
    </div>
  );
}
