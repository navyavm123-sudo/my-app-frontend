"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Kids() {
  const [search, setSearch] = useState("");

  const kidsWatches = [
    {
      img: "/watch1.png",
      name: "Kids Cartoon Watch",
      price: "₹499",
    },
    {
      img: "/watch2.png",
      name: "Colorful Digital Watch",
      price: "₹699",
    },
  ];

  const filteredWatches = kidsWatches.filter((watch) =>
    watch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar search={search} setSearch={setSearch} wishlist={[]} />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Kids Watches</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredWatches.length > 0 ? (
            filteredWatches.map((watch, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow">
                <img
                  src={watch.img}
                  className="w-full h-48 object-cover rounded-lg"
                  alt={watch.name}
                />
                <h2 className="mt-2 font-semibold">{watch.name}</h2>
                <p>{watch.price}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No watches found 😕
            </p>
          )}
        </div>
      </div>
    </>
  );
}