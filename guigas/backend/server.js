const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cimatec',
  database: 'NotePad', // Certifique-se de que este é o nome correto do seu banco de dados
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

// Rotas para CRUD
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM Note', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Note WHERE ID_Note = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body; // Use as variáveis corretas
  db.query('INSERT INTO Note (Titulo, Descricao, Statuss) VALUES (?, ?, ?)', [title, description, status], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, title, description, status });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  db.query('UPDATE Note SET Titulo = ?, Descricao = ?, Statuss = ? WHERE ID_Note = ?', [title, description, status, id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Note WHERE ID_Note = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
