const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.post('/komik', async (req, res) => {
  try {
    const komik = await db.Komik.create(req.body);
    res.status(201).json({
      message: 'Komik berhasil ditambahkan',
      data: komik
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
});

app.get('/komik', async (req, res) => {
  try {
    const komik = await db.Komik.findAll();
    res.json(komik);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/komik/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const komik = await db.Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ message: 'Komik not found' });
    }
    await komik.update(req.body);
    res.json({ message: 'Komik updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/komik/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const komik = await db.Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ message: 'Komik not found' });
    }
    await komik.destroy();
    res.json({ message: 'Komik deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DATABASE & SERVER START
db.sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server started on port ${port}`);
    });
  })
  .catch(err => console.error(' Database connection failed:', err));
