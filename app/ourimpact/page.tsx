import React from "react";
import Image from "next/image";

export default function OurImpactPage() {
    return (
        <>
            {/* Hero Image Section */}
            <section className="relative w-full h-64 mb-12">
                <Image
                    src="/ourimpact.jpg"
                    alt="Construction Site"
                    fill
                    className="object-cover rounded-lg shadow"
                />

                <div className="absolute inset-0 bg-[#00000081] bg-opacity-40 flex items-center justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        OUR IMPACT
                    </h1>
                </div>
            </section>
            
            <div className="bg-white px-4 sm:px-6 lg:px-8 py-12">
                <div className="container mx-auto text-gray-800 font-sans">
                    <h1 className="text-4xl font-bold mb-6 text-center text-green-700">Our Impact</h1>

                    {/* Region */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-3">📍 Regional Reach</h2>
                        <p className="text-lg leading-relaxed">
                            Runtej Infra is proud to serve the people of <strong>Indore, Madhya Pradesh</strong>.
                            Over the years, we have built a strong presence in the region by delivering trusted and
                            high-quality construction projects.
                        </p>
                    </section>

                    {/* Quality Construction */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-3">🏗️ Quality That Lasts</h2>
                        <p className="text-lg leading-relaxed">
                            Our focus has always been on <strong>residential construction</strong>. From compact
                            homes to luxury bungalows, our buildings are crafted with attention to detail,
                            high-grade materials, and long-term durability.
                        </p>
                    </section>

                    {/* Services */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-3">🛠️ Full-Service Construction</h2>
                        <p className="text-lg leading-relaxed">
                            We offer a full range of services – <strong>architectural design, structural
                                engineering</strong>, general construction, tiles work, and industrial finishing. Our
                            team manages projects from concept to completion.
                        </p>
                    </section>

                    {/* Design Approach */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-3">🌆 Modern Design Approach</h2>
                        <p className="text-lg leading-relaxed">
                            With every project, we aim to bring modern style and functionality together. From smart
                            space planning to sleek elevations, we follow the latest trends and technologies in
                            design and construction.
                        </p>
                    </section>

                    {/* Real Projects */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-3">🏡 Real Projects, Real Results</h2>
                        <p className="text-lg leading-relaxed">
                            Some of our notable work includes a <strong>modern bungalow</strong>, large{" "}
                            <strong>banquet halls</strong>, and efficient <strong>factory structures</strong>. Each
                            project reflects our dedication to excellence.
                        </p>
                    </section>

                    {/* Social Media */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-3">📸 Social Media Presence</h2>
                        <p className="text-lg leading-relaxed">
                            We showcase our latest projects on{" "}
                            <a
                                href="https://www.instagram.com/runtejinfra"
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </a>
                            , where clients can explore our journey, designs, and construction progress.
                        </p>
                    </section>

                    {/* Team Impact */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-3">👷 Team Excellence</h2>
                        <p className="text-lg leading-relaxed">
                            From elevation and tile work to complete project handover, our skilled team makes every
                            detail count. Their hard work and dedication are the reason for our growing impact in
                            Indore’s construction space.
                        </p>
                    </section>

                    {/* Summary */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-3">💡 Our Mission</h2>
                        <p className="text-lg leading-relaxed">
                            Runtej Infra’s impact is built on trust, quality, and design innovation. We are here to
                            shape spaces that inspire living and create lasting value for our clients and community.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}
