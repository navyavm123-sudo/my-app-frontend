"use client";

import { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

type Product = {
  _id: string;
  img: string;
  name: string;
  price: string;
  brand: string;
  category: string;
  description: string;  // ← add this
};


export default function ProductsPage() {
  const { toggleWishlist, wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/sale").then(r => r.json()).then(setProducts);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-zinc-50 dark:bg-black">
      <h1 className="text-2xl font-bold mb-6">All Watches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-3 rounded-lg shadow relative">
            <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} className="absolute top-2 right-2">
              <Heart size={18} className={wishlist.has(product._id) ? "text-red-500 fill-red-500" : "text-gray-400"} />
            </button>
            <img src={product.img} className="w-full h-28 object-cover rounded" />
            <h2 className="mt-2 font-semibold text-sm">{product.name}</h2>
            <p className="text-sm">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}