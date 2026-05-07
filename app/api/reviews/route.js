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

// GET — fetch reviews for a product
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    const db = await getDb();
    const reviews = await db
      .collection('reviews')
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = reviews.map((r) => ({ ...r, _id: r._id.toString() }));
    return NextResponse.json(serialized);
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST — save a new review
export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, name, rating, review, img } = body;

    if (!productId || !name || !rating) {
      return NextResponse.json({ error: 'productId, name and rating are required' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('reviews').insertOne({
      productId,
      name,
      rating: Number(rating),
      review: review || '',
      img: img || null,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      reviewId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('POST review error:', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}