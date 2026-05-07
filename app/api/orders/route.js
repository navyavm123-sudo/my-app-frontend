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

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, productName, productImg, productPrice, userId, userName, phone, address, status } = body;

    if (!productId || !userId || !phone || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('orders').insertOne({
      productId,
      productName,
      productImg,
      productPrice,
      userId,
      userName,
      phone,
      address,
      status: 'pending',
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, orderId: result.insertedId.toString() });
  } catch (error) {
    console.error('POST order error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const db = await getDb();
    const query = userId ? { userId } : {};
    const orders = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = orders.map(o => ({ ...o, _id: o._id.toString() }));
    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
export async function PATCH(request) {
  try {
    const { orderId, status } = await request.json();
    const db = await getDb();
    const { ObjectId } = await import('mongodb');

    await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}