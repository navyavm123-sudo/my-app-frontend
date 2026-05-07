"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/* ---------------- TYPE ---------------- */
export type Product = {
  _id: string;
  img: string;
  name: string;
  price: string;
  brand: string;
  category: string;
  description: string;
};

type WishlistContextType = {
  wishlist: Set<string>;
  toggleWishlist: (product: Product) => void;
  wishlistedProducts: Product[];
  products: Product[];
  setProducts: (p: Product[]) => void;
};

/* ---------------- CONTEXT ---------------- */
const WishlistContext = createContext<WishlistContextType | null>(null);

/* ---------------- PROVIDER ---------------- */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);

  // ✅ Load from localStorage
  useEffect(() => {
    const storedIds = localStorage.getItem("wishlist_ids");
    const storedProducts = localStorage.getItem("wishlist_products");

    if (storedIds) setWishlist(new Set(JSON.parse(storedIds)));

    if (storedProducts) {
      const parsed = JSON.parse(storedProducts);
      // ✅ Remove duplicates on load
      const unique = parsed.filter(
        (p: Product, index: number, self: Product[]) =>
          index === self.findIndex((w) => w._id === p._id)
      );
      setWishlistedProducts(unique);
    }
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist_ids", JSON.stringify([...wishlist]));
    localStorage.setItem("wishlist_products", JSON.stringify(wishlistedProducts));
  }, [wishlist, wishlistedProducts]);

  // ✅ Fixed syntax — no extra closing brace
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const updated = new Set(prev);
      if (updated.has(product._id)) {
        updated.delete(product._id);
        setWishlistedProducts((p) => p.filter((w) => w._id !== product._id));
      } else {
        updated.add(product._id);
        setWishlistedProducts((p) =>
          p.find((w) => w._id === product._id) ? p : [...p, product]
        );
      }
      return updated;
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        wishlistedProducts,
        products,
        setProducts,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("Use inside WishlistProvider");
  return ctx;
}