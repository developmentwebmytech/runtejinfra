"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  parentCategory?: string | null; // 👈 add this line
  slug: string;
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
    { label: "MEDIA", href: "/media", hasDropdown: false },
    {
      label: "PROJECTS",
      href: "#",
      hasDropdown: true,
      dropdown: projectCategories.map((cat) => ({
        label: cat.name,
        href: `/category/${cat.slug}`,
      })),
    },
    {
      label: "ABOUT US",
      href: "/about",

    },
    {
      label: "CONTACT US",
      href: "/contact",

    },
  ];

  return (
    <>
      <div className="border-b border-gray-200 ">
        <div className="container ">
          <nav className={`flex items-center px-6  py-2 text-black ${navbarClasses}`}>
            {/* Logo - left */}
            <Link href="/" className="flex-shrink-0">
              <div className="w-34 relative h-17 cursor-pointer">
                <Image src="/tlogo2.png" alt="Logo" fill style={{ objectFit: "contain" }} priority />
              </div>
            </Link>

            {/* Center menu - visible only on lg and above */}
            <div className="hidden lg:flex flex-1 justify-center items-center space-x-10 text-md font-semibold">
              {menuItems.map((item, idx) => (
                <div key={idx} className="relative group">

                  {/* Menu item */}
                  <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                    <Link href={item.href}>{item.label}</Link>
                    {item.hasDropdown && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>

                  {/* ✅ PLACE DROPDOWN HERE */}
                  {item.hasDropdown && item.dropdown && (
                    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-7 bg-white shadow-lg z-50 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">

                      {item.dropdown.map((drop, dropIdx) => (
                        <Link
                          key={drop.href + dropIdx}
                          href={drop.href}
                          className="block px-4 py-4 hover:bg-gray-100 text-sm text-gray-800"
                        >
                          {drop.label}
                        </Link>
                      ))}
                    </div>
                  )}

                </div>
              ))}

            </div>

            {/* Mobile/Tablet toggle - right */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-black ml-auto cursor-pointer lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>


          {/* Mobile Dropdown */}
          {isOpen && (
            <div className="fixed inset-0 z-50 bg-white md:bg-black/80 text-black md:text-white overflow-y-auto">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 md:border-none">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex-shrink-0">
                  <div className="w-28 relative h-12 cursor-pointer">
                    <Image src="/tlogo.png" alt="Logo" fill style={{ objectFit: "contain" }} priority />
                  </div>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 md:bg-white/10 hover:bg-gray-200 md:hover:bg-white/20 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="p-6 space-y-1">
                {menuItems.map((item, idx) => {
                  const isDropdownOpen = openDropdownIndex === idx;

                  return (
                    <div key={item.label + idx} className="w-full border-b border-gray-100 md:border-white/10 last:border-b-0">

                      {/* ✅ NO dropdown → direct link */}
                      {!item.hasDropdown ? (
                        <Link
                          href={item.href}
                          className="block w-full py-4 text-base font-medium hover:text-green-500 cursor-pointer transition-colors cursor-pointer"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <>
                          {/* ✅ Dropdown button */}
                          <button
                            type="button"
                            className="flex justify-between items-center w-full py-4 text-base font-medium hover:text-green-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownIndex(isDropdownOpen ? null : idx);
                            }}
                          >
                            {item.label}
                            <svg
                              className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Dropdown links */}
                          {isDropdownOpen && (
                            <div className="pb-4 space-y-1 bg-gray-50 md:bg-white/5 rounded-lg mb-2">
                              {item.dropdown.map((drop, i) => (
                                <Link
                                  key={drop.href + i}
                                  href={drop.href}
                                  className="block px-4 py-3 text-sm text-gray-600 md:text-gray-300 hover:text-green-500 hover:bg-gray-100 md:hover:bg-white/10 transition-colors cursor-pointer"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {drop.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
