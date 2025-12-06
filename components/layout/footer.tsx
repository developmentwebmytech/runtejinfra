import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

function Footer() {
    return (
        <footer className="relative text-black   min-h-[300px] bg-cover bg-center" >
            {/* Overlay */}
            <div className="absolute inset-0 bg-green-100"></div>

            {/* Content */}
            <div className="relative z-10 p-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <ul className="space-y-3 font-dark">
                            <li><Link href="/ourstory">Our Story</Link></li>
                            <li><Link href="/ourimpact">Our Impact</Link></li>
                            <li><Link href="/careers">Careers</Link></li>
                            <li><Link href="/investor-relations">Investor Relations</Link></li>
                            <li><Link href="/projects">All Projects</Link></li>            
                        </ul>
                    </div>

                    <div>
                        <ul className="space-y-3 font-dark">
                            <li><Link href="/commercial">Commercial</Link></li>                           
                            <li><Link href="/testimonials">Brand Experience</Link></li>
                            <li><Link href="/blogs">Blogs</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                            <li><Link href="/termsandcondition">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div>
                        <ul className="space-y-3 font-dark">
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/projectcategory">Project Category</Link></li>
                            <li><Link href="/industrialpage">Industrial</Link></li>
                             <li><Link href="/residentialpage">Residential</Link></li>
                              <li><Link href="/commercialpage">Commercial</Link></li>
                            
                        </ul>
                    </div>


                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <div className="items-start">
                            <Image
                                src="/tlogo.png"
                                alt="Runtej Infra Logo"
                                width={150}
                                height={78}
                            />
                        </div>
                        <div className="flex space-x-4 text-2xl">
                            <a href="#" className="text-blue-600 hover:opacity-75"><FaFacebookF /></a>
                            <a href="#" className="text-black hover:opacity-75"><FaXTwitter /></a>
                            <a href="#" className="text-pink-500 hover:opacity-75"><FaInstagram /></a>
                            <a href="#" className="text-blue-700 hover:opacity-75"><FaLinkedinIn /></a>
                            <a href="#" className="text-red-600 hover:opacity-75"><FaYoutube /></a>
                        </div>

                    </div>

                </div>
                <div className="border-t border-black/30 mt-8 pt-4 text-center text-sm text-black/60">
                    © Runtej Infra 2025 All Rights Reserved.
                </div>
            </div>
        </footer>

    );
}

export default Footer;
