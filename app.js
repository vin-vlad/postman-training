const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const upload = multer({ dest: "uploads/" });
const { User, Item, Token } = require("./models");
const log = require("log");
require('dotenv').config()
require("log-node")();
const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

app.use(bodyParser.json());
console.log(process.env.DB_USERNAME)
console.log(process.env.DB_PASSWORD)
// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fx-cluster.use9k.mongodb.net/?retryWrites=true&w=majority&appName=fx-cluster`, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "No token provided" });
    const storedToken = await Token.findOne({ token });
    if (!storedToken) return res.status(403).json({ message: "Invalid token" });
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
};

// Basic Requests
app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.json(items);
    console.log("GET /items %s", [req.method, res.statusCode])
    
});
app.post("/items", async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.validate();
        await item.save();
        res.status(201).json(item);
        console.log("POST /items %s", [req.method, res.statusCode, item])
    } catch (error) {
        res.status(400).json({ message: "Invalid item data", error: error.message });
        console.log("POST /items %s", [req.method, res.statusCode])
    }
});

app.delete("/items/:id", async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Item deleted" });
    } catch (error) {
        res.status(400).json({ message: "Invalid item data", error: error.message });
        console.log("DELETE /items %s", [req.params.id, req.method, res.statusCode])
    }
    
});

app.post("/register", async (req, res) => {
    try{

        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.validate();
        await user.save();
        
        const createdUser = await User.findOne({ username, password });
        if (createdUser) {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
            await new Token({ token }).save();
            res.json({ token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }catch(error){
        res.status(500).json({ message: "Internal error" });
    }
});

app.post("/login", async (req, res) => {
    try{

        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (user) {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
            await new Token({ token }).save();
            res.json({ token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }catch(error){ß
        res.status(500).json({ message: "Internal error" });
    }
});

app.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Protected content", user: req.user.username });
});

//TODO
app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ message: "File uploaded", filename: req.file.filename });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
