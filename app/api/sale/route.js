import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://navyavm123_db_user:mypassword123@cluster0.fhppqqd.mongodb.net/watchshop";
let client;

async function getDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('watchshop');
}

// ✅ GET — fetch all products for homepage
export async function GET() {
  try {
    const db = await getDb();
    const products = await db.collection('products').find({}).toArray();
    const serialized = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));
    return NextResponse.json(serialized);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ POST — list a new watch for sale
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, brand, category, description, img } = body;

    if (!name || !price || !brand || !category) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: name, price, brand, category"
      }, { status: 400 });
    }

    const db = await getDb();

    const newProduct = {
      name,
      price,
      brand,
      category,
      description: description || "",
      img: img || "/watch1.png",
      createdAt: new Date(),
    };

    const result = await db.collection('products').insertOne(newProduct);

    console.log('Saved to MongoDB:', result.insertedId);

    return NextResponse.json({
      success: true,
      message: "Watch listed successfully!",
      productId: result.insertedId.toString(),
    });

  } catch (error) {
    console.error('Sell API Error:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}