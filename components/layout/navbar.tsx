"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  parentCategory?: string | null; // 👈 add this line
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [projectCategories, setProjectCategories] = useState<Category[]>([]);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const navbarClasses = isHome
    ? "fixed top-0 w-full z-50 backdrop-blur-sm bg-white/40"
    : "sticky top-0 w-full z-50 bg-white";

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        // console.log(data)

        // 👇 Filter categories with parentCategory === null
        const parentCategories = (data.allcategories || []).filter(
          (cat: Category) => cat.parentCategory === null
        );
        // console.log("Parent Categories:", parentCategories);
        setProjectCategories(parentCategories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);


  const menuItems = [
    { label: "HOME", href: "/", hasDropdown: false },
    { label: "SERVICES", href: "/services", hasDropdown: false },
    {
      label: "PROJECTS",
      href: "#",
      hasDropdown: true,
      dropdown: projectCategories.map((cat) => ({
        label: cat.name,
        href: `/categories/${cat._id}`,
      })),
    },
    {
      label: "ABOUT US",
      href: "/about",
      hasDropdown: true,
      dropdown: [
        { label: "Know Our Story", href: "/ourstory" },
        { label: "Know Our Founders", href: "/about/#founder" },
        { label: "Vision, Mission & Core Values", href: "/about/#mission-vision" },
        { label: "Group Pillars", href: "/about/#grouppillars" },
        { label: "Company Profile", href: "/about/#companyprofile" },
      ],
    },
    {
      label: "JOIN US",
      href: "/joinus",
      hasDropdown: true,
      dropdown: [
        { label: "Careers", href: "/joinus/#careers" },
        { label: "Join Ambedessor", href: "/join/#joinambedessor" },
        { label: "Join as a Team Member", href: "/join/#joinasateammember" },
      ],
    },
    {
      label: "CONTACT US",
      href: "/contact",
      hasDropdown: true,
      dropdown: [
        { label: "Locate Us", href: "/contact/#location" },
        { label: "Partner with Us", href: "/contact/#partner" },
        { label: "Clientside Queries", href: "/contact/#queries" },
      ],
    },
  ];

  return (
    <>
      <div className="container">
        <nav className={`flex items-center justify-evenly px-16 py-3 text-black ${navbarClasses}`}>
          <Link href="/">
            <div className="w-32 relative h-8 cursor-pointer">
              <Image src="/tlogo.png" alt="Logo" fill style={{ objectFit: "contain" }} priority />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10 text-md font-semibold">
            {menuItems.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                  <Link href={item.href}>{item.label}</Link>
                  {item.hasDropdown && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                {item.hasDropdown && item.dropdown && (
                  <div className="absolute top-full left-0 mt-4 bg-white shadow-lg z-50 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.dropdown.map((drop, dropIdx) => (
                      <Link
                        key={drop.href + dropIdx}
                        href={drop.href}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
                      >
                        {drop.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile toggle */}
          <div onClick={() => setIsOpen(true)} className="text-black text-2xl font-bold cursor-pointer md:hidden">
            &#9776;
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 text-white p-6 overflow-y-auto">
            <div className="flex justify-end">
              <button onClick={() => setIsOpen(false)} className="text-3xl">&times;</button>
            </div>

            <div className="mt-6 space-y-4 text-lg text-left flex flex-col items-start">
              {menuItems.map((item, idx) => {
                const isDropdownOpen = openDropdownIndex === idx;
                return (
                  <div key={item.label + idx} className="w-full">
                    <button
                      className="flex justify-between items-center w-full hover:text-green-400"
                      onClick={() => setOpenDropdownIndex(isDropdownOpen ? null : idx)}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>

                    {item.hasDropdown && item.dropdown && isDropdownOpen && (
                      <div className="ml-4 mt-2 space-y-2 text-base">
                        {item.dropdown.map((drop, dropIdx) => (
                          <Link key={drop.href + dropIdx} href={drop.href} className="block hover:text-green-400">
                            {drop.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
