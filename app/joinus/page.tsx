"use client";
import Image from "next/image";
import { useState } from "react";

export default function CareerPage() {
  // 1️⃣ Make a constant once
  const initialState = {
    post: "",
    name: "",
    email: "",
    location: "",
    phone: "",
    qualifications: "",
    company: "",
    designation: "",
    tenure: "",
    reason: "",
  };

  // 2️⃣ Use it to create state
  const [formData, setFormData] = useState(initialState);

  //   const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file && file.type === "application/pdf") {
  //       setResumeFile(file);
  //     } else {
  //       alert("Please upload a PDF file only.");
  //     }
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/careers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Form submitted!");
      setFormData(initialState); // reset form if you want
    } else {
      alert("Error sending form.");
    }
  };

  return (
    <div className="">
      <section className="relative w-full h-64 mb-12">
        <Image
          src="/contactus.jpg"
          alt="Construction Site"
          fill
          className="object-cover rounded-lg shadow"
        />

        <div className="absolute inset-0 bg-[#00000081] bg-opacity-40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            CARRIERS
          </h1>
        </div>
      </section>

      <div id="joinus" className="container mx-auto p-6">
        {/* Hero Image Section */}

        <h2 className="text-4xl font-semibold mb-8">Application for employment</h2>
        <h2 className="text-2xl font-regular mb-6">Interested candidate, fill in this form & submit</h2>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-2">Post Applied for</h2>
          <input
            type="text"
            name="post"
            placeholder="Post applied for"
            className="w-full border p-2 mb-4"
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold mb-1">Name</h2>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                className="w-full border p-2"
                onChange={handleChange}
              />
            </div>
            <div>
              <h2 className="font-semibold mb-1">Email Address</h2>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full border p-2"
                onChange={handleChange}
              />
            </div>
            <div>
              <h2 className="font-semibold mb-1">
                Location <span className="text-red-500">*</span>
              </h2>
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="w-full border p-2"
                onChange={handleChange}
              />
            </div>
            <div>
              <h2 className="font-semibold mb-1">
                Phone number <span className="text-red-500">*</span>
              </h2>
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                className="w-full border p-2"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <h2 className="font-semibold mb-1">Qualifications</h2>
            <input
              type="text"
              name="qualifications"
              placeholder="Qualifications"
              className="w-full border p-2"
              onChange={handleChange}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Experience</h2>
            <h3 className="text-blue-600 font-semibold mb-4">
              Presently working with
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                name="company"
                placeholder="Company"
                className="border p-2"
                onChange={handleChange}
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                className="border p-2"
                onChange={handleChange}
              />
              <input
                type="text"
                name="tenure"
                placeholder="Tenure"
                className="border p-2"
                onChange={handleChange}
              />
              <input
                type="text"
                name="reason"
                placeholder="Reason for Leaving"
                className="border p-2"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* <div className="mt-8">
          <h2 className="font-semibold mb-1">Upload Resume (PDF only)</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeChange}
            className="w-full border p-2"
          />
        </div> */}

          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>

    </div>
  );
}
