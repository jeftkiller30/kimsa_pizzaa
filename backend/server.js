const express = require('express');
const cors = require('cors');

const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json());

/* 🔥 TEST */
app.get('/api', (req, res) => {
  res.json({ mensaje: 'Backend funcionando 🚀' });
});

/* 🔥 EJEMPLO FUTURO (opcional) */
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   res.json({ success: true });
// });

/* 🔥 SERVER */
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});