"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Parts Only"];

export default function SellPage() {
  const [condition, setCondition] = useState("New");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    brand: "",
    model: "",
    watchName: "",
    price: "",
    description: "",
    contact: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Convert to base64 — no Cloudinary needed
  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setPreviews([]); // reset
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // ✅ Single handleSubmit — sends base64 image directly to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.brand || !form.price || !form.contact) {
      alert("Brand, Price and Contact are required!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.watchName || form.model || form.brand,
          brand: form.brand,
          price: `₹${form.price}`,
          category: "Unisex",
          description: form.description,
          condition,
          contact: form.contact,
          img: previews[0] || "/watch1.png", // ✅ base64 or fallback
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        alert("✅ Watch submitted successfully!");
      } else {
        alert(data.message || "Failed to submit watch");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      brand: "",
      model: "",
      watchName: "",
      price: "",
      description: "",
      contact: "",
    });
    setCondition("New");
    setPreviews([]);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <>
        <Navbar wishlistCount={0} user={null} search={search} setSearch={setSearch} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white p-12 rounded-3xl shadow-lg max-w-md">
            <h2 className="text-4xl font-semibold text-green-600 mb-4">Thank You!</h2>
            <p className="text-xl">Your watch has been submitted for review.</p>
            <button
              onClick={resetForm}
              className="mt-8 bg-black text-white px-10 py-3.5 rounded-2xl hover:bg-gray-800 transition"
            >
              Sell Another Watch
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        wishlistCount={0}
        user={null}
        search={search}
        setSearch={setSearch}
      />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold">Sell Your Watch</h1>
          <p className="text-gray-500 mt-2">List your watch on WristZone</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-3xl p-8 shadow-sm space-y-6"
        >
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand *"
            className="w-full p-4 border rounded-2xl"
            required
          />

          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="Model"
            className="w-full p-4 border rounded-2xl"
          />

          <input
            name="watchName"
            value={form.watchName}
            onChange={handleChange}
            placeholder="Watch Name"
            className="w-full p-4 border rounded-2xl"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (₹) *"
            className="w-full p-4 border rounded-2xl"
            required
          />

          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact Number / Email *"
            className="w-full p-4 border rounded-2xl"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full p-4 border rounded-2xl"
          />

          {/* Condition */}
          <div>
            <p className="font-medium mb-3">Condition</p>
            <div className="flex flex-wrap gap-3">
              {CONDITIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`px-5 py-2 border rounded-2xl transition ${
                    condition === c ? "bg-black text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <p className="font-medium mb-2">Upload Images (Optional)</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-gray-400"
            />

            {previews.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-xl border"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition"
          >
            {loading ? "Submitting..." : "Submit Watch for Sale"}
          </button>
        </form>
      </div>
    </>
  );
}