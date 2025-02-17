const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.js');
const { Item, User, Token } = require('./models');

require('dotenv').config()

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// MongoDB Connection
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fx-cluster.use9k.mongodb.net/?retryWrites=true&w=majority&appName=fx-cluster`,
    { useNewUrlParser: true, 
     useUnifiedTopology: true });

// File Upload Setup
const upload = multer({ dest: 'uploads/' });

// Routes
/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: A list of items.
 */
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});
/**
 * @swagger
 * /items:
 *   post:
 *     summary: Add a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item added successfully
 */
app.post('/items', async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Invalid request', message: 'Item name is required.' });
    }
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});
/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 */
app.delete('/items/:id', async (req, res) => {
  try {
    const result = await Item.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Not found', message: 'Item not found.' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 */

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid request', message: 'Username and password are required.' });
    }
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});


/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access protected content
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protected content
 */
app.get('/protected', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Token required.' });
    }
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token.' });
    }
    res.json({ message: 'Protected content', user: user.username });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token.' });
  }
});

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search items by name
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
app.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'Invalid request', message: 'Query parameter "name" is required.' });
    }
    const items = await Item.find({ name: new RegExp(name, 'i') });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Invalid request', message: 'File is required.' });
    }
    res.json({ message: 'File uploaded', filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
