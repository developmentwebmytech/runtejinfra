'use client';
import React from 'react';

function Testimonial() {
  const testimonials = [
    {
      name: 'Chetan Rana',
      feedback:
        'Runtej Infra provided an exceptional service experience from start to finish. The team was attentive, quick to respond, and ensured everything was done to the highest standards. I truly appreciated their dedication and attention to detail.',
    },
    {
      name: 'Lovely Chadda',
      feedback:
        'The professionalism shown by the Runtej Infra team was outstanding. They not only delivered the project on time but also made the entire process smooth and stress-free. I could rely on them at every stage of the work.',
    },
    {
      name: 'Deepak Singh',
      feedback:
        'I am extremely happy with the final outcome. The design, the execution, and the quality of work exceeded my expectations. I would definitely recommend Runtej Infra to anyone looking for top-quality construction and planning services.',
    },
  ];


  return (
    <div className="container mx-auto  px-4 my-16 ">
      <h2 className="text-4xl font-semibold text-center mb-8">TESTIMONIALS - CLIENT REVIEWS</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 shadow-2xl rounded-lg p-8 text-center"
          >
            <p className="text-gray-700 italic mb-4">&quot;{item.feedback}&quot;</p>
            <h4 className="text-lg font-semibold text-green-600">
              — {item.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonial;
