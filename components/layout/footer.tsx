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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();

        const parentCategories = (data.allcategories || [])
          .filter((cat: Category) => cat.parentCategory === null)
          .slice(0, 3);

        setProjectCategories(parentCategories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="relative text-black min-h-[300px] bg-cover bg-center">
      <div className="absolute inset-0 bg-green-100"></div>

      <div className="relative z-10 p-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <ul className="space-y-3">
              <li><Link href="/ourstory">Our Story</Link></li>
              <li><Link href="/ourimpact">Our Impact</Link></li>
              <li><Link href="/joinus">Careers</Link></li>
              <li><Link href="/media">Media Gallery</Link></li>
              <li><Link href="/categories">All Categories</Link></li>
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/testimonials">Brand Experience</Link></li>
              <li><Link href="/blog">Blogs</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/termsandcondition">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/projectlist">Project List</Link></li>

              {projectCategories.map((cat) => (
                <li key={cat._id}>
                  <Link href={`/categories/${cat._id}`}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <Image src="/tlogo.png" alt="Runtej Infra Logo" width={150} height={78} />

            <div className="flex space-x-4 text-2xl">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaXTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedinIn /></a>
              <a href="#"><FaYoutube /></a>
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
