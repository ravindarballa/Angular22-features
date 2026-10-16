// REST API over the local sample_mflix database.
// Usage: npm start  (listens on http://localhost:3000)
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017';
const PORT = process.env.PORT ?? 3000;

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db('sample_mflix');
const movies = db.collection('movies');
const comments = db.collection('comments');

const app = express();
app.use(cors());
app.use(express.json());

const listFields = { title: 1, year: 1, genres: 1, poster: 1, runtime: 1, 'imdb.rating': 1 };

// GET /api/movies?search=&genre=&page=1&limit=20
app.get('/api/movies', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const filter = {};
  if (req.query.search) filter.$text = { $search: String(req.query.search) };
  if (req.query.genre) filter.genres = String(req.query.genre);

  const [items, total] = await Promise.all([
    movies
      .find(filter, { projection: listFields })
      .sort({ year: -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    movies.countDocuments(filter),
  ]);
  res.json({ items, total, page, limit });
});

app.get('/api/genres', async (_req, res) => {
  res.json((await movies.distinct('genres')).sort());
});

app.get('/api/movies/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const _id = new ObjectId(req.params.id);
  const movie = await movies.findOne({ _id });
  if (!movie) return res.status(404).json({ error: 'Not found' });
  const movieComments = await comments
    .find({ movie_id: _id })
    .sort({ date: -1 })
    .limit(20)
    .toArray();
  res.json({ ...movie, comments: movieComments });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
