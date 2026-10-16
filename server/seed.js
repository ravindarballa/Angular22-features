// Downloads the sample_mflix dataset and loads it into the local MongoDB.
// Usage: npm run seed
import { MongoClient, BSON } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
const DB_NAME = 'sample_mflix';
const BASE_URL =
  'https://raw.githubusercontent.com/neelabalan/mongodb-sample-dataset/main/sample_mflix';
const COLLECTIONS = ['movies', 'comments', 'users', 'theaters'];
const BATCH_SIZE = 1000;

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db(DB_NAME);

for (const name of COLLECTIONS) {
  process.stdout.write(`Loading ${name}... `);
  const res = await fetch(`${BASE_URL}/${name}.json`);
  if (!res.ok) throw new Error(`Download of ${name} failed: ${res.status}`);

  // One Extended JSON document per line ($oid, $date, $numberInt, ...)
  const docs = (await res.text())
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => BSON.EJSON.parse(line));

  const collection = db.collection(name);
  await collection.drop().catch(() => {});
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    await collection.insertMany(docs.slice(i, i + BATCH_SIZE), { ordered: false });
  }
  console.log(`${docs.length} documents`);
}

await db.collection('movies').createIndex({ title: 'text', plot: 'text' });
await db.collection('movies').createIndex({ year: -1 });
await db.collection('comments').createIndex({ movie_id: 1 });

await client.close();
console.log(`Done. Database "${DB_NAME}" is ready.`);
