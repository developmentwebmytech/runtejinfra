"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function TermsAndConditionsPage() {
    const contentRef = useRef(null);

    useEffect(() => {
        const sections = contentRef.current.querySelectorAll('section');
        gsap.fromTo(
            sections,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
            }
        );
    }, []);

    return (
        <div
            ref={contentRef}
            className="container mx-auto bg-white p-10 rounded-2xl shadow-xl mt-12 text-gray-800"
        >
            <h1 className="text-4xl font-extrabold text-center text-green-600 mb-8">
                Terms and Conditions
            </h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">1. About Us</h2>
                <p className="text-base leading-relaxed">
                    Welcome to <strong>www.runtejinfra.com</strong>, operated by Runtej Infra and its group companies
                    (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) are used for the company. We specialize in real estate development, offering a range of services
                    including property sales, leasing, and project management. Our mission is to deliver
                    high-quality infrastructure solutions that meet the evolving needs of our clients.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">2. Acceptance of Terms</h2>
                <p className="text-base leading-relaxed">
                    By accessing and using our website, you agree to comply with and be bound by these Terms and
                    Conditions. If you do not agree with any part of these terms, please refrain from using our
                    website. These terms may be updated periodically, and continued use of the site constitutes
                    acceptance of any changes.
                </p>
            </section>

            {/* Additional sections would follow the same structure */}
            {/* For brevity, only a few sections are included here */}

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">3. Use of the Website</h2>
                <p className="text-base leading-relaxed">
                    You agree to use our website for lawful purposes only. You must not use the site in any way
                    that breaches any applicable local, national, or international law or regulation. Unauthorized
                    use of this website may give rise to a claim for damages and/or be a criminal offense.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">4. Intellectual Property Rights</h2>
                <p className="text-base leading-relaxed">
                    All content on this website, including text, graphics, logos, images, and software, is the
                    property of Runtej Infra or its content suppliers and is protected by intellectual property
                    laws. Unauthorized reproduction or distribution of any material from this site is prohibited.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">5. Limitation of Liability</h2>
                <p className="text-base leading-relaxed">
                    Runtej Infra shall not be liable for any direct, indirect, incidental, consequential, or
                    punitive damages arising out of your access to, use of, or inability to use this website. We
                    do not warrant that the website will be uninterrupted or error-free.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">6. Prohibited Content</h2>
                <p className="text-base leading-relaxed">
                    You must not post or share any content that is illegal, harmful, threatening, abusive, or offensive.
                    Any content that violates intellectual property rights or privacy laws is strictly forbidden.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">7. No Warranty</h2>
                <p className="text-base leading-relaxed">
                    We provide the website on an &quot;as is&quot; basis without any warranties or guarantees.
                    We do not promise the site will always be available or error-free.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">8. Third-Party Links</h2>
                <p className="text-base leading-relaxed">
                    This website may include links to third-party websites. These links are provided for your convenience and do not signify that we endorse the website(s). We have no responsibility for the content of linked website(s) or their practices.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">9. Privacy Policy</h2>
                <p className="text-base leading-relaxed">
                    Our Privacy Policy explains how we handle your personal information. By using our site, you agree that we can collect and use your data as outlined in the Privacy Policy. Please review it regularly to stay informed.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">10. Governing Law</h2>
                <p className="text-base leading-relaxed">
                    These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Mumbai.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">11. Termination</h2>
                <p className="text-base leading-relaxed">
                    We reserve the right to terminate or suspend access to our website without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">12. User Responsibilities</h2>
                <p className="text-base leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. If you suspect unauthorized use, notify us immediately.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">13. Indemnification</h2>
                <p className="text-base leading-relaxed">
                    You agree to indemnify and hold harmless Runtej Infra, its officers, directors, and employees from any claim or demand, including legal fees, arising out of your use of the website or violation of these Terms.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">14. Changes to Terms</h2>
                <p className="text-base leading-relaxed">
                    We reserve the right to revise these Terms and Conditions at any time. Any changes will be posted on this page. Your continued use of the website after any changes constitutes your acceptance of the new terms.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">15. Contact Information</h2>
                <p className="text-base leading-relaxed">
                    If you have any questions about these Terms and Conditions, please contact us at{' '}
                    <a href="mailto:info@runtejinfra.com" className="text-indigo-600 underline">
                        info@runtejinfra.com
                    </a>.
                </p>
            </section>

            {/* Continue adding detailed sections as needed to reach the desired word count */}

            <p className="text-base text-gray-600 mt-10">
                Thank you for visiting our website. If you have any questions or concerns regarding these Terms
                and Conditions, please contact us at <a href="mailto:info@runtejinfra.com" className="text-indigo-600 underline">info@runtejinfra.com</a>.
            </p>
        </div>
    );
}

export default TermsAndConditionsPage;
