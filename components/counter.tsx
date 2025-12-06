'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaProjectDiagram, FaBuilding, FaUsers, FaRegClock } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

export default function Counter() {
  const counterRef = useRef<HTMLDivElement[]>([]);
  const [milestoneData, setMilestoneData] = useState<null | {
    projectsCompleted: number;
    buildingsConstructed: number;
    workersEmployed: number;
    yearsOfExperience: number;
  }>(null);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const res = await fetch('/api/milestone');
        const json = await res.json();
        if (res.ok && json) {
          setMilestoneData({
            projectsCompleted: json.projectsCompleted || 0,
            buildingsConstructed: json.buildingsConstructed || 0,
            workersEmployed: json.workersEmployed || 0,
            yearsOfExperience: json.yearsOfExperience || 0,
          });
        } else {
          console.error("Milestone fetch error:", json.error);
        }
      } catch (error) {
        console.error("Milestone fetch failed:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!milestoneData) return;

    counterRef.current.forEach((el) => {
      if (!el) return;
      const target = Number(el.dataset.target);
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          snap: { innerText: 1 },
          onUpdate: function () {
            el.innerText = Math.ceil(Number(el.innerText)).toString();
          },
        }
      );
    });
  }, [milestoneData]);

  if (!milestoneData) {
    return <div className="text-center py-20">Loading counters...</div>;
  }

  const counters = [
    {
      title: 'Projects Completed',
      number: milestoneData.projectsCompleted,
      bg: 'bg-yellow-100',
      icon: <FaProjectDiagram size={40} className="text-yellow-600" />,
    },
    {
      title: 'Buildings Constructed',
      number: milestoneData.buildingsConstructed,
      bg: 'bg-blue-100',
      icon: <FaBuilding size={40} className="text-blue-600" />,
    },
    {
      title: 'Workers Employed',
      number: milestoneData.workersEmployed,
      bg: 'bg-green-100',
      icon: <FaUsers size={40} className="text-green-600" />,
    },
    {
      title: 'Years of Experience',
      number: milestoneData.yearsOfExperience,
      bg: 'bg-red-100',
      icon: <FaRegClock size={40} className="text-red-600" />,
    },
  ];

  return (
    <section className="bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl mb-4 text-center font-semibold">WE HAVE REACHED HERE</h2>
        <p className="text-center text-gray-600 text-base md:text-lg mb-6">
          With years of dedication and trust, we have achieved great milestones. Here’s a quick look at what we have built together.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {counters.map((counter, idx) => (
            <div key={idx} className={`shadow-md rounded-2xl p-6 ${counter.bg}`}>
              <div className="flex justify-center mb-3">{counter.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">{counter.title}</h3>
              <div
                ref={(el) => {
                  if (el) counterRef.current[idx] = el;
                }}
                data-target={counter.number}
                className="text-4xl font-bold text-gray-900"
              >
                0
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
