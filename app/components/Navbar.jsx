"use client";

import { useState, useEffect } from "react";
import { Heart, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ search, setSearch }) {
  const router = useRouter();
  const [showGender, setShowGender] = useState(false);

  const { wishlist } = useWishlist();
  const { user, logout, loading } = useAuth();

  // Close gender dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowGender(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50 flex-wrap gap-4">

      {/* LOGO */}
      <div className="text-2xl font-extrabold tracking-widest">
        {user ? `Hi, ${user.name.split(" ")[0]}` : "WRISTZONE"}
      </div>

      {/* SEARCH */}
      <div className="flex items-center border rounded-full px-4 py-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Search watches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm"
        />
      </div>

      {/* MENU */}
      <div className="flex items-center gap-6 text-sm font-medium">

        <Link href="/" className="hover:text-black transition">Home</Link>

        {/* GENDER DROPDOWN */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowGender(!showGender);
            }}
            className="hover:text-black transition"
          >
            Gender ▾
          </button>

          {showGender && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg w-36 z-50 py-1">
              <Link href="/male" className="block px-4 py-2 hover:bg-gray-100">Male</Link>
              <Link href="/female" className="block px-4 py-2 hover:bg-gray-100">Female</Link>
              <Link href="/kids" className="block px-4 py-2 hover:bg-gray-100">Kids</Link>
            </div>
          )}
        </div>

        {/* SELL */}
        <Link
          href="/sale"
          className="px-4 py-1 border border-black rounded-full hover:bg-black hover:text-white transition"
        >
          + Sell
        </Link>

        {/* WISHLIST */}
        <Link href="/wishlist" className="relative hover:text-red-500 transition">
          <Heart
            size={22}
            className={wishlist.size > 0 ? "text-red-500 fill-red-500" : ""}
          />
          {wishlist.size > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {wishlist.size}
            </span>
          )}
        </Link>

        {/* USER / LOGIN / LOGOUT */}
        <button
          onClick={handleAuthClick}
          disabled={loading}
          className="flex items-center gap-2 hover:text-black transition"
        >
          {user ? (
            <>
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </>
          ) : (
            <>
              <User size={20} />
              <span className="text-sm font-medium">Login</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}