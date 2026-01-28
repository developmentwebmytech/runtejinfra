"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string; // ✅ added
  parentCategory?: string | null;
}

function Footer() {
  const [projectCategories, setProjectCategories] = useState<Category[]>([]);
  const [socialLinks, setSocialLinks] = useState<any>(null);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();

        const parentCategories = (data.allcategories || [])
          .filter((cat: Category) => cat.parentCategory === null)
          .slice(0, 6);

        setProjectCategories(parentCategories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const res = await fetch("/api/contactpost");
      const data = await res.json();
      console.log("Social Links Data:", data);
      setSocialLinks(data);
    };

    fetchSocialLinks();
  }, []);


  return (
    <footer className="relative text-black min-h-[300px] bg-cover bg-center">
      <div className="absolute inset-0 bg-green-100"></div>

      <div className="relative z-10 p-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <h2 className="mb-4 text-base md:text-lg font-semibold uppercase tracking-wide">
              Important Links
            </h2>

            <ul className="space-y-3 ">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/media">Media</Link></li>
              <li><Link href="/blog">Blogs</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>


          <div>
            <h1 className="mb-4 text-base md:text-lg font-semibold uppercase tracking-wide">PROJECTS</h1>
            <ul className="space-y-3">
              {projectCategories.map((cat) => (
                <li key={cat._id}>
                  <Link href={`/category/${cat.slug}`}>
                    {cat.name}
                  </Link>
                </li>
              ))}



            </ul>
          </div>

          <div>
            <h1 className="mb-4 text-base md:text-lg font-semibold uppercase tracking-wide ">USEFUL LINKS</h1>
            <ul className="space-y-3">

              <li><Link href="/testimonials">Testimonials</Link></li>
              <li><Link href="/termsandcondition">Terms & Conditions</Link></li>

              {/* {projectCategories.map((cat) => (
                <li key={cat._id}>
                  <Link href={`/categories/${cat._id}`}>
                    {cat.name}
                  </Link>
                </li>
              ))} */}
              <li><Link href="/employee-careers">Employee Careers</Link></li>
              <li><Link href="/client-enquiry">Client Enquiry Form</Link></li>
              <li><Link href="/vendor-registration">Vendor Registration</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <Image src="/tlogo2.png" alt="Runtej Infra Logo" width={150} height={70} />

            <div className="flex space-x-4 text-2xl">
              <a href={socialLinks?.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>

              <a href={socialLinks?.twitter} target="_blank" rel="noopener noreferrer">
                <FaXTwitter />
              </a>

              <a href={socialLinks?.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>

              <a href={socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </a>
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
