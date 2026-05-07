import "./globals.css";

import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}