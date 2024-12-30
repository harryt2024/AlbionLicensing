// Backend: Node.js + Express + MongoDB
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key'; // Change this to a secure key in production

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/react_project', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Schemas and Models
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const DataSchema = new mongoose.Schema({
    value: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const User = mongoose.model('User', UserSchema);
const Data = mongoose.model('Data', DataSchema);

// Routes

// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Add Data
app.post('/api/data', async (req, res) => {
    const { token, value } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const newData = new Data({ value, userId: decoded.userId });
        await newData.save();
        res.status(201).json({ message: 'Data added successfully' });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Unauthorized or invalid token' });
    }
});

// Get Data
app.get('/api/data', async (req, res) => {
    const { token } = req.headers;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const data = await Data.find({ userId: decoded.userId });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Unauthorized or invalid token' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
