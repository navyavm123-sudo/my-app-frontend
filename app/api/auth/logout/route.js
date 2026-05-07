import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: "Logged out successfully" 
  });

  // Clear the token cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),        // Expire immediately
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}