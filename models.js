const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const TokenSchema = new mongoose.Schema({
    token: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);
const Item = mongoose.model("Item", ItemSchema);
const Token = mongoose.model("Token", TokenSchema);

module.exports = { User, Item, Token };