import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri =
  "mongodb+srv://navyavm123_db_user:mypassword123@cluster0.fhppqqd.mongodb.net/watchshop";

let client;

async function getDb() {
  if (!client) {
    client = new MongoClient(uri);

    await client.connect();

    console.log("MongoDB Connected");
  }

  return client.db("watchshop");
}

export async function POST(request) {
  try {
    const { email, password } =
      await request.json();

    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // IMPORTANT
    const user =
      await db.collection("users").findOne({
        email: email.toLowerCase(),
      });

    console.log("USER FOUND:", user);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // IMPORTANT
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,

      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}