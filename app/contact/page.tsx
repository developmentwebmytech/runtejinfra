"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { toast } from "sonner";

export default function ContactPage() {
  const sectionRef = useRef<HTMLMainElement>(null);
  const formRef   = useRef<HTMLFormElement>(null);   // 👈 new ref
  const [loading, setLoading] = useState(false);

  // simple fade‑in
  useEffect(() => {
    gsap.from(sectionRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      formRef.current?.reset();        // ✅ safe: “?.”
      toast.success("Thank you! We'll reply soon.");
    } else {
      toast.error("Error – please try again.");
    }
  };

  return (
    <main ref={sectionRef} className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative w-full h-64 mb-12">
        <Image
          src="/contactus.jpg"
          alt="Construction site"
          fill
          className="object-cover rounded-lg shadow"
        />
        <div className="absolute inset-0 bg-[#00000081] flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">CONTACT US</h1>
        </div>
      </section>

      {/* Form */}
      <section
        id="queries"
        className="container max-w-5xl mx-auto bg-white shadow-lg p-10 rounded-2xl"
      >
        <h2 className="text-center text-green-600 font-semibold uppercase mb-2">
          Contact Us
        </h2>
        <h3 className="text-center text-3xl md:text-4xl font-semibold mb-4">
          Request a quote
        </h3>
        <p className="text-center text-gray-500 mb-10">
          Tell us what you need and our team will get back to you.
        </p>

        <form
          ref={formRef}                 // 👈 attach the ref
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* ★ inputs unchanged ★ */}
          <input
            name="firstName"
            type="text"
            placeholder="First Name*"
            className="border-b p-3 text-sm"
            required
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name*"
            className="border-b p-3 text-sm"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Work Email (optional)"
            className="border-b p-3 text-sm md:col-span-2"
          />
          <select
            name="topic"
            className="border-b p-3 text-sm md:col-span-2"
            required
          >
            <option value="">What are you looking for?</option>
            <option value="Sales">Sales</option>
            <option value="Support">Support</option>
            <option value="Partnerships">Partnerships</option>
          </select>
          <textarea
            name="message"
            placeholder="Tell us more (optional)"
            className="border-b p-3 text-sm md:col-span-2"
            rows={4}
          />
          <label className="flex items-start text-xs md:col-span-2">
            <input type="checkbox" className="mt-1 mr-2" required />
            I agree to the&nbsp;
            <a href="#" className="text-rose-600 underline">
              Privacy Policy
            </a>{" "}
            and&nbsp;
            <a href="#" className="text-rose-600 underline">
              Terms & Conditions
            </a>
            .
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-3xl md:col-span-2"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </section>

      {/* Call section */}
      <section className="bg-gray-900 text-white py-10 mt-16 text-center rounded-xl mx-10">
        <h4 className="text-2xl font-bold mb-2">Request a call</h4>
        <p className="mb-4">Want a quick chat? Book a 1‑to‑1 call with us.</p>
        <a
          href="tel:+917986546464"
          className="text-yellow-400 underline font-semibold hover:text-yellow-500"
        >
          +91 79865 46464
        </a>
      </section>

      {/* Map */}
      <section id="location" className="mt-15">
        <div className="w-full h-[450px]">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.3001914397287!2d75.84031607530477!3d22.7170810793891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd6e7667a167%3A0xf1375bca2fdf22e6!2sRuntej%20infra!5e0!3m2!1sen!2sin!4v1751865411465!5m2!1sen!2sin"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
