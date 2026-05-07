"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import { useWishlist } from "./context/WishlistContext";
import { useAuth } from "./context/AuthContext";
import { Heart } from "lucide-react";

type Product = {
  _id: string;
  img: string;
  name: string;
  price: string;
  brand: string;
  category: string;
  description: string;
};

type Review = {
  _id: string;
  productId: string;
  name: string;
  rating: number;
  review: string;
  img: string | null;
  createdAt: string;
};

export default function Home() {
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlist();
  const { user, requireLogin } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, review: "", img: "" });

  // Orders
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ phone: "", address: "" });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // ---------------- FETCH PRODUCTS ----------------
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/sale");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ---------------- FETCH REVIEWS ----------------
  useEffect(() => {
    if (!selected) return;
    setReviews([]);
    setReviewForm({ rating: 0, review: "", img: "" });
    setOrderPlaced(false);
    setShowOrderForm(false);
    setOrderForm({ phone: "", address: "" });

    async function fetchReviews() {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/reviews?productId=${selected!._id}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    }
    fetchReviews();
  }, [selected]);

  // ---------------- IMAGE HANDLER ----------------
  const handleReviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      alert("Image must be under 1MB!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReviewForm((prev) => ({ ...prev, img: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // ---------------- SUBMIT REVIEW ----------------
  const submitReview = async () => {
    if (!requireLogin()) return;
    if (!reviewForm.rating) {
      alert("Rating is required!");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selected?._id,
          userId: user!._id,
          name: user!.name,
          rating: reviewForm.rating,
          review: reviewForm.review,
          img: reviewForm.img || null,
        }),
      });
      if (res.ok) {
        const updated = await fetch(`/api/reviews?productId=${selected?._id}`);
        const data = await updated.json();
        setReviews(data);
        setReviewForm({ rating: 0, review: "", img: "" });
        alert("✅ Review submitted!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async () => {
    if (!requireLogin()) return;
    if (!orderForm.phone || !orderForm.address) {
      alert("Phone and address are required!");
      return;
    }
    setPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selected?._id,
          productName: selected?.name,
          productImg: selected?.img,
          productPrice: selected?.price,
          userId: user!._id,
          userName: user!.name,
          phone: orderForm.phone,
          address: orderForm.address,
          status: "pending",
        }),
      });
      if (res.ok) {
        setOrderPlaced(true);
        setShowOrderForm(false);
      }
    } catch (err) {
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ---------------- CLOSE MODAL ----------------
  const closeModal = () => {
    setSelected(null);
    setOrderPlaced(false);
    setShowOrderForm(false);
    setOrderForm({ phone: "", address: "" });
  };

  // ---------------- FILTER ----------------
  const filtered =
    search.trim() === ""
      ? products
      : products.filter((p) => {
          const q = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        });

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar search={search} setSearch={setSearch} />

      {/* Banner */}
      <img src="/main_image.png" className="w-full h-64 object-cover" />

      {/* PRODUCTS */}
      {loading && <p className="text-center mt-10">Loading products...</p>}
      {error && <p className="text-center mt-10 text-red-500">{error}</p>}

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product._id}
            onClick={() => setSelected(product)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition"
          >
            <img src={product.img} className="w-full h-48 object-cover rounded-lg" />
            <h2 className="mt-2 font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.price}</p>
            <button
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
              className="mt-2"
            >
              <Heart
                size={22}
                className={wishlist.has(product._id) ? "text-red-500 fill-red-500" : "text-gray-400"}
              />
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[520px] max-h-[90vh] overflow-y-auto rounded-xl p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selected.name}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>

            <img src={selected.img} className="w-full h-48 object-cover rounded-lg mb-3" />
            <p className="text-gray-600 text-sm mb-1">{selected.description}</p>
            <p className="font-semibold text-lg">{selected.price}</p>

            {/* BUY NOW */}
            {!orderPlaced ? (
              <>
                <button
                  onClick={() => { if (requireLogin()) setShowOrderForm(true); }}
                  className="mt-3 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800"
                >
                  🛒 Buy Now (Cash on Delivery)
                </button>

                {showOrderForm && (
                  <div className="mt-4 space-y-2 border rounded-lg p-4 bg-zinc-50">
                    <h3 className="font-bold">Delivery Details</h3>
                    <p className="text-sm text-gray-600">Name: <span className="font-semibold">{user?.name}</span></p>

                    <input
                      type="tel"
                      placeholder="Phone number *"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />

                    <textarea
                      placeholder="Full address *"
                      value={orderForm.address}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, address: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm h-20"
                    />

                    <p className="text-sm font-semibold">Total: {selected.price} (Cash on Delivery)</p>

                    <button
                      onClick={placeOrder}
                      disabled={placingOrder}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
                    >
                      {placingOrder ? "Placing Order..." : "✅ Confirm Order"}
                    </button>

                    <button
                      onClick={() => setShowOrderForm(false)}
                      className="w-full border py-2 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-600 font-bold text-lg">✅ Order Placed!</p>
                <p className="text-sm text-gray-500 mt-1">We'll deliver to your address soon.</p>
                <button
                  onClick={closeModal}
                  className="mt-3 text-sm underline text-gray-500"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {/* REVIEWS */}
            <div className="mt-6">
              <h3 className="font-bold mb-2">Customer Reviews</h3>

              {reviewsLoading ? (
                <p className="text-sm text-gray-400">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-3">
                  {reviews.map((r) => (
                    <div key={r._id} className="border rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-yellow-500">{"⭐".repeat(r.rating)}</p>
                      </div>
                      <p className="text-gray-600 mt-1">{r.review}</p>
                      {r.img && <img src={r.img} className="mt-2 h-24 rounded object-cover" />}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* REVIEW FORM */}
              <div className="mt-4 space-y-2">
                <h3 className="font-bold">Write a Review</h3>

                <textarea
                  placeholder="Write your review..."
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, review: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm h-20"
                />

                {/* Star rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                      className={`text-2xl ${reviewForm.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">
                    {reviewForm.rating ? `${reviewForm.rating}/5` : "Select rating"}
                  </span>
                </div>

                {/* Photo upload */}
                <div>
                  <label className="text-sm text-gray-600 cursor-pointer hover:text-black">
                    📷 Add photo
                    <input type="file" accept="image/*" onChange={handleReviewImage} className="hidden" />
                  </label>
                  {reviewForm.img && (
                    <img src={reviewForm.img} className="mt-2 h-20 rounded object-cover" />
                  )}
                </div>

                <button
                  onClick={submitReview}
                  disabled={submittingReview}
                  className="bg-black text-white px-4 py-2 rounded w-full"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}