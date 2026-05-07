import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri =
  "mongodb+srv://navyavm123_db_user:mypassword123@cluster0.fhppqqd.mongodb.net/watchshop";

let client;

async function getDb() {
  try {
    if (!client) {
      console.log("Connecting MongoDB...");

      client = new MongoClient(uri);

      await client.connect();

      console.log("MongoDB Connected");
    }

    return client.db("watchshop");

  } catch (error) {
    console.error("MongoDB Error:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    console.log("REGISTER API HIT");

    const { name, email, password } =
      await request.json();

    console.log(name, email, password);

    // CHECK EMPTY FIELDS
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // CHECK EXISTING USER
    const existingUser =
      await db.collection("users").findOne({
        email: email.toLowerCase(),
      });

    console.log("EXISTING USER:", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    console.log("HASHED PASSWORD:", hashedPassword);

    // INSERT USER
    const result =
      await db.collection("users").insertOne({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date(),
      });

    console.log("INSERTED:", result);

    return NextResponse.json({
      success: true,
      message: "Registered successfully!",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}