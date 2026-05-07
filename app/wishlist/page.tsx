"use client";

import Navbar from "../components/Navbar";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";

export default function WishlistPage() {
  const { wishlistedProducts, toggleWishlist } = useWishlist();
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar search={search} setSearch={setSearch} />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items in wishlist</p>
            <p className="text-sm text-gray-400 mt-2">
              Start adding watches you love!
            </p>
            <a href="/" className="mt-4 inline-block text-black underline">
              Browse Watches
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedProducts.map((product) => (
              <div
                key={product._id}
                className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white"
              >
                <img
                  src={product.img || "/watch1.png"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  onError={(e) => { e.currentTarget.src = "/watch1.png"; }}
                />
                <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
                <p className="text-xl font-bold text-gray-900 mb-3">
                  {product.price}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{product.brand}</span>
                  <button
                    onClick={() => toggleWishlist(product)}  // ✅ pass full product
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}