import express from 'express';

const app = express();
const PORT = process.env['PORT'] ?? 3000;

app.use(express.json());

type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

app.get('/api/users', (_req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body as Partial<User>;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const newUser: User = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

