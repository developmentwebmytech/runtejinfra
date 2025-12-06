import React from 'react';
import Image from 'next/image';

export default function OurStory() {
    return (
        <>

            {/* Hero Image Section */}
            <section className="relative w-full h-64 mb-12">
                <Image
                    src="/ourstory.jpg"
                    alt="Construction Site"
                    fill
                    className="object-cover rounded-lg shadow"
                />

                <div className="absolute inset-0 bg-[#00000081] bg-opacity-40 flex items-center justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        OUR STORY
                    </h1>
                </div>
            </section>
            
            <div className="bg-white py-10 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">

                    {/* <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Story</h1> */}

                    <section className="mb-8">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            <strong>Runtej Infra</strong> is a company based in <strong>Indore, Madhya Pradesh</strong>. We work in
                            <strong> architectural design, construction, and real estate</strong>. Our team builds homes,
                            offices, and many more things.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Services</h2>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-base">
                            <li>Architectural Design</li>
                            <li>Construction</li>
                            <li>3D Design</li>
                            <li>Real Estate Development</li>
                            <li>Landscape Design</li>
                            <li>Industrial Design</li>
                            <li>Technical Support</li>
                            <li>Project Management</li>
                            <li>Engineering Design</li>
                            <li>Property Management</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Focus</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We focus on <strong>residential and commercial projects</strong>. This includes buildings,
                            homes, offices, and industrial sheds.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Team</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Our company is led by <strong>Mr. Gagandeep Singh Tuteja</strong>, our Managing Director.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Experience</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We have been building dream projects <strong>since April 2015</strong>, turning ideas into
                            real buildings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Social Media</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            You can find our work on{" "}
                            <a
                                href="https://www.instagram.com/runtejinfra"
                                target="_blank"
                                className="text-blue-600 underline"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </a>{" "}
                            and Facebook. We post our projects and updates there.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Partnerships</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We worked on the <strong>Kaamgar project</strong> under the{" "}
                            <strong>American India Foundation (AIF)</strong> Fellowship program.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}
