"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";


interface Category {
  _id: string
  name: string
  parentCategory: string | null
}


function FormPage() {
  const [form, setForm] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    pinCode: "",
    budget: "",
  });
  const [projectCategories, setProjectCategories] = useState([]);

  // change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            // console.log(data)
    
            // 👇 Filter categories with parentCategory === null
            const parentCategories = (data.allcategories || []).filter(
              (cat: Category) => cat.parentCategory === null
            );
            // console.log("Parent Categories:", parentCategories);
            setProjectCategories(parentCategories);
          } catch (err) {
            console.error("Failed to load categories", err);
          }
        };
        fetchCategories();
      }, []);

  // submit
 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  // validation
  for (const key in form) {
    if (!form[key as keyof typeof form]) {
      toast.error("Please fill all fields ❌");
      return;
    }
  }

  try {
    const res = await fetch("/api/quotation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) throw new Error("Failed to submit");
    toast.success("Submitted successfully 🎉");

    setForm({
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      projectType: "",
      pinCode: "",
      budget: "",
    });
  } catch (err) {
    toast.error("Submission failed. Try again ❌");
  }
}


  return (
    <div className="flex items-center justify-center bg-gray-100 px-4">
      <div className="container px-4 my-12">
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Get a Quotation
          </h2>

          {/* add onSubmit */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div>
              <h3 className="font-semibold mb-2">Your Personal Information.</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="border rounded-md px-4 py-2 w-full"
                >
                  <option value="">Select</option>
                  <option>Mr</option>
                  <option>Ms</option>
                   <option>Other</option>
                </select>

                <input
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  className="border rounded-md px-4 py-2 w-full"
                  value={form.firstName}
                  onChange={handleChange}
                />

                <input
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  className="border rounded-md px-4 py-2 w-full"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="border rounded-md px-4 py-2 w-full"
                  value={form.email}
                  onChange={handleChange}
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  className="border rounded-md px-4 py-2 w-full"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  minLength={10}
                />
              </div>
            </div>

            {/* Project Info */}
            <div>
              <h3 className="font-semibold mb-2">Your Project Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                  className="border rounded-md px-4 py-2 w-full"
                >
                  <option value="">Project Type</option>
                  {projectCategories.map((cat: Category) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option> 
                  ))}
                </select>

                <input
                  name="pinCode"
                  type="text"
                  placeholder="Pin Code"
                  className="border rounded-md px-4 py-2 w-full"
                  value={form.pinCode}
                  onChange={handleChange}
                  maxLength={6}
                  
                />

                <input
                  name="budget"
                  type="text"
                  placeholder="Your Budget"
                  className="border rounded-md px-4 py-2 w-full"
                  value={form.budget}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 rounded-md mt-6 hover:bg-green-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormPage;
