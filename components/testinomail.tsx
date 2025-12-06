'use client';

import React, { useEffect, useState } from 'react';

interface Testimonial {
  _id: string;      // from DB
  name: string;
  quote?: string;   // we called it “quote” in admin
  feedback?: string; // or “feedback” if that’s the field you stored
}

export default function Testimonial() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);



/* fetch once on mount */
useEffect(() => {
  (async () => {
    try {
      const res  = await fetch("/api/testimonials");
      const data = await res.json();
      setList(data.slice(0, 6));   // show only 6
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setLoading(false);
    }
  })();
}, []);


  /* show spinner / empty state */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading testimonials…
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">No testimonials yet.</p>
      </div>
    );
  }

  /* render grid */
  return (
    <div className="container mx-auto px-4 my-16">
      <h2 className="text-4xl font-semibold text-center mb-8">
        TESTIMONIALS ‑ CLIENT REVIEWS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((t) => (
          <div
            key={t._id}
            className="bg-white border border-gray-200 shadow-2xl rounded-lg p-8 text-center"
          >
            <p className="text-gray-700 italic mb-4">
              “{t.quote ?? t.feedback}”
            </p>
            <h4 className="text-lg font-semibold text-green-600">
              — {t.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
